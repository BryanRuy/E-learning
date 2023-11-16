import { post, del, get, put, postForm, putForm, GetUrlWithPagingParams } from "./api_helper"
import * as  url from "./url_helper"




// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("authUser")
  return user ? JSON.parse(user) : null;
}

export const setLoggedInUser = (obj = {}) => {
  localStorage.setItem("authUser", JSON.stringify(obj))
}

export const getAuthentication = () => {
  const tokenInfo = localStorage.getItem("authToken")
  return tokenInfo ? JSON.parse(tokenInfo) : null;
}

//is user is logged in
export const isUserAuthenticated = () => {
  return getAuthentication() !== null
}


//Dashboard
export const getDashboardData = () => get(url.GET_DASHBOARD_DATA)
export const getTeacherHistoryStats = (teacherId) => get(url.GET_TEACHER_HISTORY_STATS(teacherId))
export const getStudentHistoryStats = (studentId) => get(url.GET_STUDENT_HISTORY_STATS(studentId))

//Blogs 
export const getBlogList = () => get(url.GET_BLOG_LIST)
export const getBlog = (id) => get(url.GET_BLOG(id))
export const getBlogCategories = () => get(url.GET_BLOG_CATEGORIES)
export const getBlogComments = (id) => get(url.GET_BLOG_COMMENTS(id))
export const postCommentOnBlog = (data) => post(url.COMMENT_ON_BLOG, data)


export const uploadBlogImage = (data, options) => postForm(url.UPLOAD_BLOG_IMAGE_URL, data, options);

// Admin Actions
export const postUserLogin = data =>{
  let userType = data.userType
   data.userType = undefined
  return post(`${url.POST_USER_LOGIN}/${userType}`, data);
} 
export const forgotAccountPassword = data => post(url.FORGOT_PASSWORD, data);
export const resetAccountPassword = data => post(url.RESET_PASSWORD, data);

//Super Admin Profile

export const updateSuperAdminProfileData = (id, data) => put(url.UPDATE_SUPER_ADMIN_PROFILE_DATA(id), data);
export const uploadSuperAdminProfilePicture = (id, data) => postForm(url.UPLOAD_SUPER_ADMIN_PROFILE_PICTURE(id), data);
export const updateSuperAdminPassword = (id, data) => put(url.UPDATE_SUPER_ADMIN_PASSWORD(id), data);

//Profile

export const updateProfileData = (id, data) => put(url.UPDATE_PROFILE_DATA(id), data);
export const uploadProfilePicture = (id, data) => postForm(url.UPLOAD_PROFILE_PICTURE(id), data);
export const updatePassword = (id, data) => put(url.UPDATE_PASSWORD(id), data);

//Admins 
export const getAllAdmins  = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_ADMINS,params)
  if(params.search) endUrl +=  `&name=${params.search}` 
  return get(endUrl)
}
export const getAdminDetail = (adminId) => get(url.ADMIN_DETAIL(adminId))
export const registerAdmin = (data) => post(url.REGISTER_ADMIN,data)
export const putAdminProfile = (data) => put(url.UPDATE_ADMIN_PROFILE(data.userId),data)
export const uploadAdminProfilePicture = (userId, data) => postForm(url.POST_ADMIN_PROFILE_PICTURE(userId), data);

//Teacher 
export const getTeachersStats = () => get(url.GET_TEACHERS_STATS)
export const getAllTeachers  = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_TEACHERS,params)
  if(params.search) endUrl +=  `&name=${params.search}` 
  return get(endUrl)
}
export const putTeacherProfile = (data) => put(url.UPDATE_TEACHER_PROFILE(data.userId),data)
export const uploadTeacherProfilePicture = (userId, data) => postForm(url.POST_TEACHER_PROFILE_PICTUTRE(userId), data);
export const getTeacher = (teacherId) => get(url.TEACHER(teacherId))
export const getTeacherStudents = (teacherId) => get(url.GET_TEACHER_STUDENTS(teacherId))
export const getTeacherPaymentPlan = (teacherId) => get(url.GET_TEACHER_PAYMENT_PLAN(teacherId))
export const postTeacherPaymentPlan = (teacherId,data) => post(url.CREATE_TEACHER_PAYMENT_PLAN(teacherId), data)
export const putTeacherPaymentPlan = (teacherId,data) => put(url.UPDATE_TEACHER_PAYMENT_PLAN(teacherId), data)

//Student 
export const getStudentsStats = () => get(url.GET_STUDENTS_STATS)
// export const getAllStudents = () => get(url.GET_STUDENTS)
export const getAllStudents = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENTS,params)
  if(params.search) endUrl +=  `&name=${params.search}` 
  return get(endUrl)
}

export const putStudentProfile = (data) => put(url.UPDATE_STUDENT_PROFILE(data.userId),data)
export const uploadStudentProfilePicture = (userId, data) => postForm(url.POST_STUDENT_PROFILE_PICTURE(userId), data);
export const getStudent = (studentId) => get(url.STUDENT(studentId))
// export const getStudentOfStatusNewOrWaiting = () => get(url.GET_STUDENTS_BY_NEW_OR_WAITING_STATUS)
export const getStudentOfStatusNewOrWaiting = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENTS_BY_NEW_OR_WAITING_STATUS,params)
  if(params.search) endUrl +=  `&name=${params.search}` 
  let endPoint = endUrl+'&isActiveStudent=false'
  return get(endPoint)
}

export const getActiveStudents = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENTS_BY_NEW_OR_WAITING_STATUS,params)
  if(params.search) endUrl +=  `&name=${params.search}` 
  let endPoint = endUrl+'&isActiveStudent=true'
  return get(endPoint)
}

//Assign
export const postAssignTeacher = data => post(url.ASSIGN_UNASSIGN_TEACHER,data)
export const deleteAssignTeacher = data => put(url.ASSIGN_UNASSIGN_TEACHER,data)

//Ebook
export const postEbook = data => postForm(url.POST_EBOOKS,data)
export const putEbook = data => putForm(url.POST_EBOOKS,data)
export const getEbooks = () => get(url.GET_EBOOKS)

//Counties
export const getCounties = () => get(url.GET_COUNTIES)

//Super-Admin
export const updateUserPassword = (data) => put(url.UPDATE_USER_PASSWORD(data.userId), data)