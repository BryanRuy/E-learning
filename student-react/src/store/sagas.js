import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./../pages/auth/login/store/saga"
import ChatSaga from "./../pages/chat/store/saga"
import MeetingsSaga from "./../pages/meetings/store/saga"
import DocumentSaga from "./../pages/documents/store/saga"
import BlogSaga from "./../pages/blog/store/saga"
import LessonsSaga from "./../pages/lessons/store/saga"
import TestsSaga from "./../pages/tests/store/saga"
import AssignmentsSaga from "./../pages/assignments/store/saga"
import GoogleSignInSaga from "./../views/google-signin/store/saga"
import SetupPasswordSaga from "./../pages/auth/setup-password/store/saga"
import RegisterSaga from "./../pages/auth/register/store/saga"
import GetStartedSaga from "./../pages/get-started/store/saga"
import ProfileSaga from "./../pages/profile/store/saga"
import ForgotPasswordSaga from "./../pages/auth/forgot-password/store/saga"
import ResetPasswordSaga from "./../pages/auth/reset-password/store/saga"
import StripeSaga from "./../pages/stripe/store/saga"
import EbookSaga from "./../pages/ebook/store/saga"
import Feedback from './../pages/feedback/store/saga'

export default function* rootSaga() {
  yield all([
    AccountSaga(),
    AuthSaga(),
    ChatSaga(),
    MeetingsSaga(),
    DocumentSaga(),
    BlogSaga(),
    LessonsSaga(),
    TestsSaga(),
    AssignmentsSaga(),
    GoogleSignInSaga(),
    SetupPasswordSaga(),
    RegisterSaga(),
    GetStartedSaga(),
    ProfileSaga(),
    ForgotPasswordSaga(),
    ResetPasswordSaga(),
    StripeSaga(),
    EbookSaga(),
    Feedback()
  ])
}
