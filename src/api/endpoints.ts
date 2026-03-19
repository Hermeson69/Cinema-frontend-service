

const API_URL = import.meta.env.VITE_BACKEND_URL 

if (!API_URL) {
  throw new Error("Variável de ambiente API_CONFIG não configurada");
}

export const AUTH_ENDPOINTS = {
  REGISTER: `${API_URL}/api/auth/register/`,
  LOGIN: `${API_URL}/api/auth/login/`,
};

// export const CLIENTS_ENDPOINTS = {
//   GET_ALL: `${API_URL}/api/clients/`,
//   GET_PROFILE: `${API_URL}/api/clients/profile/`,
//   UPDATE: `${API_URL}/api/clients/`,
//   DELETE: `${API_URL}/api/clients/`,
// };

export const SEATS_ENDPOINTS = {
  GET_ALL: `${API_URL}/api/seats/`,
  CREATE: `${API_URL}/api/seats/`,
  UPDATE: (publicId: string) => `${API_URL}/api/seats/${publicId}`,
  DELETE: `${API_URL}/api/seats/`,
};

export default API_URL;
