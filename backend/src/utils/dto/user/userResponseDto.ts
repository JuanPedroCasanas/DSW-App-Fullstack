import { User } from "../../../model/entities/User"

//Este DTO existe para no devolve la contraseña hasheada al front en los metodos por ej de login
export interface UserResponseDTO {
  id: number
  mail: string
  role: string
  isActive: boolean
  patient?: any
  professional?: any
  legalGuardian?: any
}


export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    mail: user.mail,
    role: user.role,
    isActive: user.isActive,
    patient: user.patient,
    professional: user.professional,
    legalGuardian: user.legalGuardian,
  }
}