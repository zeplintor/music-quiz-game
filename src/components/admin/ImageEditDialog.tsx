
import React from "react";
import { Button } from "@/components/ui/button";
import { usePopupClose } from "@/hooks/usePopupClose";

type Props = {
  open: boolean;
  loading: boolean;
  currentImageUrl?: string;
  onSubmit: (file: File) => void;
  onClose: () => void;
};

const ImageEditDialog: React.FC<Props> = ({ open, loading, onSubmit, onClose, currentImageUrl }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const popupRef = usePopupClose(open, onClose);

  React.useEffect(() => {
    if (open) setFile(null);
  }, [open]);

  if (!open) return null;
  
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60">
      <div
        ref={popupRef}
        className="bg-white p-7 border rounded-xl relative flex flex-col gap-5 min-w-[310px]"
        onClick={e => e.stopPropagation()}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            if (file) onSubmit(file);
          }}
        >
          <h2 className="text-xl mb-2 font-bold text-[#111]">Changer l'image promo</h2>
          <div>
            <input
              type="file"
              accept="image/*"
              required
              disabled={loading}
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="block w-full border-gray-300"
            />
            {currentImageUrl && (
              <div className="mt-2">
                <span className="text-xs">Image actuelle:</span>
                <img src={currentImageUrl} alt="actuelle" className="h-14 w-14 object-cover rounded mt-1 border" />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={loading || !file} variant="default">
              {loading ? "Envoi…" : "Enregistrer"}
            </Button>
            <Button type="button" disabled={loading} variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageEditDialog;
