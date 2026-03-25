export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      aircraft_documents: {
        Row: {
          aircraft_id: string
          created_at: string | null
          document_status_id: string
          document_type: string
          document_url: string
          id: string
          rejected_reason: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_id: string
          created_at?: string | null
          document_status_id: string
          document_type: string
          document_url: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_id?: string
          created_at?: string | null
          document_status_id?: string
          document_type?: string
          document_url?: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_documents_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircrafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aircraft_documents_document_status_id_fkey"
            columns: ["document_status_id"]
            isOneToOne: false
            referencedRelation: "document_status"
            referencedColumns: ["id"]
          },
        ]
      }
      aircrafts: {
        Row: {
          created_at: string | null
          id: string
          manufacturer: string | null
          model: string
          owner_id: string
          photos: string[]
          range_km: number | null
          seats: number
          tail_number: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model: string
          owner_id: string
          photos?: string[]
          range_km?: number | null
          seats: number
          tail_number: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model?: string
          owner_id?: string
          photos?: string[]
          range_km?: number | null
          seats?: number
          tail_number?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aircrafts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      airports: {
        Row: {
          city: string
          country: string
          created_at: string | null
          iata_code: string
          icao_code: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          iata_code: string
          icao_code?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          iata_code?: string
          icao_code?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crew_documents: {
        Row: {
          created_at: string | null
          crew_member_id: string
          document_status_id: string
          document_type: string
          document_url: string
          id: string
          rejected_reason: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crew_member_id: string
          document_status_id: string
          document_type: string
          document_url: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crew_member_id?: string
          document_status_id?: string
          document_type?: string
          document_url?: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_documents_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_documents_document_status_id_fkey"
            columns: ["document_status_id"]
            isOneToOne: false
            referencedRelation: "document_status"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string | null
          crew_role_id: string
          email: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          license_number: string | null
          owner_id: string
          phone: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crew_role_id: string
          email?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          license_number?: string | null
          owner_id: string
          phone?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crew_role_id?: string
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          license_number?: string | null
          owner_id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_crew_role_id_fkey"
            columns: ["crew_role_id"]
            isOneToOne: false
            referencedRelation: "crew_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_members_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_roles: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_status: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      flight_crew: {
        Row: {
          created_at: string | null
          crew_member_id: string
          flight_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crew_member_id: string
          flight_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crew_member_id?: string
          flight_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_crew_crew_member_id_fkey"
            columns: ["crew_member_id"]
            isOneToOne: false
            referencedRelation: "crew_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_crew_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_manifests: {
        Row: {
          created_at: string | null
          file_url: string
          flight_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_url: string
          flight_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string
          flight_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_manifests_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_reviews: {
        Row: {
          created_at: string | null
          flight_id: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          flight_id: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          flight_id?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_reviews_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_reviews_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_status: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      flights: {
        Row: {
          aircraft_id: string
          arrival_airport_id: string
          arrival_datetime: string
          arrival_fbo_name: string | null
          available_seats: number
          created_at: string | null
          currency: string | null
          departure_airport_id: string
          departure_datetime: string
          departure_fbo_name: string | null
          duration_minutes: number | null
          flight_code: string | null
          flight_plan_url: string | null
          flight_type: string
          id: string
          is_visible: boolean | null
          owner_id: string
          price_full_aircraft: number
          price_per_seat: number
          return_departure_datetime: string | null
          status_id: string
          total_seats: number
          updated_at: string | null
        }
        Insert: {
          aircraft_id: string
          arrival_airport_id: string
          arrival_datetime: string
          arrival_fbo_name?: string | null
          available_seats: number
          created_at?: string | null
          currency?: string | null
          departure_airport_id: string
          departure_datetime: string
          departure_fbo_name?: string | null
          duration_minutes?: number | null
          flight_code?: string | null
          flight_plan_url?: string | null
          flight_type: string
          id?: string
          is_visible?: boolean | null
          owner_id: string
          price_full_aircraft: number
          price_per_seat: number
          return_departure_datetime?: string | null
          status_id: string
          total_seats: number
          updated_at?: string | null
        }
        Update: {
          aircraft_id?: string
          arrival_airport_id?: string
          arrival_datetime?: string
          arrival_fbo_name?: string | null
          available_seats?: number
          created_at?: string | null
          currency?: string | null
          departure_airport_id?: string
          departure_datetime?: string
          departure_fbo_name?: string | null
          duration_minutes?: number | null
          flight_code?: string | null
          flight_plan_url?: string | null
          flight_type?: string
          id?: string
          is_visible?: boolean | null
          owner_id?: string
          price_full_aircraft?: number
          price_per_seat?: number
          return_departure_datetime?: string | null
          status_id?: string
          total_seats?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flights_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircrafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_arrival_airport_id_fkey"
            columns: ["arrival_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_departure_airport_id_fkey"
            columns: ["departure_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flights_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "flight_status"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          created_at: string | null
          fleet_name: string | null
          id: string
          status: string
          stripe_account_id: string | null
          stripe_charges_enabled: boolean | null
          stripe_details_submitted: boolean | null
          stripe_onboarding_completed_at: string | null
          stripe_payouts_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fleet_name?: string | null
          id?: string
          status?: string
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_details_submitted?: boolean | null
          stripe_onboarding_completed_at?: string | null
          stripe_payouts_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fleet_name?: string | null
          id?: string
          status?: string
          stripe_account_id?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_details_submitted?: boolean | null
          stripe_onboarding_completed_at?: string | null
          stripe_payouts_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "owners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_mobius_total: number
          amount_owner_net: number
          amount_total_paid: number
          base_price: number
          created_at: string | null
          flight_id: string
          id: string
          mobius_commission_amount: number
          mobius_commission_rate: number
          mobius_commission_vat_amount: number
          paid_at: string | null
          passenger_fee_amount: number
          passenger_fee_rate: number
          payer_email: string
          raw_stripe_payload: Json | null
          reservation_id: string
          status: string
          stripe_charge_id: string | null
          stripe_checkout_session_id: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
          vat_amount_total: number
          vat_rate: number
        }
        Insert: {
          amount_mobius_total: number
          amount_owner_net: number
          amount_total_paid: number
          base_price: number
          created_at?: string | null
          flight_id: string
          id?: string
          mobius_commission_amount: number
          mobius_commission_rate: number
          mobius_commission_vat_amount: number
          paid_at?: string | null
          passenger_fee_amount: number
          passenger_fee_rate: number
          payer_email: string
          raw_stripe_payload?: Json | null
          reservation_id: string
          status: string
          stripe_charge_id?: string | null
          stripe_checkout_session_id: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount_total: number
          vat_rate: number
        }
        Update: {
          amount_mobius_total?: number
          amount_owner_net?: number
          amount_total_paid?: number
          base_price?: number
          created_at?: string | null
          flight_id?: string
          id?: string
          mobius_commission_amount?: number
          mobius_commission_rate?: number
          mobius_commission_vat_amount?: number
          paid_at?: string | null
          passenger_fee_amount?: number
          passenger_fee_rate?: number
          payer_email?: string
          raw_stripe_payload?: Json | null
          reservation_id?: string
          status?: string
          stripe_charge_id?: string | null
          stripe_checkout_session_id?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vat_amount_total?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_passengers: {
        Row: {
          created_at: string | null
          date_of_birth: string
          document_type: string
          document_url: string | null
          full_name: string
          gender: string | null
          guardian_passenger_id: string | null
          id: string
          is_minor: boolean | null
          reservation_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          document_type: string
          document_url?: string | null
          full_name: string
          gender?: string | null
          guardian_passenger_id?: string | null
          id?: string
          is_minor?: boolean | null
          reservation_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          document_type?: string
          document_url?: string | null
          full_name?: string
          gender?: string | null
          guardian_passenger_id?: string | null
          id?: string
          is_minor?: boolean | null
          reservation_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_passengers_guardian_passenger_id_fkey"
            columns: ["guardian_passenger_id"]
            isOneToOne: false
            referencedRelation: "reservation_passengers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_passengers_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_status: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          base_price_total: number
          booking_reference: string
          confirmed_at: string | null
          contact_email: string
          contact_full_name: string
          contact_phone: string | null
          created_at: string | null
          flight_id: string
          id: string
          reservation_status_id: string
          seats_requested: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_price_total: number
          booking_reference: string
          confirmed_at?: string | null
          contact_email: string
          contact_full_name: string
          contact_phone?: string | null
          created_at?: string | null
          flight_id: string
          id?: string
          reservation_status_id: string
          seats_requested: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_price_total?: number
          booking_reference?: string
          confirmed_at?: string | null
          contact_email?: string
          contact_full_name?: string
          contact_phone?: string | null
          created_at?: string | null
          flight_id?: string
          id?: string
          reservation_status_id?: string
          seats_requested?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_reservation_status_id_fkey"
            columns: ["reservation_status_id"]
            isOneToOne: false
            referencedRelation: "reservation_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_hash: string
          payload: Json
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp_hash: string
          payload: Json
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_hash?: string
          payload?: Json
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string | null
          document_status_id: string
          document_type: string
          document_url: string
          id: string
          rejected_reason: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_status_id: string
          document_type: string
          document_url: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_status_id?: string
          document_type?: string
          document_url?: string
          id?: string
          rejected_reason?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_document_status_id_fkey"
            columns: ["document_status_id"]
            isOneToOne: false
            referencedRelation: "document_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          country_code: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          nationality: string | null
          phone: string | null
          role: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          nationality?: string | null
          phone?: string | null
          role: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          nationality?: string | null
          phone?: string | null
          role?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
