// src/hooks/useAuth.ts

import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import type { LoginData, ClientCreate, AuthResponse, ClientResponse } from "@/types/auth.types";

// ── Estado compartilhado do usuário autenticado ───────────────────────────────
interface AuthState {
  token: string | null;
  client: ClientResponse | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem("token"),
    client: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (data: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data);

      localStorage.setItem("token", response.token);
      setState({ token: response.token, client: response.client });

      return response;
    } catch (err: any) {
      const message = err?.message || "Erro ao fazer login";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async (data: ClientCreate): Promise<ClientResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      return response;
    } catch (err: any) {
      const message = err?.message || "Erro ao cadastrar usuário";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    setState({ token: null, client: null });
  };

  return {
    token:    state.token,
    client:   state.client,
    isAuthenticated: !!state.token,
    loading,
    error,
    login,
    register,
    logout,
  };
}