import {
  GET_TEACHER_HISTORY_STATS,
  GET_TEACHER_HISTORY_STATS_SUCCESS,
  GET_TEACHER_HISTORY_STATS_FAILURE,

  GET_STUDENT_HISTORY_STATS,
  GET_STUDENT_HISTORY_STATS_SUCCESS,
  GET_STUDENT_HISTORY_STATS_FAILURE,

  GET_TEACHER_PAYMENT_PLAN,
  GET_TEACHER_PAYMENT_PLAN_SUCCESS,
  GET_TEACHER_PAYMENT_PLAN_FAILURE,

  POST_TEACHER_PAYMENT_PLAN,
  POST_TEACHER_PAYMENT_PLAN_SUCCESS,
  POST_TEACHER_PAYMENT_PLAN_FAILURE,

  UPDATE_TEACHER_PAYMENT_PLAN,
  UPDATE_TEACHER_PAYMENT_PLAN_SUCCESS,
  UPDATE_TEACHER_PAYMENT_PLAN_FAILURE

} from './actionTypes'


const initialState = {
  teacherHistory: {},
  teacherHistoryError: null,
  teacherHistoryLoading: false,

  studentHistory: {},
  studentHistoryError: null,
  studentHistoryLoading: false,

  paymentPlan: null,
  paymentPlanLoading: false,
  paymentPlanError: null,

  postPaymentPlanSuccess: false,
  postPaymentPlanLoading: false,
  postPaymentPlanError: null,

  putPaymentPlanSuccess: false,
  putPaymentPlanLoading: false,
  putPaymentPlanError: null,

}


const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEACHER_HISTORY_STATS:
      return { ...state, teacherHistoryLoading: true , teacherHistory:{} }
    case GET_TEACHER_HISTORY_STATS_SUCCESS:
      return { ...state, teacherHistoryLoading: false, teacherHistory: action.payload }
    case GET_TEACHER_HISTORY_STATS_FAILURE:
      return { ...state, teacherHistoryLoading: false, teacherHistoryError: action.payload }

    case GET_STUDENT_HISTORY_STATS:
      return { ...state, studentHistoryLoading: true ,studentHistory:{}}
    case GET_STUDENT_HISTORY_STATS_SUCCESS:
      return { ...state, studentHistoryLoading: false, studentHistory: action.payload }
    case GET_STUDENT_HISTORY_STATS_FAILURE:
      return { ...state, studentHistoryLoading: false, studentHistoryError: action.payload }

    case GET_TEACHER_PAYMENT_PLAN:
      return { ...state, paymentPlanLoading: true  , paymentPlan:null}
    case GET_TEACHER_PAYMENT_PLAN_SUCCESS:
      return { ...state, paymentPlanLoading: false, paymentPlan: action.payload }
    case GET_TEACHER_PAYMENT_PLAN_FAILURE:
      return { ...state, paymentPlanLoading: false, paymentPlanError: action.payload }

    case POST_TEACHER_PAYMENT_PLAN:
      return { ...state, postPaymentPlanLoading: true }
    case POST_TEACHER_PAYMENT_PLAN_SUCCESS:
      return { ...state, postPaymentPlanLoading: false, paymentPlan: action.payload  ,postPaymentPlanSuccess:true}
    case POST_TEACHER_PAYMENT_PLAN_FAILURE:
      return { ...state, postPaymentPlanLoading: false, postPaymentPlanError: action.payload }

    case UPDATE_TEACHER_PAYMENT_PLAN:
      return { ...state, putPaymentPlanLoading: true }
    case UPDATE_TEACHER_PAYMENT_PLAN_SUCCESS:
      return { ...state, putPaymentPlanLoading: false, paymentPlan: action.payload , putPaymentPlanSuccess:true}
    case UPDATE_TEACHER_PAYMENT_PLAN_FAILURE:
      return { ...state, putPaymentPlanLoading: false, putPaymentPlanError: action.payload }


    default:
      return state
  }
}

export default historyReducer