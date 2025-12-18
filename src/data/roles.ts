import rawRoles from "./roles.json";

function envToEmails(key: string): string[] {
  return (import.meta.env[key] ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

export const roles = {
  ...rawRoles,

  presidente: {
    ...rawRoles.presidente,
    emails: envToEmails("VITE_ROLES_PRESIDENTE"),
  },
  vice_presidente: {
    ...rawRoles.vice_presidente,
    emails: envToEmails("VITE_ROLES_VICE_PRESIDENTE"),
  },
  secretario_geral: {
    ...rawRoles.secretario_geral,
    emails: envToEmails("VITE_ROLES_SECRETARIO_GERAL"),
  },
  primeiro_secretario: {
    ...rawRoles.primeiro_secretario,
    emails: envToEmails("VITE_ROLES_PRIMEIRO_SECRETARIO"),
  },
  tesoureiro: {
    ...rawRoles.tesoureiro,
    emails: envToEmails("VITE_ROLES_TESOREIRO"),
  },
  primeiro_tesoureiro: {
    ...rawRoles.primeiro_tesoureiro,
    emails: envToEmails("VITE_ROLES_PRIMEIRO_TESOREIRO"),
  },
  diretor_socio_cultural: {
    ...rawRoles.diretor_socio_cultural,
    emails: envToEmails("VITE_ROLES_DIRETOR_SOCIO_CULTURAL"),
  },
  diretor_comunicacao_imprensa: {
    ...rawRoles.diretor_comunicacao_imprensa,
    emails: envToEmails("VITE_ROLES_DIRETOR_COMUNICACAO_IMPRENSA"),
  },
  diretor_saude_meio_ambiente: {
    ...rawRoles.diretor_saude_meio_ambiente,
    emails: envToEmails("VITE_ROLES_DIRETOR_SAUDE_MEIO_AMBIENTE"),
  },
  diretor_politicas_educacionais: {
    ...rawRoles.diretor_politicas_educacionais,
    emails: envToEmails("VITE_ROLES_DIRETOR_POLITICAS_EDUCACIONAIS"),
  },
  diretor_cultura_esporte_lazer: {
    ...rawRoles.diretor_cultura_esporte_lazer,
    emails: envToEmails("VITE_ROLES_DIRETOR_CULTURA_ESPORTE_LAZER"),
  },
  programador: {
    ...rawRoles.programador,
    emails: envToEmails("VITE_ROLES_PROGRAMADORES_EMAILS"),
  },
};

export function getUserRole(email?: string | null) {
  if (!email) return { key: "aluno", ...roles.aluno };

  const normalized = email.toLowerCase();

  for (const [key, role] of Object.entries(roles)) {
    if (role.emails.includes(normalized)) {
      return { key, ...role };
    }
  }

  return { key: "aluno", ...roles.aluno };
}