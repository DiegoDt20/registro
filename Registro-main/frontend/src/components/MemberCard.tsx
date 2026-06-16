import { Link } from "react-router-dom";
import { Miembro } from "../types";
import { fullName, initials } from "../lib/utils";

interface Props {
  member: Pick<
    Miembro,
    "id" | "codigoMiembro" | "nombres" | "apellidos" | "profesion" | "foto"
  >;
}

export default function MemberCard({ member }: Props) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="card flex items-center gap-3 p-3 transition hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
        {member.foto ? (
          <img src={member.foto} alt="" className="h-full w-full object-cover" />
        ) : (
          initials(member.nombres, member.apellidos)
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">
          {fullName(member.nombres, member.apellidos)}
        </p>
        <p className="truncate text-xs text-slate-500">
          {member.profesion} · {member.codigoMiembro}
        </p>
      </div>
    </Link>
  );
}
