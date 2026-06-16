import { prisma } from "../config/prisma";

export const dashboardService = {
  async stats() {
    const [total, hombres, mujeres, profesionesRaw, ultimos] = await Promise.all([
      prisma.miembro.count(),
      prisma.miembro.count({ where: { sexo: "MASCULINO" } }),
      prisma.miembro.count({ where: { sexo: "FEMENINO" } }),
      prisma.miembro.groupBy({
        by: ["profesion"],
        _count: { profesion: true },
        orderBy: { _count: { profesion: "desc" } },
        take: 5,
      }),
      prisma.miembro.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          codigoMiembro: true,
          nombres: true,
          apellidos: true,
          profesion: true,
          foto: true,
          createdAt: true,
        },
      }),
    ]);

    const profesiones = profesionesRaw.map((p) => ({
      profesion: p.profesion,
      total: p._count.profesion,
    }));

    // Crecimiento mensual (últimos 6 meses) calculado en memoria.
    const desde = new Date();
    desde.setMonth(desde.getMonth() - 5);
    desde.setDate(1);
    desde.setHours(0, 0, 0, 0);

    const recientes = await prisma.miembro.findMany({
      where: { createdAt: { gte: desde } },
      select: { createdAt: true },
    });

    const meses: { mes: string; total: number }[] = [];
    const cursor = new Date(desde);
    for (let i = 0; i < 6; i++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const total = recientes.filter((m) => {
        const d = m.createdAt;
        return (
          d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth()
        );
      }).length;
      meses.push({ mes: key, total });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return {
      total,
      hombres,
      mujeres,
      profesiones,
      ultimos,
      crecimientoMensual: meses,
    };
  },
};
