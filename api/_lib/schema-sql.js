// The database schema, as a string so serverless functions can apply it
// without reading from disk. db/schema.sql is generated from this file by
// `npm run schema` and `npm run check` fails if the two drift apart.

export const SCHEMA_SQL = `-- Apprendre schema (Neon / Postgres 15+)
-- Content rows with user_id IS NULL are the shared built-in library that every
-- learner sees. Rows with a user_id belong to that learner alone and normally
-- came out of something they uploaded.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- accounts --

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null default '',
  password_hash text not null,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz
);

-- ----------------------------------------------------------------- sources --
-- One row per thing content came from: an upload, or the built-in library.

create table if not exists sources (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  kind        text not null default 'upload',   -- builtin | upload
  input_type  text,                             -- text | image | pdf
  title       text not null default '',
  file_name   text,
  file_url    text,
  mime_type   text,
  raw_text    text,                             -- pasted text
  file_data   text,                             -- base64 bytes, when Blob storage isn't configured
  status      text not null default 'pending',  -- pending | parsing | ready | failed
  error       text,
  summary     text,
  stats       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  parsed_at   timestamptz
);

create index if not exists sources_user_idx on sources (user_id, created_at desc);

-- ---------------------------------------------------------------- content --

create table if not exists decks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  slug       text not null,
  name       text not null,
  category   text not null default 'Vocabulary',
  level      text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);

create table if not exists cards (
  id       uuid primary key default gen_random_uuid(),
  deck_id  uuid not null references decks(id) on delete cascade,
  fr       text not null,
  en       text not null,
  ex       text not null default '',
  level    text,
  position integer not null default 0
);

create index if not exists cards_deck_idx on cards (deck_id, position);

create table if not exists quizzes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  slug       text not null,
  title      text not null,
  level      text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);

create table if not exists quiz_questions (
  id         uuid primary key default gen_random_uuid(),
  quiz_id    uuid not null references quizzes(id) on delete cascade,
  prompt     text not null,
  en         text not null default '',
  opts       jsonb not null,          -- array of option strings
  answer_idx integer not null,
  note       text not null default '',
  position   integer not null default 0
);

create index if not exists quiz_questions_quiz_idx on quiz_questions (quiz_id, position);

create table if not exists verbs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  infinitive text not null,
  meaning    text not null default '',
  forms      jsonb not null,          -- { "je": "suis", ... }
  level      text,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, infinitive)
);

create table if not exists drills (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  cat        text not null default 'general',
  en         text not null,
  fr         text not null,
  note       text not null default '',
  level      text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists drills_user_idx on drills (user_id, cat);

create table if not exists concepts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  source_id   uuid references sources(id) on delete cascade,
  slug        text not null,
  title       text not null,
  subtitle    text not null default '',
  category    text not null default 'A1.1',
  paragraphs  jsonb not null default '[]'::jsonb,
  table_rows  jsonb not null default '[]'::jsonb,   -- [{en, fr}]
  examples    jsonb not null default '[]'::jsonb,   -- [{fr, en}]
  pitfall     jsonb,                                -- {title, body}
  related     jsonb not null default '[]'::jsonb,   -- [slug]
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);

create table if not exists stories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete cascade,
  source_id   uuid references sources(id) on delete cascade,
  slug        text not null,
  title       text not null,
  blurb       text not null default '',
  level       text not null default 'A1',
  tags        jsonb not null default '[]'::jsonb,
  focus       jsonb not null default '[]'::jsonb,
  body        text not null,          -- HTML with [[fr|en|note]] glosses
  translation text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);

create table if not exists roleplays (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  title      text not null,
  ctx        text not null default '',
  lines      jsonb not null,          -- [{who: 'them'|'you', fr, en}]
  notes      text not null default '',
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists grammar_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  title      text not null,
  body       text not null,           -- HTML
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists workbook_chapters (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete cascade,
  source_id  uuid references sources(id) on delete cascade,
  slug       text not null,
  book       text not null default 'I',
  book_title text not null default '',
  num        integer not null default 1,
  title      text not null,
  subtitle   text not null default '',
  level      text not null default 'A1.1',
  rule       jsonb,                   -- {heading, paras: []}
  vocab      jsonb not null default '[]'::jsonb,  -- [{fr, en}]
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);

create table if not exists workbook_exercises (
  id           uuid primary key default gen_random_uuid(),
  chapter_id   uuid not null references workbook_chapters(id) on delete cascade,
  slug         text not null,
  title        text not null,
  instructions text not null default '',
  questions    jsonb not null,        -- [{prompt, answer, hint?, options?, accept?}]
  position     integer not null default 0
);

create index if not exists workbook_exercises_chapter_idx
  on workbook_exercises (chapter_id, position);

-- --------------------------------------------------------------- progress --

-- One row per learner per practised item. item_id matches the client's
-- itemId(kind, ref) string, e.g. "flashcard::taille::grand(e)".
create table if not exists mastery (
  user_id           uuid not null references users(id) on delete cascade,
  item_id           text not null,
  level             integer not null default 0,
  seen              integer not null default 0,
  right_count       integer not null default 0,
  wrong_count       integer not null default 0,
  recent            jsonb not null default '[]'::jsonb,  -- last 10 of 'R'/'W'
  last_seen         date,
  last_correct_date date,
  updated_at        timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- Everything else the app keeps per learner (settings, streak, time tracking,
-- today's plan, workbook progress, translate history), stored under the same
-- keys the client already uses.
create table if not exists user_state (
  user_id    uuid not null references users(id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
`;

/** Split the DDL into statements for drivers that take one at a time. */
export function schemaStatements() {
  return SCHEMA_SQL
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
    .filter(Boolean);
}
