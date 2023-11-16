import { call, put, takeEvery } from "redux-saga/effects"

import {
    POST_ASSIGN_TEACHER,
    UNASSIGN_TEACHER,
  } from "./actionTypes"


  import {
  postAssignTeacherSuccess, postAssignTeacherFailure,
  unassignTeacherSuccess,  unassignTeacherFailure
  } from "./actions"

  import { postAssignTeacher , deleteAssignTeacher} from '../../../helpers/backend-helpers'



  function* postAssignTeacherHttp({payload:{data}}) {
    try {
      const response = yield call(postAssignTeacher , data);
      if (response) {
        yield put(postAssignTeacherSuccess(response))
        return;
      }
      throw "Unknown response received from Server";
  
    } catch (error) {
      yield put(postAssignTeacherFailure(error))
    }
  }

  function* unAssignTeacherHttp({payload:{data}}) {
    try {
      const response = yield call(deleteAssignTeacher , data);
      if (response) {
        yield put(unassignTeacherSuccess(response))
        return;
      }
      throw "Unknown response received from Server";
  
    } catch (error) {
      yield put(unassignTeacherFailure(error))
    }
  }




function* AssignSaga() {
    yield takeEvery(POST_ASSIGN_TEACHER, postAssignTeacherHttp)
    yield takeEvery(UNASSIGN_TEACHER, unAssignTeacherHttp)
  }
  
  export default AssignSaga
  