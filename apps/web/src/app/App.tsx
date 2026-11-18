import { BookOpen, Search, ShoppingBag, Store } from 'lucide-react'

export default function App() {
  return (
    <main className="min-h-screen bg-[#D1D0D0] text-[#000000]">
      <header className="flex items-center justify-between border-b border-[#5C4E4E]/20 bg-[#000000] px-6 py-5 text-[#D1D0D0] md:px-12">
        <a href="/" className="flex items-center gap-3 text-lg font-semibold tracking-[0.18em]">
          <BookOpen size={22} /> BOOK BAZAR
        </a>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <a href="#books" className="hover:text-white">Explore books</a>
          <a href="#sell" className="hover:text-white">Sell books</a>
          <a href="#publish" className="hover:text-white">Publish</a>
        </nav>
        <button className="rounded-full border border-[#988686] px-5 py-2 text-sm hover:bg-[#5C4E4E]">Sign in</button>
      </header>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-12 md:py-28">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#5C4E4E]">A marketplace for every reader</p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight md:text-7xl">Good books deserve <span className="text-[#5C4E4E]">another story.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#5C4E4E]">Discover books, give your old favourites a new home, and find your next great read with BOOK BAZAR.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-md bg-[#000000] px-6 py-3 text-sm font-medium text-white hover:bg-[#5C4E4E]"><Search size={17} /> Explore books</button>
            <button className="inline-flex items-center gap-2 rounded-md border border-[#5C4E4E] px-6 py-3 text-sm font-medium hover:bg-white/40"><Store size={17} /> Start selling</button>
          </div>
        </div>
        <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-sm bg-[#988686] p-10">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/30" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full border border-white/30" />
          <div className="relative grid w-full max-w-sm grid-cols-3 items-end gap-3">
            <div className="h-48 bg-[#000000] p-3 text-white shadow-xl"><BookOpen size={25} /><p className="mt-20 text-xs tracking-widest">READ</p></div>
            <div className="h-60 bg-[#D1D0D0] p-3 shadow-xl"><BookOpen size={25} /><p className="mt-32 text-xs tracking-widest">SHARE</p></div>
            <div className="h-52 bg-[#5C4E4E] p-3 text-white shadow-xl"><BookOpen size={25} /><p className="mt-24 text-xs tracking-widest">REPEAT</p></div>
          </div>
        </div>
      </section>
      <section className="border-t border-[#5C4E4E]/20 bg-[#E4E2E2] px-6 py-12 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div><ShoppingBag size={22} /><h2 className="mt-3 font-semibold">Buy books</h2><p className="mt-2 text-sm text-[#5C4E4E]">Find books from readers and sellers.</p></div>
          <div><Store size={22} /><h2 className="mt-3 font-semibold">Sell books</h2><p className="mt-2 text-sm text-[#5C4E4E]">Give your books a new home.</p></div>
          <div><BookOpen size={22} /><h2 className="mt-3 font-semibold">Publish books</h2><p className="mt-2 text-sm text-[#5C4E4E]">A dedicated space for authors is coming.</p></div>
        </div>
      </section>
      <footer className="bg-[#000000] px-6 py-6 text-center text-xs tracking-wider text-[#D1D0D0]">BOOK BAZAR · EVERY BOOK DESERVES ANOTHER READER</footer>
    </main>
  )
}
