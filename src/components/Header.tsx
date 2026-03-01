export default function Header() {
  return (
    <header className="text-center pt-10 pb-6">
      <div className="flex items-center justify-center gap-2 mb-1">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
          Flux<span className="text-accent">Scan</span>
        </h1>
        <span className="w-2 h-2 rounded-full bg-accent inline-block mt-1 animate-pulse-subtle" />
      </div>
      <p className="text-sm tracking-wide text-text-secondary">
        generate. scan. done.
      </p>
    </header>
  )
}
