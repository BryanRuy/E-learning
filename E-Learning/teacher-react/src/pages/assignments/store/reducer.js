import { string } from 'prop-types';
import {
    GET_TEACHER_UPCOMING_ASSIGNMENTS,
    GET_TEACHER_UPCOMING_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_UPCOMING_ASSIGNMENTS_FAILURE,

    GET_TEACHER_PAST_ASSIGNMENTS,
    GET_TEACHER_PAST_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_PAST_ASSIGNMENTS_FAILURE,

    GET_STUDENT_ASSIGNMENTS,
    GET_STUDENT_ASSIGNMENTS_SUCCESS,
    GET_STUDENT_ASSIGNMENTS_FAILURE,

    GET_TEACHER_ASSIGNMENTS,
    GET_TEACHER_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_ASSIGNMENTS_FAILURE,

    POST_ASSIGNMENT,
    POST_ASSIGNMENT_SUCCESS,
    POST_ASSIGNMENT_FAILURE,

    PUT_ASSIGNMENT,
    PUT_ASSIGNMENT_SUCCESS,
    PUT_ASSIGNMENT_FAILURE,

    ASSIGN_ASSIGNMENT,
    ASSIGN_ASSIGNMENT_SUCCESS,
    ASSIGN_ASSIGNMENT_FAILURE,

    GET_ASSIGNMENT_PAST_STUDENT,
    GET_ASSIGNMENT_PAST_STUDENT_SUCCESS,
    GET_ASSIGNMENT_PAST_STUDENT_FAILURE,


    GET_ASSIGNMENT_UPCOMING_STUDENT,
    GET_ASSIGNMENT_UPCOMING_STUDENT_SUCCESS,
    GET_ASSIGNMENT_UPCOMING_STUDENT_FAILURE,

    UNASSIGN_ASSIGNMENT,
    UNASSIGN_ASSIGNMENT_SUCCESS,
    UNASSIGN_ASSIGNMENT_FAILURE,


} from './actionTypes'

const initialState = {
    upcomingAssignments: [],
    upcomingAssignmentsLoading: false,
    upcomingAssignmentsError: null,

    pastAssignments: [],
    pastAssignmentsLoading: false,
    pastAssignmentsError: null,

    studentAssignmentsList:{},
    studentAssignments: [],
    studentAssignmentsLoading: false,
    studentAssignmentsError: null,

    teacherAssignmentsList:{},
    teacherAssignments: [],
    teacherAssignmentsLoading: false,
    teacherAssignmentsError: null,

    newAssignment: {},
    newAssignmentLoading: false,
    newAssignmentSuccess: false,
    newAssignmentError: null,

    updateAssignment: {},
    updateAssignmentLoading: false,
    updateAssignmentSuccess: false,
    updateAssignmentError: null,

    assignAssignment: {},
    assignAssignmentSuccess: false,
    assignAssignmentLoading: false,
    assignAssignmentError: null,

    pastAssignmentStudents: [],
    pastAssignmentStudentsLoading: false,
    pastAssignmentStudentsError: null,

    upcomingAssignmentStudents: [],
    upcomingAssignmentStudentsLoading: false,
    upcomingAssignmentStudentsError: null,

    unassignAssignmentSuccess: false,
    unassignAssignmentLoading: false,
    unassignAssignmentError: null,
}

export default (state = initialState, action) => {
    switch (action.type) {

        case GET_TEACHER_UPCOMING_ASSIGNMENTS:
            state = { ...state, upcomingAssignments: [], upcomingAssignmentsLoading: true }
            break

        case GET_TEACHER_UPCOMING_ASSIGNMENTS_SUCCESS:
            state = { ...state, upcomingAssignments: action.payload, upcomingAssignmentsLoading: false, upcomingAssignmentsError: null }
            break

        case GET_TEACHER_UPCOMING_ASSIGNMENTS_FAILURE:
            state = { ...state, upcomingAssignments: [], upcomingAssignmentsLoading: false, upcomingAssignmentsError: action.payload }
            break

        case GET_TEACHER_PAST_ASSIGNMENTS:
            state = { ...state, pastAssignments: [], pastAssignmentsLoading: true }
            break

        case GET_TEACHER_PAST_ASSIGNMENTS_SUCCESS:
            state = { ...state, pastAssignments: action.payload, pastAssignmentsLoading: false, pastAssignmentsError: null }
            break

        case GET_TEACHER_PAST_ASSIGNMENTS_FAILURE:
            state = { ...state, pastAssignments: [], pastAssignmentsLoading: false, pastAssignmentsError: action.payload }
            break

        case GET_STUDENT_ASSIGNMENTS:
            state = {
                ...state,
                studentAssignments:{},
                studentAssignmentsLoading: true,
            }
            break;
        case GET_STUDENT_ASSIGNMENTS_SUCCESS:
            state = {
                ...state,
                studentAssignmentsList:{...state.studentAssignmentsList,[action.payload.page]:[action.payload.res.data]},
                studentAssignments: action.payload.res,
                studentAssignmentsLoading: false,
            }
            break;
        case GET_STUDENT_ASSIGNMENTS_FAILURE:
            state = {
                ...state,
                studentAssignmentsLoading: false,
                studentAssignmentsError: action.payload,
            }
            break;

        case GET_TEACHER_ASSIGNMENTS:
            state = {
                ...state,
                teacherAssignmentsLoading: true,
                teacherAssignmentsError: null
            }
            break;
        case GET_TEACHER_ASSIGNMENTS_SUCCESS:
            state = {
                ...state,
                teacherAssignmentsList:{...state.teacherAssignmentsList,[action.payload.page]:action.payload.res.data},
                teacherAssignments: action.payload.res,
                teacherAssignmentsLoading: false,
                teacherAssignmentsError: null,
            }
            break;

        case GET_TEACHER_ASSIGNMENTS_FAILURE:
            state = {
                ...state,
                teacherAssignmentsLoading: false,
                teacherAssignmentsError: action.payload,
            }
            break;

        case POST_ASSIGNMENT:
            state = {
                ...state,
                newAssignmentLoading: true,
                newAssignmentSuccess: false,
                newAssignmentError: null
            }
            break;
        case POST_ASSIGNMENT_SUCCESS:
            state = {
                ...state,
                newAssignment: action.payload,
                newAssignmentSuccess: true,
                newAssignmentLoading: false,
            }
            break;
        case POST_ASSIGNMENT_FAILURE:
            state = {
                ...state,
                newAssignmentLoading: false,
                newAssignmentSuccess: false,
                newAssignmentError: action.payload,
            }
            break;

        case PUT_ASSIGNMENT:
            state = {
                ...state,
                updateAssignmentSuccess: false,
                updateAssignmentLoading: true,
                updateAssignmentError: null
            }
            break;
        case PUT_ASSIGNMENT_SUCCESS:
            state = {
                ...state,
                updateAssignment: action.payload,
                updateAssignmentSuccess: true,
                updateAssignmentLoading: false,
                updateAssignmentError: null,
            }
            break;
        case PUT_ASSIGNMENT_FAILURE:
            state = {
                ...state,
                updateAssignmentSuccess: false,
                updateAssignmentLoading: false,
                updateAssignmentError: action.payload,
            }
            break;

        case ASSIGN_ASSIGNMENT:
            state = {
                ...state,
                assignAssignmentLoading: true,
            }
            break;
        case ASSIGN_ASSIGNMENT_SUCCESS:
            state = {
                ...state,
                assignAssignment: action.payload,
                assignAssignmentSuccess: true,
                assignAssignmentLoading: false,
            }
            break;
        case ASSIGN_ASSIGNMENT_FAILURE:
            state = {
                ...state,
                assignAssignmentSuccess: false,
                assignAssignmentLoading: false,
                assignAssignmentError: action.payload
            }
            break;

        case GET_ASSIGNMENT_PAST_STUDENT:
            state = {
                ...state,
                pastAssignmentStudentsLoading: true,
            }
            break;
        case GET_ASSIGNMENT_PAST_STUDENT_SUCCESS:
            state = {
                ...state,
                pastAssignmentStudents: action.payload,
                pastAssignmentStudentsLoading: false,
            }
            break;
        case GET_ASSIGNMENT_PAST_STUDENT_FAILURE:
            state = {
                ...state,
                pastAssignmentStudentsLoading: false,
                pastAssignmentStudentsError: action.payload,
            }
            break;

        case GET_ASSIGNMENT_UPCOMING_STUDENT:
            state = {
                ...state,
                upcomingAssignmentStudentsLoading: true,
            }
            break;
        case GET_ASSIGNMENT_UPCOMING_STUDENT_SUCCESS:
            state = {
                ...state,
                upcomingAssignmentStudents: action.payload,
                upcomingAssignmentStudentsLoading: false,
            }
            break;
        case GET_ASSIGNMENT_UPCOMING_STUDENT_FAILURE:
            state = {
                ...state,
                upcomingAssignmentStudentsLoading: false,
                upcomingAssignmentStudentsError: action.payload,
            }
            break;

        case UNASSIGN_ASSIGNMENT:
            state = {
                ...state,
                unassignAssignmentSuccess: false,
                unassignAssignmentLoading: true,
            }
            break;
        case UNASSIGN_ASSIGNMENT_SUCCESS:
            state = {
                ...state,
                unassignAssignmentSuccess: true,
                unassignAssignmentLoading: false
            }
            break;
        case UNASSIGN_ASSIGNMENT_FAILURE:
            state = {
                ...state,
                unassignAssignmentSuccess: false,
                unassignAssignmentLoading: false,
                unassignAssignmentError: action.payload,
            }
            break;
        default:
            state = { ...state }
    }
    return state;
}
