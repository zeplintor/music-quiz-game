
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClaimedBlock {
  id: string;
  user_id: string;
  grid_x: number;
  grid_y: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useClaimedBlocks(userId?: string) {
  const [blocks, setBlocks] = useState<ClaimedBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchBlocks() {
      setLoading(true);
      
      // Si pas d'userId, ne pas faire de requête
      if (!userId) {
        setBlocks([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("claimed_blocks")
        .select("id,user_id,grid_x,grid_y,status,created_at,updated_at")
        .eq("user_id", userId)
        .eq("status", "active");
        
      if (!isMounted) return;
      
      if (error) {
        console.error("Error fetching user blocks:", error);
        setBlocks([]);
      } else {
        setBlocks(data || []);
      }
      setLoading(false);
    }
    
    fetchBlocks();
    
    // Optionnel : refresh quand la page reprend le focus
    const onFocus = () => fetchBlocks();
    window.addEventListener("focus", onFocus);
    
    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
    };
  }, [userId]);

  return { blocks, loading };
}
