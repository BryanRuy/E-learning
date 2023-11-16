import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { RESET_ACCOUNT_PASSWORD } from "./actionTypes"
import { resetAccountPasswordSuccess, resetAccountPasswordFailure } from "./actions"

//Include Both Helper File with needed methods
import { resetAccountPassword } from "../../../../helpers/backend-helpers";


function* resetAccountPasswordHttp({ payload }) {
    try {
        const response = yield call(resetAccountPassword, payload);
        if (response) {
            yield put(resetAccountPasswordSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(resetAccountPasswordFailure(error.message ? error.message : error))
    }
}


function* resetPasswordSaga() {
    yield takeEvery(RESET_ACCOUNT_PASSWORD, resetAccountPasswordHttp)
}

export default resetPasswordSaga
