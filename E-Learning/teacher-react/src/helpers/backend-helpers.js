import { post, del, get, put, postForm, putForm, GetUrlWithPagingParams, download } from "./api_helper"
import * as  url from "./url_helper"
import moment from "moment"
// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("authTeacher")
  return user ? JSON.parse(user) : null;
}

export const setLoggedInUser = (obj = {}) => {
  localStorage.setItem("authTeacher", JSON.stringify(obj))
}

export const getAuthentication = () => {
  const tokenInfo = localStorage.getItem("authTeacherToken")
  return tokenInfo ? JSON.parse(tokenInfo) : null;
}

export const setUserPaymentPlan = (obj) => {
  localStorage.setItem("plan", JSON.stringify(obj))
}

export const getUserPaymentPlan = () => {
  let paymentPlan =  localStorage.getItem("plan")
  return  paymentPlan ? JSON.parse(paymentPlan) : null;
}

export const isUserPlanExpired = () => {
  let paymentPlan =  localStorage.getItem("plan")
  let plan =  paymentPlan ? JSON.parse(paymentPlan) : null;
  if(!plan || !plan.startDate || !plan.endDate || moment(plan.endDate).isBefore(new Date())){
    return true
  }

  return false
}

export const getUserData = (userId) => get(url.GET_USER_DATA(userId))

//is user is logged in
export const isUserAuthenticated = () => {
  return getAuthentication() !== null
}



// Get started
export const getStartedContent = () => get(url.GET_STARTED_CONTENT)

// All Student  
export const getAllTeacherStudents = () => get(url.ALL_STUDENTS)

//Meeting
export const getMeetingToken = () => get(url.MEETING_TOKEN);
export const newMeeting = data => post(url.NEW_MEETING, data);
export const getStudentAllMeetings = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_ALL_MEETINGS(params.userId),params)
  return get(endUrl)
}
export const getMeetingDates = userId => get(url.GET_MEETING_DATES(userId));
export const updateMeeting = (id, action, data) => put(url.UPDATE_MEETING(id, action), data);
export const getMeetingWithAdmin = userId => get(url.GET_ADMIN_MEETING(userId));
export const newAdminMeeting = data => post(url.NEW_ADMIN_MEETING, data);

// Chats
export const getChatContactsRequest = id => get(url.GET_CHATS_CONTACTS(id))
export const getChatDocuments = id => get(url.GET_CHAT_DOCUMENTS(id))
export const updateUser = (id, data) => put(url.UPDATE_USER(id), data)
export const createChat = data => post(url.CHATS, data)

// Student Actions
export const postTeacherLogin = data => post(url.POST_TEACHER_LOGIN, data);
export const signInWithGoogle = data => post(url.SIGN_IN_WITH_GOOGLE, data);
export const setupAccountPassword = data => post(url.SETUP_PASSWORD, data);
export const registerUser = data => post(url.REGISTER, data);
export const forgotAccountPassword = data => post(url.FORGOT_PASSWORD, data);
export const resetAccountPassword = data => post(url.RESET_PASSWORD, data);

export const getAllStudents = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENTS,params)
  return get(endUrl)
};
export const getStudentProfile = studentId => get(url.GET_STUDENT_BY_ID(studentId));

//STUDENT => Student-test & test-attempts
export const getAllStudentTest = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENT_TEST(params.studentId),params)
  return get(endUrl)
};
export const getStudentTestAttempts = (studentId, testId) => get(url.GET_STUDENT_ATTEMPTS(studentId, testId));
export const getAttemptDetail = (attemptId) => get(url.GET_ATTEMPT_DETAIL(attemptId));
export const putAttemptSubjectiveMarks = (attemptId, data) => putForm(url.PUT_SUBJECTIVE_ATTEMPT_MARKS(attemptId), data);

//STUDENT => Student-assignment & assignment-attempts
export const getAllStudentAssignment = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_STUDENT_ASSIGNMENTS(params.studentId),params)
   return get(endUrl);
} 
export const getStudentAssignmentAttempts = (studentId, assignmentId) => get(url.GET_STUDENT_ASSIGNMENT_ATTEMPTS(studentId, assignmentId));
export const getAssignmentAttemptDetail = (assignmentAttemptId) => get(url.GET_ASSIGNMENT_ATTEMPT_DETAIL(assignmentAttemptId));

//Tests
export const getPastTests = () => get(url.GET_PAST_TESTS);
export const getUpcomingTests = () => get(url.GET_UPCOMING_TESTS);
export const getTestDetail = (testId) => get(url.GET_TEST_BY_ID(testId));
export const getTests = (params) => {
  let endUrl = GetUrlWithPagingParams(url.GET_TESTS,params)
  return get(endUrl)
};

export const postTest = data => postForm(url.POST_TEST, data);
export const putTest = data => putForm(url.PUT_TEST, data);
export const assignTest = (testId, data) => post(url.POST_ASSIGN_TEST(testId), data);
export const getTestPastStudent = (testId) => get(url.GET_TEST_PAST_STUDENT(testId));
export const getTestUpcomingStudent = (testId) => get(url.GET_TEST_UPCOMING_STUDENT(testId));
export const unassignTest = (testId, studentTestId) => del(url.UNASSIGN_TEST(testId), studentTestId);
export const getTestById = (testId) => get(url.GET_TEST_BY_ID(testId));

//Assignment
export const getTeacherUpcomingAssignments = () => get(url.UPCOMING_ASSIGNMENTS)
export const getTeacherPastAssignments = () => get(url.PAST_ASSIGNMENTS)
export const getAssignmentDetail = (assignmentId) => get(url.GET_ASSIGNMENT_BY_ID(assignmentId));
export const getAssignments = (params) =>{
  let endUrl = GetUrlWithPagingParams( url.GET_ASSIGNMENTS,params)
  return  get(endUrl);
} 
export const postAssignment = data => post(url.POST_ASSIGNMENT, data);
export const putAssignment = data => put(url.PUT_ASSIGNMENT, data);
export const assignAssignment = (assignmentId, data) => post(url.POST_ASSIGN_ASSIGNMENT(assignmentId), data);
export const getAssignmentPastStudent = (assignmentId) => get(url.GET_ASSIGNMENT_PAST_STUDENT(assignmentId));
export const getAssignmentUpcomingStudent = (assignmentId) => get(url.GET_ASSIGNMENT_UPCOMING_STUDENT(assignmentId));
export const unassignAssignment = (assignmentId, studentAssignmentId) => del(url.UNASSIGN_TEST(assignmentId), studentAssignmentId);

//Lessons
export const getTopics = () => get(url.TOPICS);
export const deleteTopic = (id) => del(url.TOPIC(id));
export const getLesson = (id) => get(url.LESSON(id));
export const deleteLesson = (id) => del(url.LESSON(id));
export const getRecentLessons = (id) => get(url.GET_RECENT_LESSONS);
export const getTopicLessons = id => get(url.GET_TOPIC_LESSONS(id));
export const uploadNewTopic = data => postForm(url.TOPICS, data);
export const updateTopic = data => putForm(url.TOPICS, data);
export const uploadNewLesson = data => post(url.LESSONS, data);
export const updateLesson = data => put(url.LESSONS, data);
export const assignLessonToStudents = data => post(url.ASSIGN_LESSON_TO_STUDENTS, data);
export const unassignLessonToStudents = data => del(url.ASSIGN_LESSON_TO_STUDENTS, data);


//Blogs 
export const getBlogList = () => get(url.GET_BLOG_LIST)
export const getBlog = (id) => get(url.GET_BLOG(id))
export const getBlogCategories = () => get(url.GET_BLOG_CATEGORIES)
export const getBlogComments = (id) => get(url.GET_BLOG_COMMENTS(id))
export const postCommentOnBlog = (data) => post(url.COMMENT_ON_BLOG, data)


//Documents
export const getUserDocuments = () => get(url.GET_USER_DOCUMENTS)
export const deleteUserDocument = (id) => del(url.DELETE_USER_DOCUMENTS(id))
export const uploadDocument = (data, options) => postForm(url.UPLOAD_DOCUMENT_URL, data, options);

//Profile
export const updateProfileData = (id, data) => put(url.UPDATE_PROFILE_DATA(id), data);
export const uploadProfilePicture = (id, data) => postForm(url.UPLOAD_PROFILE_PICTURE(id), data);
export const updatePassword = (id, data) => put(url.UPDATE_PASSWORD(id), data);


//stripe
export const getStripeKey = () => get(url.GET_STRIPE_KEY);
export const getPaymentPlan = () => get(url.PAYMENT_PLAN);
export const deletePaymentMethod = (fingerprint) => del(url.PAYMENT_METHODS,fingerprint);
export const getPaymentMethods = () => get(url.PAYMENT_METHODS);
export const postPaymentMethods = (data) => post(url.PAYMENT_METHODS, data);
export const putPaymentMethods = (data) => put(url.PAYMENT_METHODS, data);
export const postPayment = (data) => post(url.POST_PAYMENT,data);

//Ebook
export const getEbooks = () => get(url.GET_EBOOKS)
export const downloadEbook = ebookId => download(url.DOWNLOAD_EBOOK(ebookId))
export const buyEbook = (ebookId, token) => download(url.BUY_EBOOK(ebookId, token))

//Counties
export const getCounties = () => get(url.GET_COUNTIES)

// Feedback
export const postFeedback = (feedback) => post(url.POST_FEEDBACK, feedback);