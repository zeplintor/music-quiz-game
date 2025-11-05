
import React from "react";
import { Trash, MicOff, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadEntry = {
  id: string;
  audio_url?: string;
  image_url?: string;
  message?: string;
  user_id?: string; // <-- était string, passe en optionnel pour robustesse
  block_id?: string;
  x?: number;
  y?: number;
  status?: string;
};

type AdminTableProps = {
  uploads: UploadEntry[];
  loading: boolean;
  onDelete: (upload: UploadEntry) => void;
  onToggleMute: (upload: UploadEntry) => void;
  onEditImage: (upload: UploadEntry) => void;
};

const AdminTable: React.FC<AdminTableProps> = ({
  uploads,
  loading,
  onDelete,
  onToggleMute,
  onEditImage,
}) => {
  // Logging pour debug
  if (uploads.some(u => !u || !u.id)) {
    console.error("Upload mal formé détecté:", uploads);
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Chargement…</div>;
  }
  if (!uploads || uploads.length === 0) {
    return (
      <div className="bg-gray-50 px-3 py-8 rounded shadow-sm text-center text-gray-500">
        Aucun upload à afficher.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-3 py-2">Bloc</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">Audio</th>
            <th className="px-3 py-2">Image Promo</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2">Statut</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((u, idx) => {
            // Check robustness
            if (!u || !u.id) {
              return (
                <tr key={`malforme-${idx}`}>
                  <td colSpan={7} className="px-3 py-2 text-red-600">
                    Ligne upload corrompue
                  </td>
                </tr>
              );
            }
            return (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-3 py-2 font-mono">
                  {typeof u.x === "number" && typeof u.y === "number"
                    ? `${u.x},${u.y}`
                    : "?"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {u.user_id
                    ? u.user_id.slice(0, 8) + "…"
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-3 py-2">
                  {u.audio_url ? (
                    <audio
                      controls
                      src={u.audio_url}
                      className="max-w-[120px]"
                    />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {u.image_url ? (
                    <img
                      src={u.image_url}
                      alt="image promo"
                      className="h-12 w-12 object-cover border rounded shadow"
                    />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs max-w-[120px] truncate">
                  {u.message ?? "—"}
                </td>
                <td className="px-3 py-2">
                  {u.status === "removed" ? (
                    <span className="text-red-600 font-semibold">Muté</span>
                  ) : (
                    <span className="text-green-700 font-semibold">
                      Actif
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-red-50 hover:bg-red-200"
                    title="Supprimer l’upload"
                    onClick={() => onDelete(u)}
                  >
                    <Trash className="text-red-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title={
                      u.status === "removed" ? "Réactiver" : "Mute"
                    }
                    onClick={() => onToggleMute(u)}
                    className={
                      u.status === "removed"
                        ? "bg-gray-100 hover:bg-green-100"
                        : "bg-gray-100 hover:bg-yellow-100"
                    }
                  >
                    <MicOff
                      className={
                        u.status === "removed"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-blue-50 hover:bg-blue-200"
                    onClick={() => onEditImage(u)}
                    title="Modifier image promo"
                  >
                    <Image className="text-blue-500" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
