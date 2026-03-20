// src/views/ReservasView.tsx

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"; 
import { useSeats } from "@/hooks/use.seats"; 
import { useAuth } from "@/hooks/use.auth"; 
import type { SeatResponse } from "@/types/Seat.types"; 

// ── Helpers de cor ────────────────────────────────────────────────────────────    
function seatColor(seat: SeatResponse, idUsuario: string) {
  if (seat.status !== "available") {
    // assento do próprio usuário → vermelho clicável
    if (seat.clientId === idUsuario)
      return "bg-[#e74c3c] hover:opacity-85 cursor-pointer";
    // assento de outro → cinza bloqueado
    return "bg-[#7f8c8d] cursor-not-allowed opacity-70";
  }
  if (seat.category.toLowerCase() === "vip")
    return "bg-[#f1c40f] hover:opacity-85 cursor-pointer";
  return "bg-[#2ecc71] hover:opacity-85 cursor-pointer";
}

// ── Componente principal ──────────────────────────────────────────────────────    
export default function ReservasView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailUsuario = searchParams.get("email") || "Usuário";    
  const idUsuario    = searchParams.get("id") || "";       
  const iniciais     = emailUsuario.slice(0, 2).toUpperCase();   

  const { token, logout: authLogout } = useAuth();    
  const { seats, loading, error, fetchSeats, reserve, cancel } = useSeats(token ?? undefined);    

  const [selectedSeat, setSelectedSeat]   = useState<SeatResponse | null>(null);    
  const [actionLoading, setActionLoading] = useState(false);     
  const [actionError, setActionError]     = useState<string | null>(null);    

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // ── Abre modal apenas para assentos clicáveis ─────────────────────────────               
  function handleSeatClick(seat: SeatResponse) {
    // bloqueado: ocupado por outro usuário
    if (seat.status !== "available" && seat.clientId !== idUsuario) return;
    setActionError(null);
    setSelectedSeat(seat);
  }

  // ── Reservar ───────────────────────────────────────────────────────────────          
  async function handleReserve() {
    if (!selectedSeat) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await reserve(selectedSeat.publicId, idUsuario);
      setSelectedSeat(null);
    } catch (err: any) {
      setActionError(err?.message || "Erro ao reservar assento.");
    } finally {
      setActionLoading(false);
    }
  }

  // ── Cancelar ───────────────────────────────────────────────────────────────
  async function handleCancel() {
    if (!selectedSeat) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await cancel(selectedSeat.publicId);
      setSelectedSeat(null);
    } catch (err: any) {
      setActionError(err?.message || "Erro ao cancelar reserva.");
    } finally {
      setActionLoading(false);
    }
  }

  function logout() {
    authLogout();
    navigate("/");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #141e30, #243b55)" }}
    >
      {/* Header */}
      <header className="relative flex justify-center p-6">
        <img src="src/assets/logocine.png" alt="Logo" className="h-40 w-40" />

        <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
          <div
            title={emailUsuario}
            className="w-11 h-11 rounded-full bg-[#ff4b2b] text-white font-bold text-sm flex items-center justify-center shadow-md"
          >
            {iniciais}
          </div>
          <span className="text-[11px] text-white/80 max-w-[90px] text-center break-all">
            {emailUsuario}
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <p className="mb-6 max-w-md text-center text-sm text-white/70">
          Selecione um assento para reservar ou cancelar sua reserva na sala
          Distributed Systems — UFPI Campus Senador Helvidio Nunes de Barros.
        </p>

        <Card className="w-full max-w-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">Mapa de Assentos</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <Separator />

            {loading && (
              <p className="text-center text-sm text-muted-foreground">
                Carregando assentos... 
              </p>
            )}

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}

            {/* Grid de assentos */}
            {!loading && !error && (
              <div className="grid grid-cols-5 gap-3 justify-items-center">
                {seats.map((seat) => {
                  const isOwnReservation = seat.status !== "available" && seat.clientId === idUsuario;
                  const isBlocked        = seat.status !== "available" && seat.clientId !== idUsuario;

                  return (
                    <button
                      key={seat.publicId}
                      disabled={isBlocked}
                      onClick={() => handleSeatClick(seat)}
                      title={isOwnReservation ? "Sua reserva — clique para cancelar" : undefined}
                      className={`w-12 h-12 rounded-lg text-white font-bold text-xs flex items-center justify-center transition-opacity ${seatColor(seat, idUsuario)}`}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Legenda */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#2ecc71]">
                Normal
              </span>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#f1c40f]">
                VIP
              </span>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#e74c3c]">
                Sua reserva
              </span>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#7f8c8d]">
                Ocupado
              </span>
            </div>

            <Separator />

            <Button
              className="w-full bg-[#ff4b2b] hover:bg-[#ff2a00] text-white"
              onClick={logout}
            >
              Sair
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Modal de detalhes do assento */}
      <Dialog
        open={!!selectedSeat}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSeat(null);
            setActionError(null);
          }
        }}
      >
        <DialogContent className="w-[300px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>

          <Separator />

          {selectedSeat && (
            <div className="flex flex-col gap-4">
              <div className="text-sm flex flex-col gap-1">
                <p>
                  <strong>Assento:</strong> {selectedSeat.seat_number}
                </p>
                <p>
                  <strong>Categoria:</strong> {selectedSeat.category}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedSeat.status === "available"
                    ? "Disponível"
                    : selectedSeat.clientId === idUsuario
                    ? "Reservado por você"
                    : "Ocupado"}
                </p>
              </div>

              {actionError && (
                <p className="text-sm text-red-500 text-center">{actionError}</p>
              )}

              <div className="flex flex-col gap-2">
                {/* Disponível → reservar */}
                {selectedSeat.status === "available" && (
                  <Button
                    className="bg-[#27ae60] hover:bg-[#1e8449] text-white"
                    onClick={handleReserve}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Reservando..." : "Confirmar Reserva"}
                  </Button>
                )}

                {/* Reservado pelo próprio usuário → cancelar */}
                {selectedSeat.status !== "available" &&
                  selectedSeat.clientId === idUsuario && (
                    <Button
                      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
                      onClick={handleCancel}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Cancelando..." : "Cancelar Reserva"}
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}