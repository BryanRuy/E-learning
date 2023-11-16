import {
    GET_EBOOKS,
    GET_EBOOKS_SUCCESS,
    GET_EBOOKS_FAILURE,

    POST_EBOOK,
    POST_EBOOK_SUCCESS,
    POST_EBOOK_FAILURE,

    PUT_EBOOK,
    PUT_EBOOK_SUCCESS,
    PUT_EBOOK_FAILURE,

} from './actionTypes'

const initialState = {
    ebooks: [],
    ebooksError: null,
    ebooksLoading: false,

    postEbookSuccess: false,
    postEbookError: null,
    postEbookLoading: false,

    putEbookSuccess: false,
    putEbookError: null,
    putEbookLoading: false

}

const EbookReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EBOOKS:
            return { ...state, ebooksLoading: true }
        case GET_EBOOKS_SUCCESS:
            return { ...state, ebooksLoading: false, ebooks: action.payload }
        case GET_EBOOKS_FAILURE:
            return { ...state, ebooksLoading: false, ebooksError: action.payload }

        case POST_EBOOK:
            return { ...state, postEbookLoading: true }
        case POST_EBOOK_SUCCESS:
            return { ...state, postEbookLoading: false, postEbookSuccess: true }
        case POST_EBOOK_FAILURE:
            return { ...state, postEbookLoading: false, postEbookError: action.payload }

        case PUT_EBOOK:
            return { ...state, putEbookLoading: true }
        case PUT_EBOOK_SUCCESS:
            return { ...state, putEbookLoading: false, putEbookSuccess: true }
        case PUT_EBOOK_FAILURE:
            return { ...state, putEbookLoading: false, putEbookError: action.payload }

        default:
            return state
    }
}

export default EbookReducer