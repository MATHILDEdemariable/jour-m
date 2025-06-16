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
      admin_settings: {
        Row: {
          created_at: string | null
          id: number
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
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
          uploaded_by: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
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
          uploaded_by?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
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
          uploaded_by?: string | null
          user_id?: string | null
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
          auto_backup_enabled: boolean | null
          created_at: string | null
          event_id: string | null
          guest_access_enabled: boolean | null
          id: string
          logo_url: string | null
          notifications_enabled: boolean | null
          realtime_sync_enabled: boolean | null
          tenant_id: string
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          auto_backup_enabled?: boolean | null
          created_at?: string | null
          event_id?: string | null
          guest_access_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          notifications_enabled?: boolean | null
          realtime_sync_enabled?: boolean | null
          tenant_id: string
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_backup_enabled?: boolean | null
          created_at?: string | null
          event_id?: string | null
          guest_access_enabled?: boolean | null
          id?: string
          logo_url?: string | null
          notifications_enabled?: boolean | null
          realtime_sync_enabled?: boolean | null
          tenant_id?: string
          theme_color?: string | null
          updated_at?: string | null
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
      event_documents: {
        Row: {
          assigned_to: string[] | null
          created_at: string | null
          event_id: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          source: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string[] | null
          created_at?: string | null
          event_id: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          source?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string[] | null
          created_at?: string | null
          event_id?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          source?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      event_roles: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          role_name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          role_name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          role_name?: string
          tenant_id?: string
          updated_at?: string | null
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
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_type: string
          google_drive_url: string | null
          id: string
          location: string | null
          magic_word: string | null
          name: string
          share_token: string | null
          slug: string
          start_time: string | null
          status: string
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_type: string
          google_drive_url?: string | null
          id?: string
          location?: string | null
          magic_word?: string | null
          name: string
          share_token?: string | null
          slug: string
          start_time?: string | null
          status?: string
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_type?: string
          google_drive_url?: string | null
          id?: string
          location?: string | null
          magic_word?: string | null
          name?: string
          share_token?: string | null
          slug?: string
          start_time?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          event_id: string
          folder_id: string
          folder_url: string | null
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          event_id: string
          folder_id: string
          folder_url?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          event_id?: string
          folder_id?: string
          folder_url?: string | null
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "google_drive_configs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
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
          tenant_id: string
          updated_at: string | null
          user_id: string | null
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
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
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
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          tenant_id: string
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
          tenant_id: string
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
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_categories_tenant_id_fkey"
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
          assigned_person_ids: string[] | null
          assigned_role: string | null
          assigned_vendor_id: string | null
          category_id: string | null
          completed_at: string | null
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
          tenant_id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          completed_at?: string | null
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
          tenant_id: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category_id?: string | null
          completed_at?: string | null
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
          tenant_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["tenant_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["tenant_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["tenant_role"]
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
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
      timeline_items: {
        Row: {
          assigned_person_id: string | null
          assigned_person_ids: string[] | null
          assigned_role: string | null
          assigned_vendor_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: number
          event_id: string
          id: string
          notes: string | null
          order_index: number
          priority: string | null
          status: string | null
          tenant_id: string
          time: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number
          event_id: string
          id?: string
          notes?: string | null
          order_index?: number
          priority?: string | null
          status?: string | null
          tenant_id: string
          time?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_person_id?: string | null
          assigned_person_ids?: string[] | null
          assigned_role?: string | null
          assigned_vendor_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number
          event_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          priority?: string | null
          status?: string | null
          tenant_id?: string
          time?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
          tenant_id: string
          updated_at: string | null
          user_id: string | null
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
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
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
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
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
      get_current_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_member_of_tenant: {
        Args: { p_tenant_id: string }
        Returns: boolean
      }
      recalculate_timeline: {
        Args: { event_uuid: string }
        Returns: undefined
      }
      regenerate_event_share_token: {
        Args: { event_id: string }
        Returns: string
      }
    }
    Enums: {
      tenant_role: "owner" | "admin" | "member"
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
    Enums: {
      tenant_role: ["owner", "admin", "member"],
    },
  },
} as const
