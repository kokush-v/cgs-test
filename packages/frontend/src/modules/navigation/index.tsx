import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import HomePageContainer from '../pages/home';
import { APP_KEYS } from '../common/consts';
import AuthPageContainer from '../pages/auth/main';
import ResetPassPageContainer from '../pages/auth/reset-password';
import ReqResetPassPageContainer from '../pages/auth/req-reset-password';
import { ProtectedRoutes } from './protected-routes';
import { ROUTER_KEYS } from '../common/consts/app-keys.const';

export const MainRouter = () => (
  <Routes>
    <Route element={<ProtectedRoutes />}>
      <Route element={<HomePageContainer />} path={APP_KEYS.ROUTER_KEYS.HOME} />
    </Route>
    <Route
      element={<ReqResetPassPageContainer />}
      path={APP_KEYS.ROUTER_KEYS.AUTH.REQ_RESET_PASSWORD}
    />
    <Route element={<ResetPassPageContainer />} path={APP_KEYS.ROUTER_KEYS.AUTH.RESET_PASSWORD} />
    <Route path={APP_KEYS.ROUTER_KEYS.AUTH.ROOT}>
      <Route
        element={<AuthPageContainer formikAuthFormProps={{ type: 'login' }} />}
        path={APP_KEYS.ROUTER_KEYS.AUTH.LOGIN}
      />
      <Route
        element={<AuthPageContainer formikAuthFormProps={{ type: 'register' }} />}
        path={APP_KEYS.ROUTER_KEYS.AUTH.SIGN_UP}
      />
    </Route>
    <Route path="*" element={<Navigate to={ROUTER_KEYS.HOME} />} />
  </Routes>
);
