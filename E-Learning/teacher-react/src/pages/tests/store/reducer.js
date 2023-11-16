import { string } from 'prop-types';
import {
    GET_STUDENT_TESTS,
    GET_STUDENT_TESTS_SUCCESS,
    GET_STUDENT_TESTS_FAILURE,

    GET_TEACHER_TESTS,
    GET_TEACHER_TESTS_SUCCESS,
    GET_TEACHER_TESTS_FAILURE,

    POST_TEST,
    POST_TEST_SUCCESS,
    POST_TEST_FAILURE,

    PUT_TEST,
    PUT_TEST_SUCCESS,
    PUT_TEST_FAILURE,

    ASSIGN_TEST,
    ASSIGN_TEST_SUCCESS,
    ASSIGN_TEST_FAILURE,

    GET_PAST_STUDENT,
    GET_PAST_STUDENT_SUCCESS,
    GET_PAST_STUDENT_FAILURE,


    GET_UPCOMING_STUDENT,
    GET_UPCOMING_STUDENT_SUCCESS,
    GET_UPCOMING_STUDENT_FAILURE,

    UNASSIGN_TEST,
    UNASSIGN_TEST_SUCCESS,
    UNASSIGN_TEST_FAILURE,

    GET_TEACHER_UPCOMING_TESTS,
    GET_TEACHER_UPCOMING_TESTS_SUCCESS,
    GET_TEACHER_UPCOMING_TESTS_FAILURE,

    GET_TEACHER_PAST_TESTS,
    GET_TEACHER_PAST_TESTS_SUCCESS,
    GET_TEACHER_PAST_TESTS_FAILURE,

    GET_TEST_BY_ID,
    GET_TEST_BY_ID_SUCCESS,
    GET_TEST_BY_ID_FAILURE,
} from './actionTypes'

const initialState = {
    studentTests: [],
    studentTestList:{},
    studentTestsLoading: false,
    studentTestsError: null,

    teacherTests:[],
    teacherTestList:{},
    teacherTestsLoading: false,
    teacherTestsError: null,

    newTest: {},
    newTestLoading: false,
    newTestSuccess: false,
    newTestError: null,

    updateTest: {},
    updateTestLoading: false,
    updateTestSuccess: false,
    updateTestTestError: null,

    assignTest: {},
    assignTestSuccess: false,
    assignTestLoading: false,
    assignTestError: null,

    pastStudents: [],
    pastStudentsLoading: false,
    pastStudentsError: null,

    upcomingStudents: [],
    upcomingStudentsLoading: false,
    upcomingStudentsError: null,

    unassignTestSuccess: false,
    unassignTestLoading: false,
    unassignTestError: null,

    newTests: [],
    newTestsLoading: false,
    newTestsError: null,

    pastTests: [],
    pastTestsLoading: false,
    pastTestsError: null,

    selectedTest: {},
    selectedTestLoading: false,
    selectedTestError: null,
}

export default (state = initialState, action) => {
    switch (action.type) {

        case GET_TEACHER_UPCOMING_TESTS:
            state = { ...state, newTests: [], newTestsLoading: true }
            break

        case GET_TEACHER_UPCOMING_TESTS_SUCCESS:
            state = { ...state, newTests: action.payload, newTestsLoading: false, newTestsError: null }
            break

        case GET_TEACHER_UPCOMING_TESTS_FAILURE:
            return { ...state, newTests: [], newTestsLoading: false, newTestsError: action.payload }

        case GET_TEACHER_PAST_TESTS:
            state = { ...state, pastTests: [], pastTestsLoading: true }
            break

        case GET_TEACHER_PAST_TESTS_SUCCESS:
            state = { ...state, pastTests: action.payload, pastTestsLoading: false, pastTestsError: null }
            break;

        case GET_TEACHER_PAST_TESTS_FAILURE:
            state = { ...state, pastTests: [], pastTestsLoading: false, pastTestsError: action.payload }
            break;

        case GET_STUDENT_TESTS:
            state = {
                ...state,
                studentTestsLoading: true,
                studentTestsError: null
            }
            break;
        case GET_STUDENT_TESTS_SUCCESS:
           
            state = {
                ...state,
                studentTestList:{...state.studentTestList,[action.payload.page]:[action.payload.res.data]},
                studentTests: action.payload.res,
                studentTestsLoading: false,
                studentTestsError: null,
            }
           
            break;
        case GET_STUDENT_TESTS_FAILURE:
            state = {
                ...state,
                studentTestsLoading: false,
                studentTestsError: action.payload,
            }
            break;

        case GET_TEACHER_TESTS:
            state = {
                ...state,
                newTestSuccess:false,
                teacherTestsLoading: true,
                teacherTestsError: null
            }
            break;
        case GET_TEACHER_TESTS_SUCCESS:
            state = {
                ...state,
                teacherTestList:{...state.teacherTestList,[action.payload.page]:action.payload.res.data},
                teacherTests: action.payload.res,
                teacherTestsLoading: false,
                teacherTestsError: null,
            }
            break;
        case GET_TEACHER_TESTS_FAILURE:
            state = {
                ...state,
                teacherTestsLoading: false,
                teacherTestsError: action.payload,
            }
            break;
        case POST_TEST:
            state = {
                ...state,
                newTestLoading: true,
                newTestSuccess: false,
                newTestError: null
            }
            break;
        case POST_TEST_SUCCESS:
            state = {
                ...state,
                newTest: action.payload,
                newTestSuccess: true,
                newTestLoading: false,
                newTestError: null,
            }
            break;
        case POST_TEST_FAILURE:
            state = {
                ...state,
                newTestLoading: false,
                newTestSuccess: false,
                newTestError: action.payload,
            }
            break;
        case PUT_TEST:
            state = {
                ...state,
                updateTestSuccess: false,
                updateTestLoading: true,
                updateTestError: null
            }
            break;
        case PUT_TEST_SUCCESS:
            state = {
                ...state,
                updateTest: action.payload,
                updateTestSuccess: true,
                updateTestLoading: false,
                updateTestError: null,
            }
            break;
        case PUT_TEST_FAILURE:
            state = {
                ...state,
                updateTestSuccess: false,
                updateTestLoading: false,
                updateTestError: action.payload,
            }
            break;
        case ASSIGN_TEST:
            state = {
                ...state,
                assignTestSuccess: false,
                assignTestLoading: true,
                assignTestError: null
            }
            break;
        case ASSIGN_TEST_SUCCESS:
            state = {
                ...state,
                assignTest: action.payload,
                assignTestSuccess: true,
                assignTestLoading: false,
                assignTestError: null,
            }
            break;
        case ASSIGN_TEST_FAILURE:
            state = {
                ...state,
                assignTestLoading: false,
                assignTestError: action.payload,
            }
            break;
        case GET_PAST_STUDENT:
            state = {
                ...state,
                pastStudentsLoading: true,
                pastStudentsError: null
            }
            break;
        case GET_PAST_STUDENT_SUCCESS:
            state = {
                ...state,
                pastStudents: action.payload,
                pastStudentsLoading: false,
                pastStudentsError: null,
            }
            break;
        case GET_PAST_STUDENT_FAILURE:
            state = {
                ...state,
                pastStudentsLoading: false,
                pastStudentsError: action.payload,
            }
            break;
        case GET_UPCOMING_STUDENT:
            state = {
                ...state,
                upcomingStudentsLoading: true,
                upcomingStudentsError: null
            }
            break;
        case GET_UPCOMING_STUDENT_SUCCESS:
            state = {
                ...state,
                upcomingStudents: action.payload,
                upcomingStudentsLoading: false,
                upcomingStudentsError: null,
            }
            break;
        case GET_UPCOMING_STUDENT_FAILURE:
            state = {
                ...state,
                upcomingStudentsLoading: false,
                upcomingStudentsError: action.payload,
            }
            break;
        case UNASSIGN_TEST:
            state = {
                ...state,
                unassignTestSuccess: false,
                unassignTestLoading: true,
                unassignTestError: null
            }
            break;
        case UNASSIGN_TEST_SUCCESS:
            state = {
                ...state,
                unassignTestSuccess: true,
                unassignTestLoading: false,
                unassignTestError: null,
            }
            break;
        case UNASSIGN_TEST_FAILURE:
            state = {
                ...state,
                unassignTestSuccess: false,
                unassignTestLoading: false,
                unassignTestError: action.payload,
            }
            break;

        case GET_TEST_BY_ID:
            state = { ...state, selectedTestLoading: true }
            break;
        case GET_TEST_BY_ID_SUCCESS:
            state = { ...state, selectedTestLoading: false, selectedTest: action.payload }
            break;
        case GET_TEST_BY_ID_FAILURE:
            state = { ...state, selectedTest: {}, selectedTestLoading: false, selectedTestError: action.payload }
            break;
        default:
            state = { ...state }
    }
    return state;
}
