import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Persistent JSON Database Setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  adminUsername?: string;
  adminPassword?: string;
  adminPin?: string;
  activeChallenge: ChallengeSummary;
  tips: RolloverTip[];
  activities: ActivityLog[];
  comments: TipComment[];
  announcements: Announcement[];
  members: (UserMember & { password?: string })[];
}

function getInitialDatabase(): DatabaseSchema {
  const initialTips: RolloverTip[] = [
    {
      id: 'tip-day-1',
      challengeId: 'chal-10day-oct',
      challengeName: '10-Day Safe Rollover Challenge ($20 -> $500)',
      dayNumber: 1,
      totalDays: 10,
      date: '2026-10-11',
      status: 'WON',
      startingStake: 20.0,
      currentStake: 20.0,
      targetPayout: 27.0,
      totalOdds: 1.35,
      confidence: 96,
      riskLevel: 'Safe',
      adminNote: 'Clean kickoff to the 10-day sprint. Controlled risk with European home favorites.',
      matches: [
        {
          id: 'm1-1',
          sport: 'Football / Soccer',
          league: 'Premier League',
          homeTeam: 'Manchester City',
          awayTeam: 'Fulham',
          kickoffTime: '15:00 GMT',
          prediction: 'Man City Win & Over 1.5 Goals',
          marketType: '1 & Over 1.5',
          odds: 1.22,
          reasoning: 'City averaging 2.8 goals at home; Haaland fit and starting.',
          matchStatus: 'WON',
          score: '3 - 1',
        },
        {
          id: 'm1-2',
          sport: 'Football / Soccer',
          league: 'La Liga',
          homeTeam: 'Barcelona',
          awayTeam: 'Getafe',
          kickoffTime: '20:00 GMT',
          prediction: 'Barcelona Win or Draw (1X)',
          marketType: 'Double Chance 1X',
          odds: 1.11,
          reasoning: 'Barcelona unbeaten at home in last 14 fixtures.',
          matchStatus: 'WON',
          score: '2 - 0',
        },
      ],
      bookingCodes: [
        { bookmaker: 'SportyBet', code: 'BC7719A', region: 'Global' },
        { bookmaker: '1xBet', code: 'XB8821Q', region: 'Global' },
        { bookmaker: 'Bet9ja', code: 'B9J-3341', region: 'Nigeria' },
        { bookmaker: 'Betway', code: 'BW-9012', region: 'Kenya/SA' },
      ],
      reactions: { fire: 42, target: 35, money: 28, cold: 1 },
      viewsCount: 384,
      copiesCount: 215,
      followedCount: 168,
      createdAt: '2026-10-11T08:00:00Z',
      settledAt: '2026-10-11T22:30:00Z',
    },
    {
      id: 'tip-day-2',
      challengeId: 'chal-10day-oct',
      challengeName: '10-Day Safe Rollover Challenge ($20 -> $500)',
      dayNumber: 2,
      totalDays: 10,
      date: '2026-10-12',
      status: 'WON',
      startingStake: 20.0,
      currentStake: 27.0,
      targetPayout: 37.8,
      totalOdds: 1.4,
      confidence: 94,
      riskLevel: 'Safe',
      adminNote: 'Staking total profit from Day 1 ($27.00). Target: $37.80. Discipline is key!',
      matches: [
        {
          id: 'm2-1',
          sport: 'Football / Soccer',
          league: 'Serie A',
          homeTeam: 'Inter Milan',
          awayTeam: 'Monza',
          kickoffTime: '19:45 GMT',
          prediction: 'Inter Milan Draw No Bet (1 DNB)',
          marketType: 'Draw No Bet',
          odds: 1.18,
          reasoning: 'Inter solid defensive record, 0 losses in last 8 league outings.',
          matchStatus: 'WON',
          score: '2 - 1',
        },
        {
          id: 'm2-2',
          sport: 'Football / Soccer',
          league: 'Bundesliga',
          homeTeam: 'Bayern Munich',
          awayTeam: 'Augsburg',
          kickoffTime: '17:30 GMT',
          prediction: 'Over 2.5 Total Match Goals',
          marketType: 'Over 2.5 Goals',
          odds: 1.19,
          reasoning: 'H2H matches average 4.2 goals over past 5 encounters.',
          matchStatus: 'WON',
          score: '4 - 1',
        },
      ],
      bookingCodes: [
        { bookmaker: 'SportyBet', code: 'SD8812K', region: 'Global' },
        { bookmaker: '1xBet', code: '1X-7734F', region: 'Global' },
        { bookmaker: 'Bet9ja', code: 'B9J-5582', region: 'Nigeria' },
        { bookmaker: 'Betway', code: 'BW-2219', region: 'Kenya/SA' },
      ],
      reactions: { fire: 67, target: 51, money: 49, cold: 0 },
      viewsCount: 512,
      copiesCount: 310,
      followedCount: 245,
      createdAt: '2026-10-12T08:30:00Z',
      settledAt: '2026-10-12T21:45:00Z',
    },
    {
      id: 'tip-day-3',
      challengeId: 'chal-10day-oct',
      challengeName: '10-Day Safe Rollover Challenge ($20 -> $500)',
      dayNumber: 3,
      totalDays: 10,
      date: '2026-10-13',
      status: 'WON',
      startingStake: 20.0,
      currentStake: 37.8,
      targetPayout: 51.4,
      totalOdds: 1.36,
      confidence: 93,
      riskLevel: 'Safe',
      adminNote: 'Day 3 cleared comfortably! Bankroll more than doubled from initial $20 to $51.40.',
      matches: [
        {
          id: 'm3-1',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Real Madrid',
          awayTeam: 'Shakhtar Donetsk',
          kickoffTime: '20:00 GMT',
          prediction: 'Real Madrid Win & Over 1.5 Goals',
          marketType: '1 & Over 1.5',
          odds: 1.25,
          reasoning: 'Madrid formidable in European home ties with frontline at peak sharpness.',
          matchStatus: 'WON',
          score: '3 - 0',
        },
        {
          id: 'm3-2',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Arsenal',
          awayTeam: 'PSV Eindhoven',
          kickoffTime: '20:00 GMT',
          prediction: 'Arsenal Win or Draw (1X)',
          marketType: 'Double Chance 1X',
          odds: 1.09,
          reasoning: 'Arsenal undefeated at Emirates in UCL group stages for 2 seasons.',
          matchStatus: 'WON',
          score: '2 - 1',
        },
      ],
      bookingCodes: [
        { bookmaker: 'SportyBet', code: 'SP-9934B', region: 'Global' },
        { bookmaker: '1xBet', code: '1X-6611G', region: 'Global' },
        { bookmaker: 'Bet9ja', code: 'B9J-7729', region: 'Nigeria' },
        { bookmaker: 'Betway', code: 'BW-3381', region: 'Kenya/SA' },
      ],
      reactions: { fire: 89, target: 73, money: 81, cold: 2 },
      viewsCount: 780,
      copiesCount: 489,
      followedCount: 390,
      createdAt: '2026-10-13T09:00:00Z',
      settledAt: '2026-10-13T22:00:00Z',
    },
    {
      id: 'tip-day-4',
      challengeId: 'chal-10day-oct',
      challengeName: '10-Day Safe Rollover Challenge ($20 -> $500)',
      dayNumber: 4,
      totalDays: 10,
      date: '2026-10-14',
      status: 'PENDING',
      startingStake: 20.0,
      currentStake: 51.4,
      targetPayout: 70.42,
      totalOdds: 1.37,
      confidence: 95,
      riskLevel: 'Safe',
      adminNote: 'TODAYS OFFICIAL SLIP! Day 4: Full stake $51.40 into total odds 1.37. Target Return: $70.42. Copy booking code below and lock in early before odds drop!',
      matches: [
        {
          id: 'm4-1',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Liverpool',
          awayTeam: 'Bologna',
          kickoffTime: '20:00 GMT',
          prediction: 'Liverpool Win & Over 1.5 Goals',
          marketType: '1 & Over 1.5',
          odds: 1.22,
          reasoning: 'Anfield European nights carry massive momentum. Bologna conceded in each of their last 6 away matches.',
          matchStatus: 'PENDING',
        },
        {
          id: 'm4-2',
          sport: 'Football / Soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Aston Villa',
          awayTeam: 'Bayern Munich',
          kickoffTime: '20:00 GMT',
          prediction: 'Over 1.5 Total Match Goals',
          marketType: 'Over 1.5 Goals',
          odds: 1.12,
          reasoning: 'Both teams play high-tempo transitional football with prolific attacking units.',
          matchStatus: 'PENDING',
        },
      ],
      bookingCodes: [
        { bookmaker: 'SportyBet', code: '8XF2A9', region: 'Global / Africa' },
        { bookmaker: '1xBet', code: 'ROLL-10D4', region: 'Global / LatAm' },
        { bookmaker: 'Bet9ja', code: 'B9J-99042', region: 'Nigeria' },
        { bookmaker: 'Betway', code: 'BW-77301', region: 'UK / Europe / Kenya' },
        { bookmaker: 'WilliamHill', code: 'WH-5510', region: 'UK' },
      ],
      reactions: { fire: 114, target: 98, money: 102, cold: 1 },
      viewsCount: 1042,
      copiesCount: 685,
      followedCount: 520,
      createdAt: '2026-10-14T06:30:00Z',
      settledAt: null,
    },
  ];

  const initialActivities: ActivityLog[] = [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-6612 (London, UK)',
      actionType: 'booking_code_copied',
      category: 'conversion',
      details: "Copied SportyBet code '8XF2A9' for Day 4 Rollover Slip",
      metadata: { tipId: 'tip-day-4', bookmaker: 'SportyBet', code: '8XF2A9', dayNumber: 4 },
      device: 'Mobile / Safari iOS',
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-9941 (Lagos, NG)',
      actionType: 'tip_followed',
      category: 'engagement',
      details: "Marked Day 4 tip as 'Followed with $51.40 stake'",
      metadata: { tipId: 'tip-day-4', stake: 51.4 },
      device: 'Mobile / Chrome Android',
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-3308 (Nairobi, KE)',
      actionType: 'booking_code_copied',
      category: 'conversion',
      details: "Copied Betway code 'BW-77301' for Day 4 Rollover Slip",
      metadata: { tipId: 'tip-day-4', bookmaker: 'Betway', code: 'BW-77301', dayNumber: 4 },
      device: 'Desktop / Chrome Windows',
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-1192 (Berlin, DE)',
      actionType: 'calculator_simulated',
      category: 'engagement',
      details: 'Simulated 10-Day Rollover compound: $50 start -> $1,280 target at 1.38 odds',
      metadata: { startingStake: 50, days: 10, odds: 1.38, target: 1280 },
      device: 'Desktop / Firefox',
    },
    {
      id: 'act-5',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      actorType: 'admin',
      actorIdentifier: 'Admin Master',
      actionType: 'admin_tip_created',
      category: 'management',
      details: "Uploaded Day 4 Rollover Slip (Liverpool vs Bologna, Villa vs Bayern) @ 1.37 odds",
      metadata: { tipId: 'tip-day-4', odds: 1.37, dayNumber: 4 },
      device: 'Admin Console / Chrome',
    },
    {
      id: 'act-6',
      timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
      actorType: 'admin',
      actorIdentifier: 'Admin Master',
      actionType: 'admin_status_changed',
      category: 'management',
      details: "Marked Day 3 Rollover Tip as 'WON' (Bankroll grew to $51.40)",
      metadata: { tipId: 'tip-day-3', status: 'WON', bankroll: 51.4 },
      device: 'Admin Console / Chrome',
    },
    {
      id: 'act-7',
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-8823 (Accra, GH)',
      actionType: 'reaction_added',
      category: 'community',
      details: 'Reacted 🔥 Fire to Day 4 Rollover Slip',
      metadata: { tipId: 'tip-day-4', reaction: 'fire' },
      device: 'Mobile / Chrome Android',
    },
    {
      id: 'act-8',
      timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
      actorType: 'user',
      actorIdentifier: 'User-4402 (Toronto, CA)',
      actionType: 'slip_shared',
      category: 'conversion',
      details: 'Generated share card and copied link for Day 4 Rollover Slip',
      metadata: { tipId: 'tip-day-4' },
      device: 'Desktop / Chrome macOS',
    },
  ];

  const initialComments: TipComment[] = [
    {
      id: 'com-1',
      tipId: 'tip-day-4',
      authorName: 'Alex_Punter',
      authorBadge: 'Verified Bettor',
      text: 'Locked in the SportyBet slip early. Liverpool at Anfield is as solid as it gets. Let’s make it 4 in a row!',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      likes: 18,
    },
    {
      id: 'com-2',
      tipId: 'tip-day-4',
      authorName: 'KelvinTips',
      authorBadge: 'Veteran',
      text: 'Good catch taking Over 1.5 in the Villa vs Bayern game instead of straight win. Bayern matches are goalfests.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      likes: 12,
    },
    {
      id: 'com-3',
      tipId: 'tip-day-4',
      authorName: 'Samuel_O',
      authorBadge: 'Member',
      text: 'Following since Day 1 with $20, already at $51. Discipline is the only way in sports betting.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      likes: 9,
    },
  ];

  const initialAnnouncements: Announcement[] = [
    {
      id: 'ann-1',
      title: '🚨 Day 4 Rollover Slip is Live!',
      message: 'Stick strictly to compounding rule. Do not add outside selections. Kickoff is at 20:00 GMT.',
      type: 'live',
      active: true,
      createdAt: '2026-10-14T06:45:00Z',
    },
    {
      id: 'ann-2',
      title: '✅ Day 3 Target Achieved!',
      message: 'Real Madrid and Arsenal both landed smoothly. Initial $20 stake has compound-grown to $51.40 (+157% net gain).',
      type: 'success',
      active: true,
      createdAt: '2026-10-13T22:15:00Z',
    },
  ];

  const initialMembers: (UserMember & { password?: string })[] = [];

  return {
    adminUsername: 'Vip',
    adminPassword: '1',
    activeChallenge: {
      id: 'chal-10day-oct',
      name: '10-Day Safe Rollover Challenge ($20 -> $500)',
      status: 'ACTIVE',
      currentDay: 4,
      totalDays: 10,
      startingStake: 20.0,
      currentBankroll: 51.4,
      targetBankroll: 500.0,
      currentStreak: 3,
    },
    tips: initialTips,
    activities: initialActivities,
    comments: initialComments,
    announcements: initialAnnouncements,
    members: initialMembers,
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      saveDatabase(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    let shouldSave = false;
    if (!parsed.adminUsername) {
      parsed.adminUsername = 'Vip';
      shouldSave = true;
    }
    if (!parsed.adminPassword) {
      parsed.adminPassword = '1';
      shouldSave = true;
    }
    if (parsed.adminPin) {
      delete parsed.adminPin;
      shouldSave = true;
    }
    if (!parsed.members || !Array.isArray(parsed.members)) {
      parsed.members = [];
      shouldSave = true;
    }
    if (shouldSave) {
      saveDatabase(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database, creating new:', err);
    const initial = getInitialDatabase();
    saveDatabase(initial);
    return initial;
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Helper to log activities
function logActivity(
  db: DatabaseSchema,
  entry: Omit<ActivityLog, 'id' | 'timestamp'>
): ActivityLog {
  const newLog: ActivityLog = {
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  db.activities.unshift(newLog);
  // Keep max 500 recent activity items
  if (db.activities.length > 500) {
    db.activities = db.activities.slice(0, 500);
  }
  return newLog;
}

// ----------------- API ROUTES ----------------- //

// Admin Login / Verification (Username & Password)
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { username, password, pin } = req.body;
  const db = loadDatabase();
  const expectedUser = (db.adminUsername || 'Vip').trim();
  const expectedPass = (db.adminPassword || '1').trim();

  const inputUser = (username || '').toString().trim();
  const inputPass = (password !== undefined && password !== null ? password : (pin !== undefined && pin !== null ? pin : '')).toString().trim();

  // Admin must provide valid username (Vip) and password (1)
  const isUsernameMatch = inputUser.length > 0 && inputUser.toLowerCase() === expectedUser.toLowerCase();
  const isPasswordMatch = inputPass.length > 0 && inputPass === expectedPass;

  if (isUsernameMatch && isPasswordMatch) {
    logActivity(db, {
      actorType: 'admin',
      actorIdentifier: `Admin (${expectedUser})`,
      actionType: 'admin_login',
      category: 'management',
      details: 'Administrator authenticated successfully',
      device: req.headers['user-agent']?.substring(0, 50) || 'Web Browser',
    });
    saveDatabase(db);
    return res.json({ success: true, token: 'adm_tok_' + Date.now() });
  }

  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Admin Authorization Guard middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers['x-admin-token'] || req.headers['authorization']) as string | undefined;
  if (!token || (!token.startsWith('adm_tok_') && token !== 'admin_tok_vip_auth' && token !== 'true')) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted: Administrator credentials required',
    });
  }
  next();
}

// Admin change credentials
app.post('/api/admin/change-credentials', requireAdminAuth, (req: Request, res: Response) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const db = loadDatabase();
  const expectedPass = (db.adminPassword || '1').trim();

  if (!currentPassword || currentPassword.toString().trim() !== expectedPass) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  if (newUsername && newUsername.trim()) {
    db.adminUsername = newUsername.trim();
  }
  if (newPassword && newPassword.toString().trim()) {
    db.adminPassword = newPassword.toString().trim();
  }

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: `Admin (${db.adminUsername || 'Vip'})`,
    actionType: 'admin_login',
    category: 'management',
    details: 'Admin security credentials updated',
    device: req.headers['user-agent']?.substring(0, 50) || 'Web Browser',
  });
  saveDatabase(db);
  res.json({ success: true, message: 'Admin credentials updated successfully' });
});

// Backwards compatibility endpoint for PIN change
app.post('/api/admin/change-pin', requireAdminAuth, (req: Request, res: Response) => {
  const { oldPin, newPin } = req.body;
  const db = loadDatabase();
  const expectedPass = (db.adminPassword || '1').trim();

  if (!oldPin || oldPin.toString().trim() !== expectedPass) {
    return res.status(401).json({ success: false, message: 'Current password/PIN is incorrect' });
  }
  if (!newPin || !newPin.toString().trim()) {
    return res.status(400).json({ success: false, message: 'New password cannot be empty' });
  }
  db.adminPassword = newPin.toString().trim();
  saveDatabase(db);
  res.json({ success: true, message: 'Password updated successfully' });
});

// ----------------- CLIENT AUTH & MEMBERSHIP ROUTES ----------------- //

// Client Member Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const db = loadDatabase();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = db.members.find((m) => m.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newMember: UserMember & { password?: string } = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || '',
    role: 'member',
    status: 'active',
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    codesCopiedCount: 0,
    tipsFollowedCount: 0,
    password: password || 'member123',
  };

  db.members.unshift(newMember);

  logActivity(db, {
    actorType: 'user',
    actorIdentifier: `${newMember.name} (${newMember.email})`,
    actionType: 'user_registered',
    category: 'conversion',
    details: `New bettor registered account: ${newMember.name} <${newMember.email}>`,
    metadata: { memberId: newMember.id, email: newMember.email, phone: newMember.phone },
    device: req.headers['user-agent']?.substring(0, 50) || 'Web Browser',
  });

  saveDatabase(db);

  const { password: _, ...safeMember } = newMember;
  res.json({
    success: true,
    member: safeMember,
    token: 'usr_tok_' + newMember.id,
  });
});

// Client Member Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const db = loadDatabase();
  const normalizedEmail = email.trim().toLowerCase();

  const member = db.members.find((m) => m.email.toLowerCase() === normalizedEmail);
  if (!member) {
    return res.status(404).json({ success: false, message: 'No registered member found with this email. Please register for a free account.' });
  }

  if (member.status === 'suspended') {
    return res.status(403).json({ success: false, message: 'Your account has been suspended by administrator' });
  }

  if (member.password && member.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
  }

  // Update last active
  member.lastActiveAt = new Date().toISOString();

  logActivity(db, {
    actorType: 'user',
    actorIdentifier: `${member.name} (${member.email})`,
    actionType: 'user_login',
    category: 'engagement',
    details: `Member logged in: ${member.name} (${member.role.toUpperCase()})`,
    metadata: { memberId: member.id, email: member.email },
    device: req.headers['user-agent']?.substring(0, 50) || 'Web Browser',
  });

  saveDatabase(db);

  const { password: _, ...safeMember } = member;
  res.json({
    success: true,
    member: safeMember,
    token: 'usr_tok_' + member.id,
  });
});

// Client Member Session Check
app.get('/api/auth/me', (req: Request, res: Response) => {
  const email = req.headers['x-user-email'] as string;
  if (!email) {
    return res.status(401).json({ success: false });
  }

  const db = loadDatabase();
  const member = db.members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase());
  if (!member) {
    return res.status(404).json({ success: false });
  }

  const { password: _, ...safeMember } = member;
  res.json({ success: true, member: safeMember });
});

// ----------------- ADMIN MEMBERS DIRECTORY ROUTES ----------------- //

// Admin: View all registered members
app.get('/api/admin/members', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDatabase();
  const safeMembers: UserMember[] = db.members.map(({ password, ...m }) => m);
  res.json({ members: safeMembers, totalCount: safeMembers.length });
});

// Admin: Update member role or status (promote to VIP, suspend, activate)
app.patch('/api/admin/members/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status } = req.body;
  const db = loadDatabase();

  const member = db.members.find((m) => m.id === id);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  if (role && ['member', 'verified', 'veteran'].includes(role)) {
    member.role = role;
  }
  if (status && ['active', 'suspended'].includes(status)) {
    member.status = status;
  }

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'member_status_updated',
    category: 'management',
    details: `Updated member ${member.name} (${member.email}) -> Role: ${member.role}, Status: ${member.status}`,
    metadata: { memberId: member.id, role: member.role, status: member.status },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  const { password: _, ...safeMember } = member;
  res.json({ success: true, member: safeMember });
});

// Admin: Delete member
app.delete('/api/admin/members/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();

  const target = db.members.find((m) => m.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  db.members = db.members.filter((m) => m.id !== id);

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'member_status_updated',
    category: 'management',
    details: `Removed member account: ${target.name} (${target.email})`,
    metadata: { memberId: id, email: target.email },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, message: 'Member deleted' });
});

// GET all tips
app.get('/api/tips', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    tips: db.tips,
    activeChallenge: db.activeChallenge,
  });
});

// POST new tip (Admin)
app.post('/api/tips', (req: Request, res: Response) => {
  const tipData = req.body;
  const db = loadDatabase();

  const totalOdds = tipData.matches?.length
    ? Number(
        tipData.matches
          .reduce((acc: number, m: any) => acc * (Number(m.odds) || 1), 1)
          .toFixed(2)
      )
    : Number(tipData.totalOdds) || 1.35;

  const currentStake = Number(tipData.currentStake) || db.activeChallenge.currentBankroll;
  const targetPayout = Number((currentStake * totalOdds).toFixed(2));

  const newTip: RolloverTip = {
    id: 'tip-' + Date.now(),
    challengeId: db.activeChallenge.id,
    challengeName: db.activeChallenge.name,
    dayNumber: Number(tipData.dayNumber) || db.tips.length + 1,
    totalDays: Number(tipData.totalDays) || db.activeChallenge.totalDays,
    date: tipData.date || new Date().toISOString().split('T')[0],
    status: (tipData.status as any) || 'PENDING',
    startingStake: Number(tipData.startingStake) || db.activeChallenge.startingStake,
    currentStake,
    targetPayout,
    totalOdds,
    confidence: Number(tipData.confidence) || 95,
    riskLevel: tipData.riskLevel || 'Safe',
    adminNote: tipData.adminNote || '',
    matches: Array.isArray(tipData.matches)
      ? tipData.matches.map((m: any, idx: number) => ({
          id: m.id || `m-${Date.now()}-${idx}`,
          sport: m.sport || 'Football / Soccer',
          league: m.league || 'League',
          homeTeam: m.homeTeam || 'Home',
          awayTeam: m.awayTeam || 'Away',
          kickoffTime: m.kickoffTime || '19:45 GMT',
          prediction: m.prediction || 'Double Chance 1X',
          marketType: m.marketType || '1X',
          odds: Number(m.odds) || 1.2,
          reasoning: m.reasoning || '',
          matchStatus: m.matchStatus || 'PENDING',
          score: m.score,
        }))
      : [],
    bookingCodes: Array.isArray(tipData.bookingCodes) ? tipData.bookingCodes : [],
    reactions: { fire: 0, target: 0, money: 0, cold: 0 },
    viewsCount: 0,
    copiesCount: 0,
    followedCount: 0,
    createdAt: new Date().toISOString(),
    settledAt: null,
  };

  db.tips.unshift(newTip);
  db.activeChallenge.currentDay = newTip.dayNumber;

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_tip_created',
    category: 'management',
    details: `Uploaded Day ${newTip.dayNumber} Rollover Tip with ${newTip.matches.length} matches @ ${newTip.totalOdds} odds`,
    metadata: { tipId: newTip.id, dayNumber: newTip.dayNumber, odds: newTip.totalOdds },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, tip: newTip });
});

// PUT update tip (Admin - full game and slip editing)
app.put('/api/tips/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = loadDatabase();

  const tipIdx = db.tips.findIndex((t) => t.id === id);
  if (tipIdx === -1) {
    return res.status(404).json({ success: false, message: 'Tip not found' });
  }

  const existing = db.tips[tipIdx];

  // If matches were updated, format and compute total odds
  let matches = existing.matches;
  if (Array.isArray(updates.matches)) {
    matches = updates.matches.map((m: any, idx: number) => ({
      id: m.id || `m-${Date.now()}-${idx}`,
      sport: m.sport || 'Football / Soccer',
      league: m.league || 'League',
      homeTeam: m.homeTeam || 'Home',
      awayTeam: m.awayTeam || 'Away',
      kickoffTime: m.kickoffTime || '19:45 GMT',
      prediction: m.prediction || 'Double Chance 1X',
      marketType: m.marketType || '1X',
      odds: Number(m.odds) || 1.2,
      reasoning: m.reasoning || '',
      matchStatus: m.matchStatus || 'PENDING',
      score: m.score,
    }));
  }

  const totalOdds = matches.length > 0
    ? Number(matches.reduce((acc: number, m) => acc * (Number(m.odds) || 1), 1).toFixed(2))
    : Number(updates.totalOdds) || existing.totalOdds;

  const currentStake = updates.currentStake !== undefined ? Number(updates.currentStake) : existing.currentStake;
  const targetPayout = Number((currentStake * totalOdds).toFixed(2));

  const updated: RolloverTip = {
    ...existing,
    ...updates,
    id: existing.id,
    matches,
    totalOdds,
    currentStake,
    targetPayout,
    reactions: existing.reactions,
    viewsCount: existing.viewsCount,
    copiesCount: existing.copiesCount,
    followedCount: existing.followedCount,
  };

  db.tips[tipIdx] = updated;

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_tip_updated',
    category: 'management',
    details: `Admin edited Day ${updated.dayNumber} games (${updated.matches.length} legs @ ${updated.totalOdds} odds)`,
    metadata: { tipId: updated.id, dayNumber: updated.dayNumber, matchCount: updated.matches.length },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, tip: updated });
});

// PATCH status (WON/LOST/PENDING/VOID)
app.patch('/api/tips/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, matches } = req.body;
  const db = loadDatabase();

  const tip = db.tips.find((t) => t.id === id);
  if (!tip) {
    return res.status(404).json({ success: false, message: 'Tip not found' });
  }

  tip.status = status;
  if (status === 'WON' || status === 'LOST' || status === 'VOID') {
    tip.settledAt = new Date().toISOString();
  } else {
    tip.settledAt = null;
  }

  if (Array.isArray(matches)) {
    tip.matches = matches;
  }

  // Recalculate streak & active bankroll
  let streak = 0;
  let bankroll = db.activeChallenge.startingStake;

  // sort tips chronologically by dayNumber
  const sortedTips = [...db.tips].sort((a, b) => a.dayNumber - b.dayNumber);
  for (const t of sortedTips) {
    if (t.status === 'WON') {
      streak += 1;
      bankroll = Number((bankroll * t.totalOdds).toFixed(2));
    } else if (t.status === 'LOST') {
      streak = 0;
      bankroll = 0;
    }
  }

  db.activeChallenge.currentStreak = streak;
  db.activeChallenge.currentBankroll = bankroll > 0 ? bankroll : db.activeChallenge.startingStake;

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_status_changed',
    category: 'management',
    details: `Settled Day ${tip.dayNumber} Rollover Tip as '${status}' (Bankroll: $${db.activeChallenge.currentBankroll})`,
    metadata: { tipId: tip.id, status, streak, bankroll: db.activeChallenge.currentBankroll },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, tip, activeChallenge: db.activeChallenge });
});

// DELETE tip
app.delete('/api/tips/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();

  const target = db.tips.find((t) => t.id === id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'Tip not found' });
  }

  db.tips = db.tips.filter((t) => t.id !== id);

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_tip_deleted',
    category: 'management',
    details: `Deleted Rollover Tip for Day ${target.dayNumber}`,
    metadata: { tipId: id, dayNumber: target.dayNumber },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, message: 'Tip deleted successfully' });
});

// USER INTERACTIONS: View Tip
app.post('/api/tips/:id/view', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userIdentifier, device } = req.body;
  const db = loadDatabase();

  const tip = db.tips.find((t) => t.id === id);
  if (tip) {
    tip.viewsCount = (tip.viewsCount || 0) + 1;
    logActivity(db, {
      actorType: 'user',
      actorIdentifier: userIdentifier || 'Bettor Guest',
      actionType: 'tip_viewed',
      category: 'engagement',
      details: `Viewed Day ${tip.dayNumber} Rollover Slip details and match predictions`,
      metadata: { tipId: tip.id, dayNumber: tip.dayNumber },
      device: device || 'Web Browser',
    });
    saveDatabase(db);
  }
  res.json({ success: true });
});

// USER INTERACTIONS: Copy Booking Code
app.post('/api/tips/:id/copy', (req: Request, res: Response) => {
  const { id } = req.params;
  const { bookmaker, code, userIdentifier, memberEmail, device } = req.body;
  const db = loadDatabase();

  const tip = db.tips.find((t) => t.id === id);
  if (tip) {
    tip.copiesCount = (tip.copiesCount || 0) + 1;

    // If member logged in, increment their member copy count
    if (memberEmail || userIdentifier) {
      const targetEmail = (memberEmail || '').toLowerCase();
      const mem = db.members.find(
        (m) =>
          (targetEmail && m.email.toLowerCase() === targetEmail) ||
          m.email.toLowerCase() === userIdentifier?.toLowerCase() ||
          userIdentifier?.includes(m.email)
      );
      if (mem) {
        mem.codesCopiedCount = (mem.codesCopiedCount || 0) + 1;
        mem.lastActiveAt = new Date().toISOString();
      }
    }

    logActivity(db, {
      actorType: 'user',
      actorIdentifier: userIdentifier || 'Bettor Guest',
      actionType: 'booking_code_copied',
      category: 'conversion',
      details: `Copied ${bookmaker || 'bookmaker'} code '${code}' for Day ${tip.dayNumber} Rollover Slip`,
      metadata: { tipId: tip.id, bookmaker, code, dayNumber: tip.dayNumber, memberEmail },
      device: device || 'Mobile Web',
    });
    saveDatabase(db);
  }
  res.json({ success: true });
});

// USER INTERACTIONS: Follow Tip
app.post('/api/tips/:id/follow', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userIdentifier, memberEmail, stake, device } = req.body;
  const db = loadDatabase();

  const tip = db.tips.find((t) => t.id === id);
  if (tip) {
    tip.followedCount = (tip.followedCount || 0) + 1;

    // If member logged in, increment their member follow count
    if (memberEmail || userIdentifier) {
      const targetEmail = (memberEmail || '').toLowerCase();
      const mem = db.members.find(
        (m) =>
          (targetEmail && m.email.toLowerCase() === targetEmail) ||
          m.email.toLowerCase() === userIdentifier?.toLowerCase() ||
          userIdentifier?.includes(m.email)
      );
      if (mem) {
        mem.tipsFollowedCount = (mem.tipsFollowedCount || 0) + 1;
        mem.lastActiveAt = new Date().toISOString();
      }
    }

    logActivity(db, {
      actorType: 'user',
      actorIdentifier: userIdentifier || 'Bettor Guest',
      actionType: 'tip_followed',
      category: 'conversion',
      details: `Committed to Day ${tip.dayNumber} Rollover with stake $${stake || tip.currentStake}`,
      metadata: { tipId: tip.id, stake: stake || tip.currentStake, dayNumber: tip.dayNumber, memberEmail },
      device: device || 'Mobile Web',
    });
    saveDatabase(db);
  }
  res.json({ success: true, followedCount: tip ? tip.followedCount : 0 });
});

// USER INTERACTIONS: Reaction
app.post('/api/tips/:id/react', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reactionType, userIdentifier, device } = req.body;
  const db = loadDatabase();

  const tip = db.tips.find((t) => t.id === id);
  if (tip && reactionType && ['fire', 'target', 'money', 'cold'].includes(reactionType)) {
    tip.reactions[reactionType as keyof typeof tip.reactions] =
      (tip.reactions[reactionType as keyof typeof tip.reactions] || 0) + 1;

    const emojiMap: Record<string, string> = {
      fire: '🔥 Fire',
      target: '🎯 On Target',
      money: '💰 Easy Money',
      cold: '❄️ Cold/Risky',
    };

    logActivity(db, {
      actorType: 'user',
      actorIdentifier: userIdentifier || 'Bettor Guest',
      actionType: 'reaction_added',
      category: 'community',
      details: `Reacted ${emojiMap[reactionType] || reactionType} to Day ${tip.dayNumber} Slip`,
      metadata: { tipId: tip.id, reaction: reactionType, dayNumber: tip.dayNumber },
      device: device || 'Web Browser',
    });
    saveDatabase(db);
    return res.json({ success: true, reactions: tip.reactions });
  }
  res.status(400).json({ success: false, message: 'Invalid reaction' });
});

// COMMENTS
app.get('/api/tips/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  const comments = db.comments.filter((c) => c.tipId === id);
  res.json({ comments });
});

app.post('/api/tips/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { authorName, authorBadge, text, userIdentifier, device } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Comment text required' });
  }

  const db = loadDatabase();
  const newComment: TipComment = {
    id: 'com-' + Date.now(),
    tipId: id,
    authorName: authorName?.trim() || 'Punter_' + Math.floor(1000 + Math.random() * 9000),
    authorBadge: authorBadge || 'Member',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    likes: 0,
  };

  db.comments.push(newComment);

  const tip = db.tips.find((t) => t.id === id);
  logActivity(db, {
    actorType: 'user',
    actorIdentifier: userIdentifier || newComment.authorName,
    actionType: 'comment_posted',
    category: 'community',
    details: `Posted discussion comment on Day ${tip ? tip.dayNumber : 'Slip'}: "${newComment.text.substring(0, 40)}..."`,
    metadata: { tipId: id, commentId: newComment.id },
    device: device || 'Web Browser',
  });

  saveDatabase(db);
  res.json({ success: true, comment: newComment });
});

// ACTIVITIES (Admin Activity Monitor & Client tracking)
app.get('/api/activities', requireAdminAuth, (req: Request, res: Response) => {
  const { category, actorType, search, limit } = req.query;
  const db = loadDatabase();

  let filtered = [...db.activities];

  if (category && category !== 'all') {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (actorType && actorType !== 'all') {
    filtered = filtered.filter((a) => a.actorType === actorType);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.details.toLowerCase().includes(q) ||
        a.actorIdentifier.toLowerCase().includes(q) ||
        a.actionType.toLowerCase().includes(q)
    );
  }

  const max = limit ? parseInt(limit as string, 10) : 100;
  res.json({
    activities: filtered.slice(0, max),
    totalCount: filtered.length,
  });
});

// Client generic activity tracker (e.g. calculator used, share slip clicked)
app.post('/api/activities', (req: Request, res: Response) => {
  const { actorType, actorIdentifier, actionType, category, details, metadata, device } = req.body;
  const db = loadDatabase();

  const log = logActivity(db, {
    actorType: actorType || 'user',
    actorIdentifier: actorIdentifier || 'Bettor Guest',
    actionType: actionType || 'calculator_simulated',
    category: category || 'engagement',
    details: details || 'User action performed',
    metadata: metadata || {},
    device: device || 'Web Browser',
  });

  saveDatabase(db);
  res.json({ success: true, log });
});

// Clear / Reset activity logs (Admin)
app.delete('/api/activities', requireAdminAuth, (req: Request, res: Response) => {
  const db = loadDatabase();
  db.activities = [];
  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_login',
    category: 'management',
    details: 'Admin cleared activity logs history',
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });
  saveDatabase(db);
  res.json({ success: true, message: 'Activities cleared' });
});

// SYSTEM METRICS
app.get('/api/metrics', (req: Request, res: Response) => {
  const db = loadDatabase();

  const totalViews = db.tips.reduce((acc, t) => acc + (t.viewsCount || 0), 0);
  const totalCopies = db.tips.reduce((acc, t) => acc + (t.copiesCount || 0), 0);
  const totalFollows = db.tips.reduce((acc, t) => acc + (t.followedCount || 0), 0);

  const completedTips = db.tips.filter((t) => t.status === 'WON' || t.status === 'LOST');
  const wonTips = db.tips.filter((t) => t.status === 'WON');
  const winRate =
    completedTips.length > 0 ? Math.round((wonTips.length / completedTips.length) * 100) : 100;

  const currentGrowthMultiplier = Number(
    (db.activeChallenge.currentBankroll / db.activeChallenge.startingStake).toFixed(2)
  );

  const metrics: SystemMetrics = {
    totalViews,
    totalCopies,
    totalFollows,
    activeStreak: db.activeChallenge.currentStreak,
    overallWinRate: winRate,
    totalTipsCompleted: completedTips.length,
    bankrollGrowthX: currentGrowthMultiplier,
    activeVisitorsNow: Math.floor(18 + Math.random() * 8), // Simulated active concurrent bettors
    totalActivitiesCount: db.activities.length,
  };

  res.json({ metrics });
});

// ANNOUNCEMENTS
app.get('/api/announcements', (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({ announcements: db.announcements.filter((a) => a.active) });
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message required' });
  }

  const db = loadDatabase();
  const ann: Announcement = {
    id: 'ann-' + Date.now(),
    title: title.trim(),
    message: message.trim(),
    type: type || 'info',
    active: true,
    createdAt: new Date().toISOString(),
  };

  db.announcements.unshift(ann);

  logActivity(db, {
    actorType: 'admin',
    actorIdentifier: 'Admin Master',
    actionType: 'admin_announcement_created',
    category: 'management',
    details: `Broadcasted announcement: "${ann.title}"`,
    metadata: { announcementId: ann.id },
    device: req.headers['user-agent']?.substring(0, 50) || 'Admin Console',
  });

  saveDatabase(db);
  res.json({ success: true, announcement: ann });
});

app.delete('/api/announcements/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = loadDatabase();
  db.announcements = db.announcements.filter((a) => a.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});

// Vite Middleware & Production SPA serving
const distDir = path.resolve(__dirname, 'dist');
const hasDist = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'));

if (isProd && hasDist) {
  app.use(express.static(distDir));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT} [mode: ${isProd && hasDist ? 'production-dist' : 'dev-middleware'}]`);
});
