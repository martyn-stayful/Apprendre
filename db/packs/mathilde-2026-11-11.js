// Lesson with Mathilde, 11 November 2026.
//
// Family first: half-brothers, divorced parents, who's single and who's en
// couple, and a brother in Melbourne you talk to every day. Then the grammar it
// threw up: « I'm working » is je travaille, never je suis travaille (être en
// train de when it's right now); spoken French drops the ne (je sais pas,
// chépa, chui); a pronoun goes before its verb (je ne la vois pas souvent); and
// reflexive verbs — je me lève, je me lave, on s'entend bien — where entendre
// and s'entendre, promener le chien and se promener mean different things.
// Last, the corrections from the written exercise: je vais prendre des photos,
// je me suis perdu, le cours de français, je retente.
//
// Slugs and the pack key are permanent — progress is stored against them.

import { mc, typed, choice, drills, lines, forms } from './helpers.js';

export default {
  key: 'mathilde-2026-11-11',
  title: 'Lesson of 11 November',
  date: '2026-11-11',
  summary:
    'Talking about your family (demi-frère, divorcés, célibataire, en couple, mes proches), reflexive ' +
    'verbs for the daily routine (je me lève, on s\'entend bien), why « I\'m working » is je travaille ' +
    'and not je suis…, être en train de, and how spoken French drops the ne: je sais pas, chépa, chui.',

  // ----------------------------------------------------------- Daily 10 --
  drills: [
    ...drills('chat', 'A1.3', [
      ['Say: My parents are divorced.', 'Mes parents sont divorcés.'],
      ["Say: I've got a half-brother.", "J'ai un demi-frère.", 'Demi = half: un demi-frère, une demi-sœur.'],
      ['Say: My brother lives in Australia, in Melbourne.', 'Mon frère habite en Australie, à Melbourne.', 'En for a feminine country, à for a city.'],
      ['Ask: Have you got brothers and sisters?', 'Tu as des frères et sœurs ?', "There's no one word for siblings: frères et sœurs."],
      ['Say: She\'s single, and he\'s in a relationship.', 'Elle est célibataire, et il est en couple.'],
      ["Say: We're close.", 'On est proches.', 'Mes proches = my close family.'],
    ]),
    ...drills('chat', 'A2.1', [
      ['Say: We get on really well.', "On s'entend très bien.", "S'entendre = to get on. Entendre on its own = to hear."],
      ['Say: We talk on the phone every day.', 'On se parle au téléphone tous les jours.', 'Se parler = to talk to each other.'],
      ["Say: I don't see her often.", 'Je ne la vois pas souvent.', 'La goes right before the verb. Spoken: je la vois pas souvent.'],
      ["Say: I've never met him.", "Je ne l'ai jamais rencontré.", 'Rencontrer = to meet for the first time. Retrouver = to meet up.'],
      ["Say: I'm working tonight.", 'Je travaille ce soir.', "One present tense for 'I work' and 'I'm working'. Never je suis travaille."],
      ["Say: I can't talk, I'm in the middle of working.", 'Je ne peux pas parler, je suis en train de travailler.', 'Être en train de + infinitive: right now, in the middle of it.'],
      ["Say: I'm on my way!", 'Je suis en route !'],
      ["Say: I'm happy.", 'Je suis heureux.', 'Être for states: heureux, fatigué, en retard. Lois: heureuse.'],
    ]),
    ...drills('general', 'A2.1', [
      ['Say: I get up at seven.', 'Je me lève à sept heures.'],
      ['Say: I wake up early.', 'Je me réveille tôt.'],
      ["Say: I'm going for a walk by the lake.", 'Je vais me promener au bord du lac.', 'Se promener = to go for a walk. Promener le chien = to walk the dog.'],
      ["Say: I'm walking the dog.", 'Je promène le chien.', 'Not reflexive: the dog is the one being walked.'],
      ['Say: I got lost.', 'Je me suis perdu.', 'Reflexive verbs take être in the passé composé. Lois: perdue.'],
      ["Tell a friend: Don't get worked up!", "Ne t'énerve pas !", "S'énerver = to get angry. Lots of English “get” verbs are reflexive in French."],
      ["Ask a guest: What's your name?", 'Vous vous appelez comment ?'],
    ]),
    ...drills('slang', 'A2.1', [
      ["Say it casually: I don't know.", 'Je sais pas.', 'Spoken French drops the ne. Written: je ne sais pas.'],
      ['Say it fast, like a local: I dunno.', 'Chépa.', 'Je ne sais pas → je sais pas → j\'sais pas → chépa.'],
      ["Say it casually: I'm knackered.", 'Chui crevé.', 'Chui = je suis, said fast. Crevé = knackered, familier.'],
      ["Tell a friend: Don't worry!", "T'inquiète !", "Short for ne t'inquiète pas, familier."],
    ]),
  ],

  // --------------------------------------------------------- role-plays --
  roleplays: [
    {
      title: 'Parler de sa famille',
      ctx: 'Mathilde asks about your family. Answer in short, natural sentences.',
      lines: lines([
        ['them', 'Tu as des frères et sœurs ?', 'Have you got brothers and sisters?'],
        ['you', "Oui, j'ai un frère et un demi-frère.", "Yes, I've got a brother and a half-brother."],
        ['them', 'Ils habitent où ?', 'Where do they live?'],
        ['you', 'Mon frère habite en Australie, à Melbourne.', 'My brother lives in Australia, in Melbourne.'],
        ['them', 'Tu le vois souvent ?', 'Do you see him often?'],
        ['you', 'Non, je ne le vois pas souvent, mais on se parle au téléphone.', "No, I don't see him often, but we talk on the phone."],
        ['them', 'Vous vous entendez bien ?', 'Do you get on well?'],
        ['you', "Oui, on s'entend très bien. On est proches.", "Yes, we get on really well. We're close."],
        ['them', 'Et tes parents ?', 'And your parents?'],
        ['you', 'Mes parents sont divorcés. Ils sont tous les deux en couple, mais pas remariés.', "My parents are divorced. They've both got new partners, but they haven't remarried."],
        ['them', 'Et ton demi-frère ?', 'And your half-brother?'],
        ['you', "Je ne l'ai jamais rencontré !", "I've never met him!"],
      ]),
      notes: "<strong>Le</strong> and <strong>la</strong> go before the verb: <em>je le vois, je ne le vois pas</em>. <em>On s'entend</em> and <em>on se parle</em> are plural reflexives, so they mean <em>each other</em>. In conversation you'll hear <em>je le vois pas souvent</em>, without the <em>ne</em>. Lois says <em>je ne l'ai jamais rencontrée</em> only if the half-sibling is a sister.",
    },
    {
      title: 'Tu peux parler ?',
      ctx: "A friend rings while you're behind the bar.",
      lines: lines([
        ['them', 'Salut ! Tu peux parler ?', 'Hi! Can you talk?'],
        ['you', 'Pas vraiment, je suis en train de travailler.', "Not really, I'm in the middle of working."],
        ['them', 'Ah, pardon ! Tu finis à quelle heure ?', 'Oh, sorry! What time do you finish?'],
        ['you', 'Je sais pas… vers onze heures, je pense.', "I don't know… around eleven, I think."],
        ['them', 'On se retrouve au bar après ?', 'Shall we meet up at the bar afterwards?'],
        ['you', "D'accord. Je t'envoie un message quand je suis en route.", "OK. I'll send you a message when I'm on my way."],
        ['them', "Super. Et ne t'énerve pas avec les clients !", "Great. And don't get worked up with the customers!"],
        ['you', "T'inquiète, je m'énerve jamais !", "Don't worry, I never get worked up!"],
      ]),
      notes: "<em>Je suis en train de travailler</em> stresses right now; <em>je travaille ce soir</em> is the everyday present. <em>Je sais pas</em> and <em>je m'énerve jamais</em> drop the <em>ne</em>, as everyone does when speaking. <em>T'inquiète</em> = don't worry, familier. <em>Se retrouver</em> = to meet up.",
    },
  ],

  // -------------------------------------------------------------- decks --
  decks: [
    {
      slug: 'nov11_family',
      name: 'Family and relationships',
      category: 'Vocabulary',
      level: 'A1.3',
      cards: [
        { fr: 'les frères et sœurs', en: 'brothers and sisters, siblings', ex: 'Tu as des frères et sœurs ?' },
        { fr: 'un demi-frère', en: 'a half-brother', ex: "J'ai un demi-frère en Angleterre." },
        { fr: 'une demi-sœur', en: 'a half-sister', ex: 'Ma demi-sœur a dix ans.' },
        { fr: 'divorcé(e)', en: 'divorced', ex: 'Mes parents sont divorcés.' },
        { fr: 'célibataire', en: 'single', ex: 'Elle est célibataire.' },
        { fr: 'en couple', en: 'in a relationship', ex: 'Il est en couple depuis deux ans.' },
        { fr: 'marié(e)', en: 'married', ex: 'Ils ne sont pas mariés.' },
        { fr: 'le compagnon / la compagne', en: 'partner (not married)', ex: 'Ma mère vit avec son compagnon.' },
        { fr: 'mes proches', en: 'my close family, my loved ones', ex: 'Je passe Noël avec mes proches.' },
        { fr: 'proche', en: 'close', ex: 'On est très proches.' },
        { fr: 'le neveu / la nièce', en: 'nephew / niece', ex: 'Mes neveux habitent à Northampton.' },
        { fr: 'le mari / la femme', en: 'husband / wife', ex: 'Son mari est prof de yoga.' },
        { fr: 'rencontrer', en: 'to meet (for the first time)', ex: "Je ne l'ai jamais rencontré." },
        { fr: 'retrouver', en: 'to meet up with', ex: 'On se retrouve au bar ?' },
        { fr: 'un prof', en: 'a teacher (short for professeur)', ex: 'Elle est prof de yoga.' },
        { fr: 'une manif', en: 'a demo, a protest (short for manifestation)', ex: 'Il y a une manif à Genève.' },
      ],
    },
    {
      slug: 'nov11_reflexive',
      name: 'Reflexive verbs: the daily routine',
      category: 'Verbs',
      level: 'A2.1',
      cards: [
        { fr: 'se lever', en: 'to get up', ex: 'Je me lève à sept heures.' },
        { fr: 'se réveiller', en: 'to wake up', ex: 'Je me réveille tôt.' },
        { fr: 'se laver', en: 'to wash (yourself)', ex: 'Je me lave les mains.' },
        { fr: 'se doucher', en: 'to have a shower', ex: 'Je me douche le matin.' },
        { fr: "s'habiller", en: 'to get dressed', ex: "Je m'habille vite." },
        { fr: 'se coucher', en: 'to go to bed', ex: 'Je me couche tard.' },
        { fr: "s'appeler", en: 'to be called', ex: "Je m'appelle Martyn." },
        { fr: "s'entendre bien avec", en: 'to get on well with', ex: "Je m'entends bien avec mon frère." },
        { fr: 'entendre', en: 'to hear', ex: "Tu m'entends ?" },
        { fr: 'se promener', en: 'to go for a walk', ex: 'On se promène au bord du lac.' },
        { fr: 'promener le chien', en: 'to walk the dog', ex: 'Je promène le chien le soir.' },
        { fr: "s'énerver", en: 'to get angry, to get worked up', ex: "Ne t'énerve pas !" },
        { fr: 'se perdre', en: 'to get lost', ex: 'Je me suis perdu dans la montagne.' },
        { fr: 'se parler', en: 'to talk to each other', ex: 'On se parle tous les jours.' },
      ],
    },
    {
      slug: 'nov11_spoken',
      name: 'How French is really spoken',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'je sais pas', en: "I don't know (spoken)", ex: 'Je sais pas, on verra.' },
        { fr: 'chépa', en: 'dunno (je sais pas, said fast)', ex: '« Il est où ? » « Chépa. »' },
        { fr: 'chui', en: "I'm (je suis, said fast)", ex: 'Chui crevé.' },
        { fr: 'je travaille', en: "I work / I'm working", ex: 'Je travaille ce soir.' },
        { fr: 'je suis en train de…', en: "I'm in the middle of… (right now)", ex: 'Je suis en train de manger.' },
        { fr: 'je suis en route', en: "I'm on my way", ex: "Je suis en route, j'arrive !" },
        { fr: "t'inquiète", en: "don't worry (spoken)", ex: "T'inquiète, c'est pas grave." },
        { fr: 'souvent', en: 'often', ex: 'Je ne la vois pas souvent.' },
        { fr: 'jamais', en: 'never', ex: "Je ne l'ai jamais rencontré." },
      ],
    },
  ],

  // ------------------------------------------------------------ quizzes --
  quizzes: [
    {
      slug: 'nov11_reflexive_quiz',
      title: 'Me, te, se: reflexive verbs',
      level: 'A2.1',
      questions: [
        mc('Je ___ lève à sept heures.', 'I get up at seven.', ['me', 'se', 'te', 'le'],
          'Je goes with me: je me lève.'),
        mc('Tu ___ réveilles tôt ?', 'Do you wake up early?', ['te', 'me', 'se', 'tu'],
          'Tu goes with te.'),
        mc('Elle ___ douche le matin.', 'She has a shower in the morning.', ['se', 'la', 'me', 'te'],
          'Il, elle and on go with se.'),
        mc('Nous ___ promenons au bord du lac.', "We're going for a walk by the lake.", ['nous', 'se', 'vous', 'nos'],
          'With nous the pronoun repeats: nous nous promenons. In speech, on se promène.'),
        mc('Vous ___ appelez comment ?', "What's your name?", ['vous', 'se', 'nous', 'votre']),
        mc('Mon frère et moi, on ___ entend très bien.', 'My brother and I get on really well.', ["s'", 'se', "m'", "t'"],
          "On goes with se, and se becomes s' before a vowel: on s'entend."),
        mc('Je ___ suis perdu.', 'I got lost.', ['me', 'se', "m'", 'le'],
          'Reflexive verbs take être in the passé composé: je me suis perdu.'),
        mc('« Je promène le chien » means…', 'Pick the meaning.',
          ['I walk the dog.', 'I go for a walk with the dog.', 'The dog takes me for a walk.', 'I wash the dog.'],
          'Promener le chien: you walk the dog. Se promener: you go for a walk yourself.'),
        mc("« S'entendre bien » means…", 'Pick the meaning.',
          ['to get on well', 'to hear well', 'to listen carefully', 'to understand perfectly'],
          "Entendre = to hear; s'entendre = to get on. Making a verb reflexive can change its meaning."),
        mc('« Ils se réveillent » can mean…', 'Pick the fullest answer.',
          ['they wake up, or they wake each other up', 'they wake up, and nothing else', 'they wake someone else up', 'they woke up'],
          'A plural reflexive can mean each other.'),
        mc('I go for a run.', 'Pick the French.', ['Je cours.', 'Je me cours.', 'Je suis cours.', 'Je me suis courir.'],
          "Running isn't something you do to yourself, so no me. You don't eat yourself or run yourself either."),
      ],
    },
    {
      slug: 'nov11_working_quiz',
      title: '« I\'m working »: je travaille, être and en train de',
      level: 'A2.1',
      questions: [
        mc("I'm working tonight.", 'Pick the French.',
          ['Je travaille ce soir.', 'Je suis travaille ce soir.', 'Je suis travailler ce soir.', 'Je suis en travail ce soir.'],
          "French has one present tense for 'I work' and 'I'm working'. Never je suis + a verb."),
        mc("I can't talk, I'm in the middle of eating.", 'Pick the French.',
          ['Je ne peux pas parler, je suis en train de manger.', 'Je ne peux pas parler, je suis mange.',
            'Je ne peux pas parler, je suis en train de mange.', 'Je ne peux pas parler, je suis en manger.'],
          'Être en train de + the infinitive: right now, in the middle of it.'),
        mc('Je suis en train de ___.', "I'm in the middle of cooking.", ['cuisiner', 'cuisine', 'cuisinant', 'cuisiné'],
          'After de, the infinitive.'),
        mc("I'm learning French.", 'Pick the French.',
          ["J'apprends le français.", 'Je suis apprends le français.', 'Je suis apprendre le français.', "J'apprendre le français."],
          "Just the present tense: j'apprends."),
        mc("I'm happy.", 'Pick the French.', ['Je suis heureux.', 'Je heureux.', "J'ai heureux.", 'Je suis en train de heureux.'],
          'Être is for states and descriptions: heureux, fatigué, en retard.'),
        mc("I'm on my way!", 'Pick the French.', ['Je suis en route !', 'Je viens en route !', "J'ai en route !", 'Je suis venir !']),
        mc('« Je sais pas » is…', "I don't know", ['spoken French: the ne is dropped', 'a mistake', 'formal written French', 'only for children'],
          'In writing: je ne sais pas. Speaking: je sais pas, or, fast, chépa.'),
        mc('« Chui fatigué » means…', 'Pick the meaning.', ["I'm tired (je suis, said fast)", "I'm not tired", 'I was tired', "He's tired"],
          "Je suis → j'suis → chui in fast speech."),
        mc("I don't see her often.", 'Pick the French.',
          ['Je ne la vois pas souvent.', 'Je ne vois pas la souvent.', 'Je ne vois la pas souvent.', 'Je la ne vois pas souvent.'],
          'The pronoun goes right before the verb, inside ne… pas.'),
        mc("I've never met him.", 'Pick the French.',
          ["Je ne l'ai jamais rencontré.", "Je ne l'ai jamais retrouvé.", "Je n'ai jamais le rencontré.", "Je ne l'ai pas jamais rencontré."],
          'Rencontrer = to meet for the first time; retrouver = to meet up again.'),
        mc("I'm going to take photos.", 'Pick the French.',
          ['Je vais prendre des photos.', 'Je vais aller prendre des photo.', 'Je vais prendre des photo.', 'Je suis prendre des photos.'],
          'Aller + infinitive already says “going to”: no second aller. And photos takes an s.'),
      ],
    },
  ],

  // -------------------------------------------------------------- verbs --
  // Reflexive verbs: each form carries its pronoun, so the drill asks for
  // « me lève » after je.
  verbs: [
    { infinitive: 'se lever', meaning: 'to get up', level: 'A2.1',
      forms: forms('me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent') },
    { infinitive: 'se réveiller', meaning: 'to wake up', level: 'A2.1',
      forms: forms('me réveille', 'te réveilles', 'se réveille', 'nous réveillons', 'vous réveillez', 'se réveillent') },
    { infinitive: "s'entendre", meaning: 'to get on (with)', level: 'A2.1',
      forms: forms("m'entends", "t'entends", "s'entend", 'nous entendons', 'vous entendez', "s'entendent") },
    { infinitive: 'se promener', meaning: 'to go for a walk', level: 'A2.1',
      forms: forms('me promène', 'te promènes', 'se promène', 'nous promenons', 'vous promenez', 'se promènent') },
  ],

  // ----------------------------------------------------------- concepts --
  concepts: [
    {
      slug: 'nov11-reflexive',
      title: 'Reflexive verbs',
      subtitle: 'je me lève · on s\'entend bien · se promener',
      category: 'A2.1',
      paragraphs: [
        "When you do something to yourself, French adds a small pronoun before the verb: <strong>je me lave</strong> (I wash myself). Compare <em>je lave Zoé</em>, where the action goes to someone else. That's a <strong>reflexive verb</strong>: the subject and the object are the same person, like a reflection in a mirror. In the dictionary it's <em>se laver</em>.",
        "The pronoun matches the person and sits right before the verb: <strong>je me, tu te, il/elle/on se, nous nous, vous vous, ils/elles se</strong>. Before a vowel, <em>me, te, se</em> become <em>m', t', s'</em>: <em>je m'appelle, on s'entend</em>.",
        "A clue in English: lots of <strong>“get”</strong> verbs are reflexive in French. Get up, <em>se lever</em>; get washed, <em>se laver</em>; get dressed, <em>s'habiller</em>; get angry, <em>s'énerver</em>; get lost, <em>se perdre</em>. Wake up is <em>se réveiller</em>.",
        "Sometimes the meaning changes. <em>Entendre</em> = to hear, <strong>s'entendre</strong> = to get on. <em>Promener le chien</em> = to walk the dog, <strong>se promener</strong> = to go for a walk. And with <em>nous, vous, on, ils</em>, a reflexive can mean <strong>each other</strong>: <em>ils se réveillent</em> is they wake up, or they wake each other up; <em>on se parle</em> is we talk to each other.",
        "Not every verb can do it. You don't eat yourself or run yourself, so <em>je mange, je cours</em>, never <em>je me cours</em>. Learn the three or four you use every day as whole phrases: <em>je me lève, je me lave, je me réveille, on s'entend bien</em>.",
      ],
      table_rows: [
        { en: 'I get up', fr: 'je me lève' },
        { en: 'you wake up', fr: 'tu te réveilles' },
        { en: 'he goes for a walk', fr: 'il se promène' },
        { en: 'we get up', fr: 'nous nous levons · on se lève' },
        { en: "what's your name?", fr: 'vous vous appelez comment ?' },
        { en: 'they get on well', fr: "ils s'entendent bien" },
        { en: 'I got lost', fr: 'je me suis perdu(e)' },
      ],
      examples: [
        { fr: 'Je me lève à sept heures et je me douche.', en: 'I get up at seven and have a shower.' },
        { fr: "Mon frère et moi, on s'entend très bien.", en: 'My brother and I get on really well.' },
        { fr: 'Je promène le chien, puis je me promène au bord du lac.', en: 'I walk the dog, then I go for a walk by the lake.' },
        { fr: 'Hier, je me suis perdu dans la montagne.', en: 'Yesterday I got lost in the mountains.' },
      ],
      pitfall: {
        title: '« Je suis lève » and « je lève »',
        body: "The pronoun is part of the verb: <em>je <strong>me</strong> lève</em>. Without it, <em>je lève</em> means I lift (something). In the past, reflexives take <em>être</em>: <em>je me suis levé, je me suis perdu</em>.",
      },
    },
    {
      slug: 'nov11-je-travaille',
      title: '« I\'m working » is je travaille',
      subtitle: 'one present tense · être for states · en train de for right now',
      category: 'A2.1',
      paragraphs: [
        "English has two present tenses: <em>I work</em> and <em>I'm working</em>. French has one: <strong>je travaille</strong> means both. So never <em>je suis travaille</em>: when “I am” is helping to make an action, French just uses the verb. <em>I'm learning French</em> = <em>j'apprends le français</em>.",
        "<strong>Être</strong> is for what you <em>are</em>, not what you're doing: states and descriptions. <em>Je suis heureux, je suis fatigué, je suis en retard, je suis en route.</em>",
        "When you really want to say <em>right now, in the middle of it</em>, use <strong>être en train de + the infinitive</strong>: <em>Je ne peux pas parler, je suis en train de travailler.</em> It's the closest thing to English “-ing”, but the French use it far less: only when it matters that it's happening this minute.",
        "The same goes for the past: <em>I was working</em> isn't <em>j'étais travaille</em>. It's <em>je travaillais</em>, or <em>j'étais en train de travailler</em> to stress it.",
      ],
      table_rows: [
        { en: "I'm working tonight", fr: 'je travaille ce soir' },
        { en: "I'm learning French", fr: "j'apprends le français" },
        { en: "I'm in the middle of working (right now)", fr: 'je suis en train de travailler' },
        { en: "I'm happy", fr: 'je suis heureux · heureuse' },
        { en: "I'm on my way", fr: 'je suis en route' },
      ],
      examples: [
        { fr: 'Ce soir, je travaille au bar.', en: "Tonight I'm working at the bar." },
        { fr: 'Pas maintenant, je suis en train de manger !', en: "Not now, I'm in the middle of eating!" },
        { fr: 'Je suis en route, j\'arrive dans dix minutes.', en: "I'm on my way, I'll be there in ten minutes." },
      ],
      pitfall: {
        title: '« Je suis travaille »',
        body: "Two verbs can't sit side by side like that. Either the plain present, <em>je travaille</em>, or <em>je suis en train de travailler</em>, with the infinitive after <em>de</em>.",
      },
    },
    {
      slug: 'nov11-je-sais-pas',
      title: 'Je sais pas: how French is spoken',
      subtitle: 'dropping ne · chépa · chui · where the pronoun goes',
      category: 'A2.1',
      paragraphs: [
        "In writing, the negative has two parts: <strong>ne… pas</strong>. <em>Je ne sais pas.</em> When people speak, the <em>ne</em> almost always disappears: <strong>je sais pas</strong>. Said quickly it squashes further: <em>j'sais pas</em>, then <strong>chépa</strong>. You'll hear it from customers all the time.",
        "The same with <em>je suis</em>: fast, it becomes <em>j'suis</em>, then <strong>chui</strong>. <em>Chui crevé</em> = I'm knackered. You don't need to say these yourself, but you need to recognise them.",
        "Writing, or speaking to someone you call <em>vous</em>, keep the <em>ne</em>: it's correct and never wrong. With friends, dropping it sounds natural: <em>je m'énerve jamais, c'est pas grave, t'inquiète</em> (from <em>ne t'inquiète pas</em>).",
        "Small pronouns (<em>le, la, l', lui, les</em>) go right <strong>before the verb</strong>, not after it as in English: <em>je la vois</em> (I see her). In the negative they stay glued to the verb, inside <em>ne… pas</em>: <strong>je ne la vois pas souvent</strong>. In the past: <em>je ne l'ai jamais rencontré</em>.",
      ],
      table_rows: [
        { en: "I don't know", fr: 'je ne sais pas → je sais pas → chépa' },
        { en: "I'm…", fr: 'je suis → j\'suis → chui' },
        { en: "it doesn't matter", fr: "ce n'est pas grave → c'est pas grave" },
        { en: "don't worry", fr: "ne t'inquiète pas → t'inquiète" },
        { en: "I don't see her often", fr: 'je ne la vois pas souvent' },
        { en: "I've never met him", fr: "je ne l'ai jamais rencontré" },
      ],
      examples: [
        { fr: '« Le bus passe à quelle heure ? » « Chépa. »', en: '“What time does the bus come?” “Dunno.”' },
        { fr: 'Ma sœur ? Je la vois pas souvent.', en: "My sister? I don't see her often." },
        { fr: "C'est pas grave, t'inquiète !", en: "It doesn't matter, don't worry!" },
      ],
      pitfall: {
        title: '« Je ne vois pas la »',
        body: "English puts the pronoun after the verb; French puts it before. Think of the whole block: <em>je ne <strong>la</strong> vois pas</em>, <em>je ne <strong>l'</strong>ai jamais vu</em>.",
      },
    },
  ],

  // ------------------------------------------------------ grammar notes --
  grammar_notes: [
    {
      title: '11 November, tidied up',
      body: `<p>The lesson of 11 November, spelt and translated, with the corrections from the written exercise. Tap any French to hear it.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>mes parents sont divorcés</em></td><td>my parents are divorced</td></tr>
        <tr><td class="fr"><em>un demi-frère · une demi-sœur</em></td><td>a half-brother · a half-sister</td></tr>
        <tr><td class="fr"><em>célibataire · en couple · marié(e)</em></td><td>single · in a relationship · married</td></tr>
        <tr><td class="fr"><em>les frères et sœurs</em></td><td>siblings (no single word)</td></tr>
        <tr><td class="fr"><em>mes proches</em></td><td>my close family</td></tr>
        <tr><td class="fr"><em>je ne l'ai jamais rencontré</em></td><td>I've never met him (rencontrer = meet for the first time)</td></tr>
        <tr><td class="fr"><em>on se retrouve ?</em></td><td>shall we meet up? (retrouver = meet up)</td></tr>
        <tr><td class="fr"><em>je ne la vois pas souvent</em></td><td>I don't see her often (la before the verb)</td></tr>
        <tr><td class="fr"><em>on s'entend très bien</em></td><td>we get on really well</td></tr>
        <tr><td class="fr"><em>je travaille · je suis en train de travailler</em></td><td>I'm working · I'm in the middle of working</td></tr>
        <tr><td class="fr"><em>je sais pas · chépa · chui</em></td><td>I don't know · dunno · I'm (spoken)</td></tr>
        <tr><td class="fr"><em>je vais prendre des photos</em></td><td>I'm going to take photos (not « je vais aller prendre des photo »)</td></tr>
        <tr><td class="fr"><em>je me suis perdu(e)</em></td><td>I got lost (reflexive, so être)</td></tr>
        <tr><td class="fr"><em>comment est-ce que je vais à l'hôtel du lac ?</em></td><td>how do I get to the lake hotel? (est-ce que works after comment, à quelle heure…)</td></tr>
        <tr><td class="fr"><em>à quelle heure est-ce que tu es disponible ?</em></td><td>what time are you free? (quand est-ce que… works too)</td></tr>
        <tr><td class="fr"><em>le cours de français</em></td><td>the French lesson (cours is masculine)</td></tr>
        <tr><td class="fr"><em>retenter · je retente</em></td><td>to try again · I try again (infinitive vs conjugated)</td></tr>
      </table>`,
    },
  ],

  // ------------------------------------------------------------ stories --
  stories: [
    {
      slug: 'nov11-le-matin-au-chalet',
      title: 'Le matin au chalet',
      blurb: 'A morning at the chalet and a call from Melbourne: the lesson of 11 November as a story. Press Read aloud and listen first.',
      level: 'A2',
      tags: ['reflexive verbs', 'family', 'spoken French', 'listening'],
      focus: [
        "<em>Je me réveille, je me lève, je me douche</em>: reflexive verbs for the routine",
        "<em>On s'entend bien, on se parle</em>: plural reflexives meaning each other",
        "<em>Je suis en train de…, je sais pas</em>: right now, and how people really speak",
      ],
      body: `
      <p>[[Le matin|In the morning]], [[je me réveille|I wake up|se réveiller]] [[à six heures et demie|at half past six]], mais [[je me lève|I get up|se lever]] [[à sept heures|at seven]]. [[Je me douche|I have a shower|se doucher]], [[je m'habille|I get dressed|s'habiller]] et [[je promène le chien|I walk the dog|not reflexive: the dog gets walked]].</p>
      <p>[[Ce matin|This morning]], [[mon téléphone sonne|my phone rings]]. C'est [[mon frère|my brother]], [[il habite en Australie|he lives in Australia]], [[à Melbourne|in Melbourne]]. [[Je ne le vois pas souvent|I don't see him often|le before the verb]], mais [[on se parle|we talk to each other|plural reflexive = each other]] [[tous les dimanches|every Sunday]]. [[On s'entend très bien|We get on really well|s'entendre = to get on]].</p>
      <p>« [[Tu fais quoi ?|What are you up to?]] » [[demande-t-il|he asks]]. « [[Je suis en train de promener le chien|I'm in the middle of walking the dog|être en train de + infinitive]] ! » [[Il me parle de|He tells me about]] [[notre demi-frère|our half-brother]] : [[il est en couple|he's in a relationship]] [[et il va se marier|and he's going to get married]]. « [[Tu l'as déjà rencontré ?|Have you met him yet?]] » « [[Non, je l'ai jamais rencontré|No, I've never met him|spoken: no ne]]. [[Et sa copine ?|And his girlfriend?]] » « [[Chépa|Dunno|je sais pas, said fast]] ! »</p>
      <p>[[Après|Afterwards]], [[je me promène|I go for a walk|se promener]] [[au bord du lac|by the lake]]. [[Il fait froid|It's cold]], mais [[je suis heureux|I'm happy|être for a state]]. [[Ce soir|Tonight]], [[je travaille au bar|I'm working at the bar|plain present, not je suis travaille]].</p>
      `,
      translation: `
      <p>In the morning I wake up at half past six, but I get up at seven. I have a shower, get dressed and walk the dog.</p>
      <p>This morning my phone rings. It's my brother; he lives in Australia, in Melbourne. I don't see him often, but we talk every Sunday. We get on really well.</p>
      <p>“What are you up to?” he asks. “I'm in the middle of walking the dog!” He tells me about our half-brother: he's in a relationship and he's going to get married. “Have you met him yet?” “No, I've never met him. And his girlfriend?” “Dunno!”</p>
      <p>Afterwards I go for a walk by the lake. It's cold, but I'm happy. Tonight I'm working at the bar.</p>
      `,
    },
  ],

  // ----------------------------------------------------------- workbook --
  workbook_chapters: [
    {
      slug: 'nov11-ch26',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 27,
      title: 'Family, reflexive verbs and « I\'m working »',
      subtitle: 'me, te, se · je travaille · the pronoun before the verb',
      level: 'A2.1',
      rule: {
        heading: 'Me, te, se before the verb; one present tense',
        paras: [
          'Reflexive verbs carry a pronoun that matches the person: <em>je me lève, tu te lèves, il se lève, nous nous levons, vous vous levez, ils se lèvent</em>. In the past they take <em>être</em>: <em>je me suis perdu</em>.',
          '<em>Je travaille</em> = I work <em>and</em> I\'m working. Never <em>je suis travaille</em>. To stress right now: <em>je suis en train de travailler</em>.',
          'Small pronouns go before the verb, inside <em>ne… pas</em>: <em>je ne la vois pas souvent</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'pronoun',
          title: 'Me, te, se, nous or vous?',
          instructions: 'Type the reflexive pronoun. Before a vowel, it loses its e: <em>m\', t\', s\'</em>.',
          questions: [
            typed('Je ___ lève à sept heures.', 'me'),
            typed('Tu ___ réveilles à quelle heure ?', 'te'),
            typed('Il ___ promène au bord du lac.', 'se'),
            typed('Nous ___ parlons tous les jours.', 'nous'),
            typed('Vous ___ appelez comment ?', 'vous'),
            typed('On ___ entend très bien.', "s'", { acceptable: ["s’"], hint: 'Before a vowel.' }),
            typed('Je ___ suis perdu.', 'me'),
          ],
        },
        {
          slug: 'working',
          title: 'Which one?',
          instructions: 'Pick the natural French.',
          questions: [
            choice("I'm working tonight.", ['Je travaille ce soir.', 'Je suis travaille ce soir.']),
            choice("I can't talk, I'm in the middle of working.", ['Je suis en train de travailler.', 'Je suis travailler.']),
            choice("I'm happy.", ['Je suis heureux.', 'Je heureux.']),
            choice("I don't see her often.", ['Je ne la vois pas souvent.', 'Je ne vois pas la souvent.']),
            choice('I walk the dog.', ['Je promène le chien.', 'Je me promène le chien.']),
            choice('We get on well.', ["On s'entend bien.", 'On entend bien.']),
          ],
        },
        {
          slug: 'corrections',
          title: 'Fix it',
          instructions: 'The corrections from the written exercise. Type the sentence as it should be.',
          questions: [
            typed('Je vais aller prendre des photo. (I\'m going to take photos.)', 'Je vais prendre des photos.',
              { hint: 'Aller + infinitive already says “going to”. And photos takes an s.' }),
            typed("Je suis perdu hier. (I got lost yesterday.)", 'Je me suis perdu hier.',
              { acceptable: ['Hier, je me suis perdu.', 'Je me suis perdue hier.'], hint: 'Se perdre is reflexive.' }),
            typed('La cours de français est à midi. (The French lesson is at twelve.)', 'Le cours de français est à midi.',
              { hint: 'Cours is masculine.' }),
            typed('Ça ne marche pas. Je retenter. (It doesn\'t work. I\'ll try again.)', 'Ça ne marche pas. Je retente.',
              { hint: 'Retenter is the infinitive; after je, conjugate it.' }),
            typed('Comment je vais à l\'hôtel du lac ? Use est-ce que.', "Comment est-ce que je vais à l'hôtel du lac ?",
              { hint: 'Est-ce que works after question words too, not only for yes/no questions.' }),
          ],
        },
        {
          slug: 'family',
          title: 'Talk about your family',
          instructions: 'Say it out loud, then type it.',
          questions: [
            typed('My parents are divorced.', 'Mes parents sont divorcés.'),
            typed("I've got a half-brother.", "J'ai un demi-frère."),
            typed('We get on really well.', "On s'entend très bien.", { acceptable: ['Nous nous entendons très bien.'] }),
            typed("I've never met him.", "Je ne l'ai jamais rencontré."),
            typed("We're close.", 'On est proches.', { acceptable: ['Nous sommes proches.'] }),
          ],
        },
      ],
    },
  ],
};
