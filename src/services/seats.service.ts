// src/services/seat.service.ts

import { getRequest } from "@/utils/requests";
import { SEATS_ENDPOINTS } from "@/api/endpoints";
import handleError from "@/utils/handleerror";
import type { SeatResponse, UpdateSeatData } from "@/types/Seat.types";

// PUT precisa de header customizado, então chamamos fetch diretamente aqui
async function putWithClientId(
  url: string,
  body: UpdateSeatData,
  token?: string,
  clientId?: string,
): Promise<SeatResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token    && { Authorization: `Bearer ${token}` }),
    ...(clientId && { "x-client-id": clientId }),
  };

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        if (typeof errorData === "object" && errorData !== null) {
          errorMessage =
            errorData.message ||
            errorData.detail ||
            errorData.error?.message ||
            errorMessage;
        }
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }
    } catch {
      // mantém mensagem padrão
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<SeatResponse>;
}

export const SeatService = {
  /**
   * GET /api/seats/
   * Lista todos os assentos da sala
   */
  list: async (token?: string): Promise<SeatResponse[]> => {
    try {
      return await getRequest<SeatResponse[]>(SEATS_ENDPOINTS.GET_ALL, token);
    } catch (error) {
      return handleError(error, "Erro ao carregar assentos");
    }
  },

  /**
   * PUT /api/seats/{publicId}
   * Reserva um assento atrelando o clientId via header x-client-id
   * e marcando o status como "reserved"
   */
  reserve: async (
    publicId: string,
    clientId: string,
    token?: string,
  ): Promise<SeatResponse> => {
    try {
      return await putWithClientId(
        SEATS_ENDPOINTS.UPDATE(publicId),
        { status: "reserved" },
        token,
        clientId,
      );
    } catch (error) {
      return handleError(error, "Erro ao reservar assento");
    }
  },

  /**
   * PUT /api/seats/{publicId}
   * Cancela a reserva removendo o clientId e voltando para "available"
   * Não passa x-client-id para desatrelar o cliente
   */
  cancel: async (
    publicId: string,
    token?: string,
  ): Promise<SeatResponse> => {
    try {
      return await putWithClientId(
        SEATS_ENDPOINTS.UPDATE(publicId),
        { status: "available" },
        token,
        undefined, // sem x-client-id para desatrelar
      );
    } catch (error) {
      return handleError(error, "Erro ao cancelar reserva");
    }
  },

  /**
   * PUT /api/seats/{publicId}
   * Atualiza qualquer campo do assento (uso administrativo)
   */
  update: async (
    publicId: string,
    data: UpdateSeatData,
    token?: string,
    clientId?: string,
  ): Promise<SeatResponse> => {
    try {
      return await putWithClientId(
        SEATS_ENDPOINTS.UPDATE(publicId),
        data,
        token,
        clientId,
      );
    } catch (error) {
      return handleError(error, "Erro ao atualizar assento");
    }
  },
};