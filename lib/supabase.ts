import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'cliente' | 'experto' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

export type ProjectCategory = 'Facturación' | 'RRHH' | 'Ventas' | 'Marketing' | 'Operaciones' | 'Otros'

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  budget?: number
  deadline?: string
  status: 'abierto' | 'en_proceso' | 'completado' | 'cancelado'
  user_id: string
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  title: string
  description: string
  category: ProjectCategory
  budget?: number
  deadline?: string
}

export interface Conversation {
  id: string
  project_id: string
  client_id: string
  expert_id: string
  created_at: string
  project?: Project
  client?: UserProfile
  expert?: UserProfile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_text: string
  created_at: string
  sender?: UserProfile
}

export interface ConversationWithLastMessage extends Conversation {
  last_message?: Message
  unread_count?: number
}

// Nuevos tipos para el sistema de pagos
export interface Payment {
  id: string
  project_id: string
  client_id: string
  expert_id: string
  amount: number
  commission: number
  expert_amount: number
  currency: string
  status: 'pending' | 'paid' | 'released' | 'refunded' | 'disputed'
  stripe_payment_intent_id: string
  stripe_transfer_id?: string
  created_at: string
  updated_at: string
  released_at?: string
  project?: Project
  client?: UserProfile
  expert?: UserProfile
}

export interface CreatePaymentData {
  project_id: string
  expert_id: string
  amount: number
}

export interface PaymentReleaseData {
  payment_id: string
  project_id: string
  expert_id: string
}

// Nuevos tipos para el sistema de propuestas
export interface Proposal {
  id: string
  project_id: string
  expert_id: string
  price: number
  estimated_days: number
  message: string
  status: 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
  project?: Project
  expert?: UserProfile
}

export interface CreateProposalData {
  project_id: string
  price: number
  estimated_days: number
  message: string
}

export interface Contract {
  id: string
  project_id: string
  client_id: string
  expert_id: string
  proposal_id: string
  agreed_price: number
  start_date: string
  status: 'active' | 'completed' | 'disputed'
  completed_at?: string
  created_at: string
  updated_at: string
  project?: Project
  client?: UserProfile
  expert?: UserProfile
  proposal?: Proposal
}

// Nuevos tipos para el sistema de notificaciones
export type NotificationType = 'NEW_MESSAGE' | 'NEW_PROPOSAL' | 'PROPOSAL_ACCEPTED' | 'PAYMENT_REQUIRED' | 'REVIEW_REQUEST'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  payload: Record<string, any>
  read: boolean
  created_at: string
  user?: UserProfile
}

export interface CreateNotificationData {
  user_id: string
  type: NotificationType
  payload: Record<string, any>
}
