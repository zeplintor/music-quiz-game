
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Unifie la logique pour fournir la liste des blocs
 * Ceux ayant été réservés ET uploadés
 * Retourne [{x, y, audio, img, promoMessage}]
 */
export function useGridBlocks() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchBlocks() {
      setLoading(true);
      // Récupère tous les uploads joints à leur claimed block
      const { data, error } = await supabase
        .from("uploads")
        .select("block_id,audio_url,image_url,message,claimed_blocks(grid_x,grid_y)")
        .neq("audio_url", null);

      if (!isMounted) return;

      if (error) {
        setBlocks([]);
        console.log("Supabase uploads error:", error);
      } else {
        // Garde uniquement ceux qui ont bien une claimed_block associée
        const list = (data || [])
          .map((row: any) => ({
            x: row?.claimed_blocks?.grid_x,
            y: row?.claimed_blocks?.grid_y,
            audio: row.audio_url,
            img: row.image_url,
            promoMessage: row.message,
          }))
          .filter(b => b.x !== undefined && b.y !== undefined);
        setBlocks(list);
        console.log("[Grid] uploads fetched:", list.length, list);
      }
      setLoading(false);
    }
    fetchBlocks();
    // Auto-refresh on focus
    const onFocus = () => fetchBlocks();
    window.addEventListener("focus", onFocus);
    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return { blocks, loading };
}
