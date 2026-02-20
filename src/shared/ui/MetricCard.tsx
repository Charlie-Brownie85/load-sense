import { Tooltip } from './Tooltip';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  warning?: boolean;
  tooltip?: string;
}

export function MetricCard({ label, value, subtitle, warning, tooltip }: MetricCardProps) {
  const labelElement = (
    <p className={`text-slate-500 text-xs font-bold uppercase ${tooltip ? 'cursor-help' : ''}`}>
      {label}
    </p>
  );

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      {tooltip ? (
        <Tooltip content={tooltip}>{labelElement}</Tooltip>
      ) : (
        labelElement
      )}
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
