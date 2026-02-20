interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-60">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined font-bold">add</span>
        <span className="font-bold tracking-tight text-sm">Add Session</span>
      </button>
    </div>
  );
}
