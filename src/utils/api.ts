// API helpers and local device/actor identification
import type {
  RolloverTip,
  ActivityLog,
  TipComment,
  Announcement,
  SystemMetrics,
  ChallengeSummary,
  ActionCategory,
  ActionType,
  UserMember,
} from '../types/index.ts';

// Generate or retrieve persistent anonymous user identifier
export function getUserIdentifier(): string {
  if (typeof window === 'undefined') return 'Guest Bettor';
  let userId = localStorage.getItem('rollover_user_id');
  if (!userId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const cities = ['London', 'Lagos', 'Nairobi', 'Berlin', 'Accra', 'Toronto', 'Johannesburg', 'Madrid'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    userId = `Punter-${randomNum} (${randomCity})`;
    localStorage.setItem('rollover_user_id', userId);
  }
  return userId;
}

export function getDeviceString(): string {
  if (typeof window === 'undefined') return 'Desktop Web';
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const browser = ua.includes('Chrome')
    ? 'Chrome'
    : ua.includes('Safari')
    ? 'Safari'
    : ua.includes('Firefox')
    ? 'Firefox'
    : 'Browser';
  return `${isMobile ? 'Mobile' : 'Desktop'} / ${browser}`;
}

// Odds formatting utility
export type OddsFormat = 'decimal' | 'fractional' | 'american';

export function formatOdds(decimal: number, format: OddsFormat = 'decimal'): string {
  if (!decimal || decimal <= 1) return '1.00';
  if (format === 'decimal') {
    return decimal.toFixed(2);
  }
  if (format === 'fractional') {
    const decMinus1 = decimal - 1;
    // Common fractional representations
    if (Math.abs(decMinus1 - 0.25) < 0.03) return '1/4';
    if (Math.abs(decMinus1 - 0.33) < 0.03) return '1/3';
    if (Math.abs(decMinus1 - 0.35) < 0.03) return '7/20';
    if (Math.abs(decMinus1 - 0.37) < 0.03) return '37/100';
    if (Math.abs(decMinus1 - 0.4) < 0.03) return '2/5';
    if (Math.abs(decMinus1 - 0.5) < 0.03) return '1/2';
    if (Math.abs(decMinus1 - 0.6) < 0.03) return '3/5';
    if (Math.abs(decMinus1 - 0.75) < 0.03) return '3/4';
    if (Math.abs(decMinus1 - 1.0) < 0.03) return '1/1';
    const rounded = Math.round(decMinus1 * 100);
    return `${rounded}/100`;
  }
  if (format === 'american') {
    if (decimal >= 2.0) {
      return `+${Math.round((decimal - 1) * 100)}`;
    } else {
      return `-${Math.round(100 / (decimal - 1))}`;
    }
  }
  return decimal.toFixed(2);
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  } catch {
    return dateString;
  }
}

// API Calls
export async function fetchTipsAndChallenge(): Promise<{
  tips: RolloverTip[];
  activeChallenge: ChallengeSummary;
}> {
  const res = await fetch('/api/tips');
  if (!res.ok) throw new Error('Failed to fetch tips');
  return res.json();
}

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('rollover_admin_token') || '';
}

export function getAdminHeaders(): Record<string, string> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    'x-admin-token': token,
  };
}

export async function fetchActivities(filters?: {
  category?: string;
  actorType?: string;
  search?: string;
  limit?: number;
}): Promise<{ activities: ActivityLog[]; totalCount: number }> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.actorType) params.append('actorType', filters.actorType);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const res = await fetch(`/api/activities?${params.toString()}`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function logUserActivity(
  actionType: ActionType,
  category: ActionCategory,
  details: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorType: 'user',
        actorIdentifier: getUserIdentifier(),
        actionType,
        category,
        details,
        metadata,
        device: getDeviceString(),
      }),
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

export async function trackTipView(tipId: string): Promise<void> {
  try {
    await fetch(`/api/tips/${tipId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userIdentifier: getUserIdentifier(),
        device: getDeviceString(),
      }),
    });
  } catch (err) {
    console.error('Failed to track view:', err);
  }
}

export async function trackBookingCodeCopy(
  tipId: string,
  bookmaker: string,
  code: string
): Promise<void> {
  try {
    await fetch(`/api/tips/${tipId}/copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookmaker,
        code,
        userIdentifier: getUserIdentifier(),
        device: getDeviceString(),
      }),
    });
  } catch (err) {
    console.error('Failed to track code copy:', err);
  }
}

export async function trackTipFollow(tipId: string, stake: number): Promise<number> {
  const res = await fetch(`/api/tips/${tipId}/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stake,
      userIdentifier: getUserIdentifier(),
      device: getDeviceString(),
    }),
  });
  const data = await res.json();
  return data.followedCount;
}

export async function addTipReaction(
  tipId: string,
  reactionType: 'fire' | 'target' | 'money' | 'cold'
): Promise<any> {
  const res = await fetch(`/api/tips/${tipId}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reactionType,
      userIdentifier: getUserIdentifier(),
      device: getDeviceString(),
    }),
  });
  return res.json();
}

export async function fetchTipComments(tipId: string): Promise<TipComment[]> {
  const res = await fetch(`/api/tips/${tipId}/comments`);
  const data = await res.json();
  return data.comments || [];
}

export async function postTipComment(
  tipId: string,
  text: string,
  authorName?: string,
  authorBadge?: string
): Promise<TipComment> {
  const res = await fetch(`/api/tips/${tipId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      authorName,
      authorBadge,
      userIdentifier: getUserIdentifier(),
      device: getDeviceString(),
    }),
  });
  const data = await res.json();
  return data.comment;
}

export async function fetchSystemMetrics(): Promise<SystemMetrics> {
  const res = await fetch('/api/metrics');
  const data = await res.json();
  return data.metrics;
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await fetch('/api/announcements');
  const data = await res.json();
  return data.announcements || [];
}

export async function postAnnouncement(title: string, message: string, type: string): Promise<any> {
  const res = await fetch('/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, message, type }),
  });
  return res.json();
}

export async function deleteAnnouncement(id: string): Promise<any> {
  return fetch(`/api/announcements/${id}`, { method: 'DELETE' });
}

export async function verifyAdminCredentials(credentials: {
  username: string;
  password: string;
}): Promise<boolean> {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.ok;
}

export async function verifyAdminPin(pin: string): Promise<boolean> {
  return verifyAdminCredentials({ username: 'Vip', password: pin });
}

export async function changeAdminCredentials(
  currentPassword: string,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/admin/change-credentials', {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({ currentPassword, newUsername, newPassword }),
  });
  return res.json();
}

export async function changeAdminPin(oldPin: string, newPin: string): Promise<any> {
  return changeAdminCredentials(oldPin, undefined, newPin);
}

export async function createTip(tipData: Partial<RolloverTip>): Promise<RolloverTip> {
  const res = await fetch('/api/tips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipData),
  });
  const data = await res.json();
  return data.tip;
}

export async function updateTip(id: string, tipData: Partial<RolloverTip>): Promise<RolloverTip> {
  const res = await fetch(`/api/tips/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipData),
  });
  const data = await res.json();
  return data.tip;
}

export async function updateTipStatus(
  id: string,
  status: 'WON' | 'LOST' | 'PENDING' | 'VOID',
  matches?: any[]
): Promise<any> {
  const res = await fetch(`/api/tips/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, matches }),
  });
  return res.json();
}

export async function deleteTip(id: string): Promise<any> {
  const res = await fetch(`/api/tips/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function clearAllActivities(): Promise<any> {
  const res = await fetch('/api/activities', {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  return res.json();
}

// ----------------- MEMBER AUTHENTICATION API ----------------- //

export function getStoredMember(): UserMember | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('rollover_member_session');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserMember;
  } catch {
    return null;
  }
}

export function saveMemberSession(member: UserMember): void {
  localStorage.setItem('rollover_member_session', JSON.stringify(member));
  localStorage.setItem('rollover_user_id', `${member.name} (${member.email})`);
}

export function clearMemberSession(): void {
  localStorage.removeItem('rollover_member_session');
}

export async function registerMember(data: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}): Promise<{ success: boolean; member?: UserMember; message?: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (resData.success && resData.member) {
    saveMemberSession(resData.member);
  }
  return resData;
}

export async function loginMember(data: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; member?: UserMember; message?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await res.json();
  if (resData.success && resData.member) {
    saveMemberSession(resData.member);
  }
  return resData;
}

// ----------------- ADMIN MEMBERS DIRECTORY API ----------------- //

export async function fetchAdminMembers(): Promise<UserMember[]> {
  const res = await fetch('/api/admin/members', {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch members');
  const data = await res.json();
  return data.members || [];
}

export async function updateAdminMember(
  id: string,
  updates: { role?: 'member' | 'verified' | 'veteran'; status?: 'active' | 'suspended' }
): Promise<UserMember> {
  const res = await fetch(`/api/admin/members/${id}`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  return data.member;
}

export async function deleteAdminMember(id: string): Promise<any> {
  const res = await fetch(`/api/admin/members/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  return res.json();
}
