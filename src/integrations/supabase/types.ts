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
          category: string | null
          created_at: string | null
          event_id: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_shared: boolean | null
          name: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_shared?: boolean | null
          name: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_shared?: boolean | null
          name?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          id: string
          location: string | null
          name: string
          start_time: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          location?: string | null
          name: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          name?: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      people: {
        Row: {
          availability_notes: string | null
          avatar_url: string | null
          confirmation_status: string | null
          created_at: string | null
          custom_role: string | null
          dietary_restrictions: string | null
          email: string | null
          event_id: string | null
          id: string
          is_vendor: boolean | null
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          availability_notes?: string | null
          avatar_url?: string | null
          confirmation_status?: string | null
          created_at?: string | null
          custom_role?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          is_vendor?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          availability_notes?: string | null
          avatar_url?: string | null
          confirmation_status?: string | null
          created_at?: string | null
          custom_role?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          is_vendor?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "people_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      task_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          event_id: string | null
          icon: string | null
          id: string
          is_template: boolean | null
          name: string
          order_index: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          icon?: string | null
          id?: string
          is_template?: boolean | null
          name: string
          order_index?: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          icon?: string | null
          id?: string
          is_template?: boolean | null
          name?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
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
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          duration_minutes: number
          event_id: string | null
          id: string
          is_template: boolean | null
          notes: string | null
          order_index: number
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          duration_minutes?: number
          event_id?: string | null
          id?: string
          is_template?: boolean | null
          notes?: string | null
          order_index?: number
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_person_id?: string | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          duration_minutes?: number
          event_id?: string | null
          id?: string
          is_template?: boolean | null
          notes?: string | null
          order_index?: number
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_at: string | null
          event_id: string | null
          id: string
          scheduled_end: string | null
          scheduled_start: string | null
          task_id: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          task_id?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          scheduled_end?: string | null
          scheduled_start?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          contract_status: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          email: string | null
          event_id: string | null
          final_price: number | null
          id: string
          internal_rating: number | null
          logo_url: string | null
          name: string
          notes: string | null
          payment_status: string | null
          phone: string | null
          quoted_price: number | null
          service_type: string | null
          setup_time: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          contract_status?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          email?: string | null
          event_id?: string | null
          final_price?: number | null
          id?: string
          internal_rating?: number | null
          logo_url?: string | null
          name: string
          notes?: string | null
          payment_status?: string | null
          phone?: string | null
          quoted_price?: number | null
          service_type?: string | null
          setup_time?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          contract_status?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          email?: string | null
          event_id?: string | null
          final_price?: number | null
          id?: string
          internal_rating?: number | null
          logo_url?: string | null
          name?: string
          notes?: string | null
          payment_status?: string | null
          phone?: string | null
          quoted_price?: number | null
          service_type?: string | null
          setup_time?: string | null
          updated_at?: string | null
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_timeline: {
        Args: { event_uuid: string }
        Returns: undefined
      }
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
