export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-bold text-lg text-indigo-600 md:text-2xl">V<span className="text-black">aidehi</span></span>
          <div className="text-sm text-slate-500 mt-1">© {new Date().getFullYear()} Vaidehi. All rights reserved.</div>
        </div>

        <div className="flex gap-6">
          <a href="#features" className="text-sm hover:text-indigo-600">Features</a>
          <a href="#pricing" className="text-sm hover:text-indigo-600">Pricing</a>
          <a href="#about" className="text-sm hover:text-indigo-600">About</a>
          <a href="#contact" className="text-sm hover:text-indigo-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
