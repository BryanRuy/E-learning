import { call, put, takeEvery } from "redux-saga/effects"
// Login Redux States
import {
  GET_CHAT_CONTACTS,
  GET_SELECT_CHAT_DOCUMENTS,
  UPDATE_ABOUT,
  UPLOAD_DOCUMENT,
  CREATE_CHAT,
  GET_ALL_TEACHERS
} from "./actionTypes"

import { v4 } from 'uuid';
import axios from 'axios';

import {
  addDocumentToQueue,
  cancelDocumentUpload,
  getChatContactsFailure,
  getChatContactsSuccess,
  getSelectChatDocumentsFailure,
  getSelectChatDocumentsSuccess,
  updateAboutFailure,
  updateAboutSuccess,
  updateDocumentProgress,
  createChatSuccess,
  createChatFailure,
  getAllTeachersSuccess,
  getAllTeachersFailure
} from "./actions"

//Include Both Helper File with needed methods
import {
  getChatContactsRequest,
  getChatDocuments,
  getLoggedInUser,
  updateUser,
  uploadDocument,
  createChat,
  getAllTeachers
} from "../../../helpers/backend-helpers"

function* getChatContactsHttp({ payload: { userId } }) {
  try {
    const response = yield call(getChatContactsRequest, userId);
    if (response) {
      yield put(getChatContactsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";


  } catch (error) {
    yield put(getChatContactsFailure(error.message ? error.message : error))
  }
}

function* uploadDocHttp({ payload: { chatId, file, callback } }) {
  let document = {
    documentId: v4(),
    chatId,
    name: file.name,
    progress: 0,
    request: axios.CancelToken.source(),
  }
  try {

    yield put(addDocumentToQueue(document))
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        callback({ documentId: document.documentId, progress: percent })
      },
      cancelToken: document.request.token
    }

    let formData = new FormData()

    formData.append("chatId", chatId)
    formData.append("file", file)

    const response = yield call(uploadDocument, formData, options);
    if (response) {
      yield put(updateDocumentProgress({ documentId: document.documentId, data: response }))
      return;
    }
    throw "Unknown response received from Server";


  } catch (error) {
    yield put(cancelDocumentUpload({ documentId: document.documentId }))
  }
}

function* getDocHttp({ payload: { chatId } }) {
  try {
    const response = yield call(getChatDocuments, chatId);
    if (response) {
      yield put(getSelectChatDocumentsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";


  } catch (error) {
    yield put(getSelectChatDocumentsFailure(error.message ? error.message : error))
  }
}

function* updateAboutHttp({ payload: { about } }) {
  try {
    let user = getLoggedInUser()
    user.about = about
    const response = yield call(updateUser, user.userId, user);
    if (response) {
      yield put(updateAboutSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(updateAboutFailure(error.message ? error.message : error))
  }
}

function* createChatHttp({ payload }) {
  try {

    const response = yield call(createChat, payload);
    if (response) {
      yield put(createChatSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(createChatFailure(error.message ? error.message : error))
  }
}

function* getAllTeachersHttp() {
  try {
    let user = getLoggedInUser()
    const response = yield call(getAllTeachers, user.userId);
    if (response) {
      yield put(getAllTeachersSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getAllTeachersFailure(error.message ? error.message : error))
  }
}

function* chatSaga() {
  yield takeEvery(GET_CHAT_CONTACTS, getChatContactsHttp)
  yield takeEvery(UPLOAD_DOCUMENT, uploadDocHttp)
  yield takeEvery(GET_SELECT_CHAT_DOCUMENTS, getDocHttp)
  yield takeEvery(UPDATE_ABOUT, updateAboutHttp)
  yield takeEvery(CREATE_CHAT, createChatHttp)
  yield takeEvery(GET_ALL_TEACHERS, getAllTeachersHttp)
}

export default chatSaga
