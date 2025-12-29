import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserDoc } from "@/lib/ensureUserDoc";

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
import { XHorizonte } from "@/apps/XHorizonte";
import { Jogos } from "@/apps/Jogos";
import { Estudos } from "@/pages/Estudos";
import { Notificacao } from "@/pages/Notificacao";
import { Rank } from "@/components/estudos/pages/if/Rank";
import { Streak } from "./components/estudos/pages/if/Streak";
import Conquistas from "./components/estudos/pages/if/Conquistas";
import { HorarioTurma } from "./components/estudos/pages/if/HorarioTurma";
import { CalendarioAcademico } from "@/components/estudos/pages/if/CalendarioAcademico";
import Materias from "@/components/estudos/pages/vestpro/Materias";
import Portugues from "@/components/estudos/pages/vestpro/conteudos/Portugues";
import Matematica from "@/components/estudos/pages/vestpro/conteudos/Matematica";
import Fisica from "@/components/estudos/pages/vestpro/conteudos/Biologia";
import Quimica from "@/components/estudos/pages/vestpro/conteudos/Quimica";
import Biologia from "@/components/estudos/pages/vestpro/conteudos/Biologia";
import Historia from "@/components/estudos/pages/vestpro/conteudos/Historia";
import Geografia from "@/components/estudos/pages/vestpro/conteudos/Geografia";
import Filosofia from "@/components/estudos/pages/vestpro/conteudos/Filosofia";
import Sociologia from "@/components/estudos/pages/vestpro/conteudos/Sociologia";
import Simulados from "@/components/estudos/pages/vestpro/Simulados";
import SimuladoProva from "./components/estudos/pages/vestpro/SimuladoProva";
import SimuladoConclusao from "./components/estudos/pages/vestpro/SimuladoConclusao";
import SimuladoHistorico from "./components/estudos/pages/vestpro/SimuladoHistorico";
import Simulado from "@/components/estudos/pages/vestpro/Simulados";

export default function App() {

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserDoc(user);
      }
    });

    return () => unsub();
  }, []);

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


          {/* ===== Vestibular ===== */}
          <Route path="/estudos" element={<AppLayout> <Estudos /> </AppLayout>} />
          <Route path="/estudos/streak" element={<AppLayout> <Streak /> </AppLayout>} />
          <Route path="/estudos/conquistas" element={<AppLayout> <Conquistas /> </AppLayout>} />
          <Route path="/estudos/rank" element={<AppLayout> <Rank /> </AppLayout>} />
          <Route path="/estudos/if/horarios-da-turma" element={<AppLayout> <HorarioTurma /> </AppLayout>} />
          <Route path="/estudos/if/calendario-academico" element={<AppLayout> <CalendarioAcademico /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias" element={<AppLayout> <Materias /> </AppLayout>} />
          <Route path="/estudos/vestpro/simulados" element={<AppLayout> <Simulados /> </AppLayout>} />
          {/* ===== Materia Page ===== */}
          <Route path="/estudos/vestpro/materias/portugues" element={<AppLayout> <Portugues /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/matematica" element={<AppLayout> <Matematica /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/fisica" element={<AppLayout> <Fisica /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/quimica" element={<AppLayout> <Quimica /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/biologia" element={<AppLayout> <Biologia /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/historia" element={<AppLayout> <Historia /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/geografia" element={<AppLayout> <Geografia /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/filosofia" element={<AppLayout> <Filosofia /> </AppLayout>} />
          <Route path="/estudos/vestpro/materias/sociologia" element={<AppLayout> <Sociologia /> </AppLayout>} />
          <Route path="/simulado" element={<AppLayout> <Simulado /> </AppLayout>} />
          <Route path="/simulado/prova" element={<AppLayout><SimuladoProva /></AppLayout>} />
          <Route path="/simulado/conclusao" element={<AppLayout> <SimuladoConclusao /> </AppLayout>} />
          <Route path="/simulado/historico" element={<AppLayout> <SimuladoHistorico /> </AppLayout>} />
          {/* ===== Notificação ===== */}
          <Route path="/notifications" element={<AppLayout> <Notificacao /> </AppLayout>} />


          <Route path="/build" element={<AppLayout> <Build /> </AppLayout>} />
          <Route path="*" element={<AppLayout> <NotPage /> </AppLayout>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
