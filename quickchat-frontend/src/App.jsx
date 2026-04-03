import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* THIS IS IMPORTANT */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;