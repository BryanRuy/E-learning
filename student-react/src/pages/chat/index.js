import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Socket Imports
import socket from './socket'

// ** Chat App Component Imports
import Chat from './Chat'
import Sidebar from './SidebarLeft'
import UserProfileSidebar from './UserProfileSidebar'

import './style.scss';
// ** Third Party Components
import classnames from 'classnames'



// ** Store & Actions
import { connect, useSelector } from 'react-redux'
import {
  setLoggedUser,
  getChatContacts,
  authorizedSuccess,
  authorizedFailure,
  setRoomJoined,
  selectChat,
  updateSelectChat,
  getPreviousMessagesSuccess,
  getPreviousMessagesFailure,
  newMessage,
  saveNewMessage,
  deleteMessages,
  updateChatHeadMessage,
  updateChatParticipants,
  playNotificationSound,
  stopNotificationSound,
  setNotificationEnabled,
  setNotificationIds,
  muteChatNotification,
  unmuteChatNotification,
  uploadDocument,
  addDocumentToQueue,
  cancelDocumentUpload,
  updateDocumentProgress,
  removeDocument,
  getSelectChatDocuments,
  getSelectChatDocumentsSuccess,
  getSelectChatDocumentsFailure,
  updateAbout,
  updateAboutSuccess,
  updateAboutFailure,
  setPreviousMessagesLoading,
  createChat,
  getAllTeachers,
  removeChatParticipants,
  addChatParticipants

} from './store/actions'

import '@styles/base/pages/app-chat.scss'
import '@styles/base/pages/app-chat-list.scss'
import { withRouter } from 'react-router';
import { IOEvents } from './socket/eventTypes.js';
import { attachEvents, sendMessage } from './socket/events';
import { getLoggedInUser } from './../../helpers/backend-helpers';
import { getChatNotificationIds } from './utility';

const notificationSound = require("./sounds/notification.mp3")

const AppChat = (props) => {
  // ** Store Vars
  const store = useSelector(state => state.Chat)

  // ** States
  const [user, setUser] = useState({})
  const [sidebar, setSidebar] = useState(true)
  const [userSidebarRight, setUserSidebarRight] = useState(false)
  const [userSidebarLeft, setUserSidebarLeft] = useState(false)

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar)
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft)
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight)
  const handleOverlayClick = () => {
    setSidebar(false)
    setUserSidebarRight(false)
    setUserSidebarLeft(false)
  }

  // ** Set user function for Right Sidebar
  const handleUser = obj => setUser(obj)

  // ** Get data on Mount



  useEffect(() => {
    props.setLoggedUser(getLoggedInUser() || {})
    attachEvents(socket, props)
    props.setNotificationIds(getChatNotificationIds())
  }, [])

  useEffect(() => {
    if (!props.isRoomsJoined && props.chats.length > 0) {
      for (var chat of props.chats) {
        socket.emit(IOEvents.JOIN_ROOM, { chatId: chat.chatId })
      }
      props.setRoomJoined()
    }
  }, [props.chats])


  useEffect(() => {
    if (props.isNotification) {
      setTimeout(() => {
        props.stopNotificationSound()
      }, 1000);
    }
  }, [props.isNotification])


  useEffect(() => {
    for (const doc of props.uploadedDocuments) {
      if (doc.data) {
        props.removeDocument({ documentId: doc.documentId })
        sendMessage({
          socket,
          message: doc.name,
          chatId: doc.chatId,
          documentId: doc.data.documentId
        })
      }
    }
  }, [props.uploadedDocuments])


  return (
    <Fragment>
      <Sidebar
        socket={socket}
        store={props}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: userSidebarRight || userSidebarLeft
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              socket={socket}
              store={props}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
            <UserProfileSidebar
              store={props}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
      {
        props.isNotification &&
        <audio
          src={notificationSound}
          autoPlay
          style={{
            visibility: 'hidden'
          }}
        />
      }
    </Fragment>
  )
}

const mapStateToProps = (state) => {

  const {
    error,
    user,
    chats,
    chatError,
    authError,
    isAuthorized,
    isRoomsJoined,
    selectedChat,
    selectedUser,
    messages,
    isNotification,
    isEndOfMessages,
    mutedNotificationIds,
    isNotificationEnabled,
    documentList,
    uploadedDocuments,
    chatDocuments,
    chatDocumentsLoading,
    chatLoading,
    aboutUpdating,
    messagesLoading,
    newChatLoading,
    newChatError,
    teachersList,
    teachersListLoading,
    teachersListError,

  } = state.Chat;
  return {
    error,
    user,
    chats,
    chatError,
    authError,
    isAuthorized,
    isRoomsJoined,
    selectedChat,
    selectedUser,
    messages,
    isNotification,
    isEndOfMessages,
    mutedNotificationIds,
    isNotificationEnabled,
    documentList,
    uploadedDocuments,
    chatDocuments,
    chatDocumentsLoading,
    chatLoading,
    aboutUpdating,
    messagesLoading,
    newChatLoading,
    newChatError,
    teachersList,
    teachersListLoading,
    teachersListError,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    setLoggedUser,
    getChatContacts,
    authorizedSuccess,
    authorizedFailure,
    saveNewMessage,
    setRoomJoined,
    selectChat,
    updateSelectChat,
    getPreviousMessagesSuccess,
    getPreviousMessagesFailure,
    newMessage,
    updateChatHeadMessage,
    updateChatParticipants,
    deleteMessages,
    playNotificationSound,
    stopNotificationSound,
    setNotificationEnabled,
    setNotificationIds,
    muteChatNotification,
    unmuteChatNotification,
    uploadDocument,
    addDocumentToQueue,
    cancelDocumentUpload,
    updateDocumentProgress,
    removeDocument,
    getSelectChatDocuments,
    getSelectChatDocumentsSuccess,
    getSelectChatDocumentsFailure,
    updateAbout,
    updateAboutSuccess,
    updateAboutFailure,
    setPreviousMessagesLoading,
    createChat,
    getAllTeachers,
    removeChatParticipants,
    addChatParticipants
  })(AppChat)
)
