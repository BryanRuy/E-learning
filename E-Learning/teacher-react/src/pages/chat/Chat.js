import React from 'react';
// ** React Imports
import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

// ** Custom Components
import Avatar from '@components/avatar'
import AvatarGroup from '@components/avatar-group'
import { getShortNameForDocument } from '@utils';

// ** Store & Actions

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { MessageSquare, Menu, Search, MoreVertical, Send, Calendar, FileText, X, Info } from 'react-feather'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Label,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button,
  Spinner,
  Progress,
  UncontrolledTooltip,
  Card,
  CardBody, Row, Col, Modal, ModalBody
} from 'reactstrap'

import moment from 'moment';


import { v4 } from "uuid"
import {
  sendMessage,
  getPreviousMessages,
  deleteMessages,
  userBlockChat,
  userUnBlockChat,
  addParticipantsWithSocket,
  removeParticipantsWithSocket
} from './socket/events';

import { GET_DOCUMENT_URL, GET_IMAGE_URL, DOCUMENT_BASE_URL } from './../../helpers/url_helper';

import NotFound from '../../components/not-found';

import { notifyError, notifySuccess, notifyWarning } from '../../utility/toast'

import UILoader from '../../@core/components/ui-loader';

import { detectLinkInMessage, getFileIcon, getFilePreview } from './utility';
import Picker from "emoji-picker-react";

import { DateTime } from '../../components/date-time'

import { useDropzone } from 'react-dropzone'


import './style.scss'
import { useTranslation } from 'react-i18next';

const ChatLog = props => {

  const { t } = useTranslation()
  // ** Props & Store
  const {
    store,
    handleUserSidebarRight,
    handleSidebar,
    userSidebarLeft,
    socket
  } = props

  const {
    muteChatNotification,
    uploadDocument,
    unmuteChatNotification,
    mutedNotificationIds,
    chats,
    selectedChat,
    newMessage,
    isEndOfMessages,
    documentList,
    cancelDocumentUpload,
    updateDocumentProgress,
    user,
    messages,
    messagesLoading,
    setPreviousMessagesLoading,
    getAllTeacherStudents,
    teacherStudents,
    teacherStudentsLoading,
    teacherStudentsError,
    addParticipantLoading,
    addParticipantError,
    addParticipants,
    removeParticipants,
    removeParticipantLoading,
    removeParticipantError
  } = store




  // ** Refs & Dispatch
  const chatArea = useRef(null)



  // ** State
  const [msg, setMsg] = useState('')
  const [messageRefId, setMessageRefId] = useState(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [emojiSelectorShowing, setEmojiSelectorShowing] = useState(false)
  const [dropZoneVisible, setDropZoneVisible] = useState(false)
  const [query, setQuery] = useState("")

  const [isAddParticipants, setIsAddParticipants] = useState(false)
  const [isRemoveParticipants, setIsRemoveParticipants] = useState(false)
  const [participants, setParticipants] = useState([])
  const [participantsRemoveList, setParticipantsRemoveList] = useState([])
  const [userQuery, setUserQuery] = useState('')
  const [studentList , setStudentList] = useState([])

  useEffect(() => {
    setQuery("")
  }, [selectedChat])

  // ** Scroll to chat bottom
  const scrollToBottom = (animated = false) => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current)
    chatContainer.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior: animated ? 'smooth' : 'auto' });
  }

  const scrollToPosition = () => {
    if (messageRefId) {
      let topMsg = document.getElementById(messageRefId);
      if (topMsg) topMsg.scrollIntoView();
    }
  }

  useEffect(() => {
    setMessageRefId(null)
  }, [selectedChat])


  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedChat).length
    if (selectedUserLen > 0 && !messageRefId) scrollToBottom()
    if (messageRefId) scrollToPosition()
  }, [messages])


  const handleScroll = event => {
    const { scrollHeight, scrollTop, clientHeight, scrollToBottom } = event.target;
    const bottom = scrollHeight - scrollTop - clientHeight

    setShowScrollToBottom(bottom > 200)
    if (scrollTop == 0 && messages.length > 15 && !isEndOfMessages) {
      let time = messages[0] ? messages[0].createdAt : moment().utc()
      messages[0] ? setMessageRefId(messages[0].messageId) : setMessageRefId(null)
      if (selectedChat.chatId) {
        setPreviousMessagesLoading()
        getPreviousMessages(socket, selectedChat.chatId, time)
      }
    }
  }


  const openDocument = (link) => {
    if (link)
      window.open(GET_DOCUMENT_URL(link), '_blank')
  }

  const getFilterMessages = () => {
    if (!query) return messages;
    return messages.filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
  }

  // ** Renders user chat
  const renderChats = () => {
    let msgs = getFilterMessages();
    return <>
      {
        messagesLoading &&
        <div className="text-center">
          <Spinner size="lg" color={'primary'} />
        </div>
      }
      {msgs.map((item, index) =>
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.user.userId !== user.userId,
          })}
        >
          {
            !(index > 0 && index < msgs.length && moment(msgs[index - 1].createdAt).isSame(item.createdAt, 'date')) &&
            <div
              className="text-center m-2"
              style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}
            >
              <Calendar size={16} />
              &nbsp;&nbsp;
              <DateTime type="date" dateTime={item.createdAt} />
              {/* {
                moment(item.createdAt).format("DD MMM YYYY")
              } */}
            </div>
          }

          <div>
            <div className='chat-avatar'>
              <Avatar
                className='box-shadow-1 cursor-pointer'
                img={GET_IMAGE_URL(item.user.profilePicture)}
                style={{
                  visibility: index < msgs.length && index > 0 ?
                    (item.user.userId == msgs[index - 1].user.userId
                      && moment(msgs[index - 1].createdAt)
                        .isSame(item.createdAt, 'minute') ? "hidden" : "visible"
                    )
                    : "visible"
                }}
              />
            </div>
            <div
              className="chat-body"
            >
              <div id={item.messageId} key={"msg_" + item.messageId} className={`chat-content ${item.document ? 'file' : ''}`}>
                <p
                  className="message-user-name"
                  style={{
                    display: index < msgs.length && index > 0 ?
                      (item.user.userId == msgs[index - 1].user.userId
                        && moment(msgs[index - 1].createdAt)
                          .isSame(item.createdAt, 'minute') ? "none" : "block"
                      )
                      : "block"
                  }}
                >
                  {
                    selectedChat.type == "group"
                    && item.user.userId !== user.userId
                    && (item.user.name || "").split(" ")[0]
                  }
                </p>
                <p
                  onClick={() => openDocument(!!item.document ? item.document.name : null)}
                  className={!!item.document ? "cursor-pointer" : ''}
                >
                  {
                    !!item.document && <>{getFileIcon(item.document.fileType)}&nbsp;&nbsp;</>
                  }
                  {
                    item.document ?
                      <span className="font-weight-bold ">{item.content}</span>
                      : detectLinkInMessage(item.content)
                  }
                </p>
                {item.document &&
                  getFilePreview(item.document.name, item.document.fileType)
                }
              </div>
            </div>
            {
              item.error &&
              <div className="text-right">
                <Info size={14} className="text-danger mr-1" />
              </div>
            }
            {
              index < msgs.length - 1 && index > -1 ?
                <>
                  {
                    item.user.userId == msgs[index + 1].user.userId
                      && moment(msgs[index + 1].createdAt).isSame(item.createdAt, 'minute') ?
                      ""
                      : <div className="msg-time" >
                        <DateTime type="time" dateTime={item.createdAt} />
                      </div>
                  }
                </>
                : <div className="msg-time" >
                  <DateTime type="time" dateTime={item.createdAt} />
                </div>
            }
          </div>
        </div>
      )
      }</>

  }

  // ** Opens right sidebar & handles its data
  const handleAvatarClick = obj => {
    handleUserSidebarRight()
  }

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (!Object.keys(selectedChat).length && !userSidebarLeft && window.innerWidth <= 1200) {
      handleSidebar()
    }
  }

  const onEmojiClick = (e, selectedEmoji) => {
    setMsg(`${msg}${selectedEmoji.emoji}`);
  }


  const clearChat = (e) => {
    e.preventDefault()
    deleteMessages(socket, selectedChat.chatId)
    setMessageRefId(null)
  }

  const blockChat = (e) => {
    e.preventDefault()
    userBlockChat(socket, selectedChat.chatId)
  }

  const closeGroupOptions = () => {
    setIsAddParticipants(false)
    setIsRemoveParticipants(false)
    setUserQuery("")
    setParticipants([])
    setParticipantsRemoveList([])
  }


  const toggleUserFromGroup = (user) => {
    if (participants.find(p => p.userId == user.userId)) return setParticipants(participants.filter(p => p.userId != user.userId))
    setParticipants([...participants, user])
  }

  const toggleUserFromGroupForRemoval = (u) => {

    if (participantsRemoveList.find(p => p.user.userId == u.user.userId))
      return setParticipantsRemoveList(participantsRemoveList.filter(p => p.user.userId != u.user.userId))
    setParticipantsRemoveList([...participantsRemoveList, u])
  }

  useEffect(() => {
    if (isAddParticipants && !addParticipantLoading && addParticipantError) {
      notifyError(t("Add Participants"), addParticipantError)
    }
    else if (isAddParticipants && !addParticipantLoading && !addParticipantError) {
      closeGroupOptions()
      notifySuccess(t("Add Participants"), t('Participants added Successfully'))
    }
  }, [addParticipantLoading])

  useEffect(() => {
    if (isRemoveParticipants && !removeParticipantLoading && removeParticipantError) {
      notifyError(t("Remove Participants"), removeParticipantError)
    }
    else if (isRemoveParticipants && !removeParticipantLoading && !removeParticipantError) {
      closeGroupOptions()
      notifySuccess(t("Remove Participants"), t('Participants removed Successfully'))
    }
  }, [removeParticipantLoading])

  useEffect(() => {
    if(teacherStudents && teacherStudents.data.length > 0) {
      let students = []
      teacherStudents.data.forEach(std => {
        students.push(std.user)
      });
      setStudentList(students)
    }
  },[teacherStudents])

  const groupContacts = () => {
    return studentList
      .filter(u => !selectedChat.chatParticipants.find(p => p.user.userId == u.userId && p.chatParticipantStatus == 1))
      .filter(u => !participants.find(p => p.userId == u.userId))
      .filter(p => p.name.toLowerCase().includes(userQuery.toLowerCase()))
  }

  const getChatParticipants = () => {
    return selectedChat.chatParticipants
      .filter(p => p.user.userId != user.userId)
      .filter(p => p.chatParticipantStatus == 1)
      .filter(u => !participantsRemoveList.find(p => p.user.userId == u.user.userId))
      .filter(p => p.user.name.toLowerCase().includes(userQuery.toLowerCase()))
  }


  const addParticipantsToGroup = () => {

    if (participants.length == 0) return notifyWarning(t("Add Participants"), t("Participants are required"))
    addParticipants();
    addParticipantsWithSocket(socket, {
      chatId: selectedChat.chatId,
      participants: participants.map(u => u.userId),
    })
  }

  const removeParticipantsFromGroup = () => {

    if (participantsRemoveList.length == 0) return notifyWarning(t("Remove Participant"), t("Participants are required for removal"))
    removeParticipants();
    removeParticipantsWithSocket(socket, {
      chatId: selectedChat.chatId,
      participants: participantsRemoveList.map(u => u.user.userId),
    })
  }


  const addParticipantsHandler = (e) => {
    e.preventDefault()
    setIsAddParticipants(true)
    getAllTeacherStudents()
  }

  const removeParticipantsHandler = (e) => {
    e.preventDefault()
    setIsRemoveParticipants(true)
  }

  const unBlockChat = (e) => {

    e.preventDefault()
    userUnBlockChat(socket, selectedChat.chatId)
  }

  const muteNotification = (e) => {
    e.preventDefault()
    muteChatNotification(selectedChat.chatId)
  }

  const unmuteNotification = (e) => {
    e.preventDefault()
    unmuteChatNotification(selectedChat.chatId)
  }



  // ** Sends New Msg
  const handleSendMsg = e => {
    if (emojiSelectorShowing) setEmojiSelectorShowing(false);
    e.preventDefault()
    if (msg.length) {
      let message = {
        content: msg,
        messageId: v4(),
        createdAt: moment(),
        user: user
      }
      setMessageRefId(message.messageId)
      sendMessage({ socket, chatId: selectedChat.chatId, message: msg, messageId: message.messageId })
      newMessage(message)
      setMsg('')
    }

  }

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper = Object.keys(selectedChat).length > 0 ? PerfectScrollbar : 'div'

  const uploadFile = (file) => {
    uploadDocument({
      chatId: selectedChat.chatId,
      file: file,
      callback: ({ progress, documentId }) => updateDocumentProgress({ progress, documentId })
    })
  }

  const onDrop = files => {
    // Do something with the files
    setDropZoneVisible(false)

    let count = 0;
    files.forEach(file => {
      if (count < 5) uploadFile(file)
      count++
    });

  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const onFileSelectChange = (e) => {
    let count = 0;
    for (let key in e.target.files) {
      if (e.target.files.hasOwnProperty(key)) {
        uploadFile(e.target.files[key])
        if (count == 5) {
          break;
        }
        count++
      }
    }
    document.getElementById('attach-doc').value = null;
  }


  const captureDragOver = (e) => {
    setDropZoneVisible(true)

  }
  const captureDragLeave = (e) => {
    setDropZoneVisible(false)

  }

  return (
    <div className='chat-app-window'>
      <div className={classnames('start-chat-area', { 'd-none': Object.keys(selectedChat).length })}>
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
          {t('Start Conversation')}
        </h4>
      </div>

      <div className={
        `bg-gradient-primary ${dropZoneVisible ? "chat-dropzone visible" : "chat-dropzone"}`
      }

        {...getRootProps({
          onClick: event => event.stopPropagation()
        })}
        onDragLeave={e => captureDragLeave(e)}
      >
        <input {...getInputProps()} />
        <FileText className="icon" width={50} height={50} />
      </div>
      {Object.keys(selectedChat).length > 0 &&
        <div
          className={classnames('active-chat', { 'd-none': selectedChat === null })}
          onDragEnter={e => captureDragOver(e)}
        >
          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div className='sidebar-toggle d-block d-lg-none mr-1' onClick={handleSidebar}>
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight='36'
                  imgWidth='36'
                  img={GET_IMAGE_URL(selectedChat.type == 'group'
                    ? selectedChat.groupPicture || null
                    : selectedChat.chatParticipants.find(u => u.user.userId != user.userId).user.profilePicture)
                  }
                  className='avatar-border user-profile-toggle m-0 mr-1'
                  onClick={handleUserSidebarRight}
                />
                <h6 className='mb-0' onClick={handleUserSidebarRight}>
                  {
                    selectedChat.type == 'group'
                      ? selectedChat.groupName
                      : selectedChat.chatParticipants.find(u => u.user.userId != user.userId).user.name
                  }
                </h6>
              </div>
              <div className='d-flex align-items-center'>
                {/* <PhoneCall size={18} className='cursor-pointer d-sm-block d-none mr-1' />
                <Video size={18} className='cursor-pointer d-sm-block d-none mr-1' /> */}
                <div className="d-none d-md-block">
                  <InputGroup className='input-group-merge '>
                    <Input placeholder='Search here'
                      value={query} onChange={e => setQuery(e.target.value)}
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>
                        {
                          !query &&
                          <Search size={14} />
                        }
                        {
                          query &&
                          <X size={14} onClick={() => setQuery("")} />
                        }
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <UncontrolledDropdown>
                  <DropdownToggle className='btn-icon' color='transparent' size='sm'>
                    <MoreVertical size='18' />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem href='/' onClick={e => {
                      e.preventDefault()
                      handleUserSidebarRight()
                    }}>
                      {t('View Contact')}
                    </DropdownItem>
                    {
                      mutedNotificationIds && !mutedNotificationIds[selectedChat.chatId]
                      &&
                      <DropdownItem href='/' onClick={muteNotification}>
                        {t('Mute Notifications')}
                      </DropdownItem>
                    }
                    {
                      mutedNotificationIds && mutedNotificationIds[selectedChat.chatId]
                      &&
                      <DropdownItem href='/' onClick={unmuteNotification}>
                        {t('Unmute Notifications')}
                      </DropdownItem>
                    }
                    {
                      selectedChat.chatParticipants.find(u => u.user.userId == user.userId && !u.blockedAt) &&
                      <DropdownItem href='/' onClick={blockChat}>
                        {t('Block Chat')}
                      </DropdownItem>
                    }

                    {
                      selectedChat.chatParticipants.find(u => u.user.userId == user.userId && u.blockedAt) &&
                      <DropdownItem href='/' onClick={unBlockChat}>
                        {t('Unblock Chat')}
                      </DropdownItem>
                    }
                    <DropdownItem href='/' onClick={clearChat}>
                      {t('Clear Chat')}
                    </DropdownItem>
                    {
                      selectedChat.type == 'group' && selectedChat.user.userId == user.userId &&
                      <>
                        <DropdownItem href='/' onClick={addParticipantsHandler}>
                          {t('Add Participants')}
                        </DropdownItem>
                        <DropdownItem href='/' onClick={removeParticipantsHandler}>
                          {t('Remove Participants')}
                        </DropdownItem>
                      </>
                    }
                    <DropdownItem href='/' onClick={e => e.preventDefault()}>
                      {t('Report')}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </header>
          </div>

          {
            emojiSelectorShowing &&
            <div className="emoji-picker-custom d-none d-md-block">
              <Picker
                groupVisibility={false}
                onEmojiClick={onEmojiClick}
                disableAutoFocus={false}
                native
              />
            </div>

          }

          <ChatWrapper onScroll={e => handleScroll(e)} ref={chatArea} className='user-chats' options={{ wheelPropagation: false }}>
            {
              Object.keys(selectedChat).length > 0 &&
              <div className='chats'>
                {renderChats()}
              </div>

            }

            {
              messages.length > 0 && messages[messages.length - 1].user.userId === user.userId &&
              <div className="text-right p-1 msg-delivery-status-container">
                <AvatarGroup
                  data={
                    selectedChat.chatParticipants
                      .filter(cp => cp.chatParticipantStatus != 0)
                      .filter(cp => cp.seenAt != null && cp.user.userId != user.userId)
                      .map(p => ({
                        title: p.user.name,
                        img: DOCUMENT_BASE_URL + p.user.profilePicture || `${DOCUMENT_BASE_URL}profile-pictures/default.png`,
                        imgWidth: '16',
                        imgHeight: '16',
                        className: 'msg-delivery-status'
                      }))
                  } />
              </div>
            }
          </ChatWrapper>

          <Button
            onClick={() => scrollToBottom(true)}
            color="gradient-primary"
            hidden={!showScrollToBottom}
            className="btn-icon round btn-sm btn-scroll-top-chat">
            <i className="la la-arrow-down" />
          </Button>

          {
            documentList.filter(f => f.chatId == selectedChat.chatId).length > 0 &&
            < div className="chat-selected-files-container">
              <Card className="ml-1">
                <CardBody className="p-1">
                  <div className="chat-selected-files-area">
                    {
                      documentList.filter(f => f.chatId == selectedChat.chatId).map((d, index) =>
                        <div className="selected-file" key={"selectedFiles_" + d.documentId}>
                          <Progress
                            value={d.progress}
                            min={0}
                            max={100}
                            animated={true}
                          />
                          <div>
                            <span className="mr-1" id={`doc-name-${d.documentId}`} >
                              {getShortNameForDocument(d.name)}
                            </span>
                            <UncontrolledTooltip placement='top' target={`doc-name-${d.documentId}`}>
                              {d.name}
                            </UncontrolledTooltip>
                            <button onClick={() => cancelDocumentUpload({ documentId: d.documentId })}>
                              <i className="la la-times"></i>
                            </button>
                          </div>
                        </div>)
                    }
                  </div>
                </CardBody>
              </Card>
            </div>
          }

          {
            selectedChat.chatParticipants.find(u => u.user.userId == user.userId && !u.blockedAt)
              ?
              <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
                <InputGroup className='input-group-merge mr-1 form-send-message'>
                  <Input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder='Type your message...'
                  />
                  <InputGroupAddon addonType='append'>
                    <InputGroupText>
                      <Label className='attachment-icon mb-0' for='attach-doc'>
                        <i className='cursor-pointer text-secondary la la-paperclip chat-file' />
                        <input type='file' id='attach-doc' multiple={true} hidden onChange={onFileSelectChange} />
                      </Label>
                    </InputGroupText>
                    <InputGroupText className="pl-0 d-none d-md-block" onClick={() => setEmojiSelectorShowing(emojiSelectorShowing => !emojiSelectorShowing)}>
                      <Label className='emoji-icon mb-0'>
                        <i className='cursor-pointer text-secondary la la-grin-alt chat-file' />
                      </Label>
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <Button
                  className='send'
                  color='primary'
                  onClick={handleSendMsg}
                >
                  <Send size={14} className='d-lg-none' />
                  <span className='d-none d-lg-block'>Send</span>
                </Button>
              </Form>
              :
              <div className="text-center pt-1">
                {t('You can not reply to this conversation')}
              </div>
          }
        </div>
      }
      {
        Object.keys(selectedChat).length > 0 &&
        <>
          <Modal isOpen={isAddParticipants} toggle={() => closeGroupOptions()} className="pt-5">
            <UILoader blocking={teacherStudentsLoading || addParticipantLoading}>
              <ModalBody className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="m-0">{selectedChat.groupName}</h3>
                  {
                    participants.length > 0 &&
                    <Button.Ripple
                      color='primary'
                      onClick={() => addParticipantsToGroup()}
                    >
                      {t('Submit')}
                    </Button.Ripple>
                  }
                </div>
                <div className="mt-2">
                  <div >
                    {
                      studentList.length == 0 ? <NotFound message="No user Available for new chat" /> :
                        <>
                          {
                            participants.length > 0 &&
                            <>
                              <Label className="ml-25 mb-1">
                                {t('Participants')}
                              </Label>
                              <Row className="mb-2">
                                {
                                  participants.map((u, index) =>
                                    <Col
                                      key={"selected-participant" + index}
                                      lg='2'
                                      md='2'
                                      sm='2'
                                      xs="3"
                                    >
                                      <div>
                                        <Avatar
                                          img={GET_IMAGE_URL(u.profilePicture)} size='lg' />
                                        <div className="unselect-group-user"
                                          onClick={() => toggleUserFromGroup(u)}
                                        >
                                          <X size={14} />
                                        </div>
                                      </div>
                                    </Col>)
                                }
                              </Row>
                            </>
                          }
                          <InputGroup className='input-group-merge'>
                            <Input placeholder='Search here' value={userQuery} onChange={e => setUserQuery(e.target.value)} />
                            <InputGroupAddon addonType='append'>
                              <InputGroupText>
                                {
                                  !userQuery &&
                                  <Search size={14} />
                                }
                                {
                                  userQuery &&
                                  <X size={14} onClick={() => setUserQuery('')} />
                                }
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          <Label className="ml-25 mb-1 mt-1">
                            {t('Contacts')}
                          </Label>
                          {
                            groupContacts().length > 0 ?
                              groupContacts()
                                .map((s, index) =>
                                  <Row key={'non-connected' + index}>
                                    <Col sm='12'>
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="d-flex align-items-center">
                                          <Avatar
                                            img={GET_IMAGE_URL(s.profilePicture)} size='sm' />
                                          <h5 className="m-0 ml-25">
                                            {
                                              s.name
                                            }
                                          </h5>
                                        </div>
                                        <Button.Ripple
                                          color='primary'
                                          onClick={() => toggleUserFromGroup(s)}
                                        >
                                          {t('Add')}
                                        </Button.Ripple>
                                      </div>
                                    </Col>
                                  </Row>)
                              : <NotFound message="No more contacts" />
                          }
                        </>
                    }
                  </div>
                </div>
              </ModalBody>
            </UILoader>
          </Modal>
          <Modal isOpen={isRemoveParticipants} toggle={() => closeGroupOptions()} className="pt-5">
            <UILoader blocking={removeParticipantLoading}>
              <ModalBody className="p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="m-0">{selectedChat.groupName}</h3>
                  {
                    participantsRemoveList.length > 0 &&
                    <Button.Ripple
                      color='primary'
                      onClick={() => removeParticipantsFromGroup()}
                    >
                      {t('Submit')}
                    </Button.Ripple>
                  }
                </div>
                <div className="mt-2">
                  <div >
                    {
                      selectedChat.chatParticipants.length < 2 ? <NotFound message="No user available for removal" /> :
                        <>
                          {
                            participantsRemoveList.length > 0 &&
                            <>
                              <Label className="ml-25 mb-1">
                                {t('Participants')}
                              </Label>
                              <Row className="mb-2">
                                {
                                  participantsRemoveList.map((u, index) =>
                                    <Col
                                      key={"selected-participant" + index}
                                      lg='2'
                                      md='2'
                                      sm='2'
                                      xs="3"
                                    >
                                      <div>
                                        <Avatar
                                          img={GET_IMAGE_URL(u.user.profilePicture)} size='lg' />
                                        <div className="unselect-group-user"
                                          onClick={() => toggleUserFromGroupForRemoval(u)}
                                        >
                                          <X size={14} />
                                        </div>
                                      </div>
                                    </Col>)
                                }
                              </Row>
                            </>
                          }
                          <InputGroup className='input-group-merge'>
                            <Input placeholder='Search here' value={userQuery} onChange={e => setUserQuery(e.target.value)} />
                            <InputGroupAddon addonType='append'>
                              <InputGroupText>
                                {
                                  !userQuery &&
                                  <Search size={14} />
                                }
                                {
                                  userQuery &&
                                  <X size={14} onClick={() => setUserQuery('')} />
                                }
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          <Label className="ml-25 mb-1 mt-1">
                            {t('Contacts')}
                          </Label>
                          {
                            getChatParticipants().length > 0 ?
                              getChatParticipants()
                                .map((u, index) =>
                                  <Row key={'connected' + index}>
                                    <Col sm='12'>
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="d-flex align-items-center">
                                          <Avatar
                                            img={GET_IMAGE_URL(u.user.profilePicture)} size='sm' />
                                          <h5 className="m-0 ml-25">
                                            {
                                              u.user.name
                                            }
                                          </h5>
                                        </div>
                                        <Button.Ripple
                                          color='primary'
                                          onClick={() => toggleUserFromGroupForRemoval(u)}
                                        >
                                          {t('Remove')}
                                        </Button.Ripple>
                                      </div>
                                    </Col>
                                  </Row>)
                              : <NotFound message="No more contacts" />
                          }
                        </>
                    }
                  </div>
                </div>
              </ModalBody>
            </UILoader>
          </Modal>

        </>
      }


    </div >
  )
}

export default ChatLog
