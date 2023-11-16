import { call, put, takeEvery } from "redux-saga/effects"

import { v4 } from 'uuid';
import axios from 'axios';

// Login Redux States
import {
  GET_USER_DOCUMENTS,
  UPLOAD_USER_DOCUMENT,
  DELETE_USER_DOCUMENT
} from "./actionTypes"


import {
  getUserDocumentsSuccess,
  getUserDocumentsFailure,
  updateUserDocumentProgress,
  cancelUserDocumentUpload,
  addUserDocumentToQueue,
  deleteUserDocumentSuccess,
  deleteUserDocumentFailure
} from "./actions"

//Include Both Helper File with needed methods
import { deleteUserDocument, getUserDocuments, uploadDocument } from "../../../helpers/backend-helpers"

function* getDocs() {
  try {
    const response = yield call(getUserDocuments);
    if (response) {
      yield put(getUserDocumentsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getUserDocumentsFailure(error.message ? error.message : error))
  }
}

function* uploadUserDoc({ payload: { file, callback } }) {
  let document = {
    documentId: v4(),
    name: file.name,
    progress: 0,
    request: axios.CancelToken.source(),
  }
  try {

    yield put(addUserDocumentToQueue(document))

    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total)
        callback({ documentId: document.documentId, progress: percent })
      },
      cancelToken: document.request.token
    }

    let formData = new FormData()
    formData.append("file", file)

    const response = yield call(uploadDocument, formData, options);
    if (response) {
      yield put(updateUserDocumentProgress({ documentId: document.documentId, data: response }))
      return;
    }
    throw "Unknown response received from Server";


  } catch (error) {
    yield put(cancelUserDocumentUpload({ documentId: document.documentId }))
  }
}

function* deleteUseDoc({ payload }) {
  try {
    // console.log("documentId", payload)
    const response = yield call(deleteUserDocument, payload);
    if (response) {
      yield put(deleteUserDocumentSuccess(payload))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(deleteUserDocumentFailure(payload))
  }
}



function* documentSaga() {
  yield takeEvery(GET_USER_DOCUMENTS, getDocs)
  yield takeEvery(UPLOAD_USER_DOCUMENT, uploadUserDoc)
  yield takeEvery(DELETE_USER_DOCUMENT, deleteUseDoc)
}

export default documentSaga
