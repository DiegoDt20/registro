import { memberRepository, MemberFilters } from "../repositories/member.repository";
import { HttpError } from "../utils/httpError";
import { CreateMemberInput, UpdateMemberInput } from "../schemas/member.schema";

const CODIGO_PREFIX = "MEM-";
const CODIGO_PAD = 6;

function formatCodigo(n: number): string {
  return `${CODIGO_PREFIX}${String(n).padStart(CODIGO_PAD, "0")}`;
}

async function nextCodigo(): Promise<string> {
  const last = await memberRepository.findLastCodigo();
  if (!last) return formatCodigo(1);
  const current = parseInt(last.codigoMiembro.replace(CODIGO_PREFIX, ""), 10);
  return formatCodigo((Number.isNaN(current) ? 0 : current) + 1);
}

function normalizeFoto(foto?: string | null): string | null {
  return foto && foto.trim() !== "" ? foto : null;
}

function normalizeCorreo(correo?: string | null): string | null {
  return correo && correo.trim() !== "" ? correo : null;
}

export const memberService = {
  list(filters: MemberFilters) {
    return memberRepository.findMany(filters);
  },

  async get(id: string) {
    const member = await memberRepository.findById(id);
    if (!member) throw new HttpError(404, "Miembro no encontrado.");
    return member;
  },

  async create(input: CreateMemberInput) {
    // LOG temporal: datos recibidos para alta de miembro.
    console.log("[member.service.create] DNI recibido:", input.dni);
    const existing = await memberRepository.findByDni(input.dni);
    if (existing) {
      // LOG temporal: muestra el registro que causa el conflicto (409).
      console.warn(
        `[member.service.create] CONFLICTO 409 → DNI ${input.dni} ya existe en miembro ` +
          `${existing.codigoMiembro} (${existing.nombres} ${existing.apellidos}).`
      );
      throw new HttpError(
        409,
        `Ya existe un miembro registrado con el DNI ${input.dni} (${existing.codigoMiembro} – ${existing.nombres} ${existing.apellidos}).`
      );
    }

    const codigoMiembro = await nextCodigo();

    return memberRepository.create({
      codigoMiembro,
      dni: input.dni,
      nombres: input.nombres,
      apellidos: input.apellidos,
      sexo: input.sexo,
      estadoCivil: input.estadoCivil,
      profesion: input.profesion,
      fechaNacimiento: new Date(input.fechaNacimiento),
      celular: input.celular,
      correo: normalizeCorreo(input.correo),
      direccion: input.direccion,
      foto: normalizeFoto(input.foto),
    });
  },

  async update(id: string, input: UpdateMemberInput) {
    const existing = await memberRepository.findById(id);
    if (!existing) throw new HttpError(404, "Miembro no encontrado.");

    if (input.dni && input.dni !== existing.dni) {
      const dup = await memberRepository.findByDni(input.dni);
      if (dup) throw new HttpError(409, "Ya existe un miembro con ese DNI.");
    }

    const data: Record<string, unknown> = {};
    if (input.dni !== undefined) data.dni = input.dni;
    if (input.nombres !== undefined) data.nombres = input.nombres;
    if (input.apellidos !== undefined) data.apellidos = input.apellidos;
    if (input.sexo !== undefined) data.sexo = input.sexo;
    if (input.estadoCivil !== undefined) data.estadoCivil = input.estadoCivil;
    if (input.profesion !== undefined) data.profesion = input.profesion;
    if (input.fechaNacimiento !== undefined) data.fechaNacimiento = new Date(input.fechaNacimiento);
    if (input.celular !== undefined) data.celular = input.celular;
    if (input.correo !== undefined) data.correo = normalizeCorreo(input.correo);
    if (input.direccion !== undefined) data.direccion = input.direccion;
    if (input.foto !== undefined) data.foto = normalizeFoto(input.foto);
    if (input.activo !== undefined) data.activo = input.activo;

    return memberRepository.update(id, data);
  },

  async remove(id: string) {
    const existing = await memberRepository.findById(id);
    if (!existing) throw new HttpError(404, "Miembro no encontrado.");
    await memberRepository.delete(id);
  },
};
