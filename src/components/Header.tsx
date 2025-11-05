
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useUser && useUser();

  return (
    <header
      className="bg-white px-3 py-2 border-b w-full flex items-center justify-between min-h-[56px] z-40"
      style={{ userSelect: "text" }}
    >
      {/* Espace réservé à gauche pour équilibrer le centrage */}
      <div className="w-20 min-w-[56px] flex-shrink-0" />

      {/* Nom du site centré, seul cliquable et sélectionnable */}
      <div className="flex flex-1 items-center justify-center select-text relative z-0">
        <Link
          to="/"
          aria-label="Aller à l'accueil"
          className="outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] rounded"
          tabIndex={0}
          style={{ textDecoration: "none" }}
        >
          <h1
            className="
              text-2xl sm:text-3xl font-black tracking-tighter text-[#111]
              hover:text-[#0ea5e9] transition-all
              text-center break-words
            "
            style={{ wordBreak: "break-word", cursor: "pointer" }}
          >
            <span className="select-text">
              what👉theinternet🌐
              <span className="block sm:inline">
                <wbr />
                sounds🔊like<span className="block sm:inline">.com</span>
              </span>
            </span>
          </h1>
        </Link>
      </div>
      
      {/* Bouton profil/login toujours à droite */}
      <div
        className="flex items-center gap-5 justify-end w-20 min-w-[56px] z-10"
        style={{ position: "relative" }}
      >
        {user ? (
          <Link to="/profile" className="text-[#00CC5F] border px-3 py-1 rounded hover:bg-[#e5ffe7] whitespace-nowrap">
            Profile
          </Link>
        ) : (
          <Link to="/auth" className="text-[#00CC5F] border px-3 py-1 rounded hover:bg-[#e5ffe7] whitespace-nowrap">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
