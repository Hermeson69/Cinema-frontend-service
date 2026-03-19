import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginView() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      });

      if (res.status === 401) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Erro ${res.status}`);
      }

      const data = await res.json();
      navigate(`/reservas?email=${encodeURIComponent(form.email)}&id=${data.id}`);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #141e30, #243b55)" }}
    >
      {/* Logo no canto */}
      <div className="absolute top-5 left-8">
        <img src="src/assets/logocine.png" alt="Logo" className="h-20 w-20" />
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
              <Link
                to="#"
                className="text-sm text-[#ff4b2b] hover:text-[#ff2a00] underline underline-offset-4 hover:no-underline transition-colors"
              >
                Esqueceu a senha?
              </Link>
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