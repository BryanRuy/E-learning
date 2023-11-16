import {
    GET_TEACHERS_STATS,
    GET_TEACHERS_STATS_SUCCESS,
    GET_TEACHERS_STATS_FAILURE,

    GET_TEACHER_DETAILS,
    GET_TEACHER_DETAILS_SUCCESS,
    GET_TEACHER_DETAILS_FAILURE,

    GET_ALL_TEACHERS,
    GET_ALL_TEACHERS_SUCCESS,
    GET_ALL_TEACHERS_FAILURE,

    GET_TEACHER_STUDENTS,
    GET_TEACHER_STUDENTS_SUCCESS,
    GET_TEACHER_STUDENTS_FAILURE,

    ON_SEARCH_TEACHER_CHANGE
} from "./actionTypes"

const initialState = {
    teacherListData: {},
    teachersStats: {},
    teachersError: null,
    teachersLoading: false,

    teacher: {},
    teacherLoading: false,
    teacherError: null,

    allTeachers: {},
    allTeachersLoading: false,
    allTeachersError: null,

    teacherStudents: [],
    teacherStudentsLoading: false,
    teacherStudentsError: null
}

const teachersReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_TEACHERS_STATS:
            return { ...state, teachersLoading: true }

        case GET_TEACHERS_STATS_SUCCESS:
            return {
                ...state,
                teachersStats: action.payload,
                teacherListData: { ...state.teacherListData, [1]: action.payload.teachers.data },
                teachersLoading: false
            }

        case GET_TEACHERS_STATS_FAILURE:
            return { ...state, teachersError: action.payload, teachersLoading: false }

        case GET_TEACHER_DETAILS:
            return { ...state, teacherLoading: true }

        case GET_TEACHER_DETAILS_SUCCESS:
            return { ...state, teacher: action.payload, teacherLoading: false }

        case GET_TEACHER_DETAILS_FAILURE:
            return { ...state, teacherError: action.payload, teacherLoading: false }

        case GET_ALL_TEACHERS:
            return { ...state, allTeachersLoading: true }

        case GET_ALL_TEACHERS_SUCCESS:
            return {
                ...state,
                teacherListData: { ...state.teacherListData, [action.payload.page]: action.payload.res.data },
                allTeachers: action.payload.res,
                allTeachersLoading: false
            }

        case GET_ALL_TEACHERS_FAILURE:
            return {
                ...state, allTeachers: [],
                allTeachersError: action.payload,
                allTeachersLoading: false
            }

        case GET_TEACHER_STUDENTS:
            return { ...state, teacherStudentsLoading: true }

        case GET_TEACHER_STUDENTS_SUCCESS:
            return { ...state, teacherStudents: action.payload, teacherStudentsLoading: false }

        case GET_TEACHER_STUDENTS_FAILURE:
            return { ...state, teacherStudents: [], teacherStudentsError: action.payload, teacherStudentsLoading: false }

        case ON_SEARCH_TEACHER_CHANGE:
            return {
                ...state,
                teacherListData: {},
                allTeachers: []
            }
        default:
            return state
    }
}

export default teachersReducer
