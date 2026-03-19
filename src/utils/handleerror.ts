/**
 * Extrai mensagem amigável de diferentes tipos de erro
 */
function extractFriendlyMessage(error: unknown): string {
  if (error instanceof Error) {
    try {

      const parsed = JSON.parse(error.message);
      if (parsed?.message) return parsed.message;
      if (parsed?.error?.message) return parsed.error.message;
      if (parsed?.detail) return parsed.detail;
      if (parsed?.error?.detail) return parsed.error.detail;

      return error.message;
    } catch {
      return error.message;
    }
  }

  // Se for objeto com propriedade message
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as Record<string, unknown>).message;
    return typeof msg === "string" ? msg : String(msg);
  }

  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error);
      if (parsed?.message) return parsed.message;
      if (parsed?.error?.message) return parsed.error.message;
      return error;
    } catch {
      return error;
    }
  }

  return "Erro desconhecido";
}

export default function handleError(error: unknown, prefix: string): never {
  const friendlyMessage = extractFriendlyMessage(error);
  throw new Error(`${prefix}: ${friendlyMessage}`);
}