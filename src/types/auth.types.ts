// ── Auth ─────────────────────────────────────────────────────────────────────

export interface ClientCreate {
  name: string;
  email: string;
  password: string;
}

export type LoginData = ClientCreate; // email + password
export type SignupData = ClientCreate; // mesmo shape que CreateClient

export interface ClientResponse {
  publicId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  client: ClientResponse;
}