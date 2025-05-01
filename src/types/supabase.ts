
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
      clients: {
        Row: {
          id: string
          name: string
          email: string
          address: string
          phone: string | null
          company: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          address: string
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          address?: string
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          description: string
          quantity: number
          price: number
          invoice_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          quantity: number
          price: number
          invoice_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          quantity?: number
          price?: number
          invoice_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          client_id: string
          date: string
          due_date: string
          notes: string | null
          status: "draft" | "sent" | "paid" | "overdue"
          total_amount: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_id: string
          date: string
          due_date: string
          notes?: string | null
          status: "draft" | "sent" | "paid" | "overdue"
          total_amount: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_id?: string
          date?: string
          due_date?: string
          notes?: string | null
          status?: "draft" | "sent" | "paid" | "overdue"
          total_amount?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          type: "credit_card" | "bank_transfer" | "paypal"
          details: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: "credit_card" | "bank_transfer" | "paypal"
          details: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: "credit_card" | "bank_transfer" | "paypal"
          details?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
