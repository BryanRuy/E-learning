import {
    POST_EBOOK,
    POST_EBOOK_SUCCESS,
    POST_EBOOK_FAILURE,

    GET_EBOOKS,
    GET_EBOOKS_SUCCESS,
    GET_EBOOKS_FAILURE,

    PUT_EBOOK,
    PUT_EBOOK_SUCCESS,
    PUT_EBOOK_FAILURE,
} from './actionTypes'

export const postEbook = (data) => {
    return {
        type: POST_EBOOK,
        payload: { data }
    }
}

export const postEbookSuccess = (data) => {
    return {
        type: POST_EBOOK_SUCCESS,
        payload: data
    }
}

export const postEbookFailure = (data) => {
    return {
        type: POST_EBOOK_FAILURE,
        payload: data
    }
}

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

export const putEbook = (data) => {
    return {
        type: PUT_EBOOK,
        payload: { data }
    }
}

export const putEbookSuccess = (data) => {
    return {
        type: PUT_EBOOK_SUCCESS,
        payload: data
    }
}

export const putEbookFailure = (data) => {
    return {
        type: PUT_EBOOK_FAILURE,
        payload: data
    }
}