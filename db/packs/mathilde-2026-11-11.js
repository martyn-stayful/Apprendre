// Lesson with Mathilde, 11 November 2026.
//
// Spoken French drops the ne (je sais pas, chais pas, chui); je suis en train
// de + infinitive for "right now"; reflexive verbs (se laver, se lever, se
// réveiller, s'entendre, se promener) and what the pronoun does to the meaning;
// family and relationships (demi-frère, divorcé, célibataire, en couple,
// proches); and a review of the written exercise on the past tense, reflexives
// and question forms. Frequency adverbs (souvent, toujours…) and another go at
// reflexives are next week.
//
// Slugs and the pack key are permanent — progress is stored against them.

import { mc, typed, choice, drills, lines, forms } from './helpers.js';

export default {
  key: 'mathilde-2026-11-11',
  title: 'Lesson of 11 November',
  summary:
    'Spoken French without the ne (chais pas, chui), je suis en train de, reflexive verbs ' +
    '(se laver, se lever, s\'entendre, se promener), and talking about your family: demi-frère, ' +
    'divorcé, célibataire, en couple.',

  // ----------------------------------------------------------- Daily 10 --
  drills: [
    ...drills('slang', 'A2.1', [
      ["Say it formally: I don't know.", 'Je ne sais pas.', 'The written, careful version.'],
      ["Say it the way people really talk: I don't know.", 'Je sais pas.', 'In speech the ne disappears.'],
      ["Say it very fast, like a local: I don't know.", 'Chais pas.', 'Je sais pas, squashed: chépa. You will hear it a lot, maybe from guests.'],
      ["Say it fast: I am… (I'm tired)", "Chui fatigué.", "Je suis becomes chui in fast speech. Fatiguée for Lois."],
      ['Say it the spoken way: I never met him.', "Je l'ai jamais rencontré.", 'Written French would be je ne l\'ai jamais rencontré.'],
      ["Say it the spoken way: I don't see her often.", 'Je la vois pas souvent.', 'Written: je ne la vois pas souvent. La goes straight before the verb.'],
      ["Say it the spoken way: I don't work on Sundays.", 'Je bosse pas le dimanche.'],
      ["Say it the spoken way: I don't understand.", 'Je comprends pas.'],
    ]),

    ...drills('chat', 'A2.1', [
      ["Say: I'm in the middle of working. (right now)", 'Je suis en train de travailler.', 'Je suis en train de + infinitive stresses what is happening right now.'],
      ["Say: I can't talk right now, I'm in the middle of something.", 'Je peux pas parler, je suis en train de faire un truc.', 'Spoken: je peux pas. Courant: je ne peux pas.'],
      ["Say: I'm happy.", 'Je suis heureux.', 'Heureuse for Lois. Être for a state: no en train de.'],
      ["Say: I'm on my way.", 'Je suis en route.', 'A state, not an action to stress.'],
      ['Say: I work (every day).', 'Je travaille tous les jours.', 'French uses the plain present for I work and I am working.'],
      ["Say: My parents are divorced.", 'Mes parents sont divorcés.', 'Divorcé (m), divorcée (f), divorcés (plural).'],
      ["Say: They both have new partners, but they aren't married.", "Ils ont tous les deux un nouveau partenaire, mais ils ne sont pas mariés.", 'Un partenaire / une partenaire.'],
      ["Say: I have a half-brother.", "J'ai un demi-frère.", 'Une demi-sœur = half-sister.'],
      ["Say: I'm single.", 'Je suis célibataire.', 'The same for a man or a woman.'],
      ["Say: We're a couple. / We're together.", 'On est en couple.', 'En couple = in a relationship.'],
      ['Say: I have a brother and a sister.', "J'ai un frère et une sœur."],
      ['Say: I have brothers and sisters.', "J'ai des frères et sœurs.", "There's no single word for siblings."],
      ["Say: My brother lives in Melbourne.", 'Mon frère habite à Melbourne.'],
      ["Say: We talk a lot on the phone.", 'On se parle beaucoup au téléphone.', 'On se parle = we talk to each other (reflexive, "each other").'],
      ["Say: We get on really well.", 'On s\'entend très bien.', 'S\'entendre bien = to get along.'],
      ["Say: I get on well with her.", "Je m'entends bien avec elle."],
      ["Say: I don't see him often.", 'Je ne le vois pas souvent.', 'Le / la / les go directly before the verb.'],
      ['Say: My relatives. / My close family.', 'Mes proches.', 'Les proches = close relatives, the people closest to you.'],
      ["Ask: What's your relationship status?", "Quelle est votre situation ?", 'Forms: célibataire, en couple, marié(e), divorcé(e).'],
    ]),

    ...drills('time', 'A2.1', [
      ['Say: I wake up at seven.', 'Je me réveille à sept heures.', 'Se réveiller = to wake up.'],
      ['Say: I get up at half past seven.', 'Je me lève à sept heures et demie.', 'Se lever = to get up.'],
      ['Say: I wash. / I have a wash.', 'Je me lave.', 'Se laver = to wash yourself.'],
      ['Say: What time do you get up? (tu)', 'Tu te lèves à quelle heure ?'],
      ['Say: He goes for a walk.', 'Il se promène.', 'Se promener = to go for a walk (you walk yourself).'],
      ['Say: I walk the dog.', 'Je promène le chien.', 'No se: the dog is the object.'],
      ['Say: We wake up late on Sundays.', 'On se réveille tard le dimanche.'],
      ['Say: They wake up early.', 'Ils se réveillent tôt.', 'Or: they wake each other up.'],
      ['Ask: What time are you available? (tu)', 'À quelle heure est-ce que tu es disponible ?', 'Or: tu es disponible à quelle heure ?'],
    ]),

    ...drills('ask', 'A2.1', [
      ['Ask: Where can I find the timetable?', 'Où est-ce que je peux trouver les horaires ?', 'Est-ce que follows a question word too, not only yes/no questions.'],
      ['Ask: How can I get there?', 'Comment est-ce que je peux y aller ?', 'Or simply: comment je peux y aller ?'],
      ["Say: I'm trying again.", 'Je retente.', 'Retenter = to try again. With je, no -r.'],
      ["Say: I want to try again.", 'Je veux retenter.', 'After je veux: the infinitive, with the -r.'],
      ['Say: I took some photos.', "J'ai pris des photos.", 'Photos takes an s. Prendre des photos is better than faire des photos.'],
    ]),
  ],

  // --------------------------------------------------------- role-plays --
  roleplays: [
    {
      title: 'Ta famille',
      ctx: "Mathilde asks about your family. Tell her about your parents and your brother.",
      lines: lines([
        ['them', 'Et ta famille ? Tes parents, ils vivent ensemble ?', 'And your family? Do your parents live together?'],
        ['you', 'Non, mes parents sont divorcés.', 'No, my parents are divorced.'],
        ['them', 'Ils se sont remariés ?', 'Did they get remarried?'],
        ['you', 'Non, ils ne sont pas mariés, mais ils ont tous les deux un nouveau partenaire.', "No, they're not married, but they both have a new partner."],
        ['them', 'Tu as des frères et sœurs ?', 'Do you have brothers and sisters?'],
        ['you', "J'ai un frère, et un demi-frère. Mon frère habite à Melbourne.", 'I have a brother, and a half-brother. My brother lives in Melbourne.'],
        ['them', 'Tu le vois souvent ?', 'Do you see him often?'],
        ['you', 'Je ne le vois pas souvent, mais on se parle beaucoup au téléphone.', "I don't see him often, but we talk a lot on the phone."],
        ['them', 'Vous vous entendez bien ?', 'Do you get on well?'],
        ['you', "Oui, on s'entend très bien. On est proches.", "Yes, we get on really well. We're close."],
        ['them', 'Et ton demi-frère ?', 'And your half-brother?'],
        ['you', "Je l'ai jamais rencontré, malheureusement.", "I've never met him, unfortunately."],
      ]),
      notes: "<strong>Demi-frère</strong> = half-brother. <em>On s'entend bien</em> = we get on well (<em>s'entendre</em>). <em>On se parle</em> = we talk to each other. In speech the <em>ne</em> goes: <em>je l'ai jamais rencontré</em>; in writing, <em>je ne l'ai jamais rencontré</em>. <em>Proches</em> = close (people).",
    },
    {
      title: 'Je suis en train de…',
      ctx: "A friend rings while you're busy. Say that you're in the middle of something.",
      lines: lines([
        ['them', 'Allô ? Tu fais quoi ?', "Hello? What are you doing?"],
        ['you', 'Là, je suis en train de bosser. Je peux pas parler.', "Right now I'm in the middle of working. I can't talk."],
        ['them', 'Ah, tu es toujours en train de faire quelque chose !', "Ah, you're always in the middle of something!"],
        ['you', "Chais pas, c'est comme ça ! Je te rappelle ce soir ?", "Dunno, that's how it is! Shall I call you back tonight?"],
        ['them', "D'accord. Tu es disponible à quelle heure ?", 'OK. What time are you available?'],
        ['you', 'À sept heures, ça marche. Chui libre après le travail.', "Seven o'clock works. I'm free after work."],
        ['them', 'Parfait. À ce soir !', 'Perfect. See you tonight!'],
      ]),
      notes: "<strong>Je suis en train de</strong> + infinitive is for stressing <em>right now</em> — French uses the plain present most of the time. <em>Je suis</em> alone is for states: <em>je suis heureux, je suis libre</em>. Spoken: <em>je peux pas</em>, <em>chais pas</em>, <em>chui</em>.",
    },
    {
      title: 'Ma routine du matin',
      ctx: 'Mathilde asks about your morning. Use the reflexive verbs.',
      lines: lines([
        ['them', 'Tu te réveilles à quelle heure ?', 'What time do you wake up?'],
        ['you', 'Je me réveille à sept heures, mais je me lève à sept heures et demie.', 'I wake up at seven, but I get up at half past seven.'],
        ['them', 'Et après ?', 'And then?'],
        ['you', 'Je me lave, et je promène le chien.', 'I have a wash, and I walk the dog.'],
        ['them', 'Et ta partenaire ?', 'And your partner?'],
        ['you', 'Elle se lève après moi. Le dimanche, on se réveille tard.', 'She gets up after me. On Sundays we wake up late.'],
        ['them', 'Vous vous promenez ensemble ?', 'Do you go for a walk together?'],
        ['you', 'Oui, avec le chien.', 'Yes, with the dog.'],
      ]),
      notes: "<em>Je promène le chien</em> (I walk the dog — the dog is the object) but <em>je me promène</em> (I go for a walk — I walk myself). The reflexive pronoun goes straight before the verb: <em>me, te, se, nous, vous, se</em>.",
    },
  ],

  // -------------------------------------------------------------- decks --
  decks: [
    {
      slug: 'nov11_family',
      name: 'Family & relationships',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'un demi-frère', en: 'a half-brother', ex: "J'ai un demi-frère." },
        { fr: 'une demi-sœur', en: 'a half-sister', ex: "J'ai une demi-sœur en Australie." },
        { fr: 'divorcé, divorcée', en: 'divorced', ex: 'Mes parents sont divorcés.' },
        { fr: 'célibataire', en: 'single', ex: 'Je suis célibataire.' },
        { fr: 'en couple', en: 'in a relationship, together', ex: 'On est en couple depuis deux ans.' },
        { fr: 'marié, mariée', en: 'married', ex: 'Ils ne sont pas mariés.' },
        { fr: 'un partenaire, une partenaire', en: 'a partner', ex: 'Ils ont tous les deux un nouveau partenaire.' },
        { fr: 'les proches', en: 'close relatives, your nearest and dearest', ex: 'Mes proches habitent en Angleterre.' },
        { fr: 'des frères et sœurs', en: 'siblings (no single word)', ex: "J'ai des frères et sœurs." },
        { fr: 'Quelle est votre situation ?', en: 'What is your (relationship) status?', ex: 'Marié, célibataire, en couple… ?' },
        { fr: 'retrouver', en: 'to meet up with, to find again', ex: 'On se retrouve à sept heures.' },
        { fr: 'rencontrer', en: 'to meet (for the first time)', ex: "Je l'ai jamais rencontré." },
        { fr: 'On est proches.', en: "We're close.", ex: 'Mon frère et moi, on est proches.' },
        { fr: "On s'entend bien.", en: 'We get on well.', ex: "On s'entend très bien." },
        { fr: 'On se parle beaucoup.', en: 'We talk to each other a lot.', ex: 'On se parle beaucoup au téléphone.' },
      ],
    },
    {
      slug: 'nov11_reflexive',
      name: 'Reflexive verbs',
      category: 'Verbs',
      level: 'A2.1',
      cards: [
        { fr: 'se lever', en: 'to get up', ex: 'Je me lève à sept heures et demie.' },
        { fr: 'se laver', en: 'to wash (yourself)', ex: 'Je me lave le matin.' },
        { fr: 'se réveiller', en: 'to wake up', ex: 'Je me réveille à sept heures.' },
        { fr: "s'entendre (bien)", en: 'to get along (well)', ex: "Je m'entends bien avec elle." },
        { fr: 'se promener', en: 'to go for a walk', ex: 'Il se promène avec le chien.' },
        { fr: 'promener le chien', en: 'to walk the dog', ex: 'Je promène le chien.' },
        { fr: 'laver', en: 'to wash (something or someone else)', ex: 'Je lave Zoé.' },
        { fr: 'entendre', en: 'to hear', ex: "Je t'entends mal." },
        { fr: 'me, te, se, nous, vous, se', en: 'the reflexive pronouns, before the verb', ex: 'Nous nous levons tôt.' },
        { fr: 'ils se réveillent', en: 'they wake up — or they wake each other up', ex: 'Ils se réveillent à sept heures.' },
      ],
    },
    {
      slug: 'nov11_spoken',
      name: 'Spoken French',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'Je ne sais pas.', en: "I don't know. (careful, written)", ex: 'Je ne sais pas où il est.' },
        { fr: 'Je sais pas.', en: "I don't know. (spoken: no ne)", ex: 'Je sais pas, demande à Mathilde.' },
        { fr: 'Chais pas.', en: "Dunno. (je sais pas, very fast)", ex: 'Chais pas, peut-être demain.' },
        { fr: 'Chui…', en: "I'm… (je suis, very fast)", ex: 'Chui en retard.' },
        { fr: 'je suis en train de + infinitif', en: "I'm in the middle of …ing", ex: 'Je suis en train de travailler.' },
        { fr: 'Je peux pas parler.', en: "I can't talk. (spoken)", ex: "Je peux pas parler, je suis en train de bosser." },
        { fr: "J'ai jamais…", en: "I've never… (spoken: no ne)", ex: "J'ai jamais vu ça." },
        { fr: 'pas souvent', en: 'not often', ex: 'Je le vois pas souvent.' },
        { fr: 'disponible', en: 'available', ex: 'Tu es disponible demain ?' },
        { fr: 'retenter', en: 'to try again', ex: 'Je retente demain.' },
      ],
    },
  ],

  // ------------------------------------------------------------ quizzes --
  quizzes: [
    {
      slug: 'nov11_spoken_quiz',
      title: 'Spoken French and en train de',
      level: 'A2.1',
      questions: [
        mc("In fast spoken French, « Je ne sais pas » becomes…", "I don't know", ['Chais pas.', 'Je sais ne pas.', 'Je ne chais.', 'Sais pas je.'],
          'The ne drops out, then je sais → chais.'),
        mc("In casual speech, « Je suis » is often squashed into…", "I am", ['chui', 'jesu', 'sui', 'jé'],
          'Chui fatigué.'),
        mc('Which is the written form?', 'Pick the careful version.', ["Je ne l'ai jamais rencontré.", "Je l'ai jamais rencontré.", "J'ai jamais rencontré lui.", "Je n'ai rencontré jamais."],
          'In speech: je l\'ai jamais rencontré.'),
        mc('« I am in the middle of working » is…', 'Pick the French.', ['Je suis en train de travailler.', 'Je suis travailler.', 'Je suis travaillant.', 'Je suis au train travailler.'],
          'En train de + infinitive.'),
        mc("« I work » and « I am working » are both usually…", 'Pick the French.', ['Je travaille.', 'Je suis travail.', 'Je suis travaille.', 'Je suis en travail.'],
          'French uses the plain present for both.'),
        mc('« I am happy » is…', 'Pick the French.', ['Je suis heureux.', 'Je suis en train de heureux.', 'Je suis être heureux.', "J'ai heureux."],
          'Être for a state or a description — no en train de.'),
        mc("I can't talk right now, I'm busy. (spoken)", 'Pick the French.', ['Je peux pas parler, je suis en train de bosser.', 'Je peux pas parler, je suis bosser.', 'Je ne parler, je bosse train.', 'Je suis pas parler.'],
          'Peux pas = ne peux pas.'),
        mc("Where does the pronoun go? « I don't see her often »", 'Pick the French.', ['Je ne la vois pas souvent.', 'Je ne vois la pas souvent.', 'Je ne vois pas la souvent.', 'Je la ne vois pas souvent.'],
          'La, le, les go directly before the verb.'),
      ],
    },
    {
      slug: 'nov11_reflexive_quiz',
      title: 'Reflexive verbs and family',
      level: 'A2.1',
      questions: [
        mc('I wash myself →', 'Je … lave.', ['me', 'se', 'te', 'nous'], 'Je me lave.'),
        mc('He gets up →', 'Il … lève.', ['se', 'me', 'te', 'le'], 'Il se lève.'),
        mc('We wake up →', 'Nous … réveillons.', ['nous', 'se', 'me', 'vous'], 'Nous nous réveillons.'),
        mc('You (vous) get on well →', 'Vous … entendez bien.', ['vous', 'te', 'se', 'nous'], 'Vous vous entendez bien.'),
        mc('« Entendre » means…', 'Pick the meaning.', ['to hear', 'to get along', 'to wash', 'to walk'],
          "S'entendre is the reflexive: to get along."),
        mc("« S'entendre » means…", 'Pick the meaning.', ['to get along', 'to hear', 'to listen', 'to meet'],
          "Je m'entends bien avec elle."),
        mc("« Je promène le chien » vs « je me promène »", 'Pick the right pair.', ['I walk the dog / I go for a walk', 'I go for a walk / I walk the dog', 'I walk myself / I walk the dog', 'I run the dog / I run'],
          "The dog is the object; in the reflexive, you walk yourself."),
        mc('« Ils se réveillent » can mean…', 'Pick the best answer.', ['they wake up, or they wake each other up', 'only: they wake each other up', 'only: they wake up', 'they were woken up'],
          'The plural reflexive can mean each other.'),
        mc('« Half-brother »', 'Pick the French.', ['demi-frère', 'beau-frère', 'frère à moitié', 'petit frère'],
          'Une demi-sœur = half-sister.'),
        mc('« Single » (relationship)', 'Pick the French.', ['célibataire', 'divorcé', 'en couple', 'seul'],
          'The same for men and women.'),
        mc('« Siblings » in French is…', 'Pick the best answer.', ['des frères et sœurs', 'des siblings', 'des frères-sœurs', 'des enfants'],
          'There is no single word.'),
      ],
    },
  ],

  // -------------------------------------------------------------- verbs --
  verbs: [
    { infinitive: 'se laver', meaning: 'to wash (yourself)', level: 'A2.1',
      forms: forms('me lave', 'te laves', 'se lave', 'nous lavons', 'vous lavez', 'se lavent') },
    { infinitive: 'se lever', meaning: 'to get up', level: 'A2.1',
      forms: forms('me lève', 'te lèves', 'se lève', 'nous levons', 'vous levez', 'se lèvent') },
    { infinitive: 'se réveiller', meaning: 'to wake up', level: 'A2.1',
      forms: forms('me réveille', 'te réveilles', 'se réveille', 'nous réveillons', 'vous réveillez', 'se réveillent') },
    { infinitive: "s'entendre", meaning: 'to get along', level: 'A2.1',
      forms: forms("m'entends", "t'entends", "s'entend", 'nous entendons', 'vous entendez', "s'entendent") },
    { infinitive: 'se promener', meaning: 'to go for a walk', level: 'A2.1',
      forms: forms('me promène', 'te promènes', 'se promène', 'nous promenons', 'vous promenez', 'se promènent') },
    { infinitive: 'retenter', meaning: 'to try again', level: 'A2.1',
      forms: forms('retente', 'retentes', 'retente', 'retentons', 'retentez', 'retentent') },
  ],

  // ----------------------------------------------------------- concepts --
  concepts: [
    {
      slug: 'nov11-spoken-negation',
      title: 'Where the « ne » goes',
      subtitle: 'je ne sais pas · je sais pas · chais pas',
      category: 'A2.1',
      paragraphs: [
        "Written French negates with two pieces: <strong>ne … pas</strong>. In speech, the <strong>ne</strong> drops out almost all the time: <em>je ne sais pas</em> becomes <em>je sais pas</em>.",
        "In fast speech it goes further. <em>Je sais</em> squashes to <strong>chais</strong>, so you hear <em>chais pas</em> (written as <em>chépa</em>). <em>Je suis</em> becomes <strong>chui</strong>. You'll hear both from guests and clients; you don't have to say them.",
        "Same with <em>jamais</em>: written <em>je ne l'ai jamais rencontré</em>, spoken <em>je l'ai jamais rencontré</em>. Use the full form in writing and with guests; recognise the short form in speech.",
        "Little pronouns stay put, whatever you do with the ne: <em>je ne la vois pas souvent</em> / <em>je la vois pas souvent</em>. <em>La, le, les</em> go directly before the verb, which is not where English puts them.",
      ],
      table_rows: [
        { en: "I don't know", fr: 'je ne sais pas → je sais pas → chais pas' },
        { en: 'I am (fast)', fr: 'je suis → chui' },
        { en: "I've never met him", fr: "je ne l'ai jamais rencontré → je l'ai jamais rencontré" },
        { en: "I don't see her often", fr: 'je ne la vois pas souvent → je la vois pas souvent' },
        { en: "I can't talk", fr: 'je ne peux pas parler → je peux pas parler' },
      ],
      examples: [
        { fr: 'Chais pas, demande à Mathilde.', en: 'Dunno, ask Mathilde.' },
        { fr: 'Je la vois pas souvent.', en: "I don't see her often." },
        { fr: 'Chui fatigué.', en: "I'm tired." },
      ],
      pitfall: {
        title: 'Writing it as you hear it',
        body: "Spoken <em>chais pas</em> and <em>chui</em> are for listening and chatting. In an email to a guest, or in a lesson exercise, write <em>je ne sais pas, je suis</em>.",
      },
    },
    {
      slug: 'nov11-en-train-de',
      title: 'Je suis en train de…',
      subtitle: "right now, in the middle of it",
      category: 'A2.1',
      paragraphs: [
        "English has two presents: <em>I work</em> and <em>I am working</em>. French mostly has one: <strong>je travaille</strong> covers both. You never say <em>je suis travail</em>.",
        "To stress that something is happening <em>right now</em>, use <strong>je suis en train de + infinitive</strong>: <em>Je suis en train de travailler</em> = I'm in the middle of working. It's less common than the English -ing form, but a great phrase for <em>I can't talk right now</em>.",
        "<strong>Être</strong> on its own is for a state or a description — an adjective, a noun, a place: <em>je suis heureux, je suis en route</em>. It isn't a helper verb for actions the way <em>am</em> is in English.",
      ],
      table_rows: [
        { en: 'I work / I am working', fr: 'je travaille' },
        { en: "I'm in the middle of working", fr: 'je suis en train de travailler' },
        { en: "I'm happy", fr: 'je suis heureux' },
        { en: "I'm on my way", fr: 'je suis en route' },
      ],
      examples: [
        { fr: 'Je peux pas parler, je suis en train de bosser.', en: "I can't talk, I'm in the middle of working." },
        { fr: 'Tu es toujours en train de faire quelque chose !', en: "You're always in the middle of something!" },
      ],
      pitfall: {
        title: '« Je suis travailler »',
        body: "There is no <em>-ing</em> form in French. Plain present: <em>je travaille</em>. To stress it: <em>je suis en train de travailler</em>.",
      },
    },
    {
      slug: 'nov11-reflexive',
      title: 'Reflexive verbs',
      subtitle: 'je me lave · tu te lèves · il se réveille',
      category: 'A2.1',
      paragraphs: [
        "A verb is <strong>reflexive</strong> when the subject and the object are the same person — you do the action to yourself, like looking in a mirror. <em>Je lave Zoé</em> (I wash Zoé) but <em>je me lave</em> (I wash myself).",
        "The little pronoun goes <strong>directly before the verb</strong>: <em>je <strong>me</strong> lave, tu <strong>te</strong> laves, il <strong>se</strong> lave, nous <strong>nous</strong> lavons, vous <strong>vous</strong> lavez, ils <strong>se</strong> lavent</em>. It's the same idea as <em>je m'appelle</em>.",
        "Many daily-routine verbs are reflexive: <strong>se lever, se laver, se réveiller</strong>. Learn them as chunks, with the <em>se</em>.",
        "Making a verb reflexive can change its meaning: <em>entendre</em> = to hear, <strong>s'entendre</strong> = to get along. <em>Promener le chien</em> = to walk the dog, <strong>se promener</strong> = to go for a walk (you walk yourself).",
        "Not every verb works: you don't <em>run</em> yourself or <em>eat</em> yourself. Ask where the action is going: back to the subject, or to something else?",
        "In the plural, <em>nous / vous / ils</em> can mean <strong>each other</strong>: <em>ils se réveillent</em> = they wake up, or they wake each other up. <em>On se parle</em> = we talk to each other.",
      ],
      table_rows: [
        { en: 'to get up', fr: 'se lever → je me lève' },
        { en: 'to wash', fr: 'se laver → je me lave' },
        { en: 'to wake up', fr: 'se réveiller → je me réveille' },
        { en: 'to get along', fr: "s'entendre → je m'entends bien" },
        { en: 'to hear · to get along', fr: 'entendre · s\'entendre' },
        { en: 'to walk the dog · to go for a walk', fr: 'promener le chien · se promener' },
      ],
      examples: [
        { fr: 'Je me lève à sept heures et demie.', en: 'I get up at half past seven.' },
        { fr: "Je m'entends bien avec elle.", en: 'I get on well with her.' },
        { fr: 'Ils se réveillent à sept heures.', en: 'They wake up at seven (or: they wake each other up).' },
      ],
      pitfall: {
        title: '« Je lave moi » and « je entends bien avec elle »',
        body: "The pronoun comes <em>before</em> the verb: <em>je me lave</em>. And with <em>entendre</em> the reflexive changes the meaning — to get along, <em>je m'entends bien</em>, not <em>j'entends bien</em> (I hear well).",
      },
    },
    {
      slug: 'nov11-family',
      title: 'Talking about your family',
      subtitle: 'demi-frère · divorcé · célibataire · en couple · proches',
      category: 'A2.1',
      paragraphs: [
        "A <strong>half-brother</strong> is un <strong>demi-frère</strong>, a half-sister une <strong>demi-sœur</strong>.",
        "For relationship status — the box you tick on a form — <strong>célibataire</strong> is single (same for a man and a woman), <strong>en couple</strong> is in a relationship, <strong>marié(e)</strong> is married and <strong>divorcé(e)</strong> is divorced: <em>mes parents sont divorcés</em>.",
        "French has no single word for <em>siblings</em>: say <strong>des frères et sœurs</strong>. <strong>Les proches</strong> are your close relatives — the people nearest to you.",
        "<strong>Retrouver</strong> is to meet up with someone you already know (<em>on se retrouve à sept heures</em>); <strong>rencontrer</strong> is to meet someone for the first time.",
      ],
      table_rows: [
        { en: 'half-brother · half-sister', fr: 'un demi-frère · une demi-sœur' },
        { en: 'single · in a relationship', fr: 'célibataire · en couple' },
        { en: 'married · divorced', fr: 'marié(e) · divorcé(e)' },
        { en: 'siblings', fr: 'des frères et sœurs' },
        { en: 'close relatives', fr: 'les proches' },
        { en: 'to meet up · to meet (first time)', fr: 'retrouver · rencontrer' },
      ],
      examples: [
        { fr: 'Mes parents sont divorcés.', en: 'My parents are divorced.' },
        { fr: "J'ai un demi-frère que j'ai jamais rencontré.", en: "I have a half-brother I've never met." },
      ],
      pitfall: {
        title: '« Siblings »',
        body: "Don't look for an equivalent — just say <em>frères et sœurs</em>.",
      },
    },
  ],

  // ------------------------------------------------------ grammar notes --
  grammar_notes: [
    {
      title: '11 November, tidied up',
      body: `<p>The lesson of 11 November, spelt and translated. Tap any French to hear it.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>je ne sais pas · je sais pas · chais pas</em></td><td>I don't know — written, spoken, fast</td></tr>
        <tr><td class="fr"><em>je suis · chui</em></td><td>I am — careful, fast</td></tr>
        <tr><td class="fr"><em>je suis en train de travailler</em></td><td>I'm in the middle of working</td></tr>
        <tr><td class="fr"><em>je suis heureux</em></td><td>I'm happy (a state: être alone)</td></tr>
        <tr><td class="fr"><em>je me lève · je me lave · je me réveille</em></td><td>I get up · I wash · I wake up</td></tr>
        <tr><td class="fr"><em>me, te, se, nous, vous, se</em></td><td>the reflexive pronouns</td></tr>
        <tr><td class="fr"><em>entendre · s'entendre</em></td><td>to hear · to get along</td></tr>
        <tr><td class="fr"><em>promener le chien · se promener</em></td><td>to walk the dog · to go for a walk</td></tr>
        <tr><td class="fr"><em>ils se réveillent</em></td><td>they wake up · they wake each other up</td></tr>
        <tr><td class="fr"><em>un demi-frère · une demi-sœur</em></td><td>half-brother · half-sister</td></tr>
        <tr><td class="fr"><em>divorcé · célibataire · en couple</em></td><td>divorced · single · in a relationship</td></tr>
        <tr><td class="fr"><em>les proches</em></td><td>close relatives</td></tr>
        <tr><td class="fr"><em>des frères et sœurs</em></td><td>siblings</td></tr>
        <tr><td class="fr"><em>retrouver · rencontrer</em></td><td>to meet up · to meet for the first time</td></tr>
        <tr><td class="fr"><em>Je ne la vois pas souvent.</em></td><td>I don't see her often.</td></tr>
      </table>
      <p>Next week: frequency adverbs (<em>souvent, toujours, parfois…</em>) and another go at reflexive verbs before moving on to other tenses.</p>`,
    },
    {
      title: 'Corrections from 11 November',
      body: `<p>Slips from the written exercise.</p>
      <table class="gr-table">
        <tr><th>Not</th><th class="fr">But</th><th>Why</th></tr>
        <tr><td>Je retenter</td><td class="fr"><em>Je retente</em></td><td>with je, the conjugated form — no -r. The -r form is the infinitive: <em>retenter</em></td></tr>
        <tr><td>J'ai pris des photo</td><td class="fr"><em>J'ai pris des photos</em></td><td>plural: an s on photos</td></tr>
        <tr><td>Je suis allé faire des photos</td><td class="fr"><em>J'ai pris des photos</em></td><td>aller + prendre also works, but the plain <em>prendre des photos</em> is better</td></tr>
        <tr><td>Je ne vois la pas souvent</td><td class="fr"><em>Je ne la vois pas souvent</em></td><td>la goes directly before the verb</td></tr>
        <tr><td>J'entends bien avec elle</td><td class="fr"><em>Je m'entends bien avec elle</em></td><td>to get along is reflexive</td></tr>
        <tr><td>Je suis travailler</td><td class="fr"><em>Je travaille · je suis en train de travailler</em></td><td>no -ing form</td></tr>
        <tr><td>Comment je peux y aller ?</td><td class="fr"><em>Comment est-ce que je peux y aller ?</em></td><td>both work; est-ce que follows a question word too</td></tr>
      </table>
      <p>Asking about time: <em>À quelle heure est-ce que tu es disponible ?</em> and <em>Tu es disponible à quelle heure ?</em> are both fine.</p>`,
    },
  ],

  // ----------------------------------------------------------- workbook --
  workbook_chapters: [
    {
      slug: 'nov11-ch27',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 27,
      title: 'Spoken French and « en train de »',
      subtitle: 'dropping the ne · je suis en train de · être for a state',
      level: 'A2.1',
      rule: {
        heading: 'Spoken French drops the ne; en train de stresses right now',
        paras: [
          'Written: <em>je ne sais pas</em>. Spoken: <em>je sais pas</em>, fast <em>chais pas</em>. <em>Je suis</em> → <em>chui</em>.',
          '<em>Je travaille</em> covers I work and I am working. <em>Je suis en train de travailler</em> stresses right now.',
          '<em>Je suis</em> on its own is for states: <em>je suis heureux, je suis en route</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'dropping-ne',
          title: 'Written or spoken?',
          instructions: 'Is the sentence the written (careful) form or the spoken form?',
          questions: [
            choice('Je ne sais pas.', ['written', 'spoken']),
            choice('Chais pas.', ['spoken', 'written']),
            choice("Je l'ai jamais rencontré.", ['spoken', 'written']),
            choice('Je ne peux pas parler.', ['written', 'spoken']),
            choice('Chui fatigué.', ['spoken', 'written']),
          ],
        },
        {
          slug: 'en-train-de',
          title: 'Which present?',
          instructions: 'Pick the best French.',
          questions: [
            choice("I'm in the middle of working (right now).", ['Je suis en train de travailler.', 'Je suis travailler.']),
            choice('I work every day.', ['Je travaille tous les jours.', 'Je suis en train de travailler tous les jours.']),
            choice("I'm happy.", ['Je suis heureux.', 'Je suis en train de heureux.']),
            choice("I'm on my way.", ['Je suis en route.', 'Je suis en train de route.']),
            choice('She is eating (right now).', ['Elle est en train de manger.', 'Elle est mange.']),
          ],
        },
        {
          slug: 'say-it-written',
          title: 'Write it properly',
          instructions: 'Put the ne back in.',
          questions: [
            typed("Je sais pas. → Je ___ sais pas.", 'ne'),
            typed("Je la vois pas souvent. → Je ne ___ vois pas souvent.", 'la'),
            typed("Je l'ai jamais rencontré. → Je ___ l'ai jamais rencontré.", 'ne'),
            typed('Chui fatigué. → Je ___ fatigué.', 'suis'),
          ],
        },
        {
          slug: 'right-now',
          title: 'Right now',
          instructions: 'Say it in French.',
          questions: [
            typed("I'm in the middle of working.", 'Je suis en train de travailler.'),
            typed("I'm not working.", 'Je ne travaille pas.', { acceptable: ['je travaille pas'] }),
            typed("I'm happy.", 'Je suis heureux.', { acceptable: ['je suis heureuse'] }),
            typed("I don't see her often.", 'Je ne la vois pas souvent.', { acceptable: ['je la vois pas souvent'] }),
          ],
        },
      ],
    },
    {
      slug: 'nov11-ch28',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 28,
      title: 'Reflexive verbs and family',
      subtitle: 'me, te, se · s\'entendre · demi-frère, divorcé, célibataire',
      level: 'A2.1',
      rule: {
        heading: 'The reflexive pronoun goes directly before the verb',
        paras: [
          '<em>Je me lave</em>, <em>tu te laves</em>, <em>il se lave</em>, <em>nous nous lavons</em>, <em>vous vous lavez</em>, <em>ils se lavent</em>.',
          'Some verbs change meaning: <em>entendre</em> = to hear, <em>s\'entendre</em> = to get along; <em>promener le chien</em> vs <em>se promener</em>.',
          'In the plural, a reflexive can mean each other: <em>ils se réveillent</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'which-pronoun',
          title: 'Which pronoun?',
          instructions: 'Pick me, te, se, nous or vous.',
          questions: [
            choice('Je ___ lève à sept heures.', ['me', 'te', 'se']),
            choice('Tu ___ laves le matin.', ['te', 'me', 'se']),
            choice('Il ___ réveille tôt.', ['se', 'me', 'te']),
            choice('Nous ___ promenons avec le chien.', ['nous', 'se', 'vous']),
            choice('Vous ___ entendez bien ?', ['vous', 'nous', 'se']),
            choice('Elles ___ lèvent tard.', ['se', 'me', 'nous']),
          ],
        },
        {
          slug: 'reflexive-or-not',
          title: 'Reflexive or not?',
          instructions: 'Pick the right French.',
          questions: [
            choice('I walk the dog.', ['Je promène le chien.', 'Je me promène le chien.']),
            choice('I go for a walk.', ['Je me promène.', 'Je promène.']),
            choice('I wash Zoé.', ['Je lave Zoé.', 'Je me lave Zoé.']),
            choice('I get on well with her.', ["Je m'entends bien avec elle.", "J'entends bien avec elle."]),
            choice('I hear you badly.', ["Je t'entends mal.", "Je m'entends mal."]),
          ],
        },
        {
          slug: 'family-words',
          title: 'Family words',
          instructions: 'Type the French.',
          questions: [
            typed('half-brother', 'un demi-frère', { acceptable: ['demi-frère'] }),
            typed('single (relationship status)', 'célibataire'),
            typed('divorced (parents, plural)', 'divorcés'),
            typed('in a relationship', 'en couple'),
            typed('siblings (brothers and sisters)', 'des frères et sœurs', { acceptable: ['frères et sœurs'] }),
          ],
        },
        {
          slug: 'my-morning',
          title: 'My morning',
          instructions: 'Say it in French.',
          questions: [
            typed('I wake up at seven.', 'Je me réveille à sept heures.'),
            typed('I get up at half past seven.', 'Je me lève à sept heures et demie.'),
            typed('I have a wash.', 'Je me lave.'),
            typed('We get on really well.', "On s'entend très bien.", { acceptable: ["nous nous entendons très bien"] }),
            typed('We talk a lot on the phone.', 'On se parle beaucoup au téléphone.', {
              acceptable: ['nous nous parlons beaucoup au téléphone'] }),
          ],
        },
      ],
    },
  ],
};
