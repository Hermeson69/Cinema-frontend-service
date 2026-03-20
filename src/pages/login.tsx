// src/views/LoginView.tsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use.auth";

export default function LoginView() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login({
        email: form.email,
        password: form.senha,
      });

      navigate(
        `/reservas?email=${encodeURIComponent(data.client.email)}&id=${data.client.publicId}`,
      );
    } catch {
      // erro já capturado e exposto pelo hook via `error`
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #141e30, #243b55)" }}
    >
      {/* Logo no canto */}
      <div className="absolute top-5 left-8">
        <img src="src/assets/logocine.png" alt="Logo" className="h-40 w-40" />
      </div>

      <div className="w-full max-w-sm space-y-10">
        {/* Cabeçalho */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Entrar na sua conta
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Visualize, reserve ou cancele cadeiras na sala Distributed Systems —
            UFPI Campus Senador Helvidio Nunes de Barros.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
              autoComplete="email"
              className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#ff4b2b]/60"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha" className="text-white/80">
                Senha
              </Label>
            </div>

            <div className="relative">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#ff4b2b]/60 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/40" />
                ) : (
                  <Eye className="h-5 w-5 text-white/40" />
                )}
              </Button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="text-center text-sm text-red-400 bg-red-500/10 rounded-xl p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#ff4b2b] hover:bg-[#ff2a00] text-white text-base font-medium transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          {/* Link cadastro */}
          <p className="text-center text-sm text-white/50">
            Ainda não possui conta?{" "}
            <Link
              to="/sigup"
              className="text-[#ff4b2b] hover:text-[#ff2a00] font-medium underline underline-offset-4 hover:no-underline transition-colors"
            >
              Criar conta gratuita
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}