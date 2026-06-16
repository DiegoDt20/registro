interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "brand" | "gold" | "blue" | "pink";
}

const accents: Record<NonNullable<Props["accent"]>, string> = {
  brand: "bg-brand-700 text-white",
  gold: "bg-gold-500 text-brand-900",
  blue: "bg-sky-500 text-white",
  pink: "bg-pink-500 text-white",
};

export default function StatsCard({ title, value, icon, accent = "brand" }: Props) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${accents[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
