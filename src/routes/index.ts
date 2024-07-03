import { lazy } from "react";
import { redirect, redirectDocument, useNavigate, Link } from "react-router-dom";
import Layout from "../pages/layout";
import { getToken } from "../utils/cookie";
import Login from "../pages/login";

const Home = lazy(() => import("../pages/home"))
const TeamPool = lazy(() => import('../pages/TeamPool'))
const TraceRecord = lazy(() => import('../pages/TraceRecord'))
const Contact = lazy(() => import('../pages/Contact'))
const Brand = lazy(() => import('../pages/brand'))

export const router: Application.AppRoute[] =
  [
    {
      path: "/",
      element: Layout,
      children: [
        {
          path: "home",
          element: Home,
          index: true,
        },
        {
          path: "home",
          element: Home,
        },
        {
          path: "teamPool/:type",
          element: TeamPool,
          isAuth: true,
        },
        {
          path: "traceRecord",
          element: TraceRecord,
          isAuth: true,
        },
        {
          path: "contact",
          element: Contact,
          isAuth: true,
        },
        {
          path: "brand",
          element: Brand,
          isAuth: true,
        },
      ],
    },
    {
      path: '/ddlogin',
      element: Login,
    },
  ]
