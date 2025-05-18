import { Navigate } from "react-router-dom";
import Roles from "./Roles";
const ProtectedRoutes = ({ user, children }) => {
  if (user.isAuthorized && !Roles.includes(user.role)) {
    return <Navigate to="/auth/role" />;
  }
  if(!user.isAuthorized){
    return <Navigate to="/"/>
  }
  return children
};

export default ProtectedRoutes;
