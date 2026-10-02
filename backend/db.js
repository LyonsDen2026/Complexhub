import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "lyonsden.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY,
  name TEXT, email TEXT,
  membership_tier TEXT,
  points INTEGER DEFAULT 0,
  wearables TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS membership_tiers (
  id TEXT PRIMARY KEY,
  name TEXT, price TEXT, period TEXT, description TEXT, features TEXT, highlight INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT, category TEXT, section TEXT, day TEXT, time TEXT, coach TEXT, spots_left INTEGER
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER, class_id INTEGER, status TEXT DEFAULT 'confirmed',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, category TEXT, brand TEXT, price REAL, description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER, items TEXT, total REAL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER, title TEXT, type TEXT, duration INTEGER, calories INTEGER,
  source TEXT DEFAULT 'manual', date TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rewards_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER, points INTEGER, reason TEXT, date TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coaches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, title TEXT, bio TEXT, specialty TEXT, color TEXT
);
`);

const memberCount = db.prepare("SELECT COUNT(*) c FROM members").get().c;
if (memberCount === 0) {
  db.prepare(
    "INSERT INTO members (id, name, email, membership_tier, points, wearables) VALUES (1, ?, ?, ?, ?, ?)"
  ).run("Alex Rivera", "alex.rivera@lyonsdendxb.com", "couple", 2450, "[]");

  const tiers = [
    ["day", "Day Pass", "AED 200", "/day", "Facility access · services charged separately", "Full facility access for one day", 0],
    ["individual", "Individual", "AED 700", "/mo", "Single adult · full access to adult programming", "Full adult programming,Studio classes,Gym floor access", 0],
    ["couple", "Couple", "AED 1,200", "/mo", "Two adults · concierge scheduling included", "Two adult accounts,Concierge scheduling,Studio + gym access", 1],
    ["youth", "Youth Development", "AED 1,500", "/mo", "Academy youth · ages 7 to 18 · seasonal training", "Youth academy access,Seasonal training,Teaching rooms", 0],
    ["family", "Family", "AED 1,800", "/mo", "2 adults + up to 3 youth · full adult + youth access", "2 adults + 3 youth,Full adult + youth programming,Priority event RSVP", 1],
    ["annual_individual", "Annual Individual", "AED 7,200", "/yr", "Save 14% · locked rate · priority booking", "14% savings,Locked annual rate,Priority booking", 0],
    ["annual_family", "Annual Family", "AED 18,000", "/yr", "Best value · full household · all programmes", "Best value,Full household access,All programmes included", 1],
  ];
  const insTier = db.prepare(
    "INSERT INTO membership_tiers (id,name,price,period,description,features,highlight) VALUES (?,?,?,?,?,?,?)"
  );
  for (const t of tiers) insTier.run(...t);

  const classes = [
    ["Cycle", "studio", "Train", "Mon", "06:30", "Jordan P.", 6],
    ["Run", "studio", "Train", "Mon", "07:30", "Dana K.", 8],
    ["Lagree", "studio", "Train", "Tue", "08:00", "Mia S.", 4],
    ["Strength & Conditioning", "studio", "Train", "Tue", "17:30", "Coach Alicia", 10],
    ["Football Technical Session", "studio", "Train", "Wed", "18:30", "Coach Lawrence", 12],
    ["Yoga", "studio", "Recover", "Wed", "07:00", "Nadia R.", 10],
    ["Padel Court — 60min", "court", "Connect", "Thu", "19:00", "—", 4],
    ["Basketball Court — 60min", "court", "Connect", "Fri", "19:00", "—", 10],
    ["Alpha Performance 1:1", "coaching", "Perform", "Fri", "09:00", "Coach Alicia", 1],
    ["Restore: Mobility + Recovery", "studio", "Recover", "Sat", "10:00", "Nadia R.", 8],
    ["Youth Football Academy (7-12)", "youth", "Youth", "Sat", "16:00", "Coach Lawrence", 14],
    ["Youth Basketball (13-18)", "youth", "Youth", "Sun", "16:00", "Coach Jordan", 12],
    ["Lions Run Club — Member Event", "event", "Belong", "Sat", "07:00", "Community Team", 40],
  ];
  const insClass = db.prepare(
    "INSERT INTO classes (title,category,section,day,time,coach,spots_left) VALUES (?,?,?,?,?,?,?)"
  );
  for (const c of classes) insClass.run(...c);

  const products = [
    ["Men's Oversized Tee", "apparel", "Lyon's Den", 180, "Terracotta house-label tee"],
    ["Women's Cropped Hoodie", "apparel", "Lyon's Den", 320, "Forest green cropped hoodie"],
    ["Men's Loose-Fit Bottoms", "apparel", "Lyon's Den", 290, "Slate loose-fit joggers"],
    ["Women's Leggings", "apparel", "Lyon's Den", 260, "Forest performance leggings"],
    ["Training Shoes", "footwear", "On Running", 650, "Performance training shoe"],
    ["Everyday Leggings", "apparel", "Lululemon", 480, "Studio-to-street leggings"],
    ["Recovery Slides", "footwear", "Ounass", 220, "Post-training recovery slides"],
    ["Lions Water Bottle", "accessories", "Lyon's Den", 85, "Insulated 750ml bottle"],
    ["Recovery Massage Gun", "wellness", "Lyon's Den", 540, "Member-store wellness device"],
  ];
  const insProd = db.prepare(
    "INSERT INTO products (name,category,brand,price,description) VALUES (?,?,?,?,?)"
  );
  for (const p of products) insProd.run(...p);

  const workouts = [
    ["Strength & Power", "Strength", 55, 420, "wearable", "2026-09-28"],
    ["Morning Run Club", "Cardio", 40, 380, "wearable", "2026-09-29"],
    ["Lagree Studio", "Studio", 45, 310, "manual", "2026-09-30"],
  ];
  const insWorkout = db.prepare(
    "INSERT INTO workouts (member_id,title,type,duration,calories,source,date) VALUES (1,?,?,?,?,?,?)"
  );
  for (const w of workouts) insWorkout.run(...w);

  db.prepare("INSERT INTO rewards_log (member_id,points,reason) VALUES (1,250,'Welcome bonus')").run();
  db.prepare("INSERT INTO rewards_log (member_id,points,reason) VALUES (1,2200,'Early member activity')").run();
}

// --- Seed coaches (independent of first-member seed) ---
const coachCount = db.prepare("SELECT COUNT(*) c FROM coaches").get().c;
if (coachCount === 0) {
  const coaches = [
    ["Coach Alicia", "S&C & Body Alignment Coach", "Strength & conditioning and body alignment specialist. Leads Alpha Performance 1:1, S&C and body alignment sessions.", "S&C · Body Alignment", "#d9712e"],
    ["Coach Lawrence", "Football & Youth Coach", "Football technical coach with a passion for youth development. Runs Alpha sessions, football technical sessions and the Youth Football Academy.", "Football · Alpha · Youth", "#8fae63"],
    ["Coach Jordan", "Court & Cycle Coach", "Multi-sport athlete coaching basketball and cycle. Leads youth basketball programs.", "Cycle · Basketball", "#5b8def"],
    ["Dana K.", "Run Coach", "Ultra-marathoner and run-club leader. Specialises in endurance programming and gait analysis.", "Endurance · Run", "#e8746b"],
    ["Mia S.", "Lagree Coach", "Certified Lagree instructor bringing high-intensity low-impact training to the studio.", "Lagree · Studio", "#c47ad9"],
    ["Nadia R.", "Yoga & Recovery", "200hr RYT with a recovery-focused practice. Leads yoga, mobility and restore sessions.", "Yoga · Recovery", "#6bd4c4"],
  ];
  const insCoach = db.prepare(
    "INSERT INTO coaches (name,title,bio,specialty,color) VALUES (?,?,?,?,?)"
  );
  for (const c of coaches) insCoach.run(...c);

  // Add Alpha Performance 1:1 with Coach Lawrence
  db.prepare(
    "INSERT INTO classes (title,category,section,day,time,coach,spots_left) VALUES (?,?,?,?,?,?,?)"
  ).run("Alpha Performance 1:1", "coaching", "Perform", "Wed", "10:00", "Coach Lawrence", 1);
}

// --- Patch existing DB records after seed updates (idempotent) ---
db.prepare(
  "UPDATE coaches SET title=?, bio=?, specialty=? WHERE name=?"
).run("S&C & Body Alignment Coach", "Strength & conditioning and body alignment specialist. Leads Alpha Performance 1:1, S&C and body alignment sessions.", "S&C · Body Alignment", "Coach Alicia");

db.prepare(
  "UPDATE coaches SET title=?, bio=?, specialty=? WHERE name=?"
).run("Football & Youth Coach", "Football technical coach with a passion for youth development. Runs Alpha sessions, football technical sessions and the Youth Football Academy.", "Football · Alpha · Youth", "Coach Lawrence");

db.prepare(
  "UPDATE classes SET title=? WHERE title=? AND coach=?"
).run("Football Technical Session", "MMA Conditioning", "Coach Lawrence");
