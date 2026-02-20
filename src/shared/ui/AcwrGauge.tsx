interface AcwrGaugeProps {
  acwr: number | null;
}

export function AcwrGauge({ acwr }: AcwrGaugeProps) {
  const getIndicatorPosition = (): string => {
    if (acwr === null) return '50%';
    const clamped = Math.min(Math.max(acwr, 0), 2.0);
    return `${(clamped / 2.0) * 100}%`;
  };

  return (
    <div className="col-span-2 px-2 py-1">
      <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
        <span>RECOVERY</span>
        <span>OPTIMAL</span>
        <span>OVERREACH</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full flex relative">
        <div className="h-full bg-slate-300 w-1/4 rounded-l-full" />
        <div className="h-full bg-emerald-500 w-1/2" />
        <div className="h-full bg-orange-500/50 w-1/4 rounded-r-full" />
        {acwr !== null && (
          <div
            className="absolute -top-1 w-1 h-4 bg-primary rounded-full shadow-md transition-all duration-300"
            style={{ left: getIndicatorPosition() }}
          />
        )}
      </div>
    </div>
  );
}
