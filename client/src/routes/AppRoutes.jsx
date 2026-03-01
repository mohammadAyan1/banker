// src/routes/AppRoutes.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedLayout from "./ProtectedLayout ";
import { routesConfig } from "./routesConfig";
import ValuationForm from "../components/BankForm/ValuationForm";

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className='p-4 text-center'>Loading...</div>}>
      <Routes>
        {/* Public route */}
        <Route path='/login' element={<Login />} />
        <Route path='/BANKfORM' element={<ValuationForm />} />

        {/* Protected layout */}
        <Route element={<ProtectedLayout />}>
          {routesConfig.map(({ path, element: Element }, index) => (
            <Route key={index} path={path} element={<Element />} />
          ))}
        </Route>

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
