export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          ai_result: Json
          confidence: number | null
          created_at: string | null
          easy_text: string | null
          hcid: string | null
          id: string
          input_data: Json
          professional_text: string | null
          triage_level: string | null
          user_id: string
        }
        Insert: {
          ai_result: Json
          confidence?: number | null
          created_at?: string | null
          easy_text?: string | null
          hcid?: string | null
          id?: string
          input_data: Json
          professional_text?: string | null
          triage_level?: string | null
          user_id: string
        }
        Update: {
          ai_result?: Json
          confidence?: number | null
          created_at?: string | null
          easy_text?: string | null
          hcid?: string | null
          id?: string
          input_data?: Json
          professional_text?: string | null
          triage_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_hcid_fkey"
            columns: ["hcid"]
            isOneToOne: false
            referencedRelation: "health_cards"
            referencedColumns: ["hcid"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          consent_given: boolean
          consent_text: string | null
          consent_type: string
          created_at: string | null
          id: string
          locale: string | null
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          consent_given?: boolean
          consent_text?: string | null
          consent_type: string
          created_at?: string | null
          id?: string
          locale?: string | null
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          consent_given?: boolean
          consent_text?: string | null
          consent_type?: string
          created_at?: string | null
          id?: string
          locale?: string | null
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      health_cards: {
        Row: {
          created_at: string | null
          hcid: string
          id: string
          issued_at: string | null
          status: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          hcid: string
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          hcid?: string
          id?: string
          issued_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      health_events: {
        Row: {
          created_at: string | null
          event_timestamp: string | null
          event_type: string
          hcid: string
          id: string
          payload: Json | null
          source: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string | null
          event_timestamp?: string | null
          event_type: string
          hcid: string
          id?: string
          payload?: Json | null
          source?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string | null
          event_timestamp?: string | null
          event_type?: string
          hcid?: string
          id?: string
          payload?: Json | null
          source?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_events_hcid_fkey"
            columns: ["hcid"]
            isOneToOne: false
            referencedRelation: "health_cards"
            referencedColumns: ["hcid"]
          },
        ]
      }
      medical_history: {
        Row: {
          body_coordinates: Json | null
          created_at: string
          event_type: string
          hcid: string | null
          id: string
          notes: string | null
          symptoms: string | null
          triage_result: Json | null
          user_id: string
          vitals: Json | null
        }
        Insert: {
          body_coordinates?: Json | null
          created_at?: string
          event_type: string
          hcid?: string | null
          id?: string
          notes?: string | null
          symptoms?: string | null
          triage_result?: Json | null
          user_id: string
          vitals?: Json | null
        }
        Update: {
          body_coordinates?: Json | null
          created_at?: string
          event_type?: string
          hcid?: string | null
          id?: string
          notes?: string | null
          symptoms?: string | null
          triage_result?: Json | null
          user_id?: string
          vitals?: Json | null
        }
        Relationships: []
      }
      medical_qr_tokens: {
        Row: {
          created_at: string
          hcid: string
          id: string
          is_active: boolean
          last_accessed_at: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hcid: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          hcid?: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          email: string | null
          id: string
          locale: string | null
          mobile: string | null
          name: string | null
          sex: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          id: string
          locale?: string | null
          mobile?: string | null
          name?: string | null
          sex?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          locale?: string | null
          mobile?: string | null
          name?: string | null
          sex?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
