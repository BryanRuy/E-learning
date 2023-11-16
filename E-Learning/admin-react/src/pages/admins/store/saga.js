
import { call, put, takeEvery } from "redux-saga/effects"

import {
    GET_ADMINS,
    GET_ADMIN_DETAIL,
    REGISTER_ADMIN
  } from "./actionsTypes";
import {
   getAdminsSuccess, getAdminsFailure,
   getAdminDetailSuccess, getAdminDetailFailure, 
   registerAdminSuccess, registerAdminFailure
} from "./actions"


import { getAdminDetail, getAllAdmins , registerAdmin} from "../../../helpers/backend-helpers";


function* getAllAdminsHttp({payload:data}) {
   
    try {
       
        const response = yield call(getAllAdmins,data);
       
        if (response) {
            let res = {
                "res":response,
                "page":data.page
            }
            yield put(getAdminsSuccess(res))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getAdminsFailure(error.message ? error.message : error))
        
    }
}

function* getAdminDetailsHttp({ payload }) {
    try {
        const response = yield call(getAdminDetail, payload);
        if (response) {
            yield put(getAdminDetailSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getAdminDetailFailure(error.message ? error.message : error))
    }
}

function* postRegisterAdminHttp({ payload:data }) {
    try {
        const response = yield call(registerAdmin, data);
        if (response) {
            yield put(registerAdminSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(registerAdminFailure(error.message ? error.message : error))
    }
}



function* AdminsSaga() {
    yield takeEvery(GET_ADMINS, getAllAdminsHttp)
    yield takeEvery(GET_ADMIN_DETAIL, getAdminDetailsHttp)
    yield takeEvery(REGISTER_ADMIN, postRegisterAdminHttp)
}

export default AdminsSaga
