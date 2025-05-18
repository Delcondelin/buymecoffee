import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/app-route";
import "./App.css";

function App() {
  const user = { isAuthorized: false , role: "admin" };

  //get authentication
  return (
    <>
      <Router>
        <AppRouter user={user} />
      </Router>
    </>
  );
}

export default App;
