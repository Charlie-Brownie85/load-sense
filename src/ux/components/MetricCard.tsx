interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  warning?: boolean;
}

export function MetricCard({ label, value, subtitle, warning }: MetricCardProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <p className="text-slate-500 text-xs font-bold uppercase">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center gap-1">
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
        {warning && (
          <span className="material-symbols-outlined text-amber-500 text-xs!">
            warning
          </span>
        )}
      </div>
    </div>
  );
}
