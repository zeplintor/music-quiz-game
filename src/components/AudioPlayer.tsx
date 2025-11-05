
import React from "react";
import { X, Volume2, Share } from "lucide-react";
import AudioPlayerLib from "react-h5-audio-player";
import { RHAP_UI } from "react-h5-audio-player";
import { usePopupClose } from "@/hooks/usePopupClose";
import "react-h5-audio-player/lib/styles.css";

type AudioPlayerProps = {
  url: string;
  pos: { x: number; y: number };
  onClose: () => void;
  promoMessage?: string;
  imgUrl?: string;
  shareUrl?: string;
};

const isMobile =
  typeof window !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  url,
  pos,
  onClose,
  promoMessage,
  imgUrl,
  shareUrl,
}) => {
  // Pour copier lien partageable
  const [copied, setCopied] = React.useState(false);

  // Use the popup close hook for escape and outside click functionality
  const popupRef = usePopupClose(true, onClose, true, true);

  const handleCopy = async () => {
    const link = shareUrl || `${window.location.origin}/block/${pos.x}/${pos.y}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div
        ref={popupRef}
        className="bg-white border-2 border-[#00FF7F] shadow-2xl px-8 py-7 flex flex-col items-center gap-3 max-w-[370px] w-[95vw] relative"
        style={{ borderRadius: 0 }}
      >
        <button
          className="absolute right-4 top-4 bg-[#e5ffe7] p-2 hover:bg-[#00FF7F]/80 transition border border-[#00FF7F]"
          style={{ borderRadius: 0 }}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} className="text-[#00FF7F]" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center justify-center bg-[#e5ffe7] p-1 border border-[#00FF7F]"
            style={{ borderRadius: 0 }}
          >
            <Volume2 color="#00FF7F" size={26} strokeWidth={2.2} />
          </span>
          <span className="text-[#00FF7F] font-black tracking-wide text-lg drop-shadow-sm">
            Block [{pos.x}, {pos.y}]
          </span>
        </div>
        {/* Lien de partage */}
        <button
          type="button"
          className="flex items-center gap-2 text-[#0ea5e9] mt-2 mb-1 px-3 py-1 bg-[#e5ffe7] rounded border border-[#00FF7F] hover:bg-[#bffff2] text-sm font-medium select-none transition"
          style={{ borderRadius: 0 }}
          onClick={handleCopy}
        >
          <Share size={18} />
          {copied ? "Lien copié !" : "Partager ce bloc"}
        </button>
        {imgUrl && (
          <img
            src={imgUrl}
            alt="Block"
            className="w-full h-40 object-cover mb-2 border border-[#e5ffe7] shadow"
            style={{ maxWidth: "270px", borderRadius: 0 }}
          />
        )}
        {promoMessage && (
          <div className="bg-[#c80a1e] text-white font-bold text-center px-3 py-2 mb-2 text-sm shadow-lg animate-pulse uppercase tracking-tight max-w-[240px]" style={{ borderRadius: 0 }}>
            {promoMessage}
          </div>
        )}
        {/* Autoplay desktop uniquement */}
        <AudioPlayerLib
          src={url}
          autoPlay={!isMobile}
          style={{
            width: "100%",
            background: "#fff",
            border: "1px solid #00FF7F",
            borderRadius: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
          showJumpControls={false}
          customAdditionalControls={[]}
          customProgressBarSection={[
            RHAP_UI.CURRENT_TIME,
            RHAP_UI.PROGRESS_BAR,
            RHAP_UI.DURATION,
          ]}
          customVolumeControls={[
            RHAP_UI.VOLUME
          ]}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
