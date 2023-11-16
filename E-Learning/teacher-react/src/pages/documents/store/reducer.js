



import {

  GET_USER_DOCUMENTS,
  GET_USER_DOCUMENTS_SUCCESS,
  GET_USER_DOCUMENTS_FAILURE,
  SELECT_USER_DOCUMENTS_TYPE,
  ADD_USER_DOCUMENT_TO_QUEUE,
  UPDATE_USER_DOCUMENT_PROGRESS,
  CANCEL_USER_DOCUMENT_UPLOAD,
  DELETE_USER_DOCUMENT,
  DELETE_USER_DOCUMENT_SUCCESS,
  DELETE_USER_DOCUMENT_FAILURE,

} from './actionTypes'

const initialState = {
  documents: [],
  documentLoading: false,
  documentsError: null,
  selectedType: null,
  documentUploads: [],
}

const updateUserDocumentProgress = (state, payload) => {

  let { documents, documentUploads } = state;
  let doc = documentUploads.find(d => d.documentId == payload.documentId)
  if (doc) {
    if (payload.progress) {
      doc.progress = payload.progress
    }
    if (payload.data) {
      documents.push(payload.data)
      documentUploads = documentUploads.filter(d => d.documentId != payload.documentId)
    }
  }
  return {
    ...state,
    documentUploads: documentUploads,
    documents: documents
  }
}

const cancelDocumentUpload = (state, { documentId }) => {
  let doc = state.documentUploads.find(d => d.documentId == documentId)
  if (doc) doc.request.cancel()

  return {
    ...state,
    documentUploads: state.documentUploads.filter(f => f.documentId != documentId)
  }
}

const documentReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_USER_DOCUMENTS:
      return { ...state, selectedType: null, documents: [], documentLoading: true }

    case GET_USER_DOCUMENTS_SUCCESS:
      return { ...state, documents: action.payload, documentsError: null, documentLoading: false }

    case GET_USER_DOCUMENTS_FAILURE:
      return { ...state, documents: [], documentsError: action.payload, documentLoading: false }

    case SELECT_USER_DOCUMENTS_TYPE:
      return { ...state, selectedType: action.payload }

    case ADD_USER_DOCUMENT_TO_QUEUE:
      return { ...state, documentUploads: [...state.documentUploads, action.payload] }

    case UPDATE_USER_DOCUMENT_PROGRESS:
      return updateUserDocumentProgress(state, action.payload)

    case CANCEL_USER_DOCUMENT_UPLOAD:
      return cancelDocumentUpload(state, action.payload)

    case DELETE_USER_DOCUMENT:
      return { ...state, documentLoading: true }

    case DELETE_USER_DOCUMENT_SUCCESS:
      return { ...state, documentLoading: false, documents: state.documents.filter(d => d.documentId != action.payload) }

    case DELETE_USER_DOCUMENT_FAILURE:
      return { ...state, documentLoading: false }

    default:
      return state
  }
}

export default documentReducer
