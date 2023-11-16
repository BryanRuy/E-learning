import moment from "moment";
import { IOEvents } from "./eventTypes";
import { getLoggedInUser } from '../../../helpers/backend-helpers'
import authHeader from "../../../helpers/jwt-token-access/auth-token-header";


/**
 * 
 * @param {string} event 
 * @param {Object} res 
 * @param {any} props 
 */
const UpDateChatParticipants = (event, res, props) => {
    // // console.log(event, res);
    if (res.success) {
        props.updateChatParticipants({ chatId: res.chatId, data: res.data })
    }
}

/**
 * 
 * @param {string} event 
 * @param {Object} res 
 * @param {any} props 
 */
const UpDateChatsAndSelectedChat = (event, res, props) => {
    // // console.log(event, res);
    if (res.success) {
        UpDateChatParticipants(event, res, props)
        props.updateSelectChat(res.data)
    } else {
        // // console.log(event, res.error)
    }
}


/**
 * 
 * @param {string} event 
 * @param {Object} res 
 * @param {any} props 
 */
const StoreNewMessage = (event, res, props) => {
    // // console.log(event, res);
    props.playNotificationSound(res)
    props.saveNewMessage(res)
}


const addParticipantHandler = (event, res, props) => {
    // // console.log(event, res);
    if (res.success) {
        props.addChatParticipants(res)
    }
}


/**
 * 
 * @param {any} socket 
 * @param {any} props 
 */
export function attachEvents(socket, props) {

    socket.on(IOEvents.CONNECT, () => {
        // // console.log(IOEvents.CONNECT);
        socket.emit(IOEvents.SET_LANGUAGE, { locale: 'en' })
        let authorization = authHeader()['Authorization']
        socket.emit(IOEvents.AUTHORIZATION, { authorization })
    })

    socket.on(IOEvents.AUTHORIZATION, (res) => {
        // // console.log(IOEvents.AUTHORIZATION, res);
        if (res.success) {
            let user = getLoggedInUser() || {}
            props.getChatContacts(user.userId)
            props.authorizedSuccess()
        }
        else {
            props.authorizedFailure()
        }
    })

    socket.on(IOEvents.JOIN_ROOM, (res) => {
        // // console.log(IOEvents.JOIN_ROOM, res);
    })



    socket.on(IOEvents.GET_PREVIOUS_MESSAGES, (res) => {
        // // console.log(IOEvents.GET_PREVIOUS_MESSAGES, res);
        if (res.success) {
            props.getPreviousMessagesSuccess(res.data)
        }
        else {
            props.getPreviousMessagesFailure(res.error)
        }
    })

    socket.on(IOEvents.NEW_MESSAGE, res => StoreNewMessage(IOEvents.NEW_MESSAGE, res, props))

    socket.on(IOEvents.MESSAGES_DELIVERED, res => UpDateChatParticipants(IOEvents.MESSAGES_DELIVERED, res, props))
    socket.on(IOEvents.MESSAGES_SEEN, res => UpDateChatParticipants(IOEvents.MESSAGES_SEEN, res, props))

    socket.on(IOEvents.BLOCK_CHAT, res => UpDateChatsAndSelectedChat(IOEvents.BLOCK_CHAT, res, props))
    socket.on(IOEvents.UNBLOCK_CHAT, res => UpDateChatsAndSelectedChat(IOEvents.UNBLOCK_CHAT, res, props))

    socket.on(IOEvents.MESSAGES_DELETE, (res) => {
        // // console.log(IOEvents.MESSAGES_DELETE, res);
        if (res.success) {
            props.deleteMessages(res.data)
        }
    })

    socket.on(IOEvents.ADD_PARTICIPANT, res => addParticipantHandler(IOEvents.ADD_PARTICIPANT, res, props))

    socket.on(IOEvents.REMOVE_PARTICIPANT, (res) => {
        // // console.log(IOEvents.REMOVE_PARTICIPANT, res);
        if (res.success) {
            let user = getLoggedInUser();
            res.data.forEach(p => {
                if (user.userId == p.user.userId && p.chatParticipantStatus == 0) {
                    // // console.log("Removed from group")
                    socket.emit(IOEvents.LEAVE_ROOM, {
                        chatId: res.chatId
                    })
                }
            });
            props.removeChatParticipants(res);
        }
    })
}

/**
 * 
 * @param {any} socket 
 * @param {uuid} chatId 
 * @param {Moment} timeStamp 
 */

export function getPreviousMessages(socket, chatId, timeStamp = moment().utc()) {
    socket.emit(IOEvents.GET_PREVIOUS_MESSAGES, { chatId: chatId, dateTime: timeStamp })
}

/**
 * 
 * @param {any} socket 
 * @param {uuid} chatId 
 * @param {Moment} timeStamp 
 */

export function sendMessage({ socket, chatId, message, messageId, documentId }) {
    socket.emit(IOEvents.NEW_MESSAGE, { chatId, message: message, messageId, documentId })
}

/**
 * 
 * @param {any} socket 
 * @param {uuid} chatId 
 */

export function deleteMessages(socket, chatId,) {
    socket.emit(IOEvents.MESSAGES_DELETE, { chatId, lastMessageTime: moment().utc() })
}

/**
 * 
 * @param {any} socket 
 * @param {uuid} chatId 
 */

export function userBlockChat(socket, chatId,) {
    socket.emit(IOEvents.BLOCK_CHAT, { chatId })
}

/**
 * 
 * @param {any} socket 
 * @param {uuid} chatId 
 */

export function userUnBlockChat(socket, chatId,) {
    socket.emit(IOEvents.UNBLOCK_CHAT, { chatId })
    // // console.log("Unblock")
}