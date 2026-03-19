// src/services/auth.service.ts

import { postRequest } from "@/utils/requests";
import { AUTH_ENDPOINTS } from "@/api/endpoints";
import handleError from "@/utils/handleerror";
import type {
  LoginData,
  ClientCreate,
  AuthResponse,
  ClientResponse,
} from "@/types/auth.types";

export const AuthService = {
  /**
   * POST /api/auth/login/
   * Autentica o usuário e retorna token + dados do cliente
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      return await postRequest<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN,
        data,
        undefined,
        true,
      );
    } catch (error) {
      return handleError(error, "Erro ao fazer login");
    }
  },

  /**
   * POST /api/auth/register/
   * Cria um novo usuário e retorna os dados do cliente criado
   */
  register: async (data: ClientCreate): Promise<ClientResponse> => {
    try {
      return await postRequest<ClientResponse>(
        AUTH_ENDPOINTS.REGISTER,
        data,
        undefined,
        true,
      );
    } catch (error) {
      return handleError(error, "Erro ao cadastrar usuário");
    }
  },
};