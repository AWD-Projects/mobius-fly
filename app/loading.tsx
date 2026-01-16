export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-small text-muted tracking-[0.01em]">Cargando tu experiencia...</p>
      </div>
    </div>
  );
}
