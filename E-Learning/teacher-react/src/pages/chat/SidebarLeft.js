import React from 'react';
// ** React Imports
import { useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { formatDateToMonthShort } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Search, Bell, Plus } from 'react-feather'
import {
  CardText, InputGroup, InputGroupAddon,
  Input, InputGroupText, CustomInput,
  Modal, ModalBody, Row, Col,
  Button, UncontrolledDropdown,
  DropdownItem, DropdownMenu, DropdownToggle,
  FormGroup, Label
} from 'reactstrap'


import UILoader from '../../@core/components/ui-loader';


import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';

import { notifyError, notifySuccess, notifyWarning } from '../../utility/toast'

import { GET_IMAGE_URL } from './../../helpers/url_helper';

import { getPreviousMessages } from './socket/events'

import './style.scss'
import { useTranslation } from 'react-i18next';


const SidebarLeft = props => {

  const { t } = useTranslation()
  // ** Props & Store
  const { sidebar, handleUserSidebarLeft, handleSidebar, userSidebarLeft, socket, store } = props

  const {
    setNotificationEnabled,
    isNotificationEnabled,
    selectChat,
    selectedChat,
    user,
    chats,
    chatLoading,
    updateAbout,
    newChatLoading,
    newChatError,
    createChat,
    getAllTeacherStudents,
    teacherStudents,
    teacherStudentsLoading,
    teacherStudentsError,
  } = store

  // ** State
  const [about, setAbout] = useState('')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState({})
  const [status, setStatus] = useState('online')
  const [filteredChat, setFilteredChat] = useState([])

  const [isNewChat, setIsNewChat] = useState(false)
  const [isNewChatGroup, setIsNewChatGroup] = useState(false)

  const [groupName, setGroupName] = useState('')
  const [participants, setParticipants] = useState([])
  const [userQuery, setUserQuery] = useState('')

  const [studentList , setStudentList] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = (chat, socket) => {
    handleSidebar()
    selectChat(chat)
    getPreviousMessages(socket, chat.chatId)
  }


  useEffect(() => {
    if ((isNewChat || isNewChatGroup) && !newChatLoading && newChatError) {
      notifyError(isNewChat ? t("New Chat") : t("New Group Chat"), newChatError)
    }
    else if ((isNewChat || isNewChatGroup) && !newChatLoading && !newChatError) {
      closeNewChat()
      if (chats.length > 0) handleUserClick(chats[chats.length - 1], socket)
      notifySuccess(isNewChat ? t("New Chat") : t("New Group Chat"), t('Chat started Successfully'))
    }
  }, [newChatLoading])

  useEffect(() => {
    if(teacherStudents && teacherStudents.data.length > 0) {
      let students = []
      teacherStudents.data.forEach(std => {
        students.push(std.user)
      });
      setStudentList(students)
    }
  },[teacherStudents])


  // ** Renders Chat
  const renderChats = () => {

    if (chats && chats.length) {
      if (query.length && !filteredChat.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Chats Found</h6>
          </li>
        )
      } else {
        const arrToMap = query.length && filteredChat.length ? filteredChat : chats

        return arrToMap.map(item => {
          const time = formatDateToMonthShort(item.messages.length > 0 ? item.messages[0].createdAt : new Date())

          return (
            <li
              className={item.chatId == selectedChat.chatId ? "active" : ""}
              key={item.chatId}
              onClick={() => handleUserClick(item, socket)}
            >
              <Avatar
                img={GET_IMAGE_URL(item.type == 'group'
                  ? item.groupPicture || null
                  : item.chatParticipants.find(u => u.user.userId != user.userId).user.profilePicture)
                }
                imgHeight='42' imgWidth='42' status={item.status} />
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>
                  {item.type == 'group'
                    ? item.groupName
                    : item.chatParticipants.find(u => u.user.userId != user.userId).user.name}
                </h5>
                <CardText className='text-truncate'>
                  {
                    item.chatParticipants.find(u => u.user.userId == user.userId && !u.blockedAt) ?
                      <>
                        {item.messages.length > 0 ? item.messages[0].content : ''}
                      </>
                      :
                      '...'
                  }
                </CardText>
              </div>
              <div className='chat-meta text-nowrap'>
                <small className='float-right mb-25 chat-time ml-25'>{time}</small>
                {/* {item.chat.unseenMsgs >= 1 ? (
                  <Badge className='float-right' color='danger' pill>
                    {item.chat.unseenMsgs}
                  </Badge>
                ) : null} */}
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = e => {
    setQuery(e.target.value)
    let val = e.target.value || "";
    const searchFilterFunction = chat => chat.chatParticipants.find(p => p.user.name.toLowerCase().includes(val.toLowerCase())) ||
      (chat.groupName || "").toLowerCase().includes(val.toLowerCase())

    const filteredChatsArr = chats.filter(searchFilterFunction)
    setFilteredChat([...filteredChatsArr])
  }

  const onNotificationChange = (e) => {
    // console.log(e.target.checked)
    setNotificationEnabled(e.target.checked)
  }

  const saveAbout = (e) => {
    e.preventDefault()
    // console.log("ABOUT___", e.target.value)
    updateAbout({ about: e.target.value })
  }

  const getChatByUserId = (id) => {
    return chats
      .filter(ct => ct.type == "chat")
      .find(c => c.chatParticipants.find(p => p.user.userId == id))
  }

  const openNewChatModel = (e, group = false) => {
    e.preventDefault()
    group ? setIsNewChatGroup(true) : setIsNewChat(true)
    getAllTeacherStudents();
  }

  const closeNewChat = () => {
    setIsNewChat(false)
    setIsNewChatGroup(false)
    setGroupName('')
    setParticipants([])
    setUserQuery("")
  }

  const startNewChat = (id) => {
    createChat({
      participants: [id],
      type: "chat"
    })
  }

  const toggleUserFromGroup = (user) => {
    if (participants.find(p => p.userId == user.userId)) return setParticipants(participants.filter(p => p.userId != user.userId))
    setParticipants([...participants, user])
  }

  const groupContacts = () => {
    return studentList
      .filter(u => !participants.find(p => p.userId == u.userId)).filter(p => p.name.toLowerCase().includes(userQuery.toLowerCase()))
  }

  const startNewGroupChat = () => {
    if (!groupName) return notifyWarning(t("New Group Chat"), t("Group name is required"))
    if (participants.length == 0) return notifyWarning(t("New Group Chat"), t("Participants are required for group creation"))
    createChat({
      participants: participants.map(u => u.userId),
      type: "group",
      groupName
    })
  }


  return (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <header className='chat-profile-header'>
            <div className='close-icon' onClick={handleUserSidebarLeft}>
              <X size={14} />
            </div>
            <div className='header-profile-sidebar'>
              <Avatar className='box-shadow-1 avatar-border'
                img={GET_IMAGE_URL(user.profilePicture)}
                status={status}
                size='xl' />
              <h4 className='chat-user-name'>{user.name}</h4>
              {/* <span className='user-post'>{user.role}</span> */}
            </div>
          </header>
          <PerfectScrollbar className='profile-sidebar-area' options={{ wheelPropagation: false }}>
            <h6 className='section-label mb-1'>About</h6>
            <div className='about-user'>
              <Input
                rows='5'
                defaultValue={user.about}
                type='textarea'
                onBlur={e => saveAbout(e)}
                onChange={e => setAbout(e.target.value)}
                className={classnames('char-textarea', {
                  'text-danger': about && about.length > 120
                })}
              />
              <small className='counter-value float-right'>
                <span className='char-count'>{user.about ? user.about.length : 0}</span>/ 120
              </small>
            </div>
            <h6 className='section-label mb-1 mt-3'>{t('Status')}</h6>
            <ul className='list-unstyled user-status'>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-primary'
                  id='online'
                  label={t('Online')}
                  onChange={e => setStatus('online')}
                  checked={status === 'online'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-danger'
                  id='busy'
                  label={t('Do Not Disturb')}
                  onChange={e => setStatus('busy')}
                  checked={status === 'busy'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-warning'
                  id='away'
                  label={t('Away')}
                  onChange={e => setStatus('away')}
                  checked={status === 'away'}
                />
              </li>
              <li className='pb-1'>
                <CustomInput
                  type='radio'
                  className='custom-control-secondary'
                  id='offline'
                  label={t('Offline')}
                  onChange={e => setStatus('offline')}
                  checked={status === 'offline'}
                />
              </li>
            </ul>
            <h6 className='section-label mb-1 mt-2'>{t('Settings')}</h6>
            <ul className='list-unstyled'>
              <li className='d-flex justify-content-between align-items-center mb-1'>
                <div className='d-flex align-items-center'>
                  <Bell className='mr-75' size='18' />
                  <span className='align-middle'>{t('Notification')}</span>
                </div>
                <CustomInput
                  type='switch'
                  defaultChecked={isNotificationEnabled}
                  id='notifications'
                  name='notifications'
                  label=''
                  onChange={onNotificationChange} />
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <div className='sidebar-profile-toggle' onClick={handleUserSidebarLeft}>
                {Object.keys(user).length ? (
                  <Avatar
                    className='avatar-border'
                    img={GET_IMAGE_URL(user.profilePicture || null)}
                    status={status}
                    imgHeight='42'
                    imgWidth='42'
                  />
                ) : null}
              </div>
              <InputGroup className='input-group-merge ml-1 w-100'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText className='round'>
                    <Search className='text-muted' size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  value={query}
                  className='round'
                  placeholder={t('Search or start a new chat')}
                  onChange={handleFilter}
                />
              </InputGroup>
              <div className="d-flex  justify-content-center align-items-center pl-1">
                <UncontrolledDropdown>
                  <DropdownToggle tag='span'>
                    <Button.Ripple color="flat-primary" className="btn btn-icon">
                      <Plus size={15} />
                    </Button.Ripple>

                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      tag='a' href='/' className='w-100'
                      onClick={e => openNewChatModel(e)}
                    >
                      <span className='align-middle ml-50'>{t('New Personal Chat')}</span>
                    </DropdownItem>
                    <DropdownItem
                      tag='a' href='/' className='w-100'
                      onClick={e => openNewChatModel(e, true)}
                    >
                      <span className='align-middle ml-50'>{t('New Group Chat')}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </div>
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            <h4 className='chat-list-title'>{t('Chats')}</h4>
            <ul className='chat-users-list chat-list media-list'>
              <UILoader blocking={chatLoading}>
                {renderChats()}
              </UILoader>
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
      <Modal isOpen={isNewChat} className="pt-5">
        <UILoader blocking={newChatLoading || teacherStudentsLoading}>
          <ModalBody className="p-2">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="m-0">New Chat</h3>
              <X
                size={16}
                onClick={() => closeNewChat()}
              />
            </div>
            <div className="mt-2">
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

              <div className="mt-2  student-list-modal-scroll" >
                {
                  studentList.length == 0 ? <NotFound message="No user Available for new chat" /> :
                  studentList
                      .filter(u => u.name.toLowerCase().includes(userQuery.toLowerCase()))
                      .map((s, index) =>
                        <Row key={'non-connected' + index}>
                          <Col sm='12'>
                            <div className=" new-chat-head-item d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center">
                                <Avatar
                                  img={GET_IMAGE_URL(s.profilePicture)} size='sm' />
                                <h5 className="m-0 ml-25">
                                  {
                                    s.name
                                  }
                                </h5>
                              </div>
                              <div className="action-btn">
                                {
                                  // !getChatByUserId(s.userId) &&
                                  <Button.Ripple
                                    color='primary'
                                    className="btn btn-sm"
                                    onClick={() => startNewChat(s.userId)}
                                  >
                                    {t('Chat')}
                                  </Button.Ripple>
                                }
                              </div>
                            </div>
                          </Col>
                        </Row>)
                }
              </div>
            </div>
          </ModalBody>
        </UILoader>
      </Modal>

      <Modal isOpen={isNewChatGroup} toggle={() => closeNewChat()} className="pt-5">
        <UILoader blocking={newChatLoading || teacherStudentsLoading}>
          <ModalBody className="p-2">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="m-0">{t('New Group Chat')}</h3>
              {
                participants.length > 0 &&

                <Button.Ripple
                  color='primary'
                  onClick={() => startNewGroupChat()}
                >
                  {t('Submit')}
                </Button.Ripple>
              }
            </div>
            <div className="mt-2">
              <div >
                {
                  studentList.length == 0 ? <NotFound message={t("No user Available for new chat")} /> :
                    <>
                      <FormGroup>
                        <Label className="ml-25">
                          {t('Group Name')}
                        </Label>
                        <InputGroup className='input-group-merge'>
                          <Input
                            type="text"
                            placeholder={t('Enter group name')}
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                          />
                        </InputGroup>
                      </FormGroup>
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
                                  <div className='w-100'>
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
                      <div className="student-list-modal-scroll">
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
                          : <NotFound message={t("No more contacts")} />
                      }
                      </div>
                    </>
                }
              </div>
            </div>
          </ModalBody>
        </UILoader>
      </Modal>

    </div>
  )
}

export default SidebarLeft
