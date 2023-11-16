import { combineReducers } from "redux"

// Authentication
import Login from "./../pages/auth/login/store/reducer"
import Layout from "./layout/reducer"
import Navbar from "./navbar/reducer"
import Chat from "./../pages/chat/store/reducer"
import Meetings from "./../pages/meetings/store/reducer"
import Students from "./../pages/students/store/reducer"
import Tests from "./../pages/tests/store/reducer"
import Attempts from "./../pages/attempts/store/reducer"
import Documents from "./../pages/documents/store/reducer"
import Blogs from "./../pages/blog/store/reducer"
import Lessons from "./../pages/lessons/store/reducer"
import Assignments from "./../pages/assignments/store/reducer"
import AssignmentAttempts from "./../pages/assignmentAttempts/store/reducer"

import GoogleSignIn from './../views/google-signin/store/reducer'
import SetupPassword from './../pages/auth/setup-password/store/reducer'
import Register from './../pages/auth/register/store/reducer'
import GetStarted from './../pages/get-started/store/reducer'
import Profile from './../pages/profile/store/reducer'
import ForgotPassword from './../pages/auth/forgot-password/store/reducer'
import ResetPassword from './../pages/auth/reset-password/store/reducer'
import Stripe from './../pages/stripe/store/reducer'
import Ebook from './../pages/ebook/store/reducer'
import Feedback from './../pages/feedback/store/reducer';

const rootReducer = combineReducers({
  Register,
  Login,
  Layout,
  Navbar,
  Chat,
  Meetings,
  Students,
  Tests,
  Attempts,
  Documents,
  Blogs,
  Lessons,
  Assignments,
  AssignmentAttempts,
  GoogleSignIn,
  SetupPassword,
  GetStarted,
  Profile,
  ForgotPassword,
  ResetPassword,
  Stripe,
  Ebook,
  Feedback
})

export default rootReducer
