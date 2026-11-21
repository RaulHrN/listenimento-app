// Tipos do banco. Escrito à mão para o projeto compilar desde já;
// depois do `supabase start`, regenere com `npm run db:types`.
import type { ItemStatus, MediaType } from './types';

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string | null; avatar_url?: string | null };
        Update: { display_name?: string | null; avatar_url?: string | null };
        Relationships: [];
      };
      user_items: {
        Row: {
          id: string; user_id: string; media_type: MediaType; provider: string; external_id: string;
          title: string; subtitle: string | null; image_url: string | null; year: number | null; metadata: Json;
          status: ItemStatus; rating: number | null; priority: number; notes: string | null; tags: string[];
          started_at: string | null; finished_at: string | null; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id?: string; media_type: MediaType; provider: string; external_id: string;
          title: string; subtitle?: string | null; image_url?: string | null; year?: number | null; metadata?: Json;
          status?: ItemStatus; rating?: number | null; priority?: number; notes?: string | null; tags?: string[];
          started_at?: string | null; finished_at?: string | null;
        };
        Update: {
          status?: ItemStatus; rating?: number | null; priority?: number; notes?: string | null; tags?: string[];
          started_at?: string | null; finished_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      user_item_stats: {
        Row: { user_id: string; media_type: MediaType; status: ItemStatus; total: number; avg_rating: number | null };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: { media_type: MediaType; item_status: ItemStatus };
    CompositeTypes: Record<string, never>;
  };
}
