import {
  GET_USER_DOCUMENTS,
  GET_USER_DOCUMENTS_SUCCESS,
  GET_USER_DOCUMENTS_FAILURE,
  
  SELECT_USER_DOCUMENTS_TYPE,
  UPLOAD_USER_DOCUMENT,
  ADD_USER_DOCUMENT_TO_QUEUE,
  UPDATE_USER_DOCUMENT_PROGRESS,
  CANCEL_USER_DOCUMENT_UPLOAD,
  DELETE_USER_DOCUMENT,
  DELETE_USER_DOCUMENT_FAILURE,
  DELETE_USER_DOCUMENT_SUCCESS,


} from './actionTypes'


export const getUserDocuments = () => {
  return {
    type: GET_USER_DOCUMENTS,
  }
}

export const getUserDocumentsSuccess = (data) => {
  return {
    type: GET_USER_DOCUMENTS_SUCCESS,
    payload: data
  }
}

export const getUserDocumentsFailure = (error) => {
  return {
    type: GET_USER_DOCUMENTS_FAILURE,
    payload: error
  }
}

export const selectUserDocumentsType = (type) => {
  return {
    type: SELECT_USER_DOCUMENTS_TYPE,
    payload: type
  }
}


export const uploadUserDocument = ({ file, callback }) => {
  return {
    type: UPLOAD_USER_DOCUMENT,
    payload: { file, callback }
  }
}

export const addUserDocumentToQueue = ({ documentId, name, progress, request }) => {
  return {
    type: ADD_USER_DOCUMENT_TO_QUEUE,
    payload: { documentId, name, progress, request }
  }
}

export const cancelUserDocumentUpload = ({ documentId }) => {
  return {
    type: CANCEL_USER_DOCUMENT_UPLOAD,
    payload: { documentId }
  }
}


export const updateUserDocumentProgress = ({ documentId, progress, data }) => {
  return {
    type: UPDATE_USER_DOCUMENT_PROGRESS,
    payload: { documentId, progress, data }
  }
}

export const deleteUserDocument = (documentId) => {
  return {
    type: DELETE_USER_DOCUMENT,
    payload: documentId
  }
}

export const deleteUserDocumentFailure = (documentId) => {
  return {
    type: DELETE_USER_DOCUMENT_FAILURE,
    payload: documentId
  }
}

export const deleteUserDocumentSuccess = (documentId) => {
  return {
    type: DELETE_USER_DOCUMENT_SUCCESS,
    payload: documentId
  }
}
