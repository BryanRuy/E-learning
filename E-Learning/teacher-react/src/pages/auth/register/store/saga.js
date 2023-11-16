import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { REGISTER_ACCOUNT } from "./actionTypes"
import {
    registerAccountFailure,
    registerAccountSuccess
} from "./actions"

//Include Both Helper File with needed methods
import { registerUser } from "../../../../helpers/backend-helpers";


function* registerAccountHttp({ payload: { data, history } }) {
    try {
        const response = yield call(registerUser, data);
        if (response) {
            localStorage.setItem("authTeacher", JSON.stringify(response.user))
            localStorage.setItem("authTeacherToken", JSON.stringify({ token: response.token, tokenType: response.tokenType }))
            setTimeout(() => {
                window.location.reload();
            }, 100)
            yield put(registerAccountSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(registerAccountFailure(error.message ? error.message : error))
    }
}


function* setupPasswordSaga() {
    yield takeEvery(REGISTER_ACCOUNT, registerAccountHttp)
}

export default setupPasswordSaga
