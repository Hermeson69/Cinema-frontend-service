const REQUEST_TIMEOUT = 20000;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  retry?: boolean;
  disableAutoRefresh?: boolean;
}

/**
 * Função base responsável por todas as requisições HTTP.
 * Centraliza:
 * - Headers
 * - Timeout
 * - Refresh de token
 * - Tratamento de erro
 * - Parsing seguro da resposta
 */
async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    signal,
    retry = true,
    disableAutoRefresh = false,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const combinedSignal = signal ?? controller.signal;

  try {
    // FormData é detectado automaticamente pelo fetch
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Só adiciona Content-Type se NÃO for FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    let response = await fetch(url, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      signal: combinedSignal,
    });

    // /**
    //  * Se receber 401 tenta refresh do token (exceto se desabilitado)
    //  */
    // if (response.status === 401 && token && retry && !disableAutoRefresh) {
    //   const { refreshAccessToken, useAuthStore } =
    //     await import("@/features/auth/store/auth.store");

    //   try {
    //     await refreshAccessToken();
    //   } catch {
    //     throw new Error("Session expired");
    //   }

    //   const newToken = useAuthStore.getState().accessToken;

    //   if (!newToken) {
    //     throw new Error("Session expired");
    //   }

    //   return request<T>(url, {
    //     ...options,
    //     token: newToken,
    //     retry: false,
    //   });
    // }

    /**
     * Tratamento de erro HTTP
     */
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;

      try {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const errorData = await response.json();

          // Tenta extrair a mensagem em diferentes formatos
          if (typeof errorData === "object" && errorData !== null) {
            errorMessage =
              errorData.message ||
              errorData.detail ||
              errorData.error?.message ||
              errorData.error?.detail ||
              (typeof errorData.error === "string"
                ? errorData.error
                : undefined) ||
              errorMessage;
          }
        } else {
          // Tenta como texto
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
      } catch (parseError) {
        // mantém mensagem padrão
      }

      throw new Error(errorMessage);
    }

    /**
     * No Content
     */
    if (response.status === 204) {
      return {} as T;
    }

    /**
     * Parsing seguro da resposta
     */
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET
 */
export function getRequest<T>(url: string, token?: string): Promise<T> {
  return request<T>(url, {
    method: "GET",
    token,
  });
}

/**
 * POST
 */
export function postRequest<T>(
  url: string,
  body?: unknown,
  token?: string,
  disableAutoRefresh?: boolean,
): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body,
    token,
    disableAutoRefresh,
  });
}

/**
 * PUT
 */
export function putRequest<T>(
  url: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body,
    token,
  });
}

/**
 * PATCH
 */
export function patchRequest<T>(
  url: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  return request<T>(url, {
    method: "PATCH",
    body,
    token,
  });
}

/**
 * DELETE
 */
export function deleteRequest<T>(url: string, token?: string): Promise<T> {
  return request<T>(url, {
    method: "DELETE",
    token,
  });
}