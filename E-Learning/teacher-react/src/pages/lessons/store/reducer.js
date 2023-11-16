



import {

  GET_TEACHER_TOPICS,
  GET_TEACHER_TOPICS_SUCCESS,
  GET_TEACHER_TOPICS_FAILURE,
  GET_TEACHER_TOPIC_LESSONS,
  GET_TEACHER_TOPIC_LESSONS_SUCCESS,
  GET_TEACHER_TOPIC_LESSONS_FAILURE,
  GET_TEACHER_RECENT_LESSONS,
  GET_TEACHER_RECENT_LESSONS_SUCCESS,
  GET_TEACHER_RECENT_LESSONS_FAILURE,
  SELECT_TOPIC,
  SELECT_LESSON,
  ADD_NEW_TOPIC,
  ADD_NEW_TOPIC_SUCCESS,
  ADD_NEW_TOPIC_FAILURE,
  ADD_NEW_LESSON,
  ADD_NEW_LESSON_SUCCESS,
  ADD_NEW_LESSON_FAILURE,
  GET_LESSON,
  GET_LESSON_SUCCESS,
  GET_LESSON_FAILURE,
  // GET_STUDENTS_FOR_LESSON,
  // GET_STUDENTS_FOR_LESSON_FAILURE,
  // GET_STUDENTS_FOR_LESSON_SUCCESS,
  ASSIGN_LESSON_TO_STUDENTS,
  ASSIGN_LESSON_TO_STUDENTS_SUCCESS,
  ASSIGN_LESSON_TO_STUDENTS_FAILURE,
  UNASSIGN_LESSON_TO_STUDENTS,
  UNASSIGN_LESSON_TO_STUDENTS_SUCCESS,
  UNASSIGN_LESSON_TO_STUDENTS_FAILURE,
  DELETE_TOPIC,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILURE,
  DELETE_LESSON,
  DELETE_LESSON_SUCCESS,
  DELETE_LESSON_FAILURE,
  UPDATE_TOPIC,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_FAILURE,
  UPDATE_LESSON,
  UPDATE_LESSON_SUCCESS,
  UPDATE_LESSON_FAILURE,

  GET_RECENT_LESSONS,
  GET_RECENT_LESSONS_SUCCESS,
  GET_RECENT_LESSONS_FAILURE,
} from './actionTypes'

const initialState = {
  topics: [],
  topicsLoading: false,
  topicsError: null,
  recentLessons: [],
  recentLessonsLoading: false,
  recentLessonsError: null,
  lessons: [],
  lessonsLoading: false,
  lessonsError: null,
  selectedTopic: null,
  selectedLesson: null,
  newTopicUploading: false,
  newTopicError: null,
  newLessonUploading: false,
  newLessonError: null,
  oneLessonLoading: false,

  oneLessonError: null,
  // students: [],
  // studentsError: null,
  // studentsLoading: false,

  studentsLessonAssignLoading: false,
  studentsLessonAssignError: null,
  studentsLessonUnassignLoading: false,
  studentsLessonUnassignError: null,
  topicDeleting: false,
  topicDeleteError: null,
  lessonDeleting: false,
  lessonDeleteError: null,
  updateTopicUploading: false,
  updateTopicError: null,
  updateLessonLoading: false,
  updateLessonError: null,

  recentLessons: [],
  recentLessonsLoading: false,
  recentLessonsError: null,
}

const updateTopicSuccess = (state, payload) => {
  for (const index in state.topics) {
    if (state.topics[index].id === payload.id) {
      state.topics[index] = payload
      break;
    }
  }
  return {
    ...state,
    topics: [...state.topics],
    updateTopicUploading: false,
    updateTopicError: null
  }
}

const updateLessonSuccess = (state, payload) => {
  for (const index in state.lessons) {
    if (state.lessons[index].id === payload.id) {
      state.lessons[index] = payload
      break;
    }
  }
  return {
    ...state,
    lessons: [...state.lessons],
    updateLessonLoading: false,
    updateLessonError: null
  }
}

const getLessonSuccess = (state, payload) => {
  for (const index in state.lessons) {
    if (state.lessons[index].id === payload.id) {
      state.lessons[index] = payload
      state.lessons[index].isFull = true
      break
    }
  }
  return { ...state, oneLessonLoading: false, oneLessonError: null }
}

const assignLessonToStudentsSuccess = (state, payload) => {
  for (const index in state.lessons) {
    if (state.lessons[index].id === state.selectedLesson) {
      state.lessons[index].studentLessons = payload
      break;
    }
  }
  return {
    ...state,
    studentsLessonAssignLoading: false,
    studentsLessonAssignError: null
  }

}

const unassignLessonToStudentsSuccess = (state, payload) => {
  for (const index in state.lessons) {
    if (state.lessons[index].id === state.selectedLesson) {
      state.lessons[index].studentLessons = payload
      break;
    }
  }
  return {
    ...state,
    studentsLessonUnassignLoading: false,
    studentsLessonUnassignError: null
  }

}

const deleteTopicSuccess = (state, payload) => {
  return {
    ...state,
    topics: state.topics.filter(t => t.id != payload.id),
    recentLessons: state.recentLessons.filter(l => l.topic.id != payload.id),
    topicDeleting: false, topicDeleteError: null
  }
}

const deleteLessonSuccess = (state, payload) => {
  return {
    ...state,
    lessons: payload.data,
    recentLessons: state.recentLessons.filter(l => l.id != payload.id),
    lessonDeleting: false, lessonsError: null
  }
}

const teacherLessonReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_TEACHER_TOPICS:
      return { ...state, topics: [], topicsLoading: true }

    case GET_TEACHER_TOPICS_SUCCESS:
      return { ...state, topics: action.payload, topicsLoading: false, topicsError: null }

    case GET_TEACHER_TOPICS_FAILURE:
      return { ...state, topics: [], topicsLoading: false, topicsError: action.payload }

    case GET_TEACHER_TOPIC_LESSONS:
      return { ...state, lessons: [], lessonsLoading: true }

    case GET_TEACHER_TOPIC_LESSONS_SUCCESS:
      return { ...state, lessons: action.payload, lessonsLoading: false, lessonsError: null }

    case GET_TEACHER_TOPIC_LESSONS_FAILURE:
      return { ...state, lessons: [], lessonsLoading: false, lessonsError: action.payload }

    case GET_TEACHER_RECENT_LESSONS:
      return { ...state, recentLessons: [], recentLessonsLoading: true }

    case GET_TEACHER_RECENT_LESSONS_SUCCESS:
      return { ...state, recentLessons: action.payload, recentLessonsLoading: false, recentLessonsError: null }

    case GET_TEACHER_RECENT_LESSONS_FAILURE:
      return { ...state, recentLessons: [], recentLessonsLoading: false, recentLessonsError: action.payload }

    case SELECT_TOPIC:
      return { ...state, selectedTopic: action.payload, lessons: [], selectedLesson: null }

    case SELECT_LESSON:
      return { ...state, selectedLesson: action.payload }

    case ADD_NEW_TOPIC:
      return { ...state, newTopicUploading: true }

    case ADD_NEW_TOPIC_SUCCESS:
      return { ...state, topics: [...state.topics, action.payload], newTopicUploading: false, newTopicError: null }

    case ADD_NEW_TOPIC_FAILURE:
      return { ...state, newTopicUploading: false, newTopicError: action.payload }

    case UPDATE_TOPIC:
      return { ...state, updateTopicUploading: true }

    case UPDATE_TOPIC_SUCCESS:
      return updateTopicSuccess(state, action.payload)

    case UPDATE_TOPIC_FAILURE:
      return { ...state, updateTopicUploading: false, updateTopicError: action.payload }

    case ADD_NEW_LESSON:
      return { ...state, newLessonUploading: true }

    case ADD_NEW_LESSON_SUCCESS:
      return { ...state, lessons: [...state.lessons, action.payload], newLessonUploading: false, newLessonError: null }

    case ADD_NEW_LESSON_FAILURE:
      return { ...state, newLessonUploading: false, newLessonError: action.payload }

    case UPDATE_LESSON:
      return { ...state, updateLessonLoading: true }

    case UPDATE_LESSON_SUCCESS:
      return updateLessonSuccess(state, action.payload)

    case UPDATE_LESSON_FAILURE:
      return { ...state, updateLessonLoading: false, updateLessonError: action.payload }

    case GET_LESSON:
      return { ...state, oneLessonLoading: true }

    case GET_LESSON_SUCCESS:
      return getLessonSuccess(state, action.payload)

    case GET_LESSON_FAILURE:
      return { ...state, oneLessonLoading: false, oneLessonError: action.payload }

    // case GET_STUDENTS_FOR_LESSON:
    //   return { ...state, students: [], studentsLoading: true }

    // case GET_STUDENTS_FOR_LESSON_SUCCESS:
    //   return { ...state, students: action.payload, studentsLoading: false, studentsError: null }

    // case GET_STUDENTS_FOR_LESSON_FAILURE:
    //   return { ...state, studentsLoading: false, studentsError: action.payload }

    case ASSIGN_LESSON_TO_STUDENTS:
      return { ...state, studentsLessonAssignLoading: true }

    case ASSIGN_LESSON_TO_STUDENTS_SUCCESS:
      return assignLessonToStudentsSuccess(state, action.payload)

    case ASSIGN_LESSON_TO_STUDENTS_FAILURE:
      return { ...state, studentsLessonAssignLoading: false, studentsLessonAssignError: action.payload }

    case UNASSIGN_LESSON_TO_STUDENTS:
      return { ...state, studentsLessonUnassignLoading: true }

    case UNASSIGN_LESSON_TO_STUDENTS_SUCCESS:
      return unassignLessonToStudentsSuccess(state, action.payload)

    case UNASSIGN_LESSON_TO_STUDENTS_FAILURE:
      return { ...state, studentsLessonUnassignLoading: false, studentsLessonUnassignError: action.payload }

    case DELETE_TOPIC:
      return { ...state, topicDeleting: true }

    case DELETE_TOPIC_SUCCESS:
      return deleteTopicSuccess(state, action.payload)

    case DELETE_TOPIC_FAILURE:
      return { ...state, topicDeleting: false, topicDeleteError: action.payload }

    case DELETE_LESSON:
      return { ...state, lessonDeleting: true }

    case DELETE_LESSON_SUCCESS:
      return deleteLessonSuccess(state, action.payload)

    case DELETE_LESSON_FAILURE:
      return { ...state, lessonDeleting: false, lessonDeleteError: action.payload }

    case GET_RECENT_LESSONS:
      return { ...state, recentLessons: [], recentLessonsLoading: true }

    case GET_RECENT_LESSONS_SUCCESS:
      return { ...state, recentLessons: action.payload, recentLessonsLoading: false, recentLessonsError: null }

    case GET_RECENT_LESSONS_FAILURE:
      return { ...state, recentLessons: [], recentLessonsLoading: false, recentLessonsError: action.payload }
      
    default:
      return state
  }
}

export default teacherLessonReducer
