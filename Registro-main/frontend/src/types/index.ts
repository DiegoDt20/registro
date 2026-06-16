export type Rol = "ADMINISTRADOR" | "REGISTRADOR";
export type Sexo = "MASCULINO" | "FEMENINO";
export type EstadoCivil = "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO";

export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  createdAt: string;
  updatedAt: string;
}

export interface Miembro {
  id: string;
  codigoMiembro: string;
  dni: string;
  nombres: string;
  apellidos: string;
  sexo: Sexo;
  estadoCivil: EstadoCivil;
  profesion: string;
  fechaNacimiento: string;
  celular: string;
  correo: string | null;
  direccion: string;
  foto: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  hombres: number;
  mujeres: number;
  profesiones: { profesion: string; total: number }[];
  ultimos: {
    id: string;
    codigoMiembro: string;
    nombres: string;
    apellidos: string;
    profesion: string;
    foto: string | null;
    createdAt: string;
  }[];
  crecimientoMensual: { mes: string; total: number }[];
}

export interface ValidationResult {
  valido: boolean;
  miembro: {
    codigoMiembro: string;
    dni: string;
    nombres: string;
    apellidos: string;
    profesion: string;
    foto: string | null;
    activo: boolean;
  } | null;
}

export const SEXO_LABELS: Record<Sexo, string> = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
};

export const ESTADO_CIVIL_LABELS: Record<EstadoCivil, string> = {
  SOLTERO: "Soltero",
  CASADO: "Casado",
  DIVORCIADO: "Divorciado",
  VIUDO: "Viudo",
};

export const ROL_LABELS: Record<Rol, string> = {
  ADMINISTRADOR: "Administrador",
  REGISTRADOR: "Registrador",
};
