import {
  SET_USER,
  GET_CHAT_CONTACTS,
  GET_CHAT_CONTACTS_SUCCESS,
  GET_CHAT_CONTACTS_FAILURE,
  AUTHORIZED_SUCCESS,
  AUTHORIZED_FAILURE,
  API_ERROR,
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
  UPLOAD_DOCUMENT,
  ADD_DOCUMENT_TO_QUEUE,
  UPDATE_DOCUMENT_PROGRESS,
  CANCEL_DOCUMENT_UPLOAD,
  REMOVE_DOCUMENT,
  GET_SELECT_CHAT_DOCUMENTS,
  GET_SELECT_CHAT_DOCUMENTS_SUCCESS,
  GET_SELECT_CHAT_DOCUMENTS_FAILURE,
  UPDATE_ABOUT,
  UPDATE_ABOUT_SUCCESS,
  UPDATE_ABOUT_FAILURE,
  SET_PREVIOUS_MESSAGES_LOADING,
  CREATE_CHAT,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  GET_ALL_TEACHERS,
  GET_ALL_TEACHERS_SUCCESS,
  GET_ALL_TEACHERS_FAILURE,
  REMOVE_CHAT_PARTICIPANTS,
  ADD_CHAT_PARTICIPANTS

} from './actionTypes'


export const setLoggedUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  }
}

export const getChatContacts = (userId) => {
  return {
    type: GET_CHAT_CONTACTS,
    payload: { userId }
  }
}

export const getChatContactsSuccess = (headList) => {
  return {
    type: GET_CHAT_CONTACTS_SUCCESS,
    payload: headList
  }
}

export const getChatContactsFailure = () => {
  return {
    type: GET_CHAT_CONTACTS_FAILURE
  }
}

export const authorizedSuccess = () => {
  return {
    type: AUTHORIZED_SUCCESS
  }
}

export const authorizedFailure = (error) => {
  return {
    type: AUTHORIZED_FAILURE,
    payload: error
  }
}

export const setRoomJoined = () => {
  return {
    type: SET_ROOM_JOINED,
  }
}

export const selectChat = (chat) => {
  return {
    type: SELECT_CHAT,
    payload: chat
  }
}

export const updateSelectChat = (data) => {
  return {
    type: UPDATE_SELECT_CHAT,
    payload: data
  }
}

export const setPreviousMessagesLoading = () => {
  return {
    type: SET_PREVIOUS_MESSAGES_LOADING,
  }
}

export const getPreviousMessagesSuccess = (messages) => {
  return {
    type: GET_PREVIOUS_MESSAGES_SUCCESS,
    payload: messages
  }
}

export const getPreviousMessagesFailure = (error) => {
  return {
    type: GET_PREVIOUS_MESSAGES_FAILURE,
    payload: error
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const newMessage = (msg) => {
  return {
    type: NEW_MESSAGE,
    payload: msg
  }
}

export const saveNewMessage = (res) => {
  return {
    type: SAVE_NEW_MESSAGE,
    payload: res
  }
}

export const updateChatHeadMessage = ({ success, chatId, data }) => {
  return {
    type: UPDATE_CHAT_HEAD_MESSAGE,
    payload: { success, chatId, data }
  }
}

export const updateChatParticipants = (data) => {
  return {
    type: UPDATE_CHAT_PARTICIPANTS,
    payload: data
  }
}

export const deleteMessages = (data) => {
  return {
    type: DELETE_MESSAGES,
    payload: data
  }
}

export const playNotificationSound = (res) => {
  return {
    type: PLAY_NOTIFICATION_SOUND,
    payload: res
  }
}

export const stopNotificationSound = () => {
  return {
    type: STOP_NOTIFICATION_SOUND,
  }
}

export const setNotificationIds = (data) => {
  return {
    type: SET_NOTIFICATION_IDS,
    payload: data
  }
}

export const setNotificationEnabled = (value) => {
  return {
    type: SET_NOTIFICATION_ENABLED,
    payload: value
  }
}

export const muteChatNotification = (chatId) => {
  return {
    type: MUTE_CHAT_NOTIFICATION,
    payload: chatId
  }
}

export const unmuteChatNotification = (chatId) => {
  return {
    type: UNMUTE_CHAT_NOTIFICATION,
    payload: chatId
  }
}

export const uploadDocument = ({ chatId, file, callback }) => {
  return {
    type: UPLOAD_DOCUMENT,
    payload: { chatId, file, callback }
  }
}

export const addDocumentToQueue = ({ documentId, name, chatId, progress, request }) => {
  return {
    type: ADD_DOCUMENT_TO_QUEUE,
    payload: { documentId, name, chatId, progress, request }
  }
}

export const cancelDocumentUpload = ({ documentId }) => {
  return {
    type: CANCEL_DOCUMENT_UPLOAD,
    payload: { documentId }
  }
}

export const removeDocument = ({ documentId }) => {
  return {
    type: REMOVE_DOCUMENT,
    payload: { documentId }
  }
}

export const updateDocumentProgress = ({ documentId, progress, data }) => {
  return {
    type: UPDATE_DOCUMENT_PROGRESS,
    payload: { documentId, progress, data }
  }
}

export const getSelectChatDocuments = ({ chatId }) => {
  return {
    type: GET_SELECT_CHAT_DOCUMENTS,
    payload: { chatId }
  }
}

export const getSelectChatDocumentsSuccess = (data) => {
  return {
    type: GET_SELECT_CHAT_DOCUMENTS_SUCCESS,
    payload: data
  }
}

export const getSelectChatDocumentsFailure = (error) => {
  return {
    type: GET_SELECT_CHAT_DOCUMENTS_FAILURE,
    payload: error
  }
}

export const updateAbout = ({ about }) => {
  return {
    type: UPDATE_ABOUT,
    payload: { about }
  }
}

export const updateAboutSuccess = (data) => {
  return {
    type: UPDATE_ABOUT_SUCCESS,
    payload: data
  }
}

export const updateAboutFailure = (error) => {
  return {
    type: UPDATE_ABOUT_FAILURE,
    payload: error
  }
}

export const createChat = (data) => {
  return {
    type: CREATE_CHAT,
    payload: data
  }
}

export const createChatSuccess = (data) => {
  return {
    type: CREATE_CHAT_SUCCESS,
    payload: data
  }
}

export const createChatFailure = (error) => {
  return {
    type: CREATE_CHAT_FAILURE,
    payload: error
  }
}


export const getAllTeachers = () => {
  return {
    type: GET_ALL_TEACHERS,
  }
}

export const getAllTeachersSuccess = (data) => {
  return {
    type: GET_ALL_TEACHERS_SUCCESS,
    payload: data
  }
}

export const getAllTeachersFailure = (error) => {
  return {
    type: GET_ALL_TEACHERS_FAILURE,
    payload: error
  }
}

export const removeChatParticipants = (data) => {
  return {
    type: REMOVE_CHAT_PARTICIPANTS,
    payload: data
  }
}

export const addChatParticipants = (data) => {
  return {
    type: ADD_CHAT_PARTICIPANTS,
    payload: data
  }
}