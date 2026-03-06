import type { BmiStatus } from '@/shared/types';
import { BMI_STATUS_CONFIG } from '../model';

interface BmiIndicatorProps {
  bmi: number | null;
  status: BmiStatus | null;
}

export function BmiIndicator({ bmi, status }: BmiIndicatorProps) {
  if (bmi == null || status == null) {
    return <span className="text-slate-400 text-sm">N/A</span>;
  }

  const config = BMI_STATUS_CONFIG[status];

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl font-bold text-slate-900">{bmi}</span>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    </div>
  );
}
