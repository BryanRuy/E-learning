



import {

  GET_USER_TOPICS,
  GET_USER_TOPICS_SUCCESS,
  GET_USER_TOPICS_FAILURE,
  GET_USER_TOPIC_LESSONS,
  GET_USER_TOPIC_LESSONS_SUCCESS,
  GET_USER_TOPIC_LESSONS_FAILURE,
  SELECT_TOPIC,
  SELECT_LESSON,
  COMPLETED_LESSON,
  COMPLETED_LESSON_SUCCESS,
  COMPLETED_LESSON_FAILURE,
  GET_LESSON,
  GET_LESSON_SUCCESS,
  GET_LESSON_FAILURE,
  GET_RECENT_LESSONS,
  GET_RECENT_LESSONS_SUCCESS,
  GET_RECENT_LESSONS_FAILURE,
  GET_INCOMPLETE_LESSONS_COUNT,
  GET_INCOMPLETE_LESSONS_COUNT_SUCCESS,
  GET_INCOMPLETE_LESSONS_COUNT_FAILURE,

} from './actionTypes'

const initialState = {
  topics: [],
  topicsLoading: false,
  topicsError: null,
  lessons: [],
  lessonsLoading: false,
  lessonsError: null,
  selectedTopic: {},
  selectedLesson: null,
  lessonCompleteLoading: false,
  lessonCompleteError: null,
  recentLessons: [],
  recentLessonsLoading: false,
  recentLessonsError: null,
  incompleteLessons: 0,
  incompleteLessonsLoading: false,
  incompleteLessonsError: null,
}


const completedLessonSuccess = (state, payload) => {
  for (const index in state.lessons) {
    if (state.lessons[index].id == state.selectedLesson && state.lessons[index].isFull) {
      state.lessons[index].studentLessons[0] = payload
      break
    }
  }

  return {
    ...state,
    lessonCompleteError: payload,
    lessonCompleteLoading: false
  }

}


const lessonReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_USER_TOPICS:
      return { ...state, topics: [], topicsLoading: true }

    case GET_USER_TOPICS_SUCCESS:
      return { ...state, topics: action.payload, topicsLoading: false, topicsError: null }

    case GET_USER_TOPICS_FAILURE:
      return { ...state, topics: [], topicsLoading: false, topicsError: action.payload }

    case GET_USER_TOPIC_LESSONS:
      return { ...state, lessons: [], lessonsLoading: true }

    case GET_USER_TOPIC_LESSONS_SUCCESS:
      return { ...state, lessons: action.payload, lessonsLoading: false, lessonsError: null }

    case GET_USER_TOPIC_LESSONS_FAILURE:
      return { ...state, lessons: [], lessonsLoading: false, lessonsError: action.payload }

    case SELECT_TOPIC:
      return { ...state, selectedTopic: action.payload, lessons: [], selectedLesson: null }

    case SELECT_LESSON:
      return { ...state, selectedLesson: action.payload }

    case COMPLETED_LESSON:
      return {
        ...state,
        lessonCompleteError: null,
        lessonCompleteLoading: true
      }

    case COMPLETED_LESSON_SUCCESS:
      return completedLessonSuccess(state, action.payload)

    case COMPLETED_LESSON_FAILURE:
      return {
        ...state,
        lessonCompleteError: action.payload,
        lessonCompleteLoading: false
      }

    case GET_LESSON:
      return { ...state, oneLessonLoading: true }

    case GET_LESSON_SUCCESS:
      for (const index in state.lessons) {
        if (state.lessons[index].id == action.payload.id) {
          state.lessons[index] = action.payload
          state.lessons[index].isFull = true
          break
        }
      }
      return { ...state, oneLessonLoading: false, oneLessonError: null }

    case GET_LESSON_FAILURE:
      return { ...state, oneLessonLoading: false, oneLessonError: action.payload }

    case GET_RECENT_LESSONS:
      return { ...state, recentLessons: [], recentLessonsLoading: true }

    case GET_RECENT_LESSONS_SUCCESS:
      return { ...state, recentLessons: action.payload, recentLessonsLoading: false, recentLessonsError: null }

    case GET_RECENT_LESSONS_FAILURE:
      return { ...state, recentLessons: [], recentLessonsLoading: false, recentLessonsError: action.payload }

    case GET_INCOMPLETE_LESSONS_COUNT:
      return { ...state, incompleteLessons: 0, incompleteLessonsLoading: true }

    case GET_INCOMPLETE_LESSONS_COUNT_SUCCESS:
      return { ...state, incompleteLessons: action.payload, incompleteLessonsLoading: false, incompleteLessonsError: null }

    case GET_INCOMPLETE_LESSONS_COUNT_FAILURE:
      return { ...state, incompleteLessons: 0, incompleteLessonsLoading: false, incompleteLessonsError: action.payload }


    default:
      return state
  }
}

export default lessonReducer
