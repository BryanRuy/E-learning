import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, GET_USER_DATA } from "./actionTypes"
import { loginError, loginSuccess ,
    getUserDataSuccess, getUserDataFailure
} from "./actions"

//Include Both Helper File with needed methods
import { getAuthentication, postTeacherLogin  ,getUserData, getLoggedInUser} from "../../../../helpers/backend-helpers";
import { resetAPIAuthToken } from "../../../../helpers/api_helper";


function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(postTeacherLogin, user);
        if (response.user) {
            response.user = { ...response.user, userType: user.userType }
            localStorage.setItem("authTeacher", JSON.stringify(response.user))
            localStorage.setItem("authTeacherToken", JSON.stringify({ token: response.token, tokenType: response.tokenType }))
            yield put(loginSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(loginError(error))
    }
}

function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("authTeacher")
        localStorage.removeItem("authTeacherToken")
        resetAPIAuthToken();
        history.push("/login");
        window.location.reload();
    } catch (error) {
        yield put(loginError(error))
    }
}

function* getUserDataHttp() {
    try {
      let user = getLoggedInUser() || {}
      const response = yield call(getUserData, user.userId);
      if (response) {
         let res = { ...response, userType: user.userType }
         localStorage.setItem("authTeacher", JSON.stringify(res))
        yield put(getUserDataSuccess(response))
        return;
      }
      throw "Unknown response received from Server";
  
    } catch (error) {
      yield put(getUserDataFailure(error.message ? error.message : error))
    }
  }

function* LoginSaga() {
    yield takeEvery(LOGIN_USER, loginUser)
    yield takeEvery(LOGOUT_USER, logoutUser)
    yield takeEvery(GET_USER_DATA, getUserDataHttp)
}

export default LoginSaga
