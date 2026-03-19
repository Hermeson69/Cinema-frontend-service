import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function CadastroView() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        }),
      });

      if (res.status === 409) {
        setError("Este e-mail já está cadastrado.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Erro ${res.status}`);
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar cadastro.");
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
            Criar sua conta
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Cadastre-se para reservar cadeiras na sala Distributed Systems —
            UFPI Campus Senador Helvidio Nunes de Barros.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-white/80">
              Nome
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={handleChange}
              required
              autoFocus
              autoComplete="name"
              className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#ff4b2b]/60"
            />
          </div>

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
              autoComplete="email"
              className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-[#ff4b2b]/60"
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="senha" className="text-white/80">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={form.senha}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
            {loading ? "Cadastrando..." : "Criar conta"}
          </Button>

          {/* Link login */}
          <p className="text-center text-sm text-white/50">
            Já possui uma conta?{" "}
            <Link
              to="/"
              className="text-[#ff4b2b] hover:text-[#ff2a00] font-medium underline underline-offset-4 hover:no-underline transition-colors"
            >
              Faça login
            </Link>
          </p>
        </form>

        {/* Rodapé legal
        <p className="text-center text-xs text-white/30 pt-2">
          Ao criar uma conta, você concorda com os{" "}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-white/60 transition-colors"
          >
            Termos de Serviço
          </Link>{" "}
          e a{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-white/60 transition-colors"
          >
            Política de Privacidade
          </Link>
          .
        </p> */}
      </div>
    </div>
  );
}