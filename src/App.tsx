import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import ProtectedRoute from "@/routes/ProtectedRoute";

import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import { Home } from "@/pages/Home";
import ForgotPassword from "@/pages/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Splash inicial */}
        <Route path="/" element={<SplashScreen />} />

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verificar-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
