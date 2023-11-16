import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./../pages/auth/login/store/saga"
import BlogSaga from "./../pages/blog/store/saga"
import ProfileSaga from "./../pages/profile/store/saga"
import ForgotPasswordSaga from "./../pages/auth/forgot-password/store/saga"
import ResetPasswordSaga from "./../pages/auth/reset-password/store/saga"
import DashboardSaga from "./../pages/dashboard/store/saga"
import TeachersSaga from "./../pages/teachers/store/saga"
import StudentsSaga from "./../pages/students/store/saga"
import HistorySaga from "./../pages/history-profile/store/saga"
import AssignSaga from "./../pages/assign/store/saga"
import EbookSaga from "./../pages/ebook/store/saga"
import AdminSaga from "./../pages/admins/store/saga"
import UsersProfileSaga from "./../pages/users-profile/store/saga"

export default function* rootSaga() {
  yield all([
    AccountSaga(),
    AuthSaga(),
    BlogSaga(),
    ProfileSaga(),
    ForgotPasswordSaga(),
    ResetPasswordSaga(),
    DashboardSaga(),
    TeachersSaga(),
    StudentsSaga(),
    HistorySaga(),
    AssignSaga(),
    EbookSaga(),
    AdminSaga(),
    UsersProfileSaga(),
  ])
}
