// export const BASE_URL = `http://192.168.10.102:3600`
// export const MEETING_API_URL = `http://192.168.10.102:4200`
// export const MEETING_APP_URL = `http://192.168.10.102:3001`
// export const CHAT_API_URL = `http://192.168.10.102:3700`
// export const CHAT_SOCKET_API_URL = `http://192.168.10.102:3701`
// export const BLOG_API_URL = `http://192.168.10.102:1337`

export const BASE_URL = `https://api.noName.ro`;
export const MEETING_API_URL = `https://meet.noName.ro/api`;
export const MEETING_APP_URL = `https://meet.noName.ro`;
export const CHAT_API_URL = `https://chat.noName.ro/`;
export const CHAT_SOCKET_API_URL = `https://live-chat.noName.ro/`;
export const BLOG_API_URL = `https://cms.noName.ro/`;

export const BASE_API_URL = `${BASE_URL}/api/v1`;
export const IMAGES_BASE_URL = `${BASE_URL}/public`;
export const DOCUMENT_BASE_URL = `${BASE_URL}/public`;

export const GOOGLE_RECAPTCHA_KEY = "6Le1reYUAAAAAHjngT35rOyqIlMXbTNAT0JjVP6y";
export const GET_IMAGE_URL = (url) =>
  url
    ? DOCUMENT_BASE_URL + url
    : DOCUMENT_BASE_URL + "/profile-pictures/default.png";
export const GET_BLOG_IMAGE_URL = (url) => BLOG_API_URL + url;
export const GET_DOCUMENT_URL = (url) => DOCUMENT_BASE_URL + url;
export const getProfileImageUrl = (url) =>
  url
    ? IMAGES_BASE_URL + url
    : IMAGES_BASE_URL + "/profile-pictures/default.png";

//Get Started

export const GET_STARTED_CONTENT = `${BASE_URL}/api/v1/strapi/content/teacher_content`;

//  All Students
export const ALL_STUDENTS = `${BASE_URL}/api/v1/students?limit=1000&page=1`;

// Login
export const POST_TEACHER_LOGIN = `${BASE_URL}/authenticate/teacher`;
export const SIGN_IN_WITH_GOOGLE = `${BASE_URL}/authenticate-with-google/teacher`;
export const SETUP_PASSWORD = `${BASE_URL}/setup-password`;
export const RESET_PASSWORD = `${BASE_URL}/reset-password`;
export const REGISTER = `${BASE_URL}/register`;
export const FORGOT_PASSWORD = `${BASE_URL}/forget-password`;
export const GET_USER_DATA = (userId) =>
  `${BASE_URL}/api/v1/teachers/${userId}`;

//Tests

export const GET_PAST_TESTS = `${BASE_URL}/api/v1/tests/past-tests`;
export const GET_UPCOMING_TESTS = `${BASE_URL}/api/v1/tests/upcoming-tests`;
export const POST_TEST = `${BASE_API_URL}/tests`;
export const PUT_TEST = `${BASE_API_URL}/tests`;
export const GET_TESTS = `${BASE_API_URL}/tests`;
export const GET_TEST_BY_ID = (testId) => `${BASE_API_URL}/tests/${testId}`;
export const GET_TEST_PAST_STUDENT = (testId) =>
  `${BASE_API_URL}/tests/${testId}/past-tests`;
export const GET_TEST_UPCOMING_STUDENT = (testId) =>
  `${BASE_API_URL}/tests/${testId}/upcoming-tests`;
export const POST_ASSIGN_TEST = (testId) =>
  `${BASE_API_URL}/tests/${testId}/assign`;
export const UNASSIGN_TEST = (testId) =>
  `${BASE_API_URL}/tests/${testId}/unassign`;

//Assignments
export const UPCOMING_ASSIGNMENTS = `${BASE_URL}/api/v1/assignments/upcoming-assignments`;
export const PAST_ASSIGNMENTS = `${BASE_URL}/api/v1/assignments/past-assignments`;
export const POST_ASSIGNMENT = `${BASE_API_URL}/assignments`;
export const PUT_ASSIGNMENT = `${BASE_API_URL}/assignments`;
export const GET_ASSIGNMENTS = `${BASE_API_URL}/assignments`;
export const GET_ASSIGNMENT_BY_ID = (assignmentId) =>
  `${BASE_API_URL}/assignments/${assignmentId}`;
export const GET_ASSIGNMENT_PAST_STUDENT = (assignmentId) =>
  `${BASE_API_URL}/assignments/${assignmentId}/past-assignments`;
export const GET_ASSIGNMENT_UPCOMING_STUDENT = (assignmentId) =>
  `${BASE_API_URL}/assignments/${assignmentId}/upcoming-assignments`;
export const POST_ASSIGN_ASSIGNMENT = (assignmentId) =>
  `${BASE_API_URL}/assignments/${assignmentId}/assign`;
export const UNASSIGN_ASSIGNMENT = (assignmentId) =>
  `${BASE_API_URL}/assignments/${assignmentId}/unassign`;

//STUDENTS
export const GET_STUDENTS = `${BASE_API_URL}/students`;
export const GET_STUDENT_BY_ID = (studentId) =>
  `${BASE_API_URL}/students/${studentId}`;
export const GET_STUDENT_TEST = (studentId) =>
  `${BASE_API_URL}/students/${studentId}/tests`;
export const GET_STUDENT_ASSIGNMENTS = (studentId) =>
  `${BASE_API_URL}/students/${studentId}/assignments`;

//TEST -ATTEMPTS
export const GET_STUDENT_ATTEMPTS = (studentId, testId) =>
  `${BASE_API_URL}/students/${studentId}/tests/${testId}/attempts`;
export const GET_ATTEMPT_DETAIL = (attemptId) =>
  `${BASE_API_URL}/attempts/${attemptId}`;
export const PUT_SUBJECTIVE_ATTEMPT_MARKS = (attemptId) =>
  `${BASE_API_URL}/attempts/${attemptId}/subjective-marks`;

//ASSIGNMENT -ATTEMPTS
export const GET_STUDENT_ASSIGNMENT_ATTEMPTS = (studentId, assignment) =>
  `${BASE_API_URL}/students/${studentId}/assignments/${assignment}/assignment-attempts`;
export const GET_ASSIGNMENT_ATTEMPT_DETAIL = (assignmentAttemptId) =>
  `${BASE_API_URL}/assignment-attempts/${assignmentAttemptId}`;
// export const PUT_SUBJECTIVE_ATTEMPT_MARKS = attemptId => `${BASE_API_URL}/attempts/${attemptId}/subjective-marks`

// Chats

export const CHATS = `${CHAT_API_URL}/chats`;
export const GET_CHATS_CONTACTS = (id) => `${CHAT_API_URL}/users/${id}/chats`;
export const GET_CHAT_DOCUMENTS = (id) => `${BASE_URL}/documents?chatId=${id}`;
export const UPDATE_USER = (id) => `${BASE_URL}/api/v1/teacher/${id}/profile`;

// Meetings
export const MEETING_TOKEN = `${MEETING_API_URL}/users/authenticate`;
export const NEW_MEETING = `${MEETING_API_URL}/meetings`;
export const UPDATE_MEETING = (id, action) =>
  `${MEETING_API_URL}/meetings/${id}/${action}`;
export const GET_ALL_MEETINGS = (id) =>
  `${MEETING_API_URL}/users/${id}/meetings`;
export const GET_MEETING_DATES = (id) =>
  `${MEETING_API_URL}/meetings/check-dates/${id}`;
export const GET_ADMIN_MEETING = (id) =>
  `${MEETING_API_URL}/users/${id}/admin-meeting`;
export const NEW_ADMIN_MEETING = `${MEETING_API_URL}/meetings/admin-meeting`;

//Document

export const UPLOAD_DOCUMENT_URL = `${BASE_URL}/documents`;
export const GET_USER_DOCUMENTS = `${BASE_URL}/documents`;
export const DELETE_USER_DOCUMENTS = (id) => `${BASE_URL}/documents/${id}`;

//Blog
export const GET_BLOG_LIST = `${BASE_API_URL}/strapi/blogs`;
export const GET_BLOG = (id) => `${BASE_API_URL}/strapi/blogs/${id}`;
export const GET_BLOG_CATEGORIES = `${BASE_API_URL}/strapi/categories`;
export const GET_BLOG_COMMENTS = (id) =>
  `${BASE_API_URL}/strapi/blogs/${id}/comments`;
export const COMMENT_ON_BLOG = `${BASE_API_URL}/strapi/comments`;

export const UPLOAD_BLOG_IMAGE_URL = `${BASE_API_URL}/strapi/uploads`;

//Lessons

export const TOPICS = `${BASE_URL}/api/v1/strapi/topics`;
export const TOPIC = (id) => `${BASE_URL}/api/v1/strapi/topics/${id}`;
export const GET_TOPIC_LESSONS = (id) =>
  `${BASE_URL}/api/v1/strapi/topics/${id}/lessons`;
export const LESSONS = `${BASE_URL}/api/v1/strapi/lessons`;
export const LESSON = (id) => `${BASE_URL}/api/v1/strapi/lessons/${id}`;
export const GET_RECENT_LESSONS = `${BASE_URL}/api/v1/strapi/recent-lessons`;
export const ASSIGN_LESSON_TO_STUDENTS = `${BASE_URL}/api/v1/strapi/student-lessons`;

//Profile
export const UPDATE_PROFILE_DATA = (id) =>
  `${BASE_URL}/api/v1/teachers/${id}/profile`;
export const UPLOAD_PROFILE_PICTURE = (id) =>
  `${BASE_URL}/api/v1/teachers/${id}/profile-picture`;
export const UPDATE_PASSWORD = (id) =>
  `${BASE_URL}/api/v1/teachers/${id}/password`;

//Stripe
export const PAYMENT_METHODS = `${BASE_URL}/api/v1/stripe/payment-methods`;
export const PAYMENT_PLAN = `${BASE_URL}/api/v1/stripe/payment-plan`;
export const GET_STRIPE_KEY = `${BASE_URL}/api/v1/stripe/public-key`;
export const POST_PAYMENT = `${BASE_URL}/api/v1/stripe/pay`;

//Ebooks
export const GET_EBOOKS = `${BASE_URL}/api/v1/ebooks`;
export const DOWNLOAD_EBOOK = (ebookId) =>
  `${BASE_URL}/api/v1/ebooks/download/${ebookId}`;
export const BUY_EBOOK = (ebookId, token) =>
  `${BASE_URL}/api/v1/ebooks/download/${ebookId}/${token}`;

//Counties
export const GET_COUNTIES = `${BASE_URL}/counties`;

// Feedback
export const POST_FEEDBACK = `${BASE_URL}/api/v1/osticket`;
