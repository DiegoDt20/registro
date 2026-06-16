import { api } from "./client";
import {
  AuthUser,
  DashboardStats,
  Miembro,
  Usuario,
  ValidationResult,
} from "../types";

// ---- Auth ----
export async function login(correo: string, password: string) {
  const { data } = await api.post<{ token: string; user: AuthUser }>("/auth/login", {
    correo,
    password,
  });
  return data;
}

export async function changePassword(actual: string, nueva: string) {
  const { data } = await api.post<{ message: string }>("/auth/change-password", {
    actual,
    nueva,
  });
  return data;
}

// ---- Miembros ----
export interface MemberQuery {
  search?: string;
  profesion?: string;
  sexo?: string;
  estadoCivil?: string;
}

export async function getMembers(params: MemberQuery = {}) {
  const { data } = await api.get<Miembro[]>("/members", { params });
  return data;
}

export async function getMember(id: string) {
  const { data } = await api.get<Miembro>(`/members/${id}`);
  return data;
}

export type MemberPayload = Omit<
  Miembro,
  "id" | "codigoMiembro" | "createdAt" | "updatedAt" | "activo"
> & { activo?: boolean };

export async function createMember(payload: MemberPayload) {
  const { data } = await api.post<Miembro>("/members", payload);
  return data;
}

export async function updateMember(id: string, payload: Partial<MemberPayload>) {
  const { data } = await api.put<Miembro>(`/members/${id}`, payload);
  return data;
}

export async function deleteMember(id: string) {
  await api.delete(`/members/${id}`);
}

// ---- Usuarios ----
export async function getUsers() {
  const { data } = await api.get<Usuario[]>("/users");
  return data;
}

export interface UserPayload {
  nombre: string;
  correo: string;
  password?: string;
  rol: "ADMINISTRADOR" | "REGISTRADOR";
}

export async function createUser(payload: UserPayload) {
  const { data } = await api.post<Usuario>("/users", payload);
  return data;
}

export async function updateUser(id: string, payload: Partial<UserPayload>) {
  const { data } = await api.put<Usuario>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}

// ---- Validación ----
export async function validateByCodigo(codigo: string) {
  const { data } = await api.get<ValidationResult>(`/validate/${encodeURIComponent(codigo)}`);
  return data;
}

export async function validateByDni(dni: string) {
  const { data } = await api.get<ValidationResult>(`/validate/dni/${encodeURIComponent(dni)}`);
  return data;
}

// ---- Dashboard ----
export async function getDashboardStats() {
  const { data } = await api.get<DashboardStats>("/dashboard/stats");
  return data;
}
