
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


export const getEbooks = () => {
    return {
        type: GET_EBOOKS
    }
}

export const getEbooksSuccess = (data) => {
    return {
        type: GET_EBOOKS_SUCCESS,
        payload: data
    }
}

export const getEbooksFailure = (data) => {
    return {
        type: GET_EBOOKS_FAILURE,
        payload: data
    }
}
export const downloadEbook = (data) => {
    return {
        type: DOWNLOAD_EBOOK,
        payload: data
    }
}
export const downloadEbookSuccess = (data) => {
    return {
        type: DOWNLOAD_EBOOK_SUCCESS,
        payload: data
    }
}
export const downloadEbookFailure = (error) => {
    return {
        type: DOWNLOAD_EBOOK_FAILURE,
        payload: error
    }
}

export const buyEbook = (data) => {
    return {
        type: BUY_EBOOK,
        payload: data
    }
}
export const buyEbookSuccess = (data) => {
    return {
        type: BUY_EBOOK_SUCCESS,
        payload: data
    }
}
export const buyEbookFailure = (error) => {
    return {
        type: BUY_EBOOK_FAILURE,
        payload: error
    }
}

