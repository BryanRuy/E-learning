import {
    GET_EBOOKS,
    GET_EBOOKS_SUCCESS,
    GET_EBOOKS_FAILURE,

    DOWNLOAD_EBOOK,
    DOWNLOAD_EBOOK_SUCCESS,
    DOWNLOAD_EBOOK_FAILURE,

    BUY_EBOOK,
    BUY_EBOOK_SUCCESS,
    BUY_EBOOK_FAILURE,

} from './actionTypes'

const initialState = {
    ebooks: [],
    ebooksError: null,
    ebooksLoading: false,

    downloadEbookData: null,
    downloadEbookSuccess: false,
    downloadEbookError: null,
    downloadEbookLoading: false,

    buyEbook: null,
    buyEbookSuccess: false,
    buyEbookError: null,
    buyEbookLoading: false




}

const EbookReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EBOOKS:
            return { ...state, ebooksLoading: true }
        case GET_EBOOKS_SUCCESS:
            return { ...state, ebooksLoading: false, ebooks: action.payload }
        case GET_EBOOKS_FAILURE:
            return { ...state, ebooksLoading: false, ebooksError: action.payload }

        case DOWNLOAD_EBOOK:
            return { ...state, downloadEbookLoading: true , downloadEbookData:null}
        case DOWNLOAD_EBOOK_SUCCESS:
            return { ...state, downloadEbookSuccess: true, downloadEbookLoading: false, downloadEbookData: action.payload }
        case DOWNLOAD_EBOOK_FAILURE:
            return { ...state, downloadEbookLoading: false, downloadEbookError: action.payload }

        case BUY_EBOOK:
            return { ...state, buyEbookLoading: true }
        case BUY_EBOOK_SUCCESS:
            return { ...state, buyEbookSuccess: true, buyEbookLoading: false, buyEbook: action.payload }
        case BUY_EBOOK_FAILURE:
            return { ...state, buyEbookLoading: false, buyEbookError: action.payload }

        default:
            return state
    }
}

export default EbookReducer