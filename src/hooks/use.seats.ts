// src/hooks/useSeats.ts

import { useState, useCallback } from "react";
import { SeatService } from "@/services/seats.service";
import type { SeatResponse } from "@/types/Seat.types";

export function useSeats(token?: string) {
  const [seats, setSeats]   = useState<SeatResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // ── Listar ─────────────────────────────────────────────────────────────────
  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SeatService.list(token);
      setSeats(data);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar assentos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Reservar ───────────────────────────────────────────────────────────────
  const reserve = async (publicId: string, clientId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await SeatService.reserve(publicId, clientId, token);
      setSeats((prev) =>
        prev.map((s) => (s.publicId === updated.publicId ? updated : s)),
      );
    } catch (err: any) {
      const message = err?.message || "Erro ao reservar assento";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Cancelar ───────────────────────────────────────────────────────────────
  const cancel = async (publicId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await SeatService.cancel(publicId, token);
      setSeats((prev) =>
        prev.map((s) => (s.publicId === updated.publicId ? updated : s)),
      );
    } catch (err: any) {
      const message = err?.message || "Erro ao cancelar reserva";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    seats,
    loading,
    error,
    fetchSeats,
    reserve,
    cancel,
  };
}