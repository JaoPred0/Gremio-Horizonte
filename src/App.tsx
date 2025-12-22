import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import ProtectedRoute from "@/routes/ProtectedRoute";

import AppLayout from "@/layout/AppLayout";

import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import { Home } from "@/pages/Home";
import ForgotPassword from "@/pages/ForgotPassword";
import { Perfil } from "@/pages/Perfil";
import { Config } from "@/pages/Config";
import Aparencia from "@/pages/Aparencia";
import NotPage from "@/pages/NotPage";
import Build from "@/pages/Build";
import ChangePassword from "@/pages/ChangePassword";
import Apps from "@/pages/Apps";
import {XHorizonte} from "@/apps/XHorizonte";
import { Jogos } from "@/apps/Jogos";
import { Vestibular } from "@/pages/Vestibular";

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
          <Route path="/home" element={<AppLayout> <Home /> </AppLayout>} />
          {/* ===== Area da config ===== */}
          <Route path="/config" element={<AppLayout> <Config /> </AppLayout>} />
          <Route path="/config/perfil" element={<AppLayout> <Perfil /> </AppLayout>} />
          <Route path="/config/aparencia" element={<AppLayout> <Aparencia /> </AppLayout>} />
          <Route path="/config/mudar-senha" element={<AppLayout> <ChangePassword /> </AppLayout>} />

          {/* ===== Área de Aplicativos */}
          <Route path="/apps" element={<AppLayout> <Apps /> </AppLayout>} />
          <Route path="/apps/xhorizonte" element={<AppLayout> <XHorizonte /> </AppLayout>} />
          <Route path="/apps/jogos" element={<AppLayout> <Jogos /> </AppLayout>} />


          {/* Vestibular */}
          <Route path="/pre-vestibular" element={<AppLayout> <Vestibular /> </AppLayout>} />


          <Route path="/build" element={<AppLayout> <Build /> </AppLayout>} />
          <Route path="*" element={<AppLayout> <NotPage /> </AppLayout>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
