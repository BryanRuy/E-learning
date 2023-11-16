import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { SETUP_ACCOUNT_PASSWORD } from "./actionTypes"
import { setupAccountPasswordSuccess, setupAccountPasswordFailure } from "./actions"

//Include Both Helper File with needed methods
import { setupAccountPassword } from "../../../../helpers/backend-helpers";


function* setupAccountPasswordHttp({ payload: { data, history } }) {
    try {
        const response = yield call(setupAccountPassword, data);
        if (response) {
            localStorage.setItem("authStudent", JSON.stringify(response))
            setTimeout(() => {
                history.replace("/")
            }, 100)
            yield put(setupAccountPasswordSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(setupAccountPasswordFailure(error.message ? error.message : error))
    }
}


function* setupPasswordSaga() {
    yield takeEvery(SETUP_ACCOUNT_PASSWORD, setupAccountPasswordHttp)
}

export default setupPasswordSaga
