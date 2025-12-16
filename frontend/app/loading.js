export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000]" style={{ background: "rgba(15, 23, 42, 0.35)" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    </div>
  );
}

