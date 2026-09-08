# Apprendre

A French revision app built around your own lessons. Photograph a worksheet,
attach a PDF, or paste your notes — Claude reads it and builds vocabulary decks,
drills, quizzes and grammar explainers, which then join your normal practice and
spaced repetition.

Runs on Vercel with a Neon Postgres database.

---

## How it fits together

```
index.html          the whole app — three inline scripts, no build step
  ├─ bootstrap      accounts, the syncing Store, content loading
  ├─ app            practice, spaced repetition, progress (as before)
  └─ upload         the Upload Material screen

api/
  auth/             signup · login · logout · me     (bcrypt + JWT cookie)
  content.js        everything the app renders, for one learner
  uploads/          create · list · delete, and parse
  state.js          settings, streak, time tracking, workbook progress
  mastery.js        the spaced-repetition records
  _lib/
    claude.js       the prompt and the Claude call
    schema.js       the shape Claude must return
    import.js       writes parsed content into the learner's library
    content.js      reads it back in the shapes the app expects
    auth.js, db.js, http.js

db/
  schema.sql        tables
  seed-content.json the built-in library (decks, quizzes, stories, workbook)

scripts/
  seed.mjs          apply the schema and load the built-in library
  check.mjs         pre-deploy sanity pass
```

Content rows with a null `user_id` are the shared built-in library everyone
sees. Rows with a `user_id` belong to that learner and came from something they
uploaded. Deleting an upload removes everything built from it and nothing else.

---

## Setting it up

### 1. A Neon database

In the Vercel dashboard: **Storage → Create Database → Neon**, and attach it to
the project. That sets `DATABASE_URL` for you.

### 2. Environment variables

Set these in **Project → Settings → Environment Variables**:

| Variable | Needed | What it's for |
|---|---|---|
| `DATABASE_URL` | yes | Neon connection string (the Neon integration sets this) |
| `ANTHROPIC_API_KEY` | yes | Reading uploads. From [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| `AUTH_SECRET` | yes | Signs login cookies. Any long random string |
| `SIGNUP_CODE` | no | Set it to require an invite code, so strangers can't create accounts and spend your Claude credits |
| `BLOB_READ_WRITE_TOKEN` | no | Keeps the original photo/PDF. Set automatically if you add Vercel Blob storage |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Without Blob storage, uploads still work — the file is held with its database
row for the parse and dropped afterwards, so only the exercises are kept.

### 3. Create the tables and load the built-in library

Once, from your machine:

```bash
npm install
vercel env pull .env.local        # or export DATABASE_URL yourself
npm run db:setup                  # creates the tables, then seeds
```

`npm run db:seed` is safe to re-run; it does nothing if the library is already
loaded. `npm run db:reset` replaces the built-in library and leaves every
learner's own uploads and progress alone.

### 4. Deploy

```bash
vercel --prod
```

The first person to sign up becomes the admin. If you set `SIGNUP_CODE`, the
sign-up form asks for it.

---

## Uploading material

Three ways in, on the **Upload Material** screen:

- **Photo** — opens the camera on a phone. Photos are shrunk to 1800px in the
  browser before they're sent, which keeps the upload small and the reading
  cost down.
- **PDF or image** — up to 8MB.
- **Paste text** — a vocabulary list, lesson notes, anything your tutor sent.

You can add a title and an instruction ("only the left-hand page", "go easy on
the quizzes"). Claude gets both.

It then builds whatever the material supports — vocabulary decks, conjugation
tables, gap-fill quizzes, production drills, grammar explainers, role-plays,
short stories, workbook chapters — and returns a summary of what it made. Empty
categories stay empty: a vocabulary list won't produce a story just to fill a
field.

Uploads that fail can be retried from the same screen without re-uploading.

---

## Your progress

Everything the app tracks — spaced repetition, streak, time practised, workbook
completion, your own flashcards and phrases — lives in your account, so it
follows you between your phone and your laptop.

The app writes to `localStorage` as it always did; a small `Store` shim mirrors
those writes to the database, batched a couple of seconds after you stop
answering and again when you close the tab. If you're offline the work stays
queued and goes up on the next sync. If you used the app before it had accounts,
whatever was on that device is pushed up the first time you sign in.

---

## Working on it

```bash
npm run check     # every API module imports, schema is strict, scripts parse
npm run dev       # vercel dev, with .env.local
```

`npm run check` is the fast pre-deploy pass. It won't catch a bad SQL query —
for that, run against a real database.

The built-in library originally lived as object literals inside `index.html`.
`scripts/legacy/extract-builtin.mjs` is the one-time migration that pulled it
out into `db/seed-content.json`, which is now the source of truth. That script
only runs against a pre-migration `index.html` and says so if you try.

### Costs

Reading one worksheet is a single Claude call — an image or a few pages of text
in, structured JSON out. Watch it on the
[Anthropic usage page](https://console.anthropic.com/settings/usage). Setting
`SIGNUP_CODE` is what stops other people spending your credits.
