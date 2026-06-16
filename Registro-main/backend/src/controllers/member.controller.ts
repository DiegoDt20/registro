import { Request, Response } from "express";
import { memberService } from "../services/member.service";
import { createMemberSchema, updateMemberSchema } from "../schemas/member.schema";
import { MemberFilters } from "../repositories/member.repository";

function parseFilters(query: Request["query"]): MemberFilters {
  const filters: MemberFilters = {};
  if (typeof query.search === "string" && query.search.trim()) {
    filters.search = query.search.trim();
  }
  if (typeof query.profesion === "string" && query.profesion.trim()) {
    filters.profesion = query.profesion.trim();
  }
  if (query.sexo === "MASCULINO" || query.sexo === "FEMENINO") {
    filters.sexo = query.sexo;
  }
  if (
    query.estadoCivil === "SOLTERO" ||
    query.estadoCivil === "CASADO" ||
    query.estadoCivil === "DIVORCIADO" ||
    query.estadoCivil === "VIUDO"
  ) {
    filters.estadoCivil = query.estadoCivil;
  }
  return filters;
}

export const memberController = {
  async list(req: Request, res: Response) {
    res.json(await memberService.list(parseFilters(req.query)));
  },

  async get(req: Request, res: Response) {
    res.json(await memberService.get(req.params.id));
  },

  async create(req: Request, res: Response) {
    // LOG temporal de diagnóstico: body completo recibido por el backend.
    console.log("[POST /api/members] req.body:", JSON.stringify(req.body, null, 2));
    const input = createMemberSchema.parse(req.body);
    const member = await memberService.create(input);
    res.status(201).json(member);
  },

  async update(req: Request, res: Response) {
    const input = updateMemberSchema.parse(req.body);
    const member = await memberService.update(req.params.id, input);
    res.json(member);
  },

  async remove(req: Request, res: Response) {
    await memberService.remove(req.params.id);
    res.status(204).send();
  },
};
