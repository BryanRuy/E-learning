import { lazy } from "react";

// ** Document title
const TemplateTitle = "%s - noName";

// ** Default Route
const DefaultRoute = "/home";

// ** Default Route for new user
const GetStartedRoute = "/get-started";

// ** Merge Routes
const Routes = [
  {
    path: "/home",
    className: "dashboard-application",
    component: lazy(() => import("../../pages/dashboard")),
  },
  {
    path: "/get-started",
    className: "dashboard-application",
    component: lazy(() => import("../../pages/get-started")),
    meta: {
      newUserAccessible: true,
      isPlanExpired: true,
    },
  },
  {
    path: "/profile",
    className: "profile-application",
    component: lazy(() => import("../../pages/profile")),
    meta: {
      newUserAccessible: true,
      isPlanExpired: true,
    },
  },
  {
    path: "/calendar",
    className: "calendar-application",
    component: lazy(() => import("../../pages/calendar")),
    meta: {
      newUserAccessible: true,
    },
  },
  {
    path: "/meetings",
    component: lazy(() => import("../../pages/meetings/MeetingHome")),
  },
  {
    path: "/students",
    exact: true,
    component: lazy(() => import("../../pages/students/StudentList")),
  },
  {
    path: "/students/:studentId",
    component: lazy(() => import("../../pages/students/StudentHome")),
    meta: {
      navLink: "/students/:studentId",
    },
  },
  {
    path: "/tests",
    exact: true,
    component: lazy(() => import("../../pages/tests/TeacherTests")),
  },
  {
    path: "/tests/:testId",
    component: lazy(() => import("../../pages/tests/ViewOrEdit")),
    meta: {
      navLink: "/tests/:testId",
    },
  },
  {
    path: "/add-new-test",
    exact: true,
    component: lazy(() => import("../../pages/tests/NewTest")),
  },
  {
    path: "/test-dashboard/:testId",
    exact: true,
    component: lazy(() => import("../../pages/tests/TestDashboard")),
  },
  {
    path: "/attempts/:testId",
    exact: true,
    component: lazy(() => import("../../pages/attempts/AttemptHome")),
  },

  {
    path: "/attempt-detail/:attemptId",
    exact: true,
    component: lazy(() => import("../../pages/attempts/AttemptDetail")),
  },

  {
    path: "/assignments",
    exact: true,
    component: lazy(() => import("../../pages/assignments/TeacherAssignments")),
  },
  {
    path: "/assignments/:assignmentId",
    exact: true,
    component: lazy(() =>
      import("../../pages/assignments/ViewOrEditAssignment")
    ),
  },
  {
    path: "/add-new-assignment",
    exact: true,
    component: lazy(() => import("../../pages/assignments/NewAssignment")),
  },
  {
    path: "/assignment-dashboard/:assignmentId",
    exact: true,
    component: lazy(() =>
      import("../../pages/assignments/AssignmentDashboard")
    ),
  },
  {
    path: "/assignment-attempts/:assignmentId",
    exact: true,
    component: lazy(() =>
      import("../../pages/assignmentAttempts/AssignmentAttemptHome")
    ),
  },
  {
    path: "/assignment-attempt-detail/:assignmentAttemptId",
    exact: true,
    component: lazy(() =>
      import("../../pages/assignmentAttempts/AssignmentAttemptDetail")
    ),
  },
  {
    appLayout: true,
    className: "chat-application",
    path: "/chat",
    component: lazy(() => import("../../pages/chat")),
  },
  {
    appLayout: true,
    path: "/documents",
    component: lazy(() => import("../../pages/documents")),
  },
  {
    path: "/blog",
    exact: true,
    component: lazy(() => import("../../pages/blog/list")),
    meta: {
      newUserAccessible: true,
      isPlanExpired: true,
    },
  },
  {
    path: "/blog/:id",
    exact: true,
    component: lazy(() => import("../../pages/blog/details")),
    meta: {
      navLink: "/blog/:id",
    },
  },
  {
    path: "/lessons",
    exact: true,
    className: "lesson-list-application",
    component: lazy(() => import("../../pages/lessons")),
  },
  {
    path: "/topic-lessons",
    exact: true,
    className: "lesson-application",
    component: lazy(() => import("../../pages/lessons/topic-lessons")),
  },
  {
    path: "/new-lesson",
    exact: true,
    className: "new-lesson-application",
    component: lazy(() => import("../../pages/lessons/new-lesson")),
  },
  {
    path: "/update-lesson",
    exact: true,
    className: "new-lesson-application",
    component: lazy(() => import("../../pages/lessons/new-lesson")),
  },
  {
    path: "/ebooks",
    exact: true,
    component: lazy(() => import("../../pages/ebook")),
    meta: {
      newUserAccessible: true,
    },
  },
  {
    path: "/checkout",
    component: lazy(() => import("../../pages/stripe")),
  },
  {
    path: "/login",
    component: lazy(() => import("../../pages/auth/login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../../pages/auth/register")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/setup-password",
    component: lazy(() => import("../../pages/auth/setup-password")),
    layout: "BlankLayout",
    meta: {
      newUserAccessible: true,
    },
  },
  {
    path: "/forgot-password",
    component: lazy(() => import("../../pages/auth/forgot-password")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
    },
  },
  {
    path: "/reset-password/:token",
    component: lazy(() => import("../../pages/auth/reset-password")),
    layout: "BlankLayout",
    meta: {
      authRoute: true,
      navLink: "/reset-password/:token",
    },
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout",
  },
  {
    path: "/unauthorized",
    component: lazy(() => import("../../views/NotAuthorized")),
    layout: "BlankLayout",
  },
  {
    path: "/feedback",
    component: lazy(() => import("../../pages/feedback")),
    meta: {
      newUserAccessible: true,
    },
  },
];

export { GetStartedRoute, DefaultRoute, TemplateTitle, Routes };
