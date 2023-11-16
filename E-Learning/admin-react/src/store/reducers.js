import { combineReducers } from "redux"

// Authentication
import Login from "./../pages/auth/login/store/reducer"
import Layout from "./layout/reducer"
import Navbar from "./navbar/reducer"
import Blogs from "./../pages/blog/store/reducer"
import Profile from './../pages/profile/store/reducer'
import ForgotPassword from './../pages/auth/forgot-password/store/reducer'
import ResetPassword from './../pages/auth/reset-password/store/reducer'
import Dashboard from './../pages/dashboard/store/reducer'
import Teachers from './../pages/teachers/store/reducer'
import Students from './../pages/students/store/reducer'
import History from './../pages/history-profile/store/reducer'
import Assign from './../pages/assign/store/reducer'
import Ebook from './../pages/ebook/store/reducer'
import Admins from './../pages/admins/store/reducer'
import UsersProfile from './../pages/users-profile/store/reducer'

const rootReducer = combineReducers({

  Login,
  Layout,
  Navbar,
  Blogs,
  Profile,
  ForgotPassword,
  ResetPassword,
  Dashboard,
  Teachers,
  Students,
  History,
  Assign,
  Ebook,
  Admins,
  UsersProfile,
});

export default rootReducer;

