const roleRedirectMap: Record<string, string> = {
  admin: "/debug-console",
  professional: "/professional-portal",
  patient: "/patient-portal",
  legalGuardian: "/legal-guardian-portal",
};

export function redirectByRole(role: string) {
  return roleRedirectMap[role] ?? "/";
}