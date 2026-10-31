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
  translate.js      what a tapped word means in its sentence (cached)
  stories.js        writes the next story from what you're learning
  sticking.js       lessons on what you keep getting wrong
  why.js            why a wrong answer was wrong (cached)
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

## The URL changes

Wherever you opened this app before — a GitHub Pages link, or the file on your
machine — that will not work any more, and there's no way around it. The app now
talks to `/api/...` for sign-in, content and progress, and those are serverless
functions. A static host has nothing to answer them with: you'd get the sign-in
screen and then an error.

It has to be deployed to Vercel, which gives you a new `*.vercel.app` address.
If you'd rather keep a URL you can remember, add a custom domain to the project
(**Settings → Domains**) once it's up.

Two things to know before you deploy:

- **This work is on a branch**, `claude/vercel-neon-content-exercises-4b7ll6`.
  Vercel builds `main` as production, so merge the branch first — otherwise
  production will be the old single-file version.
- **Do the database setup below before you first open the app.** Without the
  tables, sign-up fails.

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

### 3. Deploy, then open it

```bash
vercel --prod
```

Open the URL. If anything is still missing, the app says so — a checklist of
what's set and what isn't, rather than an error. Once the database is connected
it offers a **Set up the database** button that creates the tables and loads the
built-in library for you. No terminal needed.

That button only works while the app has no accounts yet; once someone has
signed up it refuses. The first person to sign up becomes the admin, and if you
set `SIGNUP_CODE` the sign-up form asks for it.

### Doing the database setup from a terminal instead

If you'd rather:

```bash
npm install
vercel env pull .env.local        # or export DATABASE_URL yourself
npm run db:setup                  # creates the tables, then seeds
```

`npm run db:seed` is safe to re-run; it does nothing if the library is already
loaded. `npm run db:reset` replaces the built-in library and leaves every
learner's own uploads and progress alone.

---

## Uploading material

Three ways in, on the **Upload Material** screen:

- **Photo** — opens the camera on a phone. Photos are shrunk to 1800px in the
  browser before they're sent, which keeps each upload small and the reading
  cost down.
- **PDF or image** — up to 3MB per file. Files travel as base64, a third
  bigger, and a request body tops out at 4.5MB.
- **Paste text** — a vocabulary list, lesson notes, anything your tutor sent.

**A worksheet can be several pages.** Add up to 10, in order. They go up one
request at a time — a serverless request body caps out around 4.5MB, so a
handful of photos in a single payload would be rejected — and are then read
together in one call, so vocabulary introduced on one page and the exercises
using it on another end up connected rather than parsed as unrelated documents.

You can add a title and an instruction ("only the left-hand page", "go easy on
the quizzes"). Claude gets both.

It then builds whatever the material supports — vocabulary decks, conjugation
tables, gap-fill quizzes, production drills, grammar explainers, role-plays,
short stories, workbook chapters — and returns a summary of what it made. Empty
categories stay empty: a vocabulary list won't produce a story just to fill a
field.

Reading takes a few minutes, longer than a phone reliably holds a request open:
locking the screen or switching apps drops it, and Safari reports "Load failed".
So `/api/uploads/parse` answers straight away and carries on in the background
(Vercel's `waitUntil`, within the route's 300 seconds), and the app checks
`/api/uploads?id=` every few seconds until the upload is ready or failed. You
can lock the phone or use the rest of the app meanwhile. The uploads list keeps
checking anything still being read, and loads its exercises when it lands. A
read still unfinished after six minutes ran out of time, and shows as failed.

Uploads that fail can be retried from the same screen without re-uploading.

---

## Lesson packs

Some material belongs to everyone, not to one upload: a lesson pack is shared
content that every account sees, existing accounts and new ones alike. Packs
live in `db/packs/` as hand-written modules in the same shape the upload parser
produces.

You don't run anything to load one. The first time the app is opened after a
deploy that adds a pack, it loads into the shared library in a single
transaction, and the database remembers it so it never loads twice. The pack's
material goes to the top of each list, and that week's review puts it first.

**Lessons with Mathilde** (`db/packs/mathilde-2026.js`) is the first: spoken
French from the August–October 2026 lessons. It covers telling the time, phone
numbers, telling stories in the past, *manquer*, *pouvoir / vouloir / devoir*,
and the hotel and bar. It adds:

- **Daily 10:** five new categories (Catching up, Telling stories, Can · want ·
  must, Time & numbers, Hotel & bar), about 125 prompts to say out loud
- **Role-plays:** seven new scenes. The new **Practise my lines** button hides
  your side of every dialogue until you've said it.
- **Flashcards, quizzes and verbs:** 8 decks, 5 quizzes, 10 verbs
- **Workbook:** Book II, chapters 16–21
- **Concepts, grammar notes and stories:** explainers, notes and three stories
  to listen to with **Read aloud**

**From your notebooks** (`db/packs/notebook-2026.js`) is the second. It holds
the new material from photos of Lois and Martyn's own notebooks:

- asking questions with *est-ce que* and *qu'est-ce que*, with a new **Asking
  questions** Daily 10 category
- phrases for the lesson
- *bon / bien* and *meilleur / mieux*
- the mountain
- the paragraph about last week

It also includes a page of corrections for the mistakes in the notes, and
workbook chapters 22–24.

**Lessons of 28 October** (`db/packs/mathilde-2026-10-28.js`) is the third.
It covers two lessons from the same afternoon:

- French registers (*courant, familier, vulgaire*) and casual words such as
  *bosser*, *mon boulot* and *dégager*, with a new **Slang & registers**
  Daily 10 category
- talking about the weekend with *aller* and *faire*, and *jouer à* / *faire de*
- bus times, dates with *du… au…*, and hiring a bike
- what to say when the card machine at the pub won't work

It adds five role-plays, a story, explainers, a page of corrections, and
workbook chapters 25–26.

Each new pack's material goes ahead of the packs before it.

To add a pack, write a module like those (the builders are in
`db/packs/helpers.js`) and add it to the end of the list in
`db/packs/index.js`. A pack's key and its slugs are permanent, because progress
is stored against them. `npm run check` validates every pack: slugs that clash
with the built-in library or another pack, quiz answers, multiple-choice
options, and drill categories the Daily 10 screen knows about.

---

## Phone numbers

The French read a phone number two digits at a time, so the **Phone Numbers**
screen turns any number into those pairs and words: +44 7700900123 becomes
+44 77 00 90 01 23, *plus quarante-quatre, soixante-dix-sept, zéro zéro…*.
Each learner saves their own number there. It's stored in their account
(`fr_phone`), not in the shared library, and it joins the Time & numbers
Daily 10.

The screen has two practice modes:

- **Speaking:** say a random number, then reveal how it goes.
- **Listening:** the app reads one out and you type the digits.

---

## Today's plan

The home screen opens with **Today's plan**. Every day it has Today's Review and a
few specific exercises the app picks for you. Each pick is a different kind:

- a quiz
- a workbook exercise
- a Daily 10 set
- a role-play scene
- a verb
- an explainer
- a new story episode

Tapping a pick opens that exact exercise. A role-play opens on its scene with
**Practise my lines** on.

How the picks are chosen:

- **Recent lessons first:** anything from this week's or last week's lessons, or
  that you haven't got right yet, comes first.
- **The week's rhythm:**
  - the day before a conversation leans on speaking: Daily 10, role-plays, verbs
  - the day after a lesson leans on consolidating it: a quiz, the workbook, an
    explainer
  - light days lean on reading and stories
  - lesson, conversation and big-session days get fewer picks
- **No repeats:** nothing from the last few days comes up again.
- **How many:** about one pick per five minutes of your daily goal (two to five).

The plan stays the same all day and on every device (`fr_today_plan`). **↻**
swaps a pick for one of a different kind. Doing a pick from the menus ticks it
off too. Things outside the app that the weekly rhythm has today, like the tutor
lesson or Duolingo, are listed under "Also today". Everything in the menus is
still there to choose from.

---

## Stories written for you

The top of the **Stories** screen writes a new short story whenever you ask.
Each one is the next episode of a series set in Morzine, with a made-up cast who
come back every time:

- Chloé, who runs the bakery-café
- Hugo, the ski instructor, and his croissant-stealing dog Biscotte
- Madame Perrin next door, and her cat Gaston
- Sam, the English barman who's learning French
- Inès, Chloé's teenage cousin

Every story is built from what you're learning at that moment:

- **Saved words** (green): words you saved with **+ My vocab**. Each one comes
  back in your next five stories.
- **Recent lessons** (gold): items from this week's and last week's lessons you
  haven't mastered. Words used in your last three stories wait their turn.
- **Due for review** (red): your spaced-repetition items that are due.
- **Grammar**: the explainer most of those words belong to.

The card shows the words before you start, and **Use different words** picks
again. You choose a genre and a length.

The story is also built from about 150 words you've already mastered, and
Claude is asked to use each target at least twice. The server checks the story
before saving it: the glosses must be well formed and most targets used. If not,
Claude rewrites it once.

You can tap any word in the story. Each sentence carries its own English, so
**Whole sentence** shows straight away. **Play** reads the story a sentence at a
time and highlights each one, and **Speed** changes how fast it reads.

Every story, written for you or not, ends with a **Finished?** card. Rate how
hard it felt (Far too easy, Easy, Just right, Hard, Far too hard) and the story
is marked as read, with "✓ Read" and your rating in the list. **Mark as read
without rating** is there too. Tap a different rating to change your mind.

Your rating sets the level of your next new story, aiming from the level of the
story you just read: Easy aims a step above it, Hard a step below, "Far too…"
two steps, and Just right at the same level. Your level moves towards that by
one step at a time (two for "Far too…"), and the card says where your next
story will be. The level starts at A2.1, and the generator's level picker still
lets you choose by hand.

Your last five ratings also go to Claude with each new story, so it can pitch
the vocabulary and sentence length to match. Stories you haven't read yet,
especially a new episode from your partner, can turn up on the Today card.

Stories are saved to your library, so a learning partner sees them too, marked
"from your partner". The series carries on across both of you: each new episode
is given the last three episodes' summaries, whoever wrote them.

`/api/stories` uses Claude Opus 5.5, about 15 to 20 US cents a story. Each
learner can write five stories a day.

---

## Sticking points

For the things you keep getting wrong. Guessing again tomorrow doesn't fix
them; knowing why the right answer is right, and having a way to remember it,
does.

**The app remembers what you answered.** Mastery only counted rights and
wrongs. Now a wrong answer also goes in a mistakes log (`fr_mistakes`, synced)
with what you picked or typed: the quiz option, the workbook answer, the verb
form. Flashcards marked Again and Daily 10 sentences marked Missed go in too,
without an answer.

**Why?** Every wrong answer in a quiz, the workbook, the conjugation drill and
the review session has a **Why not "…"?** button. Claude says why the right
answer is right, why yours is wrong (or that it works too), and gives one trick
for next time. Explanations are cached, like translations, so the same mistake
is only explained once. If the question belongs to one of your lessons, the
explanation links to it.

**The Sticking Points screen** (under Learn) lists everything you've got wrong
at least twice and haven't since put right (back to level 3 with no misses in
your last five goes), worst first, with what you answered each time.
**Write lessons for these** sends them to Claude, which works out what's being
mixed up, from what you answered as well as the right answer. It then writes a
short lesson for each confusion ("à, en or au?", "savoir or connaître?"), or one
for a group of words that won't stick. Each lesson has:

- what went wrong: each of your mistakes, explained
- why an English speaker trips here
- the rule, as simply as it can be put
- ways to remember it: mnemonics, pictures, a question to ask yourself (memory
  hooks for each word, in a words lesson)
- the confusable things side by side, with audio
- six practice questions. You pick the answer, then **why** it's right. A right
  answer for the wrong reason counts as a guess, because that's the habit this
  is meant to break.

You can also ask for a lesson on anything: "depuis or pendant?", "y and en".
New mistakes that belong with a lesson you already have are added to it.

A lesson you haven't practised, or one due another go (two days on, with its
questions still going wrong), goes on top of Today's plan. It's **Sorted** once
a practice run is clean and its questions stop going wrong in your reviews.

Sorting the mistakes is quick and happens while you wait. The lessons are
written in the background (`waitUntil`, like uploads) and the screen checks
until they're ready. `/api/sticking` and `/api/why` use the same Claude model as
the stories. Each learner can have 12 lessons written a day, at most 5 at a time, and 100 new
explanations a day.

---

## Tap or highlight to translate

Tap any French word to see what it means. Tapping works in stories, role-plays,
Daily 10 answers, quizzes, workbook gap-fills, explainers and grammar notes.

Anywhere else, highlight text instead: long-press on a phone, or drag or
double-click with a mouse. Highlighting works on any text in the app: a word, a
phrase, or a sentence or two. Highlighted English comes back as French.

The popup gives:

- the meaning of the word in that sentence, its dictionary form, and a short
  grammar note
- **Whole sentence**, which shows the sentence in English
- **+ My vocab**, which saves the word, with its sentence as the example, to
  your own flashcards

After a highlight, the popup sits below the text, so it doesn't cover the
phone's own Copy menu.

**Flashcards wait until they're turned over.** Before you reveal a card,
whether in a deck or in Today's Review, nothing on it can be tapped or
highlighted, because the point there is to remember it. Once it's turned over,
the French and the example sentence can be tapped like anything else. A deck
card shows its French in small type on the back for this, and tapping a word
doesn't flip the card back.

**Explain this.** A turned-over flashcard, and a revealed Daily 10 answer, has
an **Explain this** button. Claude breaks the French down chunk by chunk with
the English for each, then explains what's going on: the tense of each verb
(what it's called, how it's built here and why it's used), and anything
irregular or tricky, with a tip for remembering it. It points to the app's own
explainer to read next if one fits, and when the card's deck already belongs to
a concept there's a **Read:** button for that explainer straight away. Coming
back from an explainer returns you to the same card. Breakdowns are cached in
`explanations` by the French, so each one is only paid for once, and they share
the 100-a-day limit with Why?.

Words a lesson already glosses show the lesson's own note straight away. For
anything else, `/api/translate` asks Claude, then stores the answer in the
`translations` table, shared by every account. So each word in each sentence is
only paid for once, and looking it up again is instant. A new lookup costs about
half a US cent. Each learner gets 300 new lookups a day.

---

## Learning partners

Two people working through the same lessons can link up: **Settings → Learning
partners**, invite by the email they signed up with, and they accept from their
own Settings.

Linking shares **uploaded content**, both ways. Whatever either of you
photographs becomes exercises for both, marked "shared with you" in the deck
list, and carries the week it arrived so it's prioritised for both of you.

Linking does **not** share progress. Streak, practice time, mastery levels and
spaced repetition stay personal — one person's answers never mark the other's
cards as known. Unlinking removes each other's material from view and deletes
nothing.

---

## Your progress

The **Progress** screen leads with what you've done, because mastery takes five
right answers spread over about a month, and a page that only counted mastered
items showed nothing for the first few weeks:

- **Your French so far:** total practice time, the days you practised and hit
  your goal, your streak and best run, every answer you've given and how many
  were right.
- **Last 7 days:** time, days practised and goals hit, against the week before,
  plus answers, accuracy and items that moved up a level (counted per day in
  `fr_activity` from 31 Oct 2026).
- **The climb:** every item as new, learning (practised), solid (right on three
  separate days) or mastered, and the date your next items could be mastered if
  you get them right when they come up.
- **Milestones:** hours practised, streaks, things got right, solid and
  mastered items, answers, stories read and sticking points sorted. What you've
  earned, and the four you're closest to, with progress bars.
- **Your level, and every deck, quiz and verb**, with bars that show what
  you've started as well as what you've mastered.

Everything the app tracks — spaced repetition, streak, time practised, workbook
completion, your own flashcards and phrases — lives in your account, so it
follows you between your phone and your laptop.

The app writes to `localStorage` as it always did; a small `Store` shim mirrors
those writes to the database, batched a couple of seconds after you stop
answering and again when you close the tab. If you're offline the work stays
queued and goes up on the next sync. If you used the app before it had accounts,
whatever was on that device is pushed up the first time you sign in.

**The streak** ("day 4" at the top) is counted from practice time, not from
opening the app: today is day N when the N − 1 days before it each had at least
five minutes of practice (or your daily goal, if that's less). It's worked out
again every time the home screen shows, so a phone that keeps the app open for
days can't miss one. Practice time and daily answer counts are kept for 400
days, and the server merges them day by day (the most recorded for a day wins)
rather than letting one device's copy overwrite another's.

---

## Working on it

```bash
npm run check     # every API module imports, schema is strict, scripts parse
npm run dev       # vercel dev, with .env.local
npm run schema    # regenerate db/schema.sql after editing the DDL
```

The schema lives in `api/_lib/schema-sql.js` as a string, because the setup
endpoint needs it in its function bundle rather than on disk. `db/schema.sql` is
generated from it for use with `psql`, and `npm run check` fails if the two
drift apart.

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
