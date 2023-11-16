import { 
  POST_FEEDBACK,
  POST_FEEDBACK_SUCCESS,
  POST_FEEDBACK_ERROR
} from "./actionTypes"

const initialState = {
  feedbackResponse: null,
  feedbackSuccess: false,
  feedbackError: null,
  feedbackLoading: false,
}

const Feedback = (state = initialState, action) => {
  switch (action.type) {
    case POST_FEEDBACK:
      state = { ...state, feedbackResponse: null, feedbackLoading:true, feedbackSuccess: false, feedbackError: null }
      break
    case POST_FEEDBACK_SUCCESS:
      state = { ...state, feedbackResponse: action.payload, feedbackLoading:false, feedbackSuccess: true }
      break
    case POST_FEEDBACK_ERROR:
      state = { ...state, feedbackError: action.payload ,feedbackLoading:false }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default Feedback
