export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          LoadSense
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400 text-lg!">
            person
          </span>
        </div>
      </div>
    </nav>
  );
}
