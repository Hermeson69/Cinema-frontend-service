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

// ── Tipos ────────────────────────────────────────────────────────────────────
interface Seat {
  id: string;
  status: "Disponível" | "Ocupado";
  category: "Normal" | "VIP";
  reservadoPor: string | null; // id do usuário que reservou
}

// ── Helpers de cor ────────────────────────────────────────────────────────────
function seatColor(seat: Seat) {
  if (seat.status === "Ocupado") return "bg-[#7f8c8d] cursor-not-allowed";
  if (seat.category === "VIP") return "bg-[#f1c40f] hover:opacity-85 cursor-pointer";
  return "bg-[#2ecc71] hover:opacity-85 cursor-pointer";
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ReservasView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailUsuario = searchParams.get("email") || "Usuário";
  const idUsuario = searchParams.get("id") || null;
  const iniciais = emailUsuario.slice(0, 2).toUpperCase();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Carrega assentos da API ────────────────────────────────────────────────
  async function fetchSeats() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assentos");
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: Seat[] = await res.json();
      setSeats(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar assentos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSeats();
  }, []);

  // ── Reservar ───────────────────────────────────────────────────────────────
  async function handleReserve() {
    if (!selectedSeat) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/assentos/${selectedSeat.id}/reservar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await fetchSeats();
      setSelectedSeat(null);
    } catch (err: any) {
      alert(err.message || "Erro ao reservar assento.");
    } finally {
      setActionLoading(false);
    }
  }

  // ── Cancelar ───────────────────────────────────────────────────────────────
  async function handleCancel() {
    if (!selectedSeat) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/assentos/${selectedSeat.id}/cancelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await fetchSeats();
      setSelectedSeat(null);
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar reserva.");
    } finally {
      setActionLoading(false);
    }
  }

  function logout() {
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
        <img src="/src/assets/logocine.png" alt="Logo" className="h-[150px]" />

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

            {/* Estados de carregamento / erro */}
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
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.status === "Ocupado"}
                    onClick={() => setSelectedSeat(seat)}
                    className={`w-12 h-12 rounded-lg text-white font-bold text-xs flex items-center justify-center transition-opacity ${seatColor(seat)}`}
                  >
                    {seat.id}
                  </button>
                ))}
              </div>
            )}

            {/* Legenda */}
            <div className="flex justify-center gap-4">
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#2ecc71]">
                Normal
              </span>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-md bg-[#f1c40f]">
                VIP
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
        onOpenChange={(open) => !open && setSelectedSeat(null)}
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
                  <strong>Assento:</strong> {selectedSeat.id}
                </p>
                <p>
                  <strong>Categoria:</strong> {selectedSeat.category}
                </p>
                <p>
                  <strong>Status:</strong> {selectedSeat.status}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {selectedSeat.status === "Disponível" && (
                  <Button
                    className="bg-[#27ae60] hover:bg-[#1e8449] text-white"
                    onClick={handleReserve}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Reservando..." : "Confirmar Reserva"}
                  </Button>
                )}

                {selectedSeat.status === "Ocupado" &&
                  selectedSeat.reservadoPor === idUsuario && (
                    <Button
                      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
                      onClick={handleCancel}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Cancelando..." : "Cancelar Reserva"}
                    </Button>
                  )}

                {selectedSeat.status === "Ocupado" &&
                  selectedSeat.reservadoPor !== idUsuario && (
                    <p className="text-sm text-muted-foreground text-center">
                      Este assento foi reservado por outro usuário.
                    </p>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}