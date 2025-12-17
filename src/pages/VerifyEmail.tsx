import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkVerification() {
    const user = auth.currentUser;

    if (!user) {
      setError("Faça login novamente para continuar.");
      return;
    }

    try {
      setChecking(true);
      await user.reload();

      if (user.emailVerified) {
        navigate("/login", { replace: true });
      } else {
        setError("Email ainda não verificado.");
      }
    } catch {
      setError("Erro ao verificar email.");
    } finally {
      setChecking(false);
    }
  }

  async function resend() {
    const user = auth.currentUser;

    if (!user) {
      setError("Faça login novamente para reenviar.");
      return;
    }

    try {
      await sendEmailVerification(user);
      alert("Email reenviado");
    } catch {
      setError("Erro ao reenviar email.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary">
          Verifique seu email
        </h1>

        <p>
          Enviamos um link para seu email institucional.
          Clique nele para ativar sua conta.
        </p>

        {error && (
          <div className="alert alert-warning text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={checkVerification}
            className="btn btn-primary w-full"
            disabled={checking}
          >
            {checking ? "Verificando..." : "Já verifiquei"}
          </button>

          <button
            onClick={resend}
            className="btn btn-outline w-full"
          >
            Reenviar email
          </button>
        </div>
      </div>
    </div>
  );
}
