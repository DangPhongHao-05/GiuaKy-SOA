import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import {RegisterPage} from "../features/auth/pages/RegisterPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <div className="p-10 text-2xl font-bold text-center">
        Trang quản lý đồ án (Sau khi đăng nhập thành công)
      </div>
    ),
  },
  {
    path: "*",
    element: (
      <div style={{ textAlign: "center", padding: "50px" }}>
        404 - Không tìm thấy trang
      </div>
    ),
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
