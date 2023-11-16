import { 
    POST_FEEDBACK,
    POST_FEEDBACK_SUCCESS,
    POST_FEEDBACK_ERROR
} from "./actionTypes"

export const postFeedback = feedback => {
    return {
        type: POST_FEEDBACK,
        payload: { feedback },
    }
}

export const postFeedbackSuccess = feedback => {
    return {
        type: POST_FEEDBACK_SUCCESS,
        payload: feedback,
    }
}

export const postFeedbackError = error => {
    return {
        type: POST_FEEDBACK_ERROR,
        payload: error,
    }
}

