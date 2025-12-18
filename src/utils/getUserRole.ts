import roles from "@/data/roles.json";

export function getUserRole(email?: string | null) {
  if (!email) return roles.aluno;

  for (const role of Object.values(roles)) {
    if (role.emails.includes(email)) {
      return role;
    }
  }

  return roles.aluno;
}
