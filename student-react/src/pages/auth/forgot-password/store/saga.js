import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { FORGOT_ACCOUNT_PASSWORD } from "./actionTypes"
import { forgotAccountPasswordSuccess, forgotAccountPasswordFailure } from "./actions"

//Include Both Helper File with needed methods
import { forgotAccountPassword } from "../../../../helpers/backend-helpers";


function* forgotAccountPasswordHttp({ payload }) {
    try {
        const response = yield call(forgotAccountPassword, payload);
        if (response) {
            yield put(forgotAccountPasswordSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(forgotAccountPasswordFailure(error.message ? error.message : error))
    }
}


function* setupPasswordSaga() {
    yield takeEvery(FORGOT_ACCOUNT_PASSWORD, forgotAccountPasswordHttp)
}

export default setupPasswordSaga
