import React from "react";
import { useTranslation } from "react-i18next";
import { Circle } from "react-feather";

export default [
  {
    header: " ",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <i className="la la-home" />,
    navLink: "/home",
    accessToAdmin: true,
  },
  {
    id: "admins",
    title: "Admins",
    icon: <i className="la la-user" />,
    navLink: "/admins",
    accessToAdmin: true,
  },
  {
    id: "teachers",
    title: "Teachers",
    icon: <i className="la la-user" />,
    navLink: "/teachers",
    accessToAdmin: true,
  },
  {
    id: "students",
    title: "Students",
    icon: <i className="las la-user-friends" />,
    navLink: "/students",
    accessToAdmin: true,
    children: [
      {
        id: "active",
        title: "Active",
        icon: <Circle size={12} />,
        navLink: "/students",
        accessToAdmin: true,
      },
      {
        id: "new-student-or-waiting-for-teacher",
        title: "New / Waiting for teacher",
        icon: <Circle size={12} />,
        navLink: "/students/new-or-waiting-for-teacher",
        accessToAdmin: true,
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    icon: <i className="las la-chart-line" />,
    navLink: "/payments",
    accessToAdmin: true,
  },
  {
    id: "ebooks",
    title: "E-books",
    icon: <i className="las la-book" />,
    navLink: "/ebooks",
    accessToAdmin: true,
  },
  {
    id: "customer-service",
    title: "Customer Service",
    icon: <i className="las la-thumbs-up" />,
    navLink: "https://support.noName.ro/scp/login.php",
    newTab: true,
    externalLink: true,
    accessToAdmin: true,
  },
  {
    id: "cms",
    title: "CMS",
    icon: <i className="las la-columns" />,
    navLink: "https://cms.noName.ro/admin",
    newTab: true,
    externalLink: true,
    accessToAdmin: true,
  },
  {
    id: "Profile",
    title: "Profile",
    icon: <i className="la la-user" />,
    navLink: "/profile",
    accessToAdmin: true,
  },
];
