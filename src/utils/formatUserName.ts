const CUSTOM_EMAIL_NAMES: Record<string, string> = {
  [import.meta.env.VITE_ROLES_DIRETOR_COMUNICACAO_IMPRENSA]: "Lyan",
};

export function formatUserName(email?: string): string {
  if (!email) return "Usuário";

  const clean = email.split("@")[0].replace(/[0-9]/g, "").split(".");

  return clean
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatUserNameLines(email?: string): string[] {
  if (!email) return ["Usuário"];

  return email
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
}
export function formatUserNameWithCustom(input?: string): string {
  if (!input) return "Usuário";

  // Se não for email, retorna como está (proteção)
  if (!input.includes("@")) return input;

  const email = input.toLowerCase();

  const customName = CUSTOM_EMAIL_NAMES[email];
  if (customName) return customName;

  return formatUserName(email);
}

export function formatUserNameLinesWithCustom(input?: string): string[] {
  if (!input) return ["Usuário"];

  if (!input.includes("@")) return [input];

  const email = input.toLowerCase();

  const customName = CUSTOM_EMAIL_NAMES[email];
  if (customName) return [customName];

  return formatUserNameLines(email);
}
