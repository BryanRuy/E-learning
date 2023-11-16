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
    },
  },
  {
    path: "/profile",
    className: "profile-application",
    component: lazy(() => import("../../pages/profile")),
    meta: {
      newUserAccessible: true,
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
    path: "/meetings/:id",
    exact: true,
    component: lazy(() => import("../../pages/blog/details")),
    meta: {
      navLink: "/meetings/:id",
    },
  },
  {
    appLayout: true,
    className: "chat-application",
    path: "/chat",
    component: lazy(() => import("../../pages/chat")),
  },
  {
    appLayout: true,
    path: "/assignments",
    exact: true,
    className: "assignments-application",
    component: lazy(() => import("../../pages/assignments")),
  },
  {
    appLayout: true,
    path: "/assignments/details",
    className: "assignments-application",
    component: lazy(() => import("../../pages/assignments/assignment-details")),
  },
  {
    appLayout: true,
    path: "/past-assignments",
    className: "assignments-application",
    component: lazy(() => import("../../pages/assignments/past-assignments")),
  },
  {
    appLayout: true,
    path: "/new-assignments",
    className: "assignments-application",
    component: lazy(() => import("../../pages/assignments/new-assignments")),
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
    },
  },
  {
    path: "/blog/:id",
    exact: true,
    component: lazy(() => import("../../pages/blog/details")),
    meta: {
      navLink: "/blog/:id",
      newUserAccessible: true,
    },
  },
  {
    path: "/lessons",
    exact: true,
    className: "lesson-application",
    component: lazy(() => import("../../pages/lessons")),
  },

  {
    path: "/tests",
    exact: true,
    className: "test-application",
    component: lazy(() => import("../../pages/tests")),
  },
  {
    path: "/tests/attempt",
    exact: true,
    className: "test-application",
    component: lazy(() => import("../../pages/tests/attemptTest")),
  },
  {
    path: "/attempt-details/:id",
    exact: true,
    className: "test-application",
    component: lazy(() => import("../../pages/tests/AttemptDetails")),
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
  {
    path: "/ebooks",
    exact: true,
    component: lazy(() => import("../../pages/ebook")),
    meta: {
      newUserAccessible: true,
    },
  },
];

export { GetStartedRoute, DefaultRoute, TemplateTitle, Routes };
