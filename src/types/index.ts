export type TipStatus = 'WON' | 'LOST' | 'PENDING' | 'VOID';
export type RiskLevel = 'Safe' | 'Moderate' | 'Aggressive';
export type MatchStatus = 'PENDING' | 'WON' | 'LOST' | 'LIVE';

export interface MatchSelection {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoffTime: string;
  prediction: string;
  marketType: string;
  odds: number;
  reasoning: string;
  matchStatus: MatchStatus;
  score?: string;
}

export interface BookingCode {
  bookmaker: string;
  code: string;
  region?: string;
}

export interface RolloverTip {
  id: string;
  challengeId: string;
  challengeName: string;
  dayNumber: number;
  totalDays: number;
  date: string;
  status: TipStatus;
  startingStake: number;
  currentStake: number;
  targetPayout: number;
  totalOdds: number;
  confidence: number; // e.g. 95%
  riskLevel: RiskLevel;
  adminNote?: string;
  matches: MatchSelection[];
  bookingCodes: BookingCode[];
  reactions: {
    fire: number;
    target: number;
    money: number;
    cold: number;
  };
  viewsCount: number;
  copiesCount: number;
  followedCount: number;
  createdAt: string;
  settledAt?: string | null;
}

export type ActionCategory = 'engagement' | 'conversion' | 'community' | 'management';

export type ActionType =
  | 'tip_viewed'
  | 'booking_code_copied'
  | 'tip_followed'
  | 'reaction_added'
  | 'comment_posted'
  | 'calculator_simulated'
  | 'slip_shared'
  | 'user_registered'
  | 'user_login'
  | 'member_status_updated'
  | 'admin_tip_created'
  | 'admin_tip_updated'
  | 'admin_status_changed'
  | 'admin_tip_deleted'
  | 'admin_announcement_created'
  | 'admin_login';

export interface UserMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'verified' | 'veteran';
  status: 'active' | 'suspended';
  joinedAt: string;
  lastActiveAt: string;
  codesCopiedCount: number;
  tipsFollowedCount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorType: 'user' | 'admin';
  actorIdentifier: string;
  actionType: ActionType;
  category: ActionCategory;
  details: string;
  metadata?: Record<string, any>;
  device: string;
}

export interface TipComment {
  id: string;
  tipId: string;
  authorName: string;
  authorBadge: 'Member' | 'Verified Bettor' | 'Veteran' | 'Admin';
  text: string;
  timestamp: string;
  likes: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'live';
  active: boolean;
  createdAt: string;
}

export interface SystemMetrics {
  totalViews: number;
  totalCopies: number;
  totalFollows: number;
  activeStreak: number;
  overallWinRate: number;
  totalTipsCompleted: number;
  bankrollGrowthX: number;
  activeVisitorsNow: number;
  totalActivitiesCount: number;
}

export interface ChallengeSummary {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
  currentDay: number;
  totalDays: number;
  startingStake: number;
  currentBankroll: number;
  targetBankroll: number;
  currentStreak: number;
}
