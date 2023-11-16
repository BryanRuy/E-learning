import { call, put, takeEvery } from "redux-saga/effects";
import {
  UPDATE_ADMIN_PROFILE,
  UPDATE_TEACHER_PROFILE,
  UPDATE_STUDENT_PROFILE,
  UPDATE_ADMIN_PROFILE_PICTURE,
  UPDATE_TEACHER_PROFILE_PICTURE,
  UPDATE_STUDENT_PROFILE_PICTURE,
  UPDATE_USER_PASSWORD,
} from "./actionsTypes";

import {
  updateAdminProfileSuccess,
  updateAdminProfileFailure,
  updateTeacherProfileSuccess,
  updateTeacherProfileFailure,
  updateStudentProfileSuccess,
  updateStudentProfileFailure,
  updateAdminProfilePictureSuccess,
  updateAdminProfilePictureFailure,
  updateTeacherProfilePictureSuccess,
  updateTeacherProfilePictureFailure,
  updateStudentProfilePictureSuccess,
  updateStudentProfilePictureFailure,
  updateUserPasswordSuccess,
  updateUserPasswordFailure,
} from "./actions";

import {
  putAdminProfile,
  putStudentProfile,
  putTeacherProfile,
  uploadStudentProfilePicture,
  uploadAdminProfilePicture,
  uploadTeacherProfilePicture,
  updateUserPassword,
} from "../../../helpers/backend-helpers";

function* updateAdminProfileHttp({ payload: data }) {
  try {
    const response = yield call(putAdminProfile, data);

    if (response) {
      yield put(updateAdminProfileSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(updateAdminProfileFailure(error.message ? error.message : error));
  }
}

function* updateTeacherProfileHttp({ payload: data }) {
  try {
    const response = yield call(putTeacherProfile, data);
    if (response) {
      yield put(updateTeacherProfileSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(
      updateTeacherProfileFailure(error.message ? error.message : error)
    );
  }
}

function* updateStudentProfileHttp({ payload: data }) {
  try {
    const response = yield call(putStudentProfile, data);
    if (response) {
      yield put(updateStudentProfileSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(
      updateStudentProfileFailure(error.message ? error.message : error)
    );
  }
}

function* updateAdminProfilePictureHttp({ payload: data }) {
  try {
    const response = yield call(
      uploadAdminProfilePicture,
      data.userId,
      data.data
    );

    if (response) {
      yield put(updateAdminProfilePictureSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(
      updateAdminProfilePictureFailure(error.message ? error.message : error)
    );
  }
}

function* updateTeacherProfilePictureHttp({ payload: data }) {
  try {
    const response = yield call(
      uploadTeacherProfilePicture,
      data.userId,
      data.data
    );
    if (response) {
      yield put(updateTeacherProfilePictureSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(
      updateTeacherProfilePictureFailure(error.message ? error.message : error)
    );
  }
}

function* updateStudentProfilePictureHttp({ payload: data }) {
  try {
    const response = yield call(
      uploadStudentProfilePicture,
      data.userId,
      data.data
    );
    if (response) {
      yield put(updateStudentProfilePictureSuccess(response));
      return;
    }
    throw "Unknown response received from Server";
  } catch (error) {
    yield put(
      updateStudentProfilePictureFailure(error.message ? error.message : error)
    );
  }
}

function* updateUserPasswordHttp({ payload: data }) {
    try {
      const response = yield call(updateUserPassword,data);
      if (response) {
        yield put(updateUserPasswordSuccess(response));
        return;
      }
      throw "Unknown response received from Server";
    } catch (error) {
      yield put(
        updateUserPasswordFailure(error.message ? error.message : error)
      );
    }
  }

function* UsersProfileSaga() {
  yield takeEvery(UPDATE_ADMIN_PROFILE, updateAdminProfileHttp);
  yield takeEvery(UPDATE_TEACHER_PROFILE, updateTeacherProfileHttp);
  yield takeEvery(UPDATE_STUDENT_PROFILE, updateStudentProfileHttp);
  yield takeEvery(UPDATE_ADMIN_PROFILE_PICTURE, updateAdminProfilePictureHttp);
  yield takeEvery(
    UPDATE_TEACHER_PROFILE_PICTURE,
    updateTeacherProfilePictureHttp
  );
  yield takeEvery(
    UPDATE_STUDENT_PROFILE_PICTURE,
    updateStudentProfilePictureHttp
  );
  yield takeEvery(UPDATE_USER_PASSWORD, updateUserPasswordHttp);
}

export default UsersProfileSaga;
