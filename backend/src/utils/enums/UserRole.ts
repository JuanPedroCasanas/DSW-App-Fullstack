export enum UserRole {
  Patient = "patient",
  LegalGuardian = "legalGuardian",
  Professional = "professional",
  Admin = "admin", //Esto será insertado en la base de datos, no se registran usuarios admin bajo un flujo normal
}