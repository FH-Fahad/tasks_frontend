import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthContext } from "./hooks/useAuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useAuthContext();

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={user ? <Home /> : <NotLoggedIn />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
      </div>
    </>
  );
}

function NotLoggedIn() {
  return (
    <div className="notLoggedIn">
      <h1>Login to view your tasks.</h1>
    </div>
  );
}

export default App;
