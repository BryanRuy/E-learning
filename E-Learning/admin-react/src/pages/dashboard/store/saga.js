import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { GET_DASHBOARD_DATA } from "./actionTypes"
import { getDashboardDataSuccess, getDashboardDataFailure } from "./actions"

//Include Both Helper File with needed methods
import { getDashboardData } from "../../../helpers/backend-helpers";


function* getDashboardDataHttp() {
    try {
        const response = yield call(getDashboardData);
        if (response) {
            yield put(getDashboardDataSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getDashboardDataFailure(error.message ? error.message : error))
    }
}


function* dashboardSaga() {
    yield takeEvery(GET_DASHBOARD_DATA, getDashboardDataHttp)
}

export default dashboardSaga
