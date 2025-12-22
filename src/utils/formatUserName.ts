export function formatUserName(email?: string) {
  if (!email) return "Usuário";

  const clean = email
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .split(".");

  return clean
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}

export function formatUserNameLines(email?: string): string[] {
  if (!email) return ["Usuário"];

  return email
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .split(".")
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1)
    );
}
