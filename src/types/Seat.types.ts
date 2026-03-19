// ── Seat ─────────────────────────────────────────────────────────────────────

export type SeatStatus = "available" | "reserved" | "occupied";

export interface CreateSeatData {
  seat_number: string;
  row: string;
  number: number;
  category: string;
  status: SeatStatus;
}

export interface UpdateSeatData {
  seat_number?: string;
  row?: string;
  number?: number;
  category?: string;
  status?: SeatStatus;
}

export interface SeatResponse {
  publicId: string;
  clientId?: string | null;
  seat_number: string;
  row: string;
  number: number;
  category: string;
  status: SeatStatus;
  createdAt: string;
  updatedAt: string;
}