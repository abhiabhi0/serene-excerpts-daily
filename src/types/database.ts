export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id?: string
          current_streak?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          last_updated?: string
        }
      }
      morning_rituals: {
        Row: {
          id: string
          user_id: string
          date: string
          items: Json
        }
        Insert: {
          id?: string
          user_id?: string
          date: string
          items: Json
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          items?: Json
        }
      }
      user_practice_data: {
        Row: {
          id: string
          user_id: string
          gratitudes: Json
          affirmations: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          gratitudes?: Json
          affirmations?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gratitudes?: Json
          affirmations?: Json
          updated_at?: string
        }
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
  }
} 