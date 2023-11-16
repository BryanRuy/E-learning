import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { SIGN_IN_WITH_GOOGLE } from "./actionTypes"
import { signInWithGoogleFailure, signInWithGoogleSuccess } from "./actions"

//Include Both Helper File with needed methods
import { signInWithGoogle } from "../../../helpers/backend-helpers";


function* signInWithGoogleHttp({ payload: { data, history } }) {
    try {
        const response = yield call(signInWithGoogle, data);
        if (response) {
            localStorage.setItem("authTeacher", JSON.stringify(response.user))
            localStorage.setItem("authTeacherToken", JSON.stringify({ token: response.token, tokenType: response.tokenType }))
            setTimeout(() => {
                response.user.isNotVerified ?
                    history.replace("/setup-password") :
                    window.location.reload()
            }, 500)
            yield put(signInWithGoogleSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(signInWithGoogleFailure(error.message ? error.message : error))
    }
}


function* signInWithGoogleSage() {
    yield takeEvery(SIGN_IN_WITH_GOOGLE, signInWithGoogleHttp)
}

export default signInWithGoogleSage
