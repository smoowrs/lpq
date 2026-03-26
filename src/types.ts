export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export type PlanType = 'free' | 'starter' | 'pro' | 'elite' | 'vitalicio';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  plan: PlanType;
  lessonsCompleted: number;
  phone?: string;
  cpf?: string;
  level?: number;
  exp?: number;
  balance?: number;
  subscriptionEndAt?: string; // ISO date string
  billingCycle?: 'monthly' | 'annual';
  yupooAccess?: boolean;
  aiCredits?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoId: string; // YouTube ID
  duration: string;
  isCompleted: boolean;
  plans: PlanType[]; // Array of plans that can access this lesson
  requiredPlan?: PlanType;
  thumbnailUrl?: string; // Optional cover image for the lesson
  sequenceOrder?: number;
}

export interface UserLessonProgress {
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  last_watched_at: string;
  stopped_at: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  modules: number;
  progress: number; // 0-100
  plans: PlanType[]; // Array of plans that can access this course
  category: string; // Row/Category identification
  requiredPlan?: PlanType;
  lessons: Lesson[];
}

export interface TrackingItem {
  id: string;
  code: string;
  nickname: string;
  status: string;
  location: string;
  updatedAt: string;
  timeline: { date: string; status: string; location: string }[];
}

export interface Product {
  id: string;
  title: string;
  pricecny: number;
  imageUrl: string;
  category: string;
  niche?: string;
  cssBuyLink: string;
  factoryLink?: string;
  plans: PlanType[];
  status?: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  submittedByUser?: { name: string; email: string };
  createdAt?: string;
  sequenceOrder?: number;
}


export interface Factory {
  id: string;
  name: string;
  location: string;
  rating: number; // 1-5
  mainProducts: string[];
  niche?: string;
  plans: PlanType[]; // Changed from optional to required or verified format
  imageUrl: string;
  url: string;
  sequenceOrder?: number;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
  parentId?: string;
}

export interface Post {
  id: string;
  user: User;
  imageUrl?: string;
  videoUrl?: string; // Legacy support or single video
  mediaUrls?: string[]; // New: Multiple media items
  mediaType?: 'image' | 'video' | 'mixed'; // New: Media type
  content: string;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected'; // New: Moderation status
  is_pinned?: boolean; // New: Pinned status
}

export enum ConnectAIStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface TicketReply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPlan?: PlanType;
  subject: string;
  message: string;
  status: 'Aguardando' | 'Respondido' | 'Fechado' | 'Concluído';
  createdAt: string;
  category: string;
  response?: string; // Legacy support for single response
  replies?: TicketReply[];
}

export interface CommunityNotification {
  id: string;
  userId: string;
  actor: {
    name: string;
    avatarUrl?: string;
    level?: number;
  };
  type: 'like' | 'comment' | 'reply' | 'tracking_update' | 'ticket_reply';
  postId: string;
  read: boolean;
  createdAt: string;
  trackingId?: string;
}

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
}

export interface ReferralHistory {
  id: string;
  referrer_id: string;
  referred_id: string;
  event_type: 'signup' | 'purchase';
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  referred_user?: {
    name: string;
    email: string;
  };
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  pix_key: string;
  status: 'pending' | 'paid' | 'rejected';
  created_at: string;
  updated_at: string;
}