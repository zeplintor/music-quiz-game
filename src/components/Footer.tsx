
const Footer = () => (
  <footer className="py-6 border-t border-gray-100 bg-white/70 backdrop-blur text-center text-sm text-gray-400 font-medium mt-auto">
    <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center items-center">
      <a href="/about" className="hover:text-[#00FF7F] transition-colors">About</a>
      <a href="/terms" className="hover:text-[#00FF7F] transition-colors">Terms</a>
      <a href="/privacy" className="hover:text-[#00FF7F] transition-colors">Privacy</a>
    </div>
    <div className="mt-2 text-xs text-gray-300">
      © {(new Date()).getFullYear()} whattheinternetsoundslike.com
    </div>
  </footer>
);

export default Footer;
