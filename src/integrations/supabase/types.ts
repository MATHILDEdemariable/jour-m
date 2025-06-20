export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          assigned_to: string[] | null
          category: string | null
          created_at: string
          description: string | null
          event_id: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          google_drive_id: string | null
          google_drive_url: string | null
          id: string
          is_shared: boolean | null
          mime_type: string | null
          name: string
          preview_url: string | null
          source: string | null
          tenant_id: string
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          google_drive_id?: string | null
          google_drive_url?: string | null
          id?: string
          is_shared?: boolean | null
          mime_type?: string | null
          name: string
          preview_url?: string | null
          source?: string | null
          tenant_id: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          google_drive_id?: string | null
          google_drive_url?: string | null
          id?: string
          is_shared?: boolean | null
          mime_type?: string | null
          name?: string
          preview_url?: string | null
          source?: string | null
          tenant_id?: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      event_configurations: {
        Row: {
          auto_backup_enabled: boolean
          created_at: string
          event_id: string
          guest_access_enabled: boolean
          id: string
          logo_url: string | null
          notifications_enabled: boolean
          realtime_sync_enabled: boolean
          tenant_id: string
          theme_color: string
          updated_at: string
        }
        Insert: {
          auto_backup_enabled?: boolean
          created_at?: string
          event_id: string
          guest_access_enabled?: boolean
          id?: string
          logo_url?: string | null
          notifications_enabled?: boolean
          realtime_sync_enabled?: boolean
          tenant_id: string
          theme_color?: string
          updated_at?: string
        }
        Update: {
          auto_backup_enabled?: boolean
          created_at?: string
          event_id?: string
          guest_access_enabled?: boolean
          id?: string
          logo_url?: string | null
          notifications_enabled?: boolean
          realtime_sync_enabled?: boolean
          tenant_id?: string
          theme_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_configurations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_configurations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      event_roles: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_active: boolean
          is_default: boolean
          role_name: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          role_name: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          role_name?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_roles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      event_share_tokens: {
        Row: {
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          token: string
        }
        Insert: {
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          token: string
        }
        Update: {
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_share_tokens_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          name: string
          start_time: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          name: string
          start_time?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          name?: string
          start_time?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      google_drive_configs: {
        Row: {
          access_token: string | null
          created_at: string
          event_id: string
          folder_id: string
          folder_url: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          event_id: string
          folder_id: string
          folder_url?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          event_id?: string
          folder_id?: string
          folder_url?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_drive_configs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "google_drive_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          availability_notes: string | null
          confirmation_status: string | null
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          availability_notes?: string | null
          confirmation_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          availability_notes?: string | null
          confirmation_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_person_id: string | null
          assigned_role: string | null
          assigned_vendor_id: string | null
          category_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          event_id: string | null
          id: string
          notes: string | null
          order_index: number | null
          priority: string | null
          status: string | null
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          priority?: string | null
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_person_id?: string | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          event_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          priority?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_person_id_fkey"
            columns: ["assigned_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          role: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string | null
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_items: {
        Row: {
          assigned_person_id: string | null
          assigned_person_ids: string[] | null
          assigned_role: string | null
          assigned_vendor_id: string | null
          assigned_vendor_ids: string[] | null
          category: string | null
          created_at: string
          description: string | null
          duration: number
          event_id: string
          id: string
          notes: string | null
          order_index: number | null
          priority: string | null
          status: string | null
          tenant_id: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          assigned_vendor_ids?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          event_id: string
          id?: string
          notes?: string | null
          order_index?: number | null
          priority?: string | null
          status?: string | null
          tenant_id: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          assigned_vendor_ids?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          event_id?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          priority?: string | null
          status?: string | null
          tenant_id?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_items_assigned_person_id_fkey"
            columns: ["assigned_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          contract_status: string | null
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          service_type: string | null
          tenant_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          contract_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          service_type?: string | null
          tenant_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          contract_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          service_type?: string | null
          tenant_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
