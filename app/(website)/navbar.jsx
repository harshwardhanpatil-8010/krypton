import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-2 z-50 w-full bg-krypton-900/80 backdrop-blur-sm shadow-lg rounded-lg ">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <span className="font-bold text-2xl md:text-3xl text-white px-4 tracking-tighter hover:text-krypton-500 transition-colors duration-200">
            KRYPTON
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="bg-krypton-500 hover:bg-krypton-600 text-white px-8 py-2.5 rounded-lg text-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-krypton-500/30 active:scale-95"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

