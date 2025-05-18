import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./router/router";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState({ isAuthorized: false, role: null });
  const [loading, setLoading] = useState(true); // NEW: loading flag

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/check", { withCredentials: true });

        const roles = res.data.role;
        const storedRole = localStorage.getItem("selectedRole");

        if (Array.isArray(roles)) {
          if (storedRole && roles.includes(storedRole)) {
            setUser({ isAuthorized: true, role: storedRole });
          } else {
            setUser({ isAuthorized: true, role: null }); // no selected role
          }
        } else {
          setUser({ isAuthorized: true, role: roles });
        }
      } catch (err) {
        setUser({ isAuthorized: false, role: null });
      } finally {
        setLoading(false); // Mark finished loading
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center text-xl">Loading...</div>; // Or a fancy spinner component
  }

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}

export default App;