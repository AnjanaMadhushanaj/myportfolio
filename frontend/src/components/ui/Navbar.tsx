import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-8 pb-4 w-full flex justify-center pointer-events-none">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg px-6 py-2 rounded-full pointer-events-auto">
        <div className="flex gap-1 items-center text-sm font-medium text-slate-300">
          <Link href="#home" className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300">Home</Link>
          <Link href="#about" className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300">About</Link>
          <Link href="#services" className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300">Services</Link>
          <Link href="#skills" className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300">Skills</Link>
          <Link href="#projects" className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300">Projects</Link>
        </div>
      </div>
    </nav>
  );
}
