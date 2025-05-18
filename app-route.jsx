import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./protectedRoutes";
import webBlogRoutes from "./self-routes/webblogRoutes";
import Roles from "./Roles";
const AppRouter = ({ user }) => {
  return (
    <>
      <Routes>
        {user.isAuthorized && !Roles.includes(user.role) && (
          <Route path="auth/role" element={<div>select role page</div>}></Route>
        )}
        <Route path="auth/role"></Route>
        <Route
          path="/"
          element={
            user.isAuthorized ? (
              <ProtectedRoutes user={user}>
                {user.role === "admin" ? (
                  <div>admin</div>
                ) : user.role === "user" ? (
                  <div>user</div>
                ) : null}
              </ProtectedRoutes>
            ) : (
              <div>webblog</div>
            )
          }
        >
          {!user.isAuthorized &&
            webBlogRoutes.map((e, i) => (
              <Route key={i} path={e.path} element={e.element} />
            ))}
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
