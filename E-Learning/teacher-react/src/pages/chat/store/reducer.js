
import { getLoggedInUser, setLoggedInUser } from '../../../helpers/backend-helpers'
import { setChatNotificationIds } from '../utility'


import {
  SET_USER,
  GET_CHAT_CONTACTS_SUCCESS,
  GET_CHAT_CONTACTS_FAILURE,
  AUTHORIZED_SUCCESS,
  AUTHORIZED_FAILURE,
  SET_ROOM_JOINED,
  SELECT_CHAT,
  UPDATE_SELECT_CHAT,
  GET_PREVIOUS_MESSAGES_SUCCESS,
  GET_PREVIOUS_MESSAGES_FAILURE,
  NEW_MESSAGE,
  SAVE_NEW_MESSAGE,
  UPDATE_CHAT_HEAD_MESSAGE,
  UPDATE_CHAT_PARTICIPANTS,
  DELETE_MESSAGES,
  PLAY_NOTIFICATION_SOUND,
  STOP_NOTIFICATION_SOUND,
  MUTE_CHAT_NOTIFICATION,
  UNMUTE_CHAT_NOTIFICATION,
  SET_NOTIFICATION_IDS,
  SET_NOTIFICATION_ENABLED,
  ADD_DOCUMENT_TO_QUEUE,
  UPDATE_DOCUMENT_PROGRESS,
  CANCEL_DOCUMENT_UPLOAD,
  REMOVE_DOCUMENT,
  GET_SELECT_CHAT_DOCUMENTS_SUCCESS,
  GET_SELECT_CHAT_DOCUMENTS_FAILURE,
  GET_CHAT_CONTACTS,
  GET_SELECT_CHAT_DOCUMENTS,
  UPDATE_ABOUT,
  UPDATE_ABOUT_SUCCESS,
  UPDATE_ABOUT_FAILURE,
  SET_PREVIOUS_MESSAGES_LOADING,
  CREATE_CHAT,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  GET_ALL_TEACHER_STUDENTS,
  GET_ALL_TEACHER_STUDENTS_SUCCESS,
  GET_ALL_TEACHER_STUDENTS_FAILURE,
  ADD_PARTICIPANTS,
  ADD_PARTICIPANTS_SUCCESS,
  ADD_PARTICIPANTS_FAILURE,
  REMOVE_PARTICIPANTS,
  REMOVE_PARTICIPANTS_SUCCESS,
  REMOVE_PARTICIPANTS_FAILURE,

} from './actionTypes'

const initialState = {
  chats: [],
  chatLoading: false,
  chatError: "",
  authError: "",
  isAuthorized: false,
  isRoomsJoined: false,
  messages: [],
  messagesLoading: false,
  userProfile: {},
  selectedChat: {},
  selectedUser: {},
  chatDocuments: [],
  chatDocumentsLoading: false,
  documentsError: null,
  error: "",
  loading: false,
  user: {},
  isNotification: false,
  isEndOfMessages: false,
  isNotificationEnabled: localStorage.getItem("isNotificationEnabled"),
  mutedNotificationIds: {},
  documentList: [],
  uploadedDocuments: [],
  aboutUpdating: false,
  aboutError: null,
  newChatLoading: false,
  newChatError: null,
  teacherStudents: null,
  teacherStudentsLoading: false,
  teacherStudentsError: null,
  addParticipantLoading: false,
  addParticipantError: null,
  removeParticipantLoading: false,
  removeParticipantError: null
}


const saveNewMessage = (state, { success, chatId, data, messageId, error }) => {

  state = updateChatHeadMessage(state, { success, chatId, data })

  //Sent message fail
  if (!success && messageId && chatId == state.selectedChat.chatId) {
    state.messages.forEach(m => {
      if (m.messageId == messageId) {
        m.error = true;
        // console.log("MESSAGE ERROR", error)
      }
    })
  }
  else if (success && messageId && chatId == state.selectedChat.chatId) {
    state.messages.forEach(m => {
      if (m.messageId == messageId) {
        m = data;
        // console.log("MESSAGE REPLACED", state.messages)
      }
    })
  }
  else if (success && !messageId && chatId == state.selectedChat.chatId) {
    state.messages.push(data)
    // console.log("MESSAGE PUSHED", state.messages)
  }

  return { ...state, messages: [...state.messages] }
}

const updateChatHeadMessage = (state, { success, chatId, data }) => {

  if (success) {
    let chat = state.chats.find(c => c.chatId === chatId);
    if (chat)
      chat.messages[0] = data
  }
  return state;
}

const updateChatParticipants = (state, action) => {
  let chatHead = state.chats.find(c => c.chatId === action.payload.chatId);
  if (chatHead) {
    chatHead.chatParticipants = action.payload.data
  }
  return state.chats
}

const updateSelectChat = (state, action) => {
  let chat = state.selectedChat
  chat.chatParticipants = action.payload
  return { ...state, selectedChat: chat }

}

const getPreviousMessagesSuccess = (state, action) => {
  if (action.payload.length == 0) {
    state.isEndOfMessages = true;
  }
  state.messagesLoading = false
  state.messages = [...action.payload, ...state.messages]
  return state
}

const playNotificationSound = (state, res) => {

  if (res.success && state.selectedChat.chatId != res.chatId && state.isNotificationEnabled && !state.mutedNotificationIds[res.chatId] && state.user.userId != res.data.user.userId) {
    // console.log("NOTIFICATION_USER_TRUE")
    state.isNotification = true;
  }
  else {
    state.isNotification = false
  }
  return state
}

const muteChatNotification = (state, chatId) => {
  let ids = state.mutedNotificationIds
  ids[chatId] = chatId
  setChatNotificationIds(ids)
  return { ...state, mutedNotificationIds: ids }
}

const unmuteChatNotification = (state, chatId) => {
  let ids = state.mutedNotificationIds
  delete ids[chatId]
  setChatNotificationIds(ids)
  return { ...state, mutedNotificationIds: ids }
}

function updateDocumentProgress(state, payload) {
  let doc = state.documentList.find(d => d.documentId == payload.documentId)
  if (doc) {
    if (payload.progress) {
      doc.progress = payload.progress
    }
    if (payload.data) {
      doc.data = payload.data
    }
  }
  return {
    ...state,
    documentList: state.documentList.filter(d => !d.data),
    uploadedDocuments: [...state.uploadedDocuments, ...state.documentList.filter(d => d.data)]
  }
}

const cancelDocumentUpload = (state, { documentId }) => {
  let doc = state.documentList.find(d => d.documentId == documentId)
  if (doc) doc.request.cancel()

  return {
    ...state,
    documentList: state.documentList.filter(f => f.documentId != documentId)
  }
}

const updateAboutSuccess = (state, payload) => {
  setLoggedInUser(payload)
  return { ...state, user: payload, aboutUpdating: false, aboutError: null }
}

const setNotificationEnabled = (state, payload) => {
  localStorage.setItem("isNotificationEnabled", payload)
  return { ...state, isNotificationEnabled: payload }
}

const chatReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_USER:
      return { ...state, user: action.payload }

    case GET_CHAT_CONTACTS:
      return { ...state, chats: [], chatsError: {}, chatLoading: true }

    case GET_CHAT_CONTACTS_SUCCESS:
      return { ...state, chats: action.payload, chatsError: {}, chatLoading: false }

    case GET_CHAT_CONTACTS_FAILURE:
      return { ...state, chats: [], chatsError: action.payload, chatLoading: false }

    case AUTHORIZED_SUCCESS:
      return { ...state, isAuthorized: true, authError: "" }

    case AUTHORIZED_FAILURE:
      return { ...state, isAuthorized: false, authError: action.payload }

    case SET_ROOM_JOINED:
      return { ...state, isRoomsJoined: true }

    case SELECT_CHAT:
      return { ...state, selectedChat: action.payload, chatDocuments: [], messages: [], isEndOfMessages: false }


    case UPDATE_SELECT_CHAT:
      return updateSelectChat(state, action)

    case SET_PREVIOUS_MESSAGES_LOADING:
      return { ...state, messagesLoading: true }

    case GET_PREVIOUS_MESSAGES_SUCCESS:
      return getPreviousMessagesSuccess(state, action)

    case GET_PREVIOUS_MESSAGES_FAILURE:
      return { ...state, messagesError: action.payload, messagesLoading: false }

    case NEW_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] }

    case SAVE_NEW_MESSAGE:
      return saveNewMessage(state, action.payload)

    case UPDATE_CHAT_HEAD_MESSAGE:
      return updateChatHeadMessage(state, action.payload)

    case UPDATE_CHAT_PARTICIPANTS:
      return { ...state, chats: updateChatParticipants(state, action) }

    case DELETE_MESSAGES:
      return { ...state, messages: action.payload }

    case PLAY_NOTIFICATION_SOUND:
      return playNotificationSound(state, action.payload)

    case STOP_NOTIFICATION_SOUND:
      return { ...state, isNotification: false }

    case SET_NOTIFICATION_ENABLED:
      return setNotificationEnabled(state, action.payload)

    case SET_NOTIFICATION_IDS:
      return { ...state, mutedNotificationIds: action.payload }

    case MUTE_CHAT_NOTIFICATION:
      return muteChatNotification(state, action.payload)

    case UNMUTE_CHAT_NOTIFICATION:
      return unmuteChatNotification(state, action.payload)

    case ADD_DOCUMENT_TO_QUEUE:
      return { ...state, documentList: [...state.documentList, action.payload] }

    case UPDATE_DOCUMENT_PROGRESS:
      return updateDocumentProgress(state, action.payload)

    case CANCEL_DOCUMENT_UPLOAD:
      return cancelDocumentUpload(state, action.payload)

    case REMOVE_DOCUMENT:
      return { ...state, uploadedDocuments: state.documentList.filter(f => f.documentId != action.payload.documentId) }

    case GET_SELECT_CHAT_DOCUMENTS:
      return { ...state, chatDocuments: [], documentsError: null, chatDocumentsLoading: true }

    case GET_SELECT_CHAT_DOCUMENTS_SUCCESS:
      return { ...state, chatDocuments: action.payload, documentsError: null, chatDocumentsLoading: false }

    case GET_SELECT_CHAT_DOCUMENTS_FAILURE:
      return { ...state, chatDocuments: [], documentsError: action.payload, chatDocumentsLoading: false }

    case UPDATE_ABOUT:
      return { ...state, aboutUpdating: true }

    case UPDATE_ABOUT_SUCCESS:
      return updateAboutSuccess(state, action.payload)

    case UPDATE_ABOUT_FAILURE:
      return { ...state, aboutUpdating: false, aboutError: action.payload }

    case CREATE_CHAT:
      return { ...state, newChatLoading: true }

    case CREATE_CHAT_SUCCESS:
      return { ...state, chats: [...state.chats.filter(c => c.chatId != action.payload.chatId), action.payload], newChatError: null, newChatLoading: false }

    case CREATE_CHAT_FAILURE:
      return { ...state, newChatError: action.payload, newChatLoading: false }

    case GET_ALL_TEACHER_STUDENTS:
      return { ...state, teacherStudentsLoading: true, teacherStudentsError: null }

    case GET_ALL_TEACHER_STUDENTS_SUCCESS:
      return { ...state, teacherStudents: action.payload, teacherStudentsError: null, teacherStudentsLoading: false }

    case GET_ALL_TEACHER_STUDENTS_FAILURE:
      return { ...state, teacherStudentsError: action.payload, teacherStudentsLoading: false }

    case ADD_PARTICIPANTS:
      return { ...state, addParticipantLoading: true, addParticipantError: null }

    case ADD_PARTICIPANTS_SUCCESS:
      return {
        ...state,
        chats: updateChatParticipants(state, action),
        selectedChat: { ...state.selectedChat, chatParticipants: action.payload.data },
        addParticipantLoading: false,
        addParticipantError: null
      }

    case ADD_PARTICIPANTS_FAILURE:
      return {
        ...state,
        addParticipantLoading: false,
        addParticipantError: action.payload
      }

    case REMOVE_PARTICIPANTS:
      return { ...state, removeParticipantLoading: true, removeParticipantError: null }

    case REMOVE_PARTICIPANTS_SUCCESS:
      return {
        ...state,
        chats: updateChatParticipants(state, action),
        selectedChat: { ...state.selectedChat, chatParticipants: action.payload.data },
        removeParticipantLoading: false,
        removeParticipantError: null
      }

    case REMOVE_PARTICIPANTS_FAILURE:
      return {
        ...state,
        removeParticipantLoading: false,
        removeParticipantError: action.payload
      }

    default:
      return state
  }
}

export default chatReducer
