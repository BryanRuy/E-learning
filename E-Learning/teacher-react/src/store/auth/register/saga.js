import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_STUDENT } from "./actionTypes"
import { registerStudentSuccessful, resgisterStudentFailed, apiError } from "./actions"

//Include Both Helper File with needed methods

// import { postStudentRegisterByInstitute } from '../../../helpers/backend-helpers'

// // initialize relavant method of both Auth

// function* registerStudent({ payload: { user } }) {
//   try {

//     const response = yield call(postStudentRegisterByInstitute, user);
//     console.log("STUDENT_INFO", response);
//     if (response.studentId) {
//       return yield put(registerStudentSuccessful(response))
//     }
//     if (response.message) {
//       throw response.message;
//     }

//     throw "Unknown response received from Server";

//   } catch (error) {
//     yield put(apiError(error))
//   }
// }


export function* watchUserRegister() {
  // yield takeEvery(REGISTER_STUDENT, registerStudent)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
