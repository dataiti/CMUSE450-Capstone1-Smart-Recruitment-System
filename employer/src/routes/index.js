import { Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "../layouts";
import {
  CompanyProfilePage,
  CreateRecruitmentJobPage,
  DashboardPage,
  ListJobsPage,
  LoginPage,
  MessagePage,
  RegisterEmployerPage,
  RegisterPage,
  UserProfilePage,
} from "../pages";
import ProtectedRoutes from "../components/ProtectedRoutes";

const routers = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        index: true,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/register-employer",
        element: <RegisterEmployerPage />,
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            element: <Navigate to="/dashboard" replace />,
            index: true,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/list-jobs",
            element: <ListJobsPage />,
          },
          {
            path: "/create-recruitment-job",
            element: <CreateRecruitmentJobPage />,
          },
          {
            path: "/message",
            element: <MessagePage />,
          },
          {
            path: "/company-profile",
            element: <CompanyProfilePage />,
          },
          {
            path: "/user-profile",
            element: <UserProfilePage />,
          },
        ],
      },
    ],
  },
];

export default routers;
