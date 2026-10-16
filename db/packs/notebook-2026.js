// From your notebooks, July–October 2026.
//
// Built from photos of Lois and Martyn's own lesson notebooks. A lot of what's
// in them is already in mathilde-2026.js (same lessons, other notes), so this
// pack holds only what's new — questions with est-ce que, phrases for the
// lesson, bon/bien and meilleur/mieux, the mountain, and the paragraph about
// last week — plus a page of corrections for the mistakes in the notes.
//
// Slugs and the pack key are permanent — progress is stored against them.

import { mc, typed, choice, drills, lines, forms } from './helpers.js';

export default {
  key: 'notebook-2026',
  title: 'From your notebooks',
  summary:
    "The new material from Lois and Martyn's notebooks: asking questions with est-ce que and " +
    "qu'est-ce que, phrases for the lesson, bon/bien and meilleur/mieux, the mountain, and the " +
    'paragraph about last week, with corrections for the mistakes in the notes.',

  // ----------------------------------------------------------- Daily 10 --
  drills: [
    ...drills('ask', 'A1.3', [
      ['Ask a friend: What do you want to do tomorrow?', "Qu'est-ce que tu veux faire demain ?", "A 'what' question: qu'est-ce que."],
      ['Ask: Does your family want to come to Châtel?', "Est-ce que ta famille veut venir à Châtel ?", 'Ta famille is one group, so veut.'],
      ['Ask a group: Do you want to go skiing today?', "Est-ce que vous voulez faire du ski aujourd'hui ?"],
      ['Ask: Do you want to go on holiday with me?', 'Est-ce que tu veux aller en vacances avec moi ?'],
      ['Ask (vous): Where do you want to go on holiday?', 'Où est-ce que vous voulez aller en vacances ?', 'Question word first, then est-ce que.'],
      ['Ask (vous): Why do you want to learn French?', 'Pourquoi est-ce que vous voulez apprendre le français ?', 'Pourquoi is one word.'],
      ['Ask (vous): Do you want to go out tonight?', 'Est-ce que vous voulez sortir ce soir ?'],
      ['Ask: Can you speak Spanish?', 'Est-ce que tu peux parler espagnol ?'],
      ['Ask: Can your family ski?', 'Est-ce que ta famille peut faire du ski ?'],
      ['Ask: What can you do in Châtel in summer?', "Qu'est-ce qu'on peut faire à Châtel en été ?", "On = people in general. Que + on squeezes to qu'on."],
      ['Ask (vous): Can you go mountain biking?', 'Est-ce que vous pouvez faire du VTT ?', 'VTT = vélo tout terrain, a mountain bike.'],
      ['Ask: When can you go skiing?', 'Quand est-ce que tu peux faire du ski ?'],
      ["Accept an invitation: Yes, I'd like that!", 'Oui, je veux bien !', "Je veux bien = yes please, I'd love to."],
      ['Ask: Is it busy there?', 'Il y a beaucoup de monde ?', 'Le monde = people. Just raise your voice at the end.'],
      ["Say: I don't understand.", 'Je ne comprends pas.', 'Je comprends — with an s.'],
      ['Say: Ah, I understand!', 'Ah, je comprends !'],
      ['Ask: What does that mean?', "Qu'est-ce que ça veut dire ?"],
      ['Ask: How do you say “homework” in French?', 'Comment on dit « homework » en français ?', 'Answer: les devoirs.'],
      ['Ask Mathilde: Can you say that again, please?', "Tu peux répéter, s'il te plaît ?"],
      ['Ask: More slowly, please.', "Plus lentement, s'il te plaît."],
      ['Ask: How do you spell it?', "Comment ça s'écrit ?"],
      ["Say: I'm not sure.", 'Je ne suis pas sûr.', 'Lois says sûre — it sounds the same.'],
      ['Say: I suggest we go to Châtel.', "Je propose d'aller à Châtel.", 'Je propose = I suggest. “I ask” is je demande.'],
    ]),

    ...drills('story', 'A2.1', [
      ['Say: Last week I worked a lot.', "La semaine dernière, j'ai beaucoup travaillé.", 'Dernière goes after semaine; beaucoup sits between ai and travaillé.'],
      ["Say: I'm tired today.", "Je suis fatigué aujourd'hui.", 'Fatiguée for Lois.'],
      ['Say: We went mountain biking on Friday and Saturday.', 'On est allés faire du VTT vendredi et samedi.', 'Aller takes être: on est allés.'],
      ['Say: It was really good.', "C'était très bien.", "For how something went: c'était bien. C'était bon is for food."],
      ['Say: Yesterday we went to the pool because it was hot and sunny.', "Hier, on est allés à la piscine parce qu'il faisait chaud et beau.", "Weather is il faisait, not c'était."],
      ["Say: This week we're going to the south of France.", 'Cette semaine, nous allons dans le sud de la France.'],
      ['Say: We went up on the Avoriaz side.', 'On est montés côté Avoriaz.', 'Monter takes être here: on est montés.'],
      ['Say: There was no queue at the chairlift.', "Il n'y avait pas de queue au télésiège."],
      ['Say: We drank a beer on the other side.', "On a bu une bière de l'autre côté.", 'Bu = past participle of boire.'],
      ['Say: I went for a run.', 'Je suis allé courir.', 'Allée for Lois.'],
      ['Say: It lasted two hours.', 'Ça a duré deux heures.'],
      ['Say: We came back around ten at night.', 'On est revenus vers vingt-deux heures.', 'Vers = around (a time).'],
      ['Say: The concert was free.', 'Le concert était gratuit.', 'Gratuit = free of charge. Free time is libre.'],
      ['Say: It was the best day of the holidays.', "C'était la meilleure journée des vacances."],
    ]),

    ...drills('chat', 'A2.1', [
      ['Say: My girlfriend works at the bar.', 'Ma copine travaille au bar.', 'À + le = au.'],
      ['Say: This restaurant is better.', 'Ce restaurant est meilleur.', 'Better + noun: meilleur.'],
      ['Say: I ski better now.', 'Je skie mieux maintenant.', 'Better at doing something: mieux.'],
      ['Say: Lois skis the best.', "C'est Lois qui skie le mieux."],
      ["Say: It's the worst film of the year.", "C'est le pire film de l'année."],
      ["Say: The weather's bad today.", "Il fait mauvais aujourd'hui.", 'Weather: il fait beau / il fait mauvais.'],
      ["Say: The weather's nice today.", "Il fait beau aujourd'hui."],
      ['Say: I slept badly.', "J'ai mal dormi.", 'Mal = badly (adverb).'],
      ["Say: It's a pretty, hilly area.", "C'est une jolie région vallonnée.", 'BAGS: jolie goes before the noun, vallonnée after.'],
      ['Say: I love this song!', "J'adore cette chanson !"],
      ['Say: We can go anywhere.', "On peut aller n'importe où."],
      ['Say: I like everything you cook.', "J'aime tout ce que tu cuisines.", "Tout ce que = everything (that). Tout ce qui when it's the subject."],
      ["Say: We're staying in because of the rain.", 'On reste à la maison à cause de la pluie.', 'À cause de + a noun.'],
      ["Say: Because it's raining.", "Parce qu'il pleut.", 'Parce que + a sentence.'],
      ['Ask: Shall we meet up at the bar?', 'On se retrouve au bar ?', 'Se retrouver = to meet up.'],
      ['Ask: Are you available on Thursday?', 'Tu es disponible jeudi ?', 'Dispo for short.'],
    ]),

    ...drills('plans', 'A2.1', [
      ['Say: On Monday I have to do the housework.', 'Lundi, je dois faire le ménage.'],
      ['Say: On Tuesday I have a French lesson.', "Mardi, j'ai cours de français.", "J'ai cours — no article."],
      ['Say: On Wednesday I want to go hiking.', 'Mercredi, je veux faire une randonnée.'],
      ["Say: On Thursday I'm free — I'm going to see my girlfriend.", 'Jeudi, je suis libre, je vais voir ma copine.'],
      ['Say: I have to walk the dog.', 'Je dois promener le chien.', 'Promener le chien — no avec.'],
      ['Say: I want to do some yoga.', 'Je veux faire du yoga.'],
      ['Say: I can go to Thonon on Saturday.', 'Je peux aller à Thonon samedi.'],
      ['Say: I want to meet up with some friends.', 'Je veux retrouver des amis.'],
      ["Say: I'm going to get some bread.", 'Je vais chercher du pain.', 'Aller chercher = to go and get.'],
      ["Say: I'll be back around quarter to ten tonight.", 'Je reviens vers vingt et une heures quarante-cinq.', 'Vingt et une heures — heure is feminine.'],
    ]),

    ...drills('time', 'A1.3', [
      ["Say: It's about eight o'clock.", 'Il est environ huit heures.', 'Il for the time, il for the weather.'],
      ['Say the time the 24-hour way: 21h45', 'Il est vingt et une heures quarante-cinq.', 'Vingt et une — heure is feminine.'],
      ['Say 21h45 the everyday way.', 'Il est dix heures moins le quart.'],
      ['Say this UK number in pairs: 07 98 15 72 80 6', 'Zéro sept, quatre-vingt-dix-huit, quinze, soixante-douze, quatre-vingts, six.', 'The way your notebook splits a UK number: pairs, and one left over.'],
      ['Say this email address: chalet.morzine@exemple.fr', 'Chalet point Morzine arobase exemple point F R.', '@ = arobase, . = point, - = tiret.'],
    ]),

    ...drills('hotel', 'A2.2', [
      ["As a customer, say: I'd like a pint on Saturday night.", 'Je voudrais prendre une pinte samedi soir.', 'Prendre for food and drink, not avoir.'],
      ['Ask: Can I book a table for two, please?', "Est-ce que je peux réserver une table pour deux personnes, s'il vous plaît ?"],
      ['Ask: Can you speak to your boss for a customer?', 'Est-ce que vous pouvez parler avec votre chef pour un client ?', 'Chef = boss. In a restaurant le chef is also the head cook; the manager is le/la responsable.'],
      ['Ask: Is it free?', "C'est gratuit ?"],
      ['Ask: What drinks do you have?', "Qu'est-ce que vous avez comme boissons ?", 'Une boisson = a drink. Je bois = I drink.'],
    ]),
  ],

  // --------------------------------------------------------- role-plays --
  roleplays: [
    {
      title: "Qu'est-ce que tu veux faire demain ?",
      ctx: 'Planning the weekend with a friend. You ask the questions.',
      lines: lines([
        ['you', "Qu'est-ce que tu veux faire demain ?", 'What do you want to do tomorrow?'],
        ['them', 'Je ne sais pas… Est-ce que tu veux faire du ski ?', "I don't know… Do you want to go skiing?"],
        ['you', 'Oui, je veux bien ! Est-ce que ta famille veut venir à Châtel ?', "Yes, I'd love to! Does your family want to come to Châtel?"],
        ['them', 'Oui, mais ma mère ne skie pas.', "Yes, but my mum doesn't ski."],
        ['you', "Pas de problème. Qu'est-ce qu'on peut faire à Châtel quand on ne skie pas ?", "No problem. What can you do in Châtel when you don't ski?"],
        ['them', 'On peut faire des randonnées en raquettes, ou aller au spa.', 'You can go snowshoeing, or go to the spa.'],
        ['you', 'Super. Il y a beaucoup de monde le samedi ?', 'Great. Is it busy on Saturdays?'],
        ['them', "Un peu. Mais le matin, il n'y a pas de queue.", "A bit. But in the morning there's no queue."],
        ['you', 'Alors on part tôt ! Et est-ce que vous voulez sortir ce soir ?', 'Then we leave early! And do you want to go out tonight?'],
        ['them', 'Ce soir, je ne peux pas, je dois travailler.', "Tonight I can't, I have to work."],
        ['you', "D'accord. Quand est-ce que tu peux sortir ?", 'OK. When can you go out?'],
        ['them', 'Samedi soir ! On se retrouve au bar ?', 'Saturday night! Shall we meet at the bar?'],
      ]),
      notes: "Yes/no: <em>est-ce que</em> + the sentence. 'What': <em>qu'est-ce que</em>. Other question words go in front: <em>quand est-ce que, où est-ce que, pourquoi est-ce que</em>. <strong>Oui, je veux bien</strong> = yes, I'd love to.",
    },
    {
      title: 'Une table pour samedi soir',
      ctx: "Booking a table by phone, then ordering on the night. You're the customer.",
      lines: lines([
        ['them', 'Bonjour, restaurant Le Refuge, je vous écoute.', 'Hello, Le Refuge restaurant, how can I help?'],
        ['you', "Bonjour ! Est-ce que je peux réserver une table pour deux personnes, s'il vous plaît ?", 'Hello! Can I book a table for two, please?'],
        ['them', 'Bien sûr. Pour quel jour ?', 'Of course. For which day?'],
        ['you', 'Samedi soir, vers vingt heures.', 'Saturday night, around 8pm.'],
        ['them', "Vingt heures… oui, c'est possible. C'est à quel nom ?", "8pm… yes, that's fine. What name is it under?"],
        ['you', "Au nom de Lois. Ça s'écrit L-O-I-S.", "Lois. It's spelt L-O-I-S."],
        ['them', "Parfait, c'est noté. À samedi !", 'Perfect, got it. See you Saturday!'],
        ['them', "Bonsoir ! Qu'est-ce que je vous sers ?", 'Good evening! What can I get you?'],
        ['you', "Je voudrais prendre une pinte, s'il vous plaît. Et qu'est-ce que vous avez comme boissons sans alcool ?", "I'd like a pint, please. And what soft drinks do you have?"],
        ['them', "Des jus, du coca et de l'eau pétillante.", 'Juices, Coke and sparkling water.'],
        ['you', "Un jus d'orange, alors. Et l'eau du robinet, c'est gratuit ?", 'An orange juice, then. And is tap water free?'],
        ['them', "Oui, bien sûr, c'est gratuit.", "Yes, of course, it's free."],
        ['you', 'Merci. Est-ce que vous pouvez parler avec le chef ? Mon amie ne mange pas de gluten.', "Thanks. Can you speak to the chef? My friend doesn't eat gluten."],
        ['them', 'Pas de problème, je vais lui demander.', "No problem, I'll ask him."],
      ]),
      notes: "Order with <strong>prendre</strong>, not avoir: <em>je voudrais prendre une pinte</em>. <em>Ça s'écrit…</em> = it's spelt… <em>Gratuit</em> = free of charge (free time is <em>libre</em>).",
    },
    {
      title: 'Pendant le cours',
      ctx: "In the lesson, Mathilde uses a word you don't know.",
      lines: lines([
        ['them', "Le Chablais, c'est une région très vallonnée.", 'The Chablais is a very hilly region.'],
        ['you', "Pardon, je ne comprends pas. Qu'est-ce que ça veut dire, « vallonné » ?", "Sorry, I don't understand. What does « vallonné » mean?"],
        ['them', "Ça veut dire qu'il y a beaucoup de collines et de vallées.", 'It means there are lots of hills and valleys.'],
        ['you', "Ah, je comprends ! Comment ça s'écrit ?", 'Ah, I understand! How do you spell it?'],
        ['them', 'V-A-L-L-O-N-N-É. Deux L et deux N.', 'V-A-L-L-O-N-N-É. Two Ls and two Ns.'],
        ['you', 'Merci. Et comment on dit « homework » en français ?', 'Thanks. And how do you say “homework” in French?'],
        ['them', "Les devoirs. Pour la semaine prochaine, tes devoirs, c'est de préparer trois questions.", 'Les devoirs. For next week, your homework is to prepare three questions.'],
        ['you', "D'accord. Je propose de préparer des questions avec « est-ce que ».", 'OK. I suggest preparing questions with « est-ce que ».'],
        ['them', 'Très bonne idée !', 'Very good idea!'],
        ['you', "Tu peux répéter la dernière partie, s'il te plaît ? Plus lentement ?", 'Can you repeat the last part, please? More slowly?'],
        ['them', 'Trois questions. Pour mardi.', 'Three questions. For Tuesday.'],
        ['you', 'Parfait. Je ne suis pas sûr de la dernière, mais je vais essayer !', "Perfect. I'm not sure about the last one, but I'll try!"],
      ]),
      notes: "Your survival kit: <em>je ne comprends pas</em> (with an s), <em>qu'est-ce que ça veut dire ?</em>, <em>comment on dit… ?</em>, <em>comment ça s'écrit ?</em>, <em>tu peux répéter ?</em> <strong>Je propose</strong> = I suggest.",
    },
    {
      title: 'Le week-end dernier',
      ctx: 'Mathilde asks about your week. Tell it the way the corrected notebook says it.',
      lines: lines([
        ['them', "Alors, qu'est-ce que tu as fait cette semaine ?", 'So, what did you do this week?'],
        ['you', "J'ai beaucoup travaillé, alors aujourd'hui, je suis fatigué !", "I worked a lot, so today I'm tired!"],
        ['them', "Oh là là ! Et le week-end, tu as fait quelque chose ?", 'Oh dear! And at the weekend, did you do anything?'],
        ['you', 'Oui, vendredi et samedi, on est allés faire du VTT côté Avoriaz.', 'Yes, on Friday and Saturday we went mountain biking on the Avoriaz side.'],
        ['them', 'Il y avait beaucoup de monde ?', 'Was it busy?'],
        ['you', "Non, il n'y avait pas de queue au télésiège. C'était très bien !", 'No, there was no queue at the chairlift. It was really good!'],
        ['them', 'Et hier ?', 'And yesterday?'],
        ['you', "Hier, on est allés à la piscine parce qu'il faisait chaud et beau.", 'Yesterday we went to the pool because it was hot and sunny.'],
        ['them', 'Génial. Et cette semaine ?', 'Great. And this week?'],
        ['you', 'Cette semaine, nous allons dans le sud de la France. On revient dimanche.', "This week we're going to the south of France. We're back on Sunday."],
        ['them', 'Super ! Tu me raconteras ?', "Great! You'll tell me about it?"],
        ['you', 'Oui, je veux bien !', "Yes, I'd love to!"],
      ]),
      notes: "Weather is <em>il faisait</em> — <em>il faisait chaud et beau</em>, not <em>c'était chaud</em>. How it went is <em>c'était bien</em>, not <em>bonne</em>. <em>Beaucoup</em> sits in the middle: <em>j'ai beaucoup travaillé</em>. Lois says <em>fatiguée</em>.",
    },
  ],

  // -------------------------------------------------------------- decks --
  decks: [
    {
      slug: 'notebook_questions',
      name: 'Asking questions',
      category: 'Phrases',
      level: 'A1.3',
      cards: [
        { fr: "Qu'est-ce que tu veux faire demain ?", en: 'What do you want to do tomorrow?', ex: 'Demain, je veux faire du VTT.' },
        { fr: 'Est-ce que ta famille veut venir à Châtel ?', en: 'Does your family want to come to Châtel?', ex: 'Oui, ma famille veut venir en février.' },
        { fr: "Est-ce que tu veux faire du ski aujourd'hui ?", en: 'Do you want to go skiing today?', ex: "Non, aujourd'hui je veux me reposer." },
        { fr: 'Est-ce que vous voulez sortir ce soir ?', en: 'Do you (all) want to go out tonight?', ex: 'Oui, on veut bien !' },
        { fr: 'Où est-ce que vous voulez aller en vacances ?', en: 'Where do you want to go on holiday?', ex: 'On veut aller dans le sud de la France.' },
        { fr: 'Est-ce que tu veux aller en vacances avec moi ?', en: 'Do you want to go on holiday with me?', ex: 'Oui, je veux bien !' },
        { fr: 'Pourquoi est-ce que vous voulez apprendre le français ?', en: 'Why do you want to learn French?', ex: "Parce qu'on habite en France !" },
        { fr: 'Est-ce que tu peux parler espagnol ?', en: 'Can you speak Spanish?', ex: 'Un peu, mais je parle mieux français.' },
        { fr: 'Est-ce que ta famille peut faire du ski ?', en: 'Can your family ski?', ex: 'Ma sœur, oui. Mes parents, non.' },
        { fr: "Qu'est-ce qu'on peut faire à Châtel en été ?", en: 'What can you do in Châtel in summer?', ex: 'On peut faire du VTT et des randonnées.' },
        { fr: 'Est-ce que vous pouvez faire du VTT ?', en: 'Can you go mountain biking?', ex: 'Oui, les remontées sont ouvertes en été.' },
        { fr: 'Quand est-ce que tu peux faire du ski ?', en: 'When can you go skiing?', ex: 'Je peux faire du ski le mardi et le jeudi.' },
        { fr: 'Oui, je veux bien.', en: "Yes, I'd like that. / Yes please.", ex: 'Tu veux un café ? — Oui, je veux bien.' },
      ],
    },
    {
      slug: 'notebook_lesson_phrases',
      name: 'Phrases for the lesson',
      category: 'Phrases',
      level: 'A1.2',
      cards: [
        { fr: 'Je comprends.', en: 'I understand.', ex: "Ah, d'accord, je comprends !" },
        { fr: 'Je ne comprends pas.', en: "I don't understand.", ex: 'Pardon, je ne comprends pas.' },
        { fr: "Qu'est-ce que ça veut dire ?", en: 'What does that mean?', ex: "« Vallonné », qu'est-ce que ça veut dire ?" },
        { fr: 'Comment on dit… en français ?', en: 'How do you say… in French?', ex: 'Comment on dit « homework » en français ?' },
        { fr: "Tu peux répéter, s'il te plaît ?", en: 'Can you say that again, please?', ex: "Pardon, tu peux répéter, s'il te plaît ?" },
        { fr: "Plus lentement, s'il te plaît.", en: 'More slowly, please.', ex: "Tu parles vite ! Plus lentement, s'il te plaît." },
        { fr: "Comment ça s'écrit ?", en: 'How do you spell it?', ex: "Vallonné ? Comment ça s'écrit ?" },
        { fr: 'Je propose…', en: 'I suggest…', ex: 'Je propose de commencer par les questions.' },
        { fr: 'Je ne suis pas sûr(e).', en: "I'm not sure.", ex: 'Je ne suis pas sûr de la réponse.' },
        { fr: 'les devoirs', en: 'homework (also: things you must do)', ex: 'Les devoirs pour la semaine prochaine ?' },
        { fr: 'On a des cours de français.', en: 'We have French lessons.', ex: 'On a des cours de français le mardi.' },
      ],
    },
    {
      slug: 'notebook_out_and_about',
      name: 'Out and about',
      category: 'Vocabulary',
      level: 'A2.1',
      cards: [
        { fr: 'On est allés…', en: 'We went…', ex: 'On est allés à Avoriaz hier.' },
        { fr: 'On est montés…', en: 'We went up…', ex: 'On est montés en télésiège.' },
        { fr: 'le côté', en: 'the side', ex: 'On a skié côté Avoriaz.' },
        { fr: 'à côté de', en: 'next to', ex: 'Le bar est à côté de la pharmacie.' },
        { fr: "l'autre côté", en: 'the other side', ex: "On est descendus de l'autre côté." },
        { fr: 'Il y a beaucoup de monde ?', en: 'Is it busy? (Are there lots of people?)', ex: 'Il y a beaucoup de monde au télésiège ?' },
        { fr: 'le monde', en: 'the world — and people', ex: 'Il y a du monde ce soir !' },
        { fr: 'pas de queue', en: 'no queue', ex: "Le matin, il n'y a pas de queue." },
        { fr: 'un télésiège', en: 'a chairlift', ex: 'Le télésiège ouvre à neuf heures.' },
        { fr: 'un siège / une chaise', en: 'a seat / a chair', ex: 'Ce siège est libre ?' },
        { fr: 'attraper', en: 'to catch', ex: 'Attrape la clé !' },
        { fr: 'la Terre / la terre', en: 'the Earth / the ground, soil', ex: 'Mon téléphone est tombé par terre.' },
        { fr: 'gratuit(e)', en: 'free (no charge)', ex: 'Le concert est gratuit.' },
        { fr: 'une boisson', en: 'a drink (noun)', ex: "Qu'est-ce que vous avez comme boissons ?" },
        { fr: 'une chanson', en: 'a song', ex: "J'adore cette chanson !" },
        { fr: 'vallonné(e)', en: 'hilly', ex: "C'est une région très vallonnée." },
        { fr: 'arobase', en: '@ — “at” in an email address', ex: 'marie point dupont arobase exemple point fr' },
      ],
    },
    {
      slug: 'notebook_little_words',
      name: 'Little words that link',
      category: 'Vocabulary',
      level: 'A2.1',
      cards: [
        { fr: 'parce que', en: 'because', ex: "On reste ici parce qu'il pleut." },
        { fr: 'à cause de', en: 'because of', ex: 'On reste ici à cause de la pluie.' },
        { fr: "n'importe où", en: 'anywhere', ex: "On peut s'asseoir n'importe où." },
        { fr: 'tout ce que', en: 'everything (that)', ex: "J'aime tout ce que tu cuisines." },
        { fr: 'environ', en: 'about, roughly', ex: 'Il est environ huit heures.' },
        { fr: 'vers', en: 'around (a time)', ex: 'On revient vers dix heures.' },
        { fr: 'pendant', en: 'during', ex: 'Je lis pendant le trajet.' },
        { fr: 'Je vais chercher…', en: "I'm going to get… (fetch, pick up)", ex: 'Je vais chercher du pain.' },
        { fr: 'revenir', en: 'to come back', ex: 'Je reviens dans cinq minutes.' },
        { fr: 'se retrouver', en: 'to meet up', ex: 'On se retrouve au bar à vingt heures ?' },
        { fr: 'disponible', en: 'available (dispo for short)', ex: 'Tu es disponible jeudi ?' },
        { fr: 'durer', en: 'to last', ex: 'Le cours a duré deux heures.' },
        { fr: 'Il fait…', en: "It's… (the weather)", ex: 'Il fait chaud et beau.' },
      ],
    },
    {
      slug: 'notebook_what_we_did',
      name: 'What we did',
      category: 'Grammar',
      level: 'A2.1',
      cards: [
        { fr: 'On a bu…', en: 'We drank…', ex: 'On a bu une bière en terrasse.' },
        { fr: "On a… / J'ai…", en: 'We… / I… (past tense)', ex: "On a mangé, puis j'ai payé." },
        { fr: 'Je suis allé(e) courir.', en: 'I went for a run.', ex: 'Ce matin, je suis allé courir.' },
        { fr: 'couru', en: 'run (past participle of courir)', ex: "J'ai couru dix kilomètres." },
        { fr: 'une course', en: 'a run, a race', ex: "C'était une belle course." },
        { fr: 'La semaine dernière…', en: 'Last week…', ex: "La semaine dernière, j'ai beaucoup travaillé." },
        { fr: "J'ai beaucoup travaillé.", en: 'I worked a lot.', ex: "Cette semaine, j'ai beaucoup travaillé." },
        { fr: 'Je suis fatigué(e).', en: "I'm tired.", ex: "Je suis fatigué aujourd'hui." },
        { fr: 'faire du VTT', en: 'to go mountain biking', ex: 'On est allés faire du VTT vendredi.' },
        { fr: "C'était très bien.", en: 'It was really good.', ex: "Le week-end ? C'était très bien !" },
        { fr: 'Il faisait chaud et beau.', en: 'It was hot and sunny.', ex: "On est allés à la piscine parce qu'il faisait chaud et beau." },
        { fr: 'Cette semaine, nous allons…', en: "This week we're going…", ex: 'Cette semaine, nous allons dans le sud de la France.' },
      ],
    },
    {
      slug: 'notebook_good_better',
      name: 'Good, better, best',
      category: 'Grammar',
      level: 'A2.1',
      cards: [
        { fr: 'bon / bonne', en: 'good (adjective)', ex: "C'est un bon restaurant." },
        { fr: 'bien', en: 'well (adverb)', ex: 'Lois skie bien.' },
        { fr: 'meilleur(e)', en: 'better (adjective)', ex: 'Ce vin est meilleur.' },
        { fr: 'mieux', en: 'better (adverb)', ex: 'Je skie mieux maintenant.' },
        { fr: 'le meilleur / la meilleure', en: 'the best (adjective)', ex: "C'est la meilleure piste de Morzine." },
        { fr: 'le mieux', en: 'the best (adverb)', ex: "C'est Lois qui skie le mieux." },
        { fr: 'mauvais(e)', en: 'bad (adjective)', ex: "Il fait mauvais aujourd'hui." },
        { fr: 'mal', en: 'badly (adverb)', ex: "J'ai mal dormi." },
        { fr: 'pire / le pire', en: 'worse / the worst (adjective)', ex: "C'est le pire film de l'année." },
        { fr: 'plus mal', en: 'worse (adverb)', ex: "Aujourd'hui, je skie plus mal qu'hier." },
      ],
    },
  ],

  // ------------------------------------------------------------ quizzes --
  quizzes: [
    {
      slug: 'notebook_est_ce_que',
      title: "Est-ce que or qu'est-ce que?",
      level: 'A1.3',
      questions: [
        mc('___ tu veux faire demain ?', 'What do you want to do tomorrow?',
          ["Qu'est-ce que", 'Est-ce que', 'Que est-ce que', "Qu'est que"],
          "A 'what' question: qu'est-ce que."),
        mc('___ ta famille veut venir à Châtel ?', 'Does your family want to come to Châtel?',
          ['Est-ce que', "Qu'est-ce que", "Est-ce qu'", 'Que'],
          'A yes/no question: est-ce que + the sentence.'),
        mc('Pourquoi ___ vous voulez apprendre le français ?', 'Why do you want to learn French?',
          ['est-ce que', "qu'est-ce que", 'que', 'est-ce'],
          'Question word first, then est-ce que.'),
        mc('___ est-ce que vous voulez aller en vacances ?', 'Where do you want to go on holiday?',
          ['Où', 'Ou', 'Quand', "Qu'"],
          'Où with an accent = where. Ou = or.'),
        mc('Quand ___ tu peux faire du ski ?', 'When can you go skiing?',
          ['est-ce que', "qu'est-ce que", 'que', 'est-ce qui'],
          'Quand + est-ce que.'),
        mc("Qu'est-ce qu'___ peut faire à Châtel en été ?", 'What can you do in Châtel in summer?',
          ['on', 'vous', 'tu', 'nous'],
          'On = people in general, and it goes with peut.'),
        mc('Est-ce que ta famille ___ venir à Châtel ?', 'Does your family want to come to Châtel?',
          ['veut', 'veulent', 'veux', 'voulez'],
          'La famille is one group, so veut — as corrected in the notebook.'),
        mc('Est-ce que tu ___ parler espagnol ?', 'Can you speak Spanish?',
          ['peux', 'peut', 'veux', 'pouvez'],
          'Tu peux.'),
        mc('Est-ce que vous voulez sortir ce soir ? — Oui, je ___ bien !', "Do you want to go out tonight? — Yes, I'd love to!",
          ['veux', 'peux', 'dois', 'vais'],
          "Je veux bien = yes please, I'd like that."),
        mc('___ est-ce que vous voulez apprendre le français ? — Pour parler avec nos voisins.', 'Why do you want to learn French? — To talk to our neighbours.',
          ['Pourquoi', 'Pour quoi', 'Parce que', 'Quand'],
          "Why is one word: pourquoi. Pour quoi means 'for what'."),
        mc("« Vallonné », qu'est-ce que ça veut ___ ?", 'What does « vallonné » mean?',
          ['dire', 'faire', 'savoir', 'parler'],
          "Ça veut dire = it means (literally 'it wants to say')."),
        mc('Pardon, je ne ___ pas.', "Sorry, I don't understand.",
          ['comprends', 'comprend', 'comprendre', 'compris'],
          'Je comprends — with an s for je.'),
      ],
    },
    {
      slug: 'notebook_good_better_quiz',
      title: 'Bon or bien? Meilleur or mieux?',
      level: 'A2.1',
      questions: [
        mc("C'est un ___ restaurant.", "It's a good restaurant.", ['bon', 'bien', 'mieux', 'bonne'],
          'Describing a noun: bon (adjective).'),
        mc('Lois skie très ___.', 'Lois skis really well.', ['bien', 'bon', 'bonne', 'meilleur'],
          'How she skis: bien (adverb).'),
        mc("Ce vin est ___ que l'autre.", 'This wine is better than the other one.', ['meilleur', 'mieux', 'plus bon', 'bien'],
          'Better + noun: meilleur. Never plus bon.'),
        mc('Je skie ___ maintenant.', 'I ski better now.', ['mieux', 'meilleur', 'plus bien', 'bon'],
          'Better at doing something: mieux.'),
        mc("C'est la ___ piste de Morzine.", "It's the best run in Morzine.", ['meilleure', 'meilleur', 'mieux', 'bonne'],
          'Piste is feminine: la meilleure.'),
        mc("C'est Lois qui skie le ___.", 'Lois is the one who skis best.', ['mieux', 'meilleur', 'meilleure', 'bien'],
          'The best at doing something: le mieux.'),
        mc("Il fait ___ aujourd'hui.", "The weather's bad today.", ['mauvais', 'mal', 'pire', 'mauvaise'],
          'Weather: il fait beau, il fait mauvais.'),
        mc("J'ai ___ dormi.", 'I slept badly.', ['mal', 'mauvais', 'pire', 'mauvaise'],
          'How you slept: mal (adverb).'),
        mc("C'est le ___ hiver depuis dix ans.", "It's the worst winter in ten years.", ['pire', 'plus mal', 'mauvais', 'mal'],
          'The worst + noun: le pire.'),
        mc("Le week-end ? C'était très ___ !", 'The weekend? It was really good!', ['bien', 'bonne', 'mieux', 'meilleure'],
          "How it went: c'était bien. Keep c'était bon for food."),
      ],
    },
  ],

  // -------------------------------------------------------------- verbs --
  verbs: [
    { infinitive: 'comprendre', meaning: 'to understand', level: 'A1.3',
      forms: forms('comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent') },
    { infinitive: 'boire', meaning: 'to drink', level: 'A1.2',
      forms: forms('bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent') },
    { infinitive: 'sortir', meaning: 'to go out', level: 'A1.3',
      forms: forms('sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent') },
    { infinitive: 'courir', meaning: 'to run', level: 'A2.1',
      forms: forms('cours', 'cours', 'court', 'courons', 'courez', 'courent') },
    { infinitive: 'revenir', meaning: 'to come back', level: 'A2.1',
      forms: forms('reviens', 'reviens', 'revient', 'revenons', 'revenez', 'reviennent') },
  ],

  // ----------------------------------------------------------- concepts --
  concepts: [
    {
      slug: 'notebook-est-ce-que',
      title: "Est-ce que and qu'est-ce que",
      subtitle: "Est-ce que tu veux… ? · Qu'est-ce que tu veux… ?",
      category: 'A1.3',
      paragraphs: [
        "<strong>Est-ce que</strong> turns any sentence into a yes/no question, and nothing else moves: <em>Tu veux sortir ce soir</em> → <em>Est-ce que tu veux sortir ce soir ?</em> Before a vowel it becomes <em>est-ce qu'</em>: <em>Est-ce qu'on peut réserver ?</em>",
        "<strong>Qu'est-ce que</strong> asks <em>what</em>: <em>Qu'est-ce que tu veux faire demain ?</em> It's <em>que</em> (what) + <em>est-ce que</em> squeezed together — never <em>que est</em>.",
        "Other question words go in front of <em>est-ce que</em>: <em>où est-ce que</em> (where), <em>quand est-ce que</em> (when), <em>pourquoi est-ce que</em> (why — one word): <em>Pourquoi est-ce que vous voulez apprendre le français ?</em>",
        "With <em>vouloir</em> and <em>pouvoir</em> the second verb stays in the infinitive: <em>Est-ce que tu peux faire du ski ? Qu'est-ce qu'on peut faire à Châtel en été ?</em>",
      ],
      table_rows: [
        { en: 'Do you want to go out tonight?', fr: 'Est-ce que vous voulez sortir ce soir ?' },
        { en: 'What do you want to do tomorrow?', fr: "Qu'est-ce que tu veux faire demain ?" },
        { en: 'Where do you want to go on holiday?', fr: 'Où est-ce que vous voulez aller en vacances ?' },
        { en: 'When can you go skiing?', fr: 'Quand est-ce que tu peux faire du ski ?' },
        { en: 'Why do you want to learn French?', fr: 'Pourquoi est-ce que vous voulez apprendre le français ?' },
        { en: 'What can you do in Châtel?', fr: "Qu'est-ce qu'on peut faire à Châtel ?" },
      ],
      examples: [
        { fr: 'Est-ce que ta famille veut venir à Châtel ?', en: 'Does your family want to come to Châtel?' },
        { fr: "Qu'est-ce que vous pouvez faire en été ?", en: 'What can you do in summer?' },
        { fr: 'Quand est-ce que tu peux faire du VTT ?', en: 'When can you go mountain biking?' },
      ],
      pitfall: {
        title: '« Que est… » and « pour quoi »',
        body: "Both are in the notebook. <em>Que</em> + <em>est</em> always squeezes to <em>qu'est-ce que</em>, and why is one word: <em>pourquoi</em>. <em>Pour quoi</em> (two words) means “for what”.",
      },
    },
    {
      slug: 'notebook-bon-bien',
      title: 'Bon or bien? Meilleur or mieux?',
      subtitle: 'bon → meilleur · bien → mieux',
      category: 'A2.1',
      paragraphs: [
        '<strong>Bon</strong> is an adjective — it describes a noun and agrees with it: <em>un bon restaurant, une bonne idée</em>. <strong>Bien</strong> is an adverb — it describes how you do something: <em>Lois skie bien</em>.',
        'Better: <em>bon</em> becomes <strong>meilleur(e)</strong> (<em>ce vin est meilleur</em>) and <em>bien</em> becomes <strong>mieux</strong> (<em>je skie mieux maintenant</em>). Never <em>plus bon</em> or <em>plus bien</em>.',
        "The best: <em>le meilleur, la meilleure</em> for things (<em>la meilleure piste</em>), <em>le mieux</em> for how (<em>c'est Lois qui skie le mieux</em>).",
        'Bad works the same way: <strong>mauvais(e)</strong> → <strong>pire</strong> → <strong>le pire</strong> for things, and <strong>mal</strong> → <strong>plus mal</strong> for how. The notebook has <em>pire</em> in both columns; in careful French, “worse” as an adverb is <em>plus mal</em>.',
      ],
      table_rows: [
        { en: 'good / well', fr: 'bon(ne) / bien' },
        { en: 'better (thing / how)', fr: 'meilleur(e) / mieux' },
        { en: 'the best (thing / how)', fr: 'le meilleur, la meilleure / le mieux' },
        { en: 'bad / badly', fr: 'mauvais(e) / mal' },
        { en: 'worse (thing / how)', fr: 'pire / plus mal' },
        { en: 'the worst', fr: 'le pire' },
      ],
      examples: [
        { fr: "C'est un bon restaurant, mais l'autre est meilleur.", en: "It's a good restaurant, but the other one is better." },
        { fr: "Je skie mieux qu'avant.", en: 'I ski better than before.' },
        { fr: "C'était le pire hiver depuis dix ans.", en: 'It was the worst winter in ten years.' },
      ],
      pitfall: {
        title: "« C'était très bonne »",
        body: "<em>C'était</em> never takes a feminine ending, and for how something went you want the adverb: <em>c'était très bien</em>. Keep <em>c'était bon</em> for food.",
      },
    },
  ],

  // ------------------------------------------------------ grammar notes --
  grammar_notes: [
    {
      title: 'Your notebook, tidied up',
      body: `<p>The new entries from the notebook photos, spelt and translated. Tap any French to hear it.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>Je comprends · je ne comprends pas</em></td><td>I understand · I don't understand</td></tr>
        <tr><td class="fr"><em>Qu'est-ce que ça veut dire ?</em></td><td>What does that mean?</td></tr>
        <tr><td class="fr"><em>Comment on dit… en français ?</em></td><td>How do you say… in French?</td></tr>
        <tr><td class="fr"><em>Je propose</em></td><td>I suggest</td></tr>
        <tr><td class="fr"><em>Je ne suis pas…</em></td><td>I am not…</td></tr>
        <tr><td class="fr"><em>les devoirs</em></td><td>homework — and the things you must do</td></tr>
        <tr><td class="fr"><em>Oui, je veux bien.</em></td><td>Yes, I'd like that.</td></tr>
        <tr><td class="fr"><em>On est allés · on est montés</em></td><td>we went · we went up</td></tr>
        <tr><td class="fr"><em>côté Avoriaz · à côté de · l'autre côté</em></td><td>the Avoriaz side · next to · the other side</td></tr>
        <tr><td class="fr"><em>pas de queue</em></td><td>no queue</td></tr>
        <tr><td class="fr"><em>Il y a beaucoup de monde ?</em></td><td>Is it busy?</td></tr>
        <tr><td class="fr"><em>le monde</em></td><td>the world — and people</td></tr>
        <tr><td class="fr"><em>la Terre · la terre</em></td><td>the Earth · the ground, soil</td></tr>
        <tr><td class="fr"><em>un télésiège · un siège · une chaise</em></td><td>a chairlift · a seat · a chair</td></tr>
        <tr><td class="fr"><em>attraper · rattraper</em></td><td>to catch · to catch up</td></tr>
        <tr><td class="fr"><em>arobase</em></td><td>@</td></tr>
        <tr><td class="fr"><em>Il est environ…</em></td><td>It's about… (o'clock)</td></tr>
        <tr><td class="fr"><em>Je vais chercher…</em></td><td>I'm going to get…</td></tr>
        <tr><td class="fr"><em>vallonné · une chanson</em></td><td>hilly · a song</td></tr>
        <tr><td class="fr"><em>parce que · à cause de</em></td><td>because · because of</td></tr>
        <tr><td class="fr"><em>n'importe où · tout ce que</em></td><td>anywhere · everything (that)</td></tr>
        <tr><td class="fr"><em>On a bu · une boisson · je bois</em></td><td>we drank · a drink · I drink</td></tr>
        <tr><td class="fr"><em>gratuit</em></td><td>free (no charge)</td></tr>
        <tr><td class="fr"><em>revenir · se retrouver · durer</em></td><td>to come back · to meet up · to last</td></tr>
        <tr><td class="fr"><em>disponible · dispo</em></td><td>available</td></tr>
        <tr><td class="fr"><em>Je suis allé courir · couru · une course</em></td><td>I went for a run · run (past) · a run, a race</td></tr>
        <tr><td class="fr"><em>vers</em></td><td>around (a time): <em>vers vingt et une heures quarante-cinq</em></td></tr>
      </table>
      <p><strong>Already in the app</strong> from Mathilde's notes: <em>on a fait, comment tu dis, la gueule de bois, on a perdu quand même, goûter, des huîtres, une dégustation de vin, on a prévu de voir, une fois, n'importe quoi, nous ne pouvons plus y aller, c'était ton jour de chance, ça me manque, ça fait peur, le vertige, on a besoin de, on doit, mon matelas, rattraper, les remontées mécaniques, faire les courses / les magasins, le loyer, la livraison, un paysage, bondé, on prend des cours de français, pour, ça aurait dû, dispo</em>, and the eight practice times.</p>`,
    },
    {
      title: 'Corrections from your notebook',
      body: `<p>Small things worth fixing now, before they set.</p>
      <table class="gr-table">
        <tr><th>Notebook</th><th class="fr">Correct</th><th>Why</th></tr>
        <tr><td>Que est…</td><td class="fr"><em>Qu'est-ce que…</em></td><td>que + est squeezes together</td></tr>
        <tr><td>Pour quoi</td><td class="fr"><em>Pourquoi</em></td><td>one word for “why”</td></tr>
        <tr><td>est ce que</td><td class="fr"><em>est-ce que</em></td><td>with hyphens</td></tr>
        <tr><td>aprandere le francois</td><td class="fr"><em>apprendre le français</em></td><td>spelling; ç</td></tr>
        <tr><td>On à des cours de française</td><td class="fr"><em>On a des cours de français</em></td><td><em>a</em> (has) has no accent; the language is <em>le français</em></td></tr>
        <tr><td>On á fait</td><td class="fr"><em>On a fait</em></td><td><em>a</em> = has; <em>à</em> = to, at</td></tr>
        <tr><td>a Chatel</td><td class="fr"><em>à Châtel</em></td><td><em>à</em> = to, at</td></tr>
        <tr><td>aujourd hui</td><td class="fr"><em>aujourd'hui</em></td><td>apostrophe</td></tr>
        <tr><td>Je ne comprend pas</td><td class="fr"><em>Je ne comprends pas</em></td><td><em>je</em> takes an s</td></tr>
        <tr><td>Je propose = I ask</td><td class="fr"><em>Je propose = I suggest</em></td><td>“I ask” is <em>je demande</em></td></tr>
        <tr><td>Comment dire… en français ?</td><td class="fr"><em>Comment on dit… en français ?</em></td><td><em>Comment dire…</em> alone means “how shall I put it…”</td></tr>
        <tr><td>Je eu</td><td class="fr"><em>J'ai eu</em></td><td>passé composé needs <em>ai</em></td></tr>
        <tr><td>Dernier semaine</td><td class="fr"><em>La semaine dernière</em></td><td>after the noun, and feminine</td></tr>
        <tr><td>j'ai travaillé beaucoup</td><td class="fr"><em>j'ai beaucoup travaillé</em></td><td><em>beaucoup</em> sits between the two parts</td></tr>
        <tr><td>Je suis fatigue</td><td class="fr"><em>Je suis fatigué(e)</em></td><td>accent; <em>-e</em> for a woman</td></tr>
        <tr><td>On est alle / on est aller</td><td class="fr"><em>On est allés</em></td><td>past participle of <em>aller</em></td></tr>
        <tr><td>C'etait tres bonne</td><td class="fr"><em>C'était très bien</em></td><td>how something went: <em>bien</em></td></tr>
        <tr><td>c'etait chaud et beau</td><td class="fr"><em>il faisait chaud et beau</em></td><td>weather uses <em>il fait</em></td></tr>
        <tr><td>On a bau</td><td class="fr"><em>On a bu</em></td><td>past participle of <em>boire</em></td></tr>
        <tr><td>teleseige · seige</td><td class="fr"><em>télésiège · siège</em></td><td>-iège</td></tr>
        <tr><td>aeróbaz</td><td class="fr"><em>arobase</em></td><td>spelling</td></tr>
        <tr><td>remontées mécaniques = chairlift</td><td class="fr"><em>= ski lifts</em></td><td>all of them; a chairlift is <em>un télésiège</em></td></tr>
        <tr><td>tout ce que = all that is</td><td class="fr"><em>= everything (that)</em></td><td>“all that is” is <em>tout ce qui est</em></td></tr>
        <tr><td>pire (adverb)</td><td class="fr"><em>plus mal</em></td><td><em>pire</em> is the adjective</td></tr>
        <tr><td>promener avec le chien</td><td class="fr"><em>promener le chien</em></td><td>no <em>avec</em></td></tr>
        <tr><td>randonee</td><td class="fr"><em>randonnée</em></td><td>two Ns, é</td></tr>
      </table>`,
    },
    {
      title: 'Il for time and weather',
      body: `<p>As the notebook says: <strong>il</strong> for the time or the weather. It doesn't mean “he” here — it's like English “it”.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>Il est huit heures.</em></td><td>It's eight o'clock.</td></tr>
        <tr><td class="fr"><em>Il est environ huit heures.</em></td><td>It's about eight.</td></tr>
        <tr><td class="fr"><em>Il fait beau · il fait chaud · il fait froid</em></td><td>It's nice · hot · cold</td></tr>
        <tr><td class="fr"><em>Il fait mauvais.</em></td><td>The weather's bad.</td></tr>
        <tr><td class="fr"><em>Il pleut · il neige</em></td><td>It's raining · snowing</td></tr>
        <tr><td class="fr"><em>Il faisait chaud et beau.</em></td><td>It was hot and sunny.</td></tr>
      </table>
      <p>That's why <em>c'était chaud</em> sounds odd for the weather: it says “that thing was hot”. For the weather it's <em>il faisait chaud</em>; save <em>c'était</em> for how something was: <em>c'était très bien</em>.</p>`,
    },
    {
      title: 'On the mountain',
      body: `<table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>les remontées mécaniques</em></td><td>the ski lifts (all of them)</td></tr>
        <tr><td class="fr"><em>un télésiège</em></td><td>a chairlift</td></tr>
        <tr><td class="fr"><em>une télécabine</em></td><td>a gondola</td></tr>
        <tr><td class="fr"><em>un téléski</em></td><td>a drag lift</td></tr>
        <tr><td class="fr"><em>un forfait</em></td><td>a lift pass</td></tr>
        <tr><td class="fr"><em>côté Avoriaz · côté Morzine</em></td><td>the Avoriaz side · the Morzine side</td></tr>
        <tr><td class="fr"><em>l'autre côté</em></td><td>the other side</td></tr>
        <tr><td class="fr"><em>On est montés · on est descendus</em></td><td>We went up · we came down</td></tr>
        <tr><td class="fr"><em>Il n'y a pas de queue.</em></td><td>There's no queue.</td></tr>
      </table>
      <p><em>Queue</em> sounds like “kuh” — the notebook's “cur”, said the British way.</p>`,
    },
  ],

  // ------------------------------------------------------------ stories --
  stories: [
    {
      slug: 'notebook-semaine-derniere',
      title: 'La semaine dernière',
      blurb: 'The paragraph from the notebook, corrected and carried on. Press Read aloud and listen first.',
      level: 'A2',
      tags: ['passé composé', 'imparfait', 'weather', 'listening'],
      focus: [
        "<em>J'ai beaucoup travaillé, on est allés, on a bu</em> — the passé composé, with être for aller and monter",
        "<em>Il faisait chaud et beau</em> — weather with il, not c'était",
        '<em>Meilleur</em> — better, the adjective',
      ],
      body: `
      <p>[[La semaine dernière|Last week|dernière goes after semaine]], [[j'ai beaucoup travaillé|I worked a lot|beaucoup sits between ai and travaillé]]. Ce week-end, j'ai travaillé [[très tard|very late]], alors [[aujourd'hui|today]], je suis [[fatigué|tired|fatiguée for a woman]].</p>
      <p>[[Vendredi et samedi|On Friday and Saturday]], [[on est allés faire du VTT|we went mountain biking|aller takes être]]. [[On est montés|We went up|monter takes être here]] [[en télésiège|by chairlift]] [[côté Avoriaz|on the Avoriaz side]]. [[Il n'y avait pas de queue|There was no queue]] ! [[C'était très bien|It was really good|c'était + bien for how something went]].</p>
      <p>[[Hier|Yesterday]], on est allés [[à la piscine|to the pool]] [[parce qu'il faisait chaud et beau|because it was hot and sunny|weather: il fait, il faisait]]. [[Il y avait beaucoup de monde|There were lots of people|le monde = people]], mais [[l'entrée était gratuite|entry was free]]. [[On a bu|We drank|passé composé of boire]] une [[boisson fraîche|cold drink]] et on a écouté [[une chanson|a song]] [[à la radio|on the radio]].</p>
      <p>[[Cette semaine|This week]], [[nous allons dans le sud de la France|we're going to the south of France]]. Là-bas, [[les paysages|the landscapes]] sont [[vallonnés|hilly]] et le vin est [[meilleur|better|meilleur = better, the adjective]] ! [[Je reviens|I'm coming back|revenir]] dimanche.</p>
      `,
      translation: `
      <p>Last week I worked a lot. This weekend I worked very late, so today I'm tired.</p>
      <p>On Friday and Saturday we went mountain biking. We went up by chairlift on the Avoriaz side. There was no queue! It was really good.</p>
      <p>Yesterday we went to the pool because it was hot and sunny. There were lots of people, but entry was free. We had a cold drink and listened to a song on the radio.</p>
      <p>This week we're going to the south of France. Down there the landscapes are hilly and the wine is better! I'm coming back on Sunday.</p>
      `,
    },
  ],

  // ----------------------------------------------------------- workbook --
  workbook_chapters: [
    {
      slug: 'notebook-ch22',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 22,
      title: 'Questions with est-ce que',
      subtitle: "Est-ce que, qu'est-ce que, and question words — from the notebook",
      level: 'A1.3',
      rule: {
        heading: "Est-ce que for yes/no, qu'est-ce que for “what”",
        paras: [
          '<em>Est-ce que</em> + any sentence = a yes/no question: <em>Est-ce que tu veux sortir ce soir ?</em>',
          "<em>Qu'est-ce que</em> = what: <em>Qu'est-ce que tu veux faire demain ?</em>",
          '<em>Où, quand, pourquoi</em> go in front: <em>Pourquoi est-ce que vous voulez apprendre le français ?</em>',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'est-ce-que',
          title: "Est-ce que or qu'est-ce que?",
          instructions: "A yes/no question, or a “what” question? Pick the start.",
          questions: [
            choice('___ tu veux faire demain ? (What…)', ["Qu'est-ce que", 'Est-ce que']),
            choice('___ ta famille veut venir à Châtel ? (Does…)', ['Est-ce que', "Qu'est-ce que"]),
            choice('___ vous voulez sortir ce soir ? (Do you…)', ['Est-ce que', "Qu'est-ce que"]),
            choice('___ on peut faire à Châtel en été ? (What…)', ["Qu'est-ce qu'", "Est-ce qu'"]),
            choice('___ tu peux parler espagnol ? (Can you…)', ['Est-ce que', "Qu'est-ce que"]),
            choice('___ vous voulez manger ce soir ? (What…)', ["Qu'est-ce que", 'Est-ce que']),
          ],
        },
        {
          slug: 'question-words',
          title: 'Question words',
          instructions: 'Put the question word in front of <em>est-ce que</em>.',
          questions: [
            typed('___ est-ce que vous voulez aller en vacances ? (Where)', 'Où', { hint: 'Où with an accent = where; ou = or.' }),
            typed('___ est-ce que tu peux faire du ski ? (When)', 'Quand'),
            typed('___ est-ce que vous voulez apprendre le français ? (Why)', 'Pourquoi', { hint: 'One word.' }),
            typed('___ est-ce que tu veux aller en vacances ? (Who with)', 'Avec qui'),
            typed('___ est-ce que ça coûte ? (How much)', 'Combien'),
          ],
        },
        {
          slug: 'make-it-a-question',
          title: 'Make it a question',
          instructions: 'Turn each sentence into a question with <em>est-ce que</em>. Say it out loud as you type.',
          questions: [
            typed('Tu veux sortir ce soir. → ___', 'Est-ce que tu veux sortir ce soir ?'),
            typed('Ta famille peut faire du ski. → ___', 'Est-ce que ta famille peut faire du ski ?'),
            typed('Vous pouvez faire du VTT. → ___', 'Est-ce que vous pouvez faire du VTT ?'),
            typed('Tu peux parler espagnol. → ___', 'Est-ce que tu peux parler espagnol ?'),
            typed('On peut réserver une table. → ___', "Est-ce qu'on peut réserver une table ?", { hint: "Before a vowel: est-ce qu'." }),
          ],
        },
        {
          slug: 'ask-in-french',
          title: 'Ask it in French',
          instructions: 'Translate the questions from the notebook.',
          questions: [
            typed('What do you want to do tomorrow? (tu)', "Qu'est-ce que tu veux faire demain ?"),
            typed('Does your family want to come to Châtel?', 'Est-ce que ta famille veut venir à Châtel ?'),
            typed('Why do you want to learn French? (vous)', 'Pourquoi est-ce que vous voulez apprendre le français ?'),
            typed('What can you do in Châtel in summer?', "Qu'est-ce qu'on peut faire à Châtel en été ?", {
              acceptable: ["qu'est-ce que vous pouvez faire à châtel en été", "qu'est-ce que tu peux faire à châtel en été"] }),
            typed("Yes, I'd like that!", 'Oui, je veux bien !'),
            typed("I don't understand.", 'Je ne comprends pas.'),
            typed('What does that mean?', "Qu'est-ce que ça veut dire ?"),
          ],
        },
      ],
    },
    {
      slug: 'notebook-ch23',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 23,
      title: 'Good, better, best — and BAGS',
      subtitle: 'bon/bien, meilleur/mieux, mauvais/mal, and where adjectives go',
      level: 'A2.1',
      rule: {
        heading: 'Adjective or adverb? Before or after?',
        paras: [
          '<em>Bon, meilleur, mauvais, pire</em> describe a thing. <em>Bien, mieux, mal, plus mal</em> describe how you do something.',
          'Most adjectives go after the noun: <em>une région vallonnée</em>. BAGS go before — <strong>B</strong>eauty, <strong>A</strong>ge, <strong>G</strong>oodness, <strong>S</strong>ize: <em>une jolie maison, un vieux chalet, un bon restaurant, une longue queue</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'bon-bien',
          title: 'Bon, bien, meilleur, mieux',
          instructions: 'Fill in <em>bon(ne), bien, meilleur(e)</em> or <em>mieux</em>.',
          questions: [
            typed("C'est un ___ restaurant.", 'bon'),
            typed('Lois skie très ___.', 'bien'),
            typed("Ce vin est ___ que l'autre.", 'meilleur'),
            typed('Je skie ___ maintenant.', 'mieux'),
            typed("C'est la ___ piste de Morzine.", 'meilleure'),
            typed("C'est Lois qui skie le ___.", 'mieux'),
            typed("Le week-end ? C'était très ___ !", 'bien'),
            typed("C'est une ___ idée.", 'bonne'),
          ],
        },
        {
          slug: 'bad-worse',
          title: 'Mauvais, mal, pire',
          instructions: 'Pick the right word.',
          questions: [
            choice("Il fait ___ aujourd'hui. (The weather's bad.)", ['mauvais', 'mal']),
            choice("J'ai ___ dormi. (I slept badly.)", ['mal', 'mauvais']),
            choice("C'est le ___ hiver depuis dix ans. (the worst)", ['pire', 'plus mal']),
            choice("C'est une ___ idée. (a bad idea)", ['mauvaise', 'mal']),
          ],
        },
        {
          slug: 'bags',
          title: 'Before or after? (BAGS)',
          instructions: 'Which way round?',
          questions: [
            choice('a pretty house', ['une jolie maison', 'une maison jolie']),
            choice('an old chalet', ['un vieux chalet', 'un chalet vieux']),
            choice('a red car', ['une voiture rouge', 'une rouge voiture']),
            choice('a hilly area', ['une région vallonnée', 'une vallonnée région']),
            choice('a good restaurant', ['un bon restaurant', 'un restaurant bon']),
            choice('French wine', ['le vin français', 'le français vin']),
            choice('a long queue', ['une longue queue', 'une queue longue']),
            choice('a free concert', ['un concert gratuit', 'un gratuit concert']),
          ],
        },
      ],
    },
    {
      slug: 'notebook-ch24',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 24,
      title: 'Fix the notebook',
      subtitle: 'The mistakes in the notes, and the right way to say each one',
      level: 'A2.1',
      rule: {
        heading: 'Spot it, fix it, say it',
        paras: [
          'Each of these came from the notebook photos. Pick the right version, then say it out loud — the ear learns the fix faster than the eye.',
          'The full list, with reasons, is in Grammar notes under <strong>Corrections from your notebook</strong>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'which-is-right',
          title: 'Which is right?',
          instructions: 'One version is from the notebook, one is corrected.',
          questions: [
            choice('Last week…', ['La semaine dernière…', 'Dernier semaine…']),
            choice('I worked a lot.', ["J'ai beaucoup travaillé.", "J'ai travaillé beaucoup."],
              'Short adverbs like <em>beaucoup, bien, déjà</em> sit between <em>ai</em> and the past participle.'),
            choice('It was hot and sunny.', ['Il faisait chaud et beau.', "C'était chaud et beau."],
              'Weather uses <em>il fait / il faisait</em>.'),
            choice('It was really good. (the weekend)', ["C'était très bien.", "C'était très bonne."]),
            choice('We went to the pool.', ['On est allés à la piscine.', 'On est aller à la piscine.']),
            choice("I don't understand.", ['Je ne comprends pas.', 'Je ne comprend pas.']),
            choice('Why do you want to learn French?', ['Pourquoi est-ce que vous voulez apprendre le français ?', 'Pour quoi vous voulez apprendre le français ?']),
            choice('We have French lessons.', ['On a des cours de français.', 'On à des cours de française.']),
            choice("I'd like a pint on Saturday night.", ['Je voudrais prendre une pinte samedi soir.', 'Je voudrais avoir une pinte samedi soir.']),
            choice('Does your family want to come?', ['Est-ce que ta famille veut venir ?', 'Est-ce que ta famille veulent venir ?']),
            choice('I got a fine.', ["J'ai eu une amende.", 'Je eu une amende.']),
            choice('I have to walk the dog.', ['Je dois promener le chien.', 'Je dois promener avec le chien.']),
          ],
        },
        {
          slug: 'fix-one-word',
          title: 'Fix one word',
          instructions: 'Fill the gap with the corrected word.',
          questions: [
            typed("La semaine ___, j'ai beaucoup travaillé. (last)", 'dernière'),
            typed("Je suis ___ aujourd'hui. (tired)", 'fatigué', { acceptable: ['fatiguée'] }),
            typed('Hier, on est ___ à la piscine. (aller)', 'allés', { acceptable: ['allé', 'allées', 'allée'] }),
            typed('Hier, il ___ chaud et beau. (faire)', 'faisait'),
            typed('Je ne ___ pas. (comprendre)', 'comprends'),
            typed('On ___ des cours de français. (avoir)', 'a'),
            typed('Pourquoi est-ce que vous voulez apprendre le ___ ? (French)', 'français'),
            typed('Je ___ allé courir. (I went for a run)', 'suis'),
            typed('On a ___ une bière. (boire)', 'bu'),
          ],
        },
      ],
    },
  ],
};
