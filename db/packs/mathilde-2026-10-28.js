// Lessons with Mathilde, 28 October 2026.
//
// Two lessons on the same afternoon. The first started with tidying the attic
// and turned into French registers — courant, familier, vulgaire — with bosser,
// mon boulot, dégager and a joke for Boris at the pub; then the weekend at
// Avoriaz, and aller and faire as the verbs to reach for when you're stuck. The
// second was getting around: bus times, dates with du… au…, a bike-hire
// role-play, and what to say when the card machine at the pub won't work.
//
// Slugs and the pack key are permanent — progress is stored against them.

import { mc, typed, choice, drills, lines, forms } from './helpers.js';

export default {
  key: 'mathilde-2026-10-28',
  title: 'Lessons of 28 October',
  summary:
    'Registers and slang (bosser, mon boulot, dégager), talking about the weekend with aller and ' +
    'faire, jouer à and faire de, bus times and dates with du… au…, hiring a bike, and the card ' +
    'machine at the pub.',

  // ----------------------------------------------------------- Daily 10 --
  drills: [
    ...drills('slang', 'A2.1', [
      ["Say it casually: I'm working tonight.", 'Je bosse ce soir.', 'Bosser = travailler, familier. A regular -er verb: je bosse, tu bosses.'],
      ['Ask a friend: What time are you working?', 'Tu bosses à quelle heure ?'],
      ["Turn a friend down: Oh no, sorry, I'm working.", 'Ah non, désolé, je bosse.', 'Désolée for Lois.'],
      ['Say it casually: I work a lot, every day.', 'Je bosse beaucoup, tous les jours.'],
      ["Say it casually: I'm off to work.", 'Je vais au boulot.', 'Mon boulot = mon travail, familier.'],
      ['Say it casually: I love my job.', "J'adore mon boulot."],
      ["Say it to your teacher: I'm going to work.", 'Je vais au travail.', 'The courant version. Travail has one L; travailler has two.'],
      ['Joke with a friend: Get lost!', 'Dégage !', "Familier, not a swear word. Fine with friends, or a rude customer — never with your boss."],
      ['Say it casually: I got rid of all the old stuff in the attic.', "J'ai dégagé tous les vieux trucs du grenier.", 'Dégager = get rid of, clear out. Un truc = a thing, familier.'],
      ['Ask politely: Where are the toilets?', 'Où sont les toilettes ?', 'Courant. Les chiottes (the bog) is familier — keep it for friends.'],
      ['Tease Boris as he heads to the loo (familier!)', 'Boris, tu vas péter les chiottes ?', "Péter = to break (and to fart); les chiottes = the bog. Funny with a regular who likes a laugh, not with strangers."],
      ["Answer « Quoi de neuf ? »: Not much.", 'Pas grand-chose.'],
      ['Notice a friend\'s jacket: Is it new?', 'Elle est neuve, ta veste ?', 'Neuf, neuve = brand new. Quoi de neuf ? = what\'s new?'],
      ['Say it casually: It was so cool!', "C'était trop cool !", 'Trop = really, in casual speech.'],
      ["Say: It's chilled in Morzine.", "C'est tranquille à Morzine.", 'Tranquille = easy-going, chilled. Calme = quiet.'],
    ]),

    ...drills('chat', 'A2.1', [
      ['Say: We went to Avoriaz to play in the snow with the dog.', 'On est allés à Avoriaz pour jouer dans la neige avec le chien.', 'Aller takes être: on est allés.'],
      ['Say: I wanted to make a snowman.', 'Je voulais faire un bonhomme de neige.', 'Je voulais = I wanted. Faire is more natural than construire here.'],
      ['Say: I went to take photos.', 'Je suis allé faire des photos.', "Allée for Lois. Aller + an infinitive keeps the past simple."],
      ['Say: I took some photos.', "J'ai pris des photos.", 'Pris = past participle of prendre.'],
      ["Say: Tomorrow we're going to eat at the restaurant.", 'Demain, on va manger au restaurant.', 'Near future: aller + infinitive.'],
      ["Say: On Saturday we're going bowling.", 'Samedi, on va jouer au bowling.', 'Jouer à + a game: à + le = au.'],
      ['Say: I play football.', 'Je joue au foot.'],
      ['Say: We played pétanque.', 'On a joué à la pétanque.'],
      ['Say: They play cards.', 'Ils jouent aux cartes.', 'À + les = aux.'],
      ['Say: My sister does dance.', 'Ma sœur fait de la danse.', "Faire de when 'play' doesn't fit."],
      ['Say: I go skiing every week.', 'Je fais du ski toutes les semaines.', 'De + le = du.'],
      ['Say: So I work a lot.', 'Donc je travaille beaucoup.', 'Donc and alors both mean so.'],
      ['Ask a friend: Are you the one who decides?', "C'est toi qui décides ?", 'After c\'est toi qui, the verb takes the tu ending.'],
      ["Say: I don't know the verb, so I'll use faire.", 'Je ne connais pas le verbe, alors je dis « faire ».', 'When in doubt: aller or faire.'],
    ]),

    ...drills('story', 'A2.1', [
      ["Say: I tidied my mum's attic.", "J'ai rangé le grenier de ma mère.", 'Ranger = to tidy, to put away.'],
      ['Say: We found some old photo albums.', 'On a trouvé de vieux albums photo.', 'You will also hear des vieux albums in speech.'],
      ['Say: There were lots of toys — maybe vintage!', 'Il y avait beaucoup de jouets, peut-être vintage !', 'Il y avait = there were (the scene, imparfait).'],
      ['Say: There were cards too.', 'Il y avait des cartes aussi.'],
      ['Say: It was so cool, the dog loved the snow.', "C'était trop cool, le chien a adoré la neige."],
    ]),

    ...drills('time', 'A1.3', [
      ['Ask: What time does the bus come?', 'À quelle heure passe le bus ?', 'Buses passent — even when they stop.'],
      ['Ask: Where can I find the timetable?', 'Où est-ce que je peux trouver les horaires ?', 'Les horaires = the timetable. Heureux = happy.'],
      ['Say: The bus runs from 20 December to 6 April.', 'Le bus passe du vingt décembre au six avril.', 'Du = de + le, au = à + le. No “th” — just the number.'],
      ['Say: on 1 January', 'le premier janvier', 'Only the 1st takes an ordinal.'],
      ['Say: on 2 February', 'le deux février'],
      ['Say: from 1 to 15 March', 'du premier au quinze mars'],
      ['Say: from Monday to Friday', 'du lundi au vendredi'],
      ['Say: from 9am to 5pm', 'de neuf heures à dix-sept heures', 'No article, so plain de… à…'],
      ["Say: My birthday is on 14 July.", "Mon anniversaire, c'est le quatorze juillet."],
      ['Say: The office is on the third floor.', 'Le bureau est au troisième étage.', 'Floors do use ordinals: premier, deuxième, troisième.'],
    ]),

    ...drills('shop', 'A2.2', [
      ["Say: I'm looking for a bike shop.", 'Je cherche un magasin de vélos.', 'Chercher already means look for — no pour.'],
      ['Ask: How can I get there?', 'Comment je peux y aller ?', 'After je peux, the infinitive: aller, not va. Y = there.'],
      ["Say: I'd like to hire a bike to go into the mountains.", 'Je voudrais louer un vélo pour aller dans la montagne.', 'Pour + infinitive = in order to.'],
      ["The shop asks: What's your budget?", 'Quel est votre budget ?'],
      ['Say: My budget is a hundred euros.', "Mon budget, c'est cent euros."],
      ['Ask: Is it electric?', 'Il est électrique ?'],
      ['The shop says: You can have a blue bike, not electric.', 'Vous pouvez avoir un vélo bleu, pas électrique.'],
      ["Say: I'll take it.", 'Je le prends.', 'Le = it (le vélo).'],
      ['The shop asks: Do you need a helmet?', "Vous avez besoin d'un casque ?", 'Un casque = a helmet. Cassé = broken.'],
      ["The shop says: Here's your bike and your helmet.", 'Voilà votre vélo et votre casque.'],
      ["Say: Excuse me, it's a hundred euros, not a hundred and fifty.", "Excusez-moi, c'est cent euros, pas cent cinquante."],
      ['Tell a customer: Be careful!', 'Faites attention !', 'To a friend: fais attention !'],
    ]),

    ...drills('hotel', 'A2.2', [
      ['Tell a customer: Try again.', 'Réessayez.', 'One word, vous form for customers.'],
      ['Tell a customer: Try your card again, please.', "Réessayez votre carte, s'il vous plaît."],
      ["Say: It didn't work.", "Ça n'a pas marché.", "Just now. Ça ne marche pas = it doesn't work."],
      ["Say: The machine isn't working.", 'La machine ne marche pas.'],
      ["Reassure a customer: It's not you, it's the machine.", "Ce n'est pas vous, c'est la machine."],
      ["Say: There's a problem with the machine.", 'Il y a un problème avec la machine.'],
      ["Say: There's a problem with the card terminal.", 'Il y a un problème avec le TPE.', 'TPE = terminal de paiement électronique, the proper name for the card machine.'],
      ['Tell a customer: Try contactless.', 'Essayez en sans contact.'],
      ['Tell a customer: Enter your PIN, please.', "Tapez votre code, s'il vous plaît."],
      ['Ask: Can you pay in cash?', 'Vous pouvez payer en espèces ?'],
      ['Say: It worked!', 'Ça a marché !'],
    ]),
  ],

  // --------------------------------------------------------- role-plays --
  roleplays: [
    {
      title: 'Le TPE ne marche pas',
      ctx: "Friday night at the pub. A customer's card won't go through. You're behind the bar.",
      lines: lines([
        ['them', "Je peux payer par carte ?", 'Can I pay by card?'],
        ['you', 'Bien sûr. Voilà, insérez votre carte.', 'Of course. There you go, put your card in.'],
        ['them', 'Euh… Paiement refusé ? Ce n\'est pas normal.', "Er… Payment declined? That's not right."],
        ['you', "Ça n'a pas marché. Réessayez, s'il vous plaît.", "It didn't work. Try again, please."],
        ['them', 'Encore refusé ! Le problème, c\'est ma carte ?', 'Declined again! Is it my card?'],
        ['you', "Non, ce n'est pas vous, c'est la machine. Il y a un problème avec le TPE ce soir.", "No, it's not you, it's the machine. There's a problem with the card terminal tonight."],
        ['them', 'Ah, d\'accord. Je peux essayer en sans contact ?', 'Ah, OK. Can I try contactless?'],
        ['you', 'Oui, essayez en sans contact.', 'Yes, try contactless.'],
        ['them', 'Ça ne marche pas non plus.', "That doesn't work either."],
        ['you', 'Désolé. Vous pouvez payer en espèces ?', 'Sorry. Can you pay in cash?'],
        ['them', 'Oui, j\'ai vingt euros.', "Yes, I've got twenty euros."],
        ['you', 'Parfait, merci ! Et voilà votre monnaie.', 'Perfect, thanks! And here\'s your change.'],
      ]),
      notes: "<strong>Réessayez</strong> is one word, and <em>vous</em> with customers. <em>Ça n'a pas marché</em> = it didn't work (just now); <em>ça ne marche pas</em> = it doesn't work. The proper name for the machine is <strong>le TPE</strong>; day to day, <em>la machine</em>. Lois says <em>désolée</em>.",
    },
    {
      title: 'Louer un vélo',
      ctx: 'At the bike shop in Morzine. You want a bike for the mountains. Watch the price.',
      lines: lines([
        ['them', 'Bonjour ! Je peux vous aider ?', 'Hello! Can I help you?'],
        ['you', 'Bonjour. Je voudrais louer un vélo pour aller dans la montagne.', "Hello. I'd like to hire a bike to go into the mountains."],
        ['them', 'Très bien. Quel est votre budget ?', "Very good. What's your budget?"],
        ['you', "Mon budget, c'est cent euros. Il y a des vélos électriques ?", 'My budget is a hundred euros. Are there electric bikes?'],
        ['them', 'Électrique, c\'est cent cinquante. Pour cent euros, vous pouvez avoir un vélo bleu, pas électrique.', 'Electric is a hundred and fifty. For a hundred, you can have a blue bike, not electric.'],
        ['you', "D'accord, je le prends.", "OK, I'll take it."],
        ['them', "Vous avez besoin d'un casque ?", 'Do you need a helmet?'],
        ['you', "Oui, s'il vous plaît. Le mien est cassé !", 'Yes, please. Mine is broken!'],
        ['them', "Voilà votre vélo et votre casque. Vous payez par carte ou en espèces ?", "Here's your bike and your helmet. Are you paying by card or in cash?"],
        ['you', 'Par carte. Euh… excusez-moi, c\'est cent euros, pas cent cinquante.', "By card. Er… excuse me, it's a hundred euros, not a hundred and fifty."],
        ['them', 'Oh pardon, vous avez raison ! Voilà. Faites attention dans la montagne !', "Oh sorry, you're right! There you go. Be careful in the mountains!"],
        ['you', 'Merci, bonne journée !', 'Thanks, have a good day!'],
      ]),
      notes: "<strong>Un casque</strong> = a helmet; <em>cassé</em> = broken — they sound close. <em>Pour aller dans la montagne</em>: <em>pour</em> + infinitive = in order to. <em>Je le prends</em> = I'll take it. In the lesson the shop charged €150 by mistake — now you know how to say so.",
    },
    {
      title: "À l'arrêt de bus",
      ctx: "You're looking for the bus to Les Gets. Ask a local about times and dates.",
      lines: lines([
        ['you', "Excusez-moi, je cherche l'arrêt de bus pour Les Gets.", "Excuse me, I'm looking for the bus stop for Les Gets."],
        ['them', "C'est ici ! Mais il ne passe pas encore.", "It's here! But it isn't running yet."],
        ['you', 'Ah bon ? Il passe quand ?', 'Really? When does it run?'],
        ['them', 'Le bus passe du vingt décembre au six avril.', 'The bus runs from 20 December to 6 April.'],
        ['you', "Et aujourd'hui, comment je peux y aller ?", 'And today, how can I get there?'],
        ['them', 'En taxi, ou à vélo. Il y a un magasin de vélos en face.', "By taxi, or by bike. There's a bike shop opposite."],
        ['you', 'Merci. Et en hiver, à quelle heure passe le bus ?', 'Thanks. And in winter, what time does the bus come?'],
        ['them', 'Toutes les trente minutes, de huit heures à dix-neuf heures.', 'Every thirty minutes, from 8am to 7pm.'],
        ['you', 'Où est-ce que je peux trouver les horaires ?', 'Where can I find the timetable?'],
        ['them', "À l'office de tourisme, au premier étage.", 'At the tourist office, on the first floor.'],
      ]),
      notes: "Buses <strong>passent</strong>. Dates take plain numbers — <em>le vingt décembre, le six avril</em> — except <em>le premier</em>. <em>Du… au…</em> for a range of dates (de + le, à + le); <em>de… à…</em> for times. After <em>je peux</em>, the infinitive: <em>comment je peux y aller ?</em> <strong>Les horaires</strong> = the timetable.",
    },
    {
      title: 'Quoi de neuf, Boris ?',
      ctx: 'Boris, a French regular, is at the bar. Keep it familier — he likes a laugh.',
      lines: lines([
        ['them', 'Salut ! Quoi de neuf ?', "Hi! What's new?"],
        ['you', 'Pas grand-chose. Je bosse beaucoup, tous les jours !', 'Not much. I work a lot, every day!'],
        ['them', 'Ah, le boulot… Et ce week-end, tu bosses ?', 'Ah, work… And this weekend, are you working?'],
        ['you', 'Ah non, désolé, je bosse samedi. Mais dimanche, c\'est tranquille.', "Oh no, sorry, I'm working Saturday. But Sunday is chilled."],
        ['them', 'Elle est neuve, ta veste ?', 'Is your jacket new?'],
        ['you', "Oui, elle est neuve ! J'ai dégagé ma vieille veste.", "Yes, it's new! I got rid of my old jacket."],
        ['them', 'Bon, une autre bière, et après je vais aux toilettes.', 'Right, another beer, and then I\'m going to the loo.'],
        ['you', 'Boris, tu vas péter les chiottes ?', 'Boris, are you going to break the bog?'],
        ['them', 'Ha ha ! Dégage !', 'Ha ha! Get lost!'],
        ['you', "C'est toi qui décides !", "You're the boss!"],
      ]),
      notes: "Everything here is <strong>familier</strong>: <em>bosser, le boulot, dégager, les chiottes</em>. Fine with Boris and friends, not with a new customer or at the desk. The courant versions: <em>travailler, le travail, les toilettes</em>.",
    },
    {
      title: 'Le week-end à Avoriaz',
      ctx: 'Mathilde asks about your weekend. Use aller and faire whenever you get stuck.',
      lines: lines([
        ['them', "Salut ! Qu'est-ce que tu as fait ce week-end ?", 'Hi! What did you do this weekend?'],
        ['you', "Samedi, j'ai rangé le grenier de ma mère.", "On Saturday I tidied my mum's attic."],
        ['them', "Ah oui ? Et qu'est-ce que tu as trouvé ?", 'Oh yes? And what did you find?'],
        ['you', 'De vieux albums photo, des cartes, et beaucoup de jouets — peut-être vintage !', 'Old photo albums, cards, and lots of toys — maybe vintage!'],
        ['them', 'Génial ! Et dimanche ?', 'Great! And Sunday?'],
        ['you', 'On est allés à Avoriaz pour jouer dans la neige avec le chien. C\'était trop cool !', 'We went to Avoriaz to play in the snow with the dog. It was so cool!'],
        ['them', "Tu as fait un bonhomme de neige ?", 'Did you make a snowman?'],
        ['you', 'Je voulais faire un bonhomme de neige, mais je suis allé faire des photos.', 'I wanted to make a snowman, but I went to take photos.'],
        ['them', 'Et cette semaine ?', 'And this week?'],
        ['you', 'Demain, on va manger au restaurant, et samedi on va jouer au bowling.', "Tomorrow we're going to eat at the restaurant, and on Saturday we're going bowling."],
      ]),
      notes: "When you don't know the verb, reach for <strong>aller</strong> or <strong>faire</strong>: <em>je suis allé faire des photos, faire un bonhomme de neige</em>. <em>Je voulais</em> = I wanted. <em>Jouer à</em> + a game: <em>jouer au bowling</em>. Lois says <em>je suis allée</em>.",
    },
  ],

  // -------------------------------------------------------------- decks --
  decks: [
    {
      slug: 'oct28_registers',
      name: 'Registers & slang',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'le registre courant', en: 'everyday, neutral French', ex: "En cours, on parle le registre courant." },
        { fr: 'le registre familier', en: 'casual French, slang', ex: 'Bosser, c\'est familier.' },
        { fr: 'le registre vulgaire', en: 'crude French', ex: 'Les gros mots, c\'est vulgaire.' },
        { fr: 'le registre soutenu', en: 'formal French', ex: 'Veuillez patienter, c\'est soutenu.' },
        { fr: 'les gros mots', en: 'swear words', ex: 'Pas de gros mots au travail !' },
        { fr: 'bosser', en: 'to work (familier)', ex: 'Tu bosses à quelle heure ?' },
        { fr: 'mon boulot', en: 'my job (familier)', ex: "J'adore mon boulot." },
        { fr: 'le travail', en: 'work, the job (one L)', ex: 'Je vais au travail à huit heures.' },
        { fr: 'dégager', en: 'to clear out, get rid of (familier)', ex: "J'ai dégagé les vieux trucs du grenier." },
        { fr: 'Dégage !', en: 'Get lost! / Clear off! (familier)', ex: 'Ha ha, dégage !' },
        { fr: 'un truc', en: 'a thing, stuff (familier)', ex: "C'est quoi, ce truc ?" },
        { fr: 'les chiottes', en: 'the bog (familier)', ex: 'Boris, tu vas péter les chiottes ?' },
        { fr: 'péter', en: 'to break, to blow (familier — also to fart)', ex: "J'ai pété mon téléphone." },
        { fr: "C'était trop cool !", en: 'It was so cool!', ex: "Avoriaz ? C'était trop cool !" },
        { fr: 'tranquille', en: 'chilled, easy-going', ex: "C'est tranquille à Morzine." },
        { fr: 'neuf, neuve', en: 'brand new', ex: 'Elle est neuve, ta veste ?' },
        { fr: 'Pas grand-chose.', en: 'Not much.', ex: 'Quoi de neuf ? — Pas grand-chose.' },
      ],
    },
    {
      slug: 'oct28_getting_around',
      name: 'Buses, dates & bike hire',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'les horaires', en: 'the timetable, opening times', ex: 'Où est-ce que je peux trouver les horaires ?' },
        { fr: 'À quelle heure passe le bus ?', en: 'What time does the bus come?', ex: 'À quelle heure passe le bus pour Les Gets ?' },
        { fr: 'passer', en: 'to come by, to run (a bus)', ex: 'Le bus passe toutes les trente minutes.' },
        { fr: 'du vingt décembre au six avril', en: 'from 20 December to 6 April', ex: 'Le bus passe du vingt décembre au six avril.' },
        { fr: 'le premier janvier', en: '1 January', ex: 'On fait la fête le premier janvier.' },
        { fr: 'le troisième étage', en: 'the third floor', ex: 'Le bureau est au troisième étage.' },
        { fr: 'Je cherche…', en: "I'm looking for…", ex: 'Je cherche un magasin de vélos.' },
        { fr: 'Comment je peux y aller ?', en: 'How can I get there?', ex: 'Avoriaz ? Comment je peux y aller ?' },
        { fr: 'louer un vélo', en: 'to hire a bike', ex: 'Je voudrais louer un vélo pour aller dans la montagne.' },
        { fr: 'un vélo électrique', en: 'an electric bike', ex: 'Un vélo électrique, c\'est plus cher.' },
        { fr: 'Quel est votre budget ?', en: "What's your budget?", ex: 'Mon budget, c\'est cent euros.' },
        { fr: 'Je le prends.', en: "I'll take it.", ex: 'Le vélo bleu ? Oui, je le prends.' },
        { fr: 'un casque', en: 'a helmet', ex: "Vous avez besoin d'un casque ?" },
        { fr: 'cassé, cassée', en: 'broken', ex: 'Mon casque est cassé.' },
        { fr: 'Faites attention !', en: 'Be careful!', ex: 'Faites attention dans la montagne !' },
      ],
    },
    {
      slug: 'oct28_card_machine',
      name: 'The card machine',
      category: 'Phrases',
      level: 'A2.2',
      cards: [
        { fr: 'Réessayez.', en: 'Try again. (to a customer)', ex: "Ça n'a pas marché. Réessayez, s'il vous plaît." },
        { fr: 'Essayez.', en: 'Try. (to a customer)', ex: 'Essayez en sans contact.' },
        { fr: "Ça n'a pas marché.", en: "It didn't work.", ex: "Ça n'a pas marché, désolé." },
        { fr: 'Ça ne marche pas.', en: "It doesn't work.", ex: 'La machine ne marche pas ce soir.' },
        { fr: 'Ça a marché !', en: 'It worked!', ex: 'Ah, ça a marché ! Merci.' },
        { fr: "Ce n'est pas vous, c'est la machine.", en: "It's not you, it's the machine.", ex: "Ne vous inquiétez pas, ce n'est pas vous, c'est la machine." },
        { fr: 'le TPE', en: 'the card machine (terminal de paiement électronique)', ex: 'Il y a un problème avec le TPE.' },
        { fr: 'Il y a un problème avec la machine.', en: "There's a problem with the machine.", ex: 'Désolé, il y a un problème avec la machine.' },
        { fr: 'en sans contact', en: 'contactless', ex: 'Vous pouvez payer en sans contact.' },
        { fr: 'Tapez votre code.', en: 'Enter your PIN.', ex: "Tapez votre code, s'il vous plaît." },
        { fr: 'Paiement refusé', en: 'Payment declined', ex: "Paiement refusé ? Réessayez." },
        { fr: 'Veuillez patienter', en: 'Please wait (on the screen — soutenu)', ex: 'La machine dit « Veuillez patienter ».' },
        { fr: 'en espèces', en: 'in cash', ex: 'Vous pouvez payer en espèces ?' },
      ],
    },
    {
      slug: 'oct28_weekend',
      name: 'Talking about your weekend',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'le grenier', en: 'the attic', ex: "J'ai rangé le grenier de ma mère." },
        { fr: 'ranger', en: 'to tidy, to put away', ex: 'Je range ma chambre.' },
        { fr: 'un album photo', en: 'a photo album', ex: 'On a trouvé de vieux albums photo.' },
        { fr: 'des jouets', en: 'toys', ex: 'Il y avait beaucoup de jouets.' },
        { fr: 'vintage', en: 'vintage', ex: 'Ces jouets sont peut-être vintage !' },
        { fr: 'jouer dans la neige', en: 'to play in the snow', ex: 'Le chien adore jouer dans la neige.' },
        { fr: 'faire un bonhomme de neige', en: 'to make a snowman', ex: 'Je voulais faire un bonhomme de neige.' },
        { fr: 'je voulais', en: 'I wanted', ex: 'Je voulais aller à Avoriaz.' },
        { fr: 'Je suis allé faire des photos.', en: 'I went to take photos.', ex: 'Dimanche, je suis allé faire des photos.' },
        { fr: "J'ai pris des photos.", en: 'I took photos.', ex: "J'ai pris des photos du chien." },
        { fr: 'On va manger au restaurant.', en: "We're going to eat at the restaurant.", ex: 'Demain, on va manger au restaurant.' },
        { fr: 'jouer au bowling', en: 'to go bowling', ex: 'Samedi, on va jouer au bowling.' },
        { fr: 'jouer à la pétanque', en: 'to play pétanque', ex: 'On a joué à la pétanque au bord du lac.' },
        { fr: 'faire de la danse', en: 'to do dance', ex: 'Ma sœur fait de la danse.' },
        { fr: 'donc, alors', en: 'so', ex: 'Je bosse beaucoup, donc je suis fatigué.' },
        { fr: "C'est toi qui décides ?", en: 'Are you the one who decides?', ex: "On va où ? C'est toi qui décides ?" },
      ],
    },
  ],

  // ------------------------------------------------------------ quizzes --
  quizzes: [
    {
      slug: 'oct28_registers_quiz',
      title: 'Courant or familier?',
      level: 'A2.1',
      questions: [
        mc('Bosser is…', 'to work', ['familier', 'courant', 'vulgaire', 'soutenu'],
          'The courant verb is travailler.'),
        mc('Mon boulot is…', 'my job', ['familier', 'courant', 'soutenu', 'vulgaire'],
          'The courant version is mon travail.'),
        mc('Les toilettes is…', 'the toilets', ['courant', 'familier', 'vulgaire', 'soutenu'],
          'Les chiottes is the familier version.'),
        mc('Veuillez patienter is…', 'please wait', ['soutenu', 'courant', 'familier', 'vulgaire'],
          'Veuillez is formal — you see it on screens and in letters.'),
        mc('« Dégage ! » is fine to say to…', 'Get lost!', ['a friend, as a joke', 'your boss', 'a new hotel guest', 'Mathilde in a lesson'],
          'Familier: friends, or a really rude customer.'),
        mc('The courant way to say « Je bosse ce soir » is…', "I'm working tonight",
          ['Je travaille ce soir.', 'Je boulot ce soir.', 'Je travail ce soir.', 'Je dégage ce soir.'],
          'Travail (one L) is the noun; the verb is travailler.'),
        mc('« Quoi de neuf ? » — the casual answer for “not much” is…', "What's new?",
          ['Pas grand-chose.', 'Pas de neuf.', 'Rien grand.', 'Pas beaucoup chose.']),
        mc('Neuf in « une veste neuve » means…', 'Pick the meaning.', ['brand new', 'nine', 'old', 'clean'],
          'Neuf = nine, and also brand new: neuf, neuve.'),
        mc("« C'est tranquille à Morzine » means…", 'Pick the meaning.', ["It's chilled in Morzine.", "It's quiet and empty in Morzine.", "It's boring in Morzine.", "It's busy in Morzine."],
          'Tranquille = easy-going, relaxed. Calme = quiet.'),
      ],
    },
    {
      slug: 'oct28_dates_quiz',
      title: 'Dates, du… au…, and the infinitive',
      level: 'A1.3',
      questions: [
        mc('Le bus passe ___ vingt décembre ___ six avril.', 'The bus runs from 20 December to 6 April.',
          ['du … au', 'de le … à le', 'de … à', 'du … à'],
          'De + le = du, à + le = au.'),
        mc('Mon anniversaire, c\'est le ___ juillet.', 'My birthday is on 14 July.',
          ['quatorze', 'quatorzième', '14ème', 'quatorzeième'],
          'Dates use plain numbers.'),
        mc("C'est le ___ janvier.", "It's 1 January.", ['premier', 'un', 'une', 'première'],
          'The 1st is the one exception: le premier.'),
        mc('Le bureau est au ___ étage.', 'The office is on the third floor.', ['troisième', 'trois', 'tiers', 'troisièmes'],
          'Floors do use ordinals.'),
        mc('Le magasin est ouvert ___ neuf heures ___ dix-sept heures.', 'The shop is open from 9 to 5.',
          ['de … à', 'du … au', 'de le … à le', 'à … de'],
          'No article before the hours, so plain de… à…'),
        mc('Comment je peux y ___ ?', 'How can I get there?', ['aller', 'va', 'vais', 'allé'],
          'After je peux, je veux, je dois: the infinitive.'),
        mc('Je veux ___ un vélo.', 'I want to hire a bike.', ['louer', 'loue', 'loué', 'loues'],
          'After vouloir: the infinitive.'),
        mc('Je ___ un magasin de vélos.', "I'm looking for a bike shop.", ['cherche', 'cherche pour', 'regarde', 'regarde pour'],
          'Chercher = to look for — no pour. Regarder = to look at.'),
        mc('À quelle heure ___ le bus ?', 'What time does the bus come?', ['passe', 'vient à', 'arrête', 'va'],
          'Buses passent.'),
        mc("Vous avez besoin d'un ___ ?", 'Do you need a helmet?', ['casque', 'cassé', 'casse', 'chapeau'],
          'Un casque = a helmet. Cassé = broken.'),
        mc('Je cherche les ___ du bus.', "I'm looking for the bus timetable.", ['horaires', 'heureux', 'heures', 'horloges'],
          'Les horaires = the timetable. Heureux = happy.'),
      ],
    },
    {
      slug: 'oct28_jouer_faire',
      title: 'Jouer à or faire de?',
      level: 'A2.1',
      questions: [
        mc('Je joue ___ foot.', 'I play football.', ['au', 'du', 'le', 'à le'], 'Jouer à + le = au.'),
        mc('On a joué ___ pétanque.', 'We played pétanque.', ['à la', 'de la', 'la', 'au'], 'Jouer à + la.'),
        mc('Ils jouent ___ cartes.', 'They play cards.', ['aux', 'des', 'à les', 'les'], 'À + les = aux.'),
        mc('Samedi, on va jouer ___ bowling.', "On Saturday we're going bowling.", ['au', 'du', 'à le', 'le']),
        mc('Ma sœur fait ___ danse.', 'My sister does dance.', ['de la', 'à la', 'la', 'du'],
          "Faire de when 'play' doesn't fit."),
        mc('Je fais ___ ski toutes les semaines.', 'I go skiing every week.', ['du', 'au', 'de le', 'le'], 'De + le = du.'),
        mc('Tu fais ___ VTT ?', 'Do you go mountain biking?', ['du', 'au', 'de la', 'à le']),
        mc('Je voulais ___ un bonhomme de neige.', 'I wanted to make a snowman.', ['faire', 'jouer', 'aller', 'fais'],
          'Faire a snowman — more natural than construire.'),
        mc('Je suis allé ___ des photos.', 'I went to take photos.', ['faire', 'fait', 'fais', 'prendu'],
          'Aller + infinitive. Or simply: j\'ai pris des photos.'),
        mc('Demain, on ___ manger au restaurant.', "Tomorrow we're going to eat at the restaurant.", ['va', 'allons', 'aller', 'est allés'],
          'On takes the il form: on va.'),
      ],
    },
  ],

  // -------------------------------------------------------------- verbs --
  verbs: [
    { infinitive: 'bosser', meaning: 'to work (familier)', level: 'A2.1',
      forms: forms('bosse', 'bosses', 'bosse', 'bossons', 'bossez', 'bossent') },
    { infinitive: 'chercher', meaning: 'to look for', level: 'A1.3',
      forms: forms('cherche', 'cherches', 'cherche', 'cherchons', 'cherchez', 'cherchent') },
    { infinitive: 'essayer', meaning: 'to try', level: 'A2.1',
      forms: forms('essaie', 'essaies', 'essaie', 'essayons', 'essayez', 'essaient') },
    { infinitive: 'louer', meaning: 'to hire, to rent', level: 'A2.1',
      forms: forms('loue', 'loues', 'loue', 'louons', 'louez', 'louent') },
    { infinitive: 'passer', meaning: 'to pass, to come by', level: 'A1.3',
      forms: forms('passe', 'passes', 'passe', 'passons', 'passez', 'passent') },
    { infinitive: 'jouer', meaning: 'to play', level: 'A1.2',
      forms: forms('joue', 'joues', 'joue', 'jouons', 'jouez', 'jouent') },
    { infinitive: 'ranger', meaning: 'to tidy, to put away', level: 'A2.1',
      forms: forms('range', 'ranges', 'range', 'rangeons', 'rangez', 'rangent') },
  ],

  // ----------------------------------------------------------- concepts --
  concepts: [
    {
      slug: 'oct28-registres',
      title: 'Courant, familier, vulgaire',
      subtitle: 'travailler · bosser — knowing where a word sits',
      category: 'A2.1',
      paragraphs: [
        "English mostly has formal and informal. French talks about <strong>registres</strong>, and a word sits in one of them: <em>soutenu</em> (formal, written), <strong>courant</strong> (everyday — what lessons teach), <strong>familier</strong> (casual, slang) and <strong>vulgaire</strong> (crude: <em>les gros mots</em>).",
        "<strong>Familier</strong> isn't rude, it's relaxed: <em>je bosse</em> for <em>je travaille</em>, <em>mon boulot</em> for <em>mon travail</em>, <em>un truc</em> for <em>une chose</em>. Use it with friends and regulars; switch back to courant with guests, at the desk and with anyone you've just met.",
        "<strong>Dégager</strong> means to clear out or get rid of — <em>j'ai dégagé les vieux trucs du grenier</em> — and <em>« Dégage ! »</em> is “get lost”. Familier: a joke with a friend, or for a very rude customer. Never with your boss.",
        "As a learner you can't hear how rude a word is, so learn its register along with its meaning. Something that sounds funny can be <em>vulgaire</em>; ask Mathilde before you try a new one on Boris.",
      ],
      table_rows: [
        { en: 'to work', fr: 'travailler (courant) · bosser (familier)' },
        { en: 'my job', fr: 'mon travail (courant) · mon boulot (familier)' },
        { en: 'a thing', fr: 'une chose (courant) · un truc (familier)' },
        { en: 'the toilets', fr: 'les toilettes (courant) · les chiottes (familier)' },
        { en: 'go away', fr: 'Partez ! (courant) · Dégage ! (familier)' },
        { en: 'it was great', fr: "C'était super (courant) · C'était trop cool (familier)" },
        { en: 'please wait', fr: 'Veuillez patienter (soutenu) · Attendez (courant)' },
      ],
      examples: [
        { fr: 'Tu bosses à quelle heure ?', en: 'What time are you working?' },
        { fr: 'Ah non, désolé, je bosse.', en: "Oh no, sorry, I'm working." },
        { fr: "J'adore mon boulot, c'est tranquille.", en: "I love my job, it's chilled." },
      ],
      pitfall: {
        title: '« Travail » and « travailler »',
        body: "The noun has one L: <em>le travail</em>. The verb has two: <em>travailler, je travaille</em>. And <em>bosser</em> is a regular -er verb: <em>je bosse, tu bosses, nous bossons</em>.",
      },
    },
    {
      slug: 'oct28-dates',
      title: 'Dates, du… au…, and floors',
      subtitle: 'le vingt décembre · du premier au quinze · le troisième étage',
      category: 'A1.3',
      paragraphs: [
        "French dates take <strong>plain numbers</strong>, no “th”: <em>le vingt décembre, le six avril, le quatorze juillet</em>. The one exception is the 1st: <strong>le premier</strong> — <em>le premier janvier</em>.",
        "For a range of dates, <strong>du… au…</strong>: <em>Le bus passe du vingt décembre au six avril.</em> <em>Du</em> is <em>de + le</em> and <em>au</em> is <em>à + le</em> — the <em>le</em> is the one in <em>le vingt décembre</em>. Same with days: <em>du lundi au vendredi</em>.",
        "With no <em>le</em> there's nothing to squeeze, so it stays <strong>de… à…</strong>: <em>de neuf heures à dix-sept heures</em>.",
        "Floors <em>do</em> take ordinals: <em>le premier étage, le deuxième, le troisième</em>.",
      ],
      table_rows: [
        { en: '1 January', fr: 'le premier janvier' },
        { en: '20 December', fr: 'le vingt décembre' },
        { en: 'from 20 December to 6 April', fr: 'du vingt décembre au six avril' },
        { en: 'from Monday to Friday', fr: 'du lundi au vendredi' },
        { en: 'from 9am to 5pm', fr: 'de neuf heures à dix-sept heures' },
        { en: 'on the third floor', fr: 'au troisième étage' },
      ],
      examples: [
        { fr: 'À quelle heure passe le bus ?', en: 'What time does the bus come?' },
        { fr: 'Le bus passe du vingt décembre au six avril.', en: 'The bus runs from 20 December to 6 April.' },
        { fr: "Mon anniversaire, c'est le quatorze juillet.", en: 'My birthday is on 14 July.' },
      ],
      pitfall: {
        title: '« Le vingtième décembre » and « de le »',
        body: "No ordinals in dates except <em>premier</em>. And <em>de le</em> or <em>à le</em> always squeeze: <em>du, au</em>.",
      },
    },
    {
      slug: 'oct28-aller-faire',
      title: 'When in doubt: aller and faire',
      subtitle: 'je suis allé faire… · on va manger · jouer à, faire de',
      category: 'A2.1',
      paragraphs: [
        "Stuck for a verb? Reach for <strong>faire</strong> or <strong>aller</strong>. <em>Faire un bonhomme de neige</em> is more natural than <em>construire</em>; <em>faire des photos</em> is fine (<em>prendre des photos</em> too).",
        "<strong>Aller + an infinitive</strong> does two jobs. Future: <em>Demain, on va manger au restaurant.</em> Past, without a hard participle: <em>Je suis allé faire des photos</em> — only <em>allé</em> has to change.",
        "After <em>je peux, je veux, je dois</em> the next verb is always the infinitive: <em>Comment je peux y aller ?</em> — not <em>je peux va</em>. <em>Pour</em> + infinitive = in order to: <em>pour aller dans la montagne</em>.",
        "Games and sports: <strong>jouer à</strong> — <em>jouer au foot, à la pétanque, aux cartes, au bowling</em>. When “play” doesn't fit: <strong>faire de</strong> — <em>faire du ski, de la danse, du VTT</em>.",
      ],
      table_rows: [
        { en: 'I went to take photos', fr: 'Je suis allé faire des photos.' },
        { en: 'I wanted to make a snowman', fr: 'Je voulais faire un bonhomme de neige.' },
        { en: "We're going to eat at the restaurant", fr: 'On va manger au restaurant.' },
        { en: 'How can I get there?', fr: 'Comment je peux y aller ?' },
        { en: 'to play football / pétanque', fr: 'jouer au foot / à la pétanque' },
        { en: 'to ski / to do dance', fr: 'faire du ski / de la danse' },
      ],
      examples: [
        { fr: 'On est allés à Avoriaz pour jouer dans la neige avec le chien.', en: 'We went to Avoriaz to play in the snow with the dog.' },
        { fr: 'Samedi, on va jouer au bowling.', en: "On Saturday we're going bowling." },
        { fr: 'Ma sœur fait de la danse.', en: 'My sister does dance.' },
      ],
      pitfall: {
        title: '« Je peux va »',
        body: "Two conjugated verbs never sit side by side: <em>je peux aller, je veux louer, je dois partir</em>. And <em>je cherche</em> already means “I'm looking for” — no <em>pour</em>.",
      },
    },
  ],

  // ------------------------------------------------------ grammar notes --
  grammar_notes: [
    {
      title: '28 October, tidied up',
      body: `<p>Both lessons from 28 October, spelt and translated. Tap any French to hear it.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>le grenier · ranger</em></td><td>the attic · to tidy</td></tr>
        <tr><td class="fr"><em>des albums photo · des cartes · des jouets · vintage</em></td><td>photo albums · cards · toys · vintage</td></tr>
        <tr><td class="fr"><em>soutenu · courant · familier · vulgaire</em></td><td>formal · everyday · casual · crude</td></tr>
        <tr><td class="fr"><em>les gros mots</em></td><td>swear words</td></tr>
        <tr><td class="fr"><em>bosser · mon boulot</em></td><td>to work · my job (familier)</td></tr>
        <tr><td class="fr"><em>dégager · Dégage !</em></td><td>to clear out · get lost! (familier)</td></tr>
        <tr><td class="fr"><em>les chiottes · péter</em></td><td>the bog · to break, to blow (familier)</td></tr>
        <tr><td class="fr"><em>Quoi de neuf ? — Pas grand-chose.</em></td><td>What's new? — Not much.</td></tr>
        <tr><td class="fr"><em>neuf, neuve</em></td><td>brand new</td></tr>
        <tr><td class="fr"><em>C'était trop cool.</em></td><td>It was so cool.</td></tr>
        <tr><td class="fr"><em>tranquille · calme</em></td><td>chilled · quiet</td></tr>
        <tr><td class="fr"><em>je voulais</em></td><td>I wanted</td></tr>
        <tr><td class="fr"><em>faire un bonhomme de neige</em></td><td>to make a snowman</td></tr>
        <tr><td class="fr"><em>Je suis allé faire des photos · j'ai pris des photos</em></td><td>I went to take photos · I took photos</td></tr>
        <tr><td class="fr"><em>jouer au bowling · faire de la danse</em></td><td>to go bowling · to do dance</td></tr>
        <tr><td class="fr"><em>donc · alors</em></td><td>so</td></tr>
        <tr><td class="fr"><em>C'est toi qui décides ?</em></td><td>Are you the one who decides?</td></tr>
        <tr><td class="fr"><em>les horaires</em></td><td>the timetable</td></tr>
        <tr><td class="fr"><em>À quelle heure passe le bus ?</em></td><td>What time does the bus come?</td></tr>
        <tr><td class="fr"><em>du vingt décembre au six avril</em></td><td>from 20 December to 6 April</td></tr>
        <tr><td class="fr"><em>Je cherche… · Comment je peux y aller ?</em></td><td>I'm looking for… · How can I get there?</td></tr>
        <tr><td class="fr"><em>louer un vélo · un casque · Je le prends.</em></td><td>to hire a bike · a helmet · I'll take it.</td></tr>
        <tr><td class="fr"><em>Faites attention !</em></td><td>Be careful!</td></tr>
        <tr><td class="fr"><em>Réessayez · Ça n'a pas marché</em></td><td>Try again · It didn't work</td></tr>
        <tr><td class="fr"><em>Ce n'est pas vous, c'est la machine.</em></td><td>It's not you, it's the machine.</td></tr>
        <tr><td class="fr"><em>le TPE</em></td><td>the card machine (terminal de paiement électronique)</td></tr>
      </table>
      <p>Mathilde is away next week, so the vocabulary test moves back a week.</p>`,
    },
    {
      title: 'Corrections from 28 October',
      body: `<p>Slips and look-alikes from both lessons.</p>
      <table class="gr-table">
        <tr><th>Not</th><th class="fr">But</th><th>Why</th></tr>
        <tr><td>heureux (for the bus times)</td><td class="fr"><em>les horaires</em></td><td>heureux = happy</td></tr>
        <tr><td>Comment je peux va ?</td><td class="fr"><em>Comment je peux y aller ?</em></td><td>after je peux: the infinitive</td></tr>
        <tr><td>Je cherche pour un magasin</td><td class="fr"><em>Je cherche un magasin</em></td><td>chercher already means look for</td></tr>
        <tr><td>Je regarde un magasin (for “looking for”)</td><td class="fr"><em>Je cherche un magasin</em></td><td>regarder = to look at</td></tr>
        <tr><td>le vingtième décembre</td><td class="fr"><em>le vingt décembre</em></td><td>plain numbers in dates</td></tr>
        <tr><td>de le vingt décembre à le six avril</td><td class="fr"><em>du vingt décembre au six avril</em></td><td>de + le = du, à + le = au</td></tr>
        <tr><td>une casse</td><td class="fr"><em>un casque</em></td><td>a helmet; cassé = broken</td></tr>
        <tr><td>Ré essayez</td><td class="fr"><em>Réessayez</em></td><td>one word</td></tr>
        <tr><td>Ça ne marche pas (just now)</td><td class="fr"><em>Ça n'a pas marché</em></td><td>it didn't work — the passé composé</td></tr>
        <tr><td>construire un bonhomme de neige</td><td class="fr"><em>faire un bonhomme de neige</em></td><td>faire is more natural</td></tr>
        <tr><td>le travaille</td><td class="fr"><em>le travail · je travaille</em></td><td>noun one L, verb two</td></tr>
      </table>`,
    },
  ],

  // ------------------------------------------------------------ stories --
  stories: [
    {
      slug: 'oct28-le-grenier',
      title: 'Le grenier de ma mère',
      blurb: 'The attic, Avoriaz and Boris — the lesson of 28 October as a story. Press Read aloud and listen first.',
      level: 'A2',
      tags: ['passé composé', 'familier', 'aller + infinitive', 'listening'],
      focus: [
        "<em>J'ai rangé, on a trouvé, on est allés</em> — the passé composé, with être for aller",
        '<em>Je suis allé faire, on va manger</em> — aller + infinitive for the past and the future',
        '<em>Bosser, le boulot, dégager</em> — familier words, and where to use them',
      ],
      body: `
      <p>[[Samedi|On Saturday]], [[j'ai rangé le grenier|I tidied the attic|ranger = to tidy]] [[de ma mère|of my mum's]]. [[Il y avait|There were|imparfait for the scene]] [[de vieux albums photo|old photo albums]], [[des cartes|cards]] et [[beaucoup de jouets|lots of toys]]. Certains sont [[peut-être vintage|maybe vintage]] ! [[J'ai dégagé|I got rid of|dégager, familier]] [[tous les vieux trucs|all the old stuff|un truc = a thing, familier]], mais [[j'ai gardé|I kept]] les albums.</p>
      <p>[[Dimanche|On Sunday]], [[on est allés à Avoriaz|we went to Avoriaz|aller takes être]] [[pour jouer dans la neige|to play in the snow|pour + infinitive]] [[avec le chien|with the dog]]. [[Je voulais faire un bonhomme de neige|I wanted to make a snowman|faire, not construire]], mais [[le chien|the dog]] [[a tout cassé|broke everything]] ! Alors [[je suis allé faire des photos|I went to take photos|aller + infinitive keeps the past simple]]. [[C'était trop cool|It was so cool|trop = really, familier]].</p>
      <p>[[Lundi soir|On Monday evening]], [[au pub|at the pub]], Boris [[m'a demandé|asked me]] : [[« Quoi de neuf ? »|What's new?]] J'ai dit : [[« Pas grand-chose. Je bosse beaucoup ! »|Not much. I work a lot!|bosser = travailler, familier]] [[La machine à carte|The card machine]] [[ne marchait pas|wasn't working]], alors j'ai dit [[aux clients|to the customers]] : [[« Réessayez ! Ce n'est pas vous, c'est la machine. »|Try again! It's not you, it's the machine.]]</p>
      <p>[[Demain|Tomorrow]], [[on va manger au restaurant|we're going to eat at the restaurant|aller + infinitive for the future]], et samedi, [[on va jouer au bowling|we're going bowling|jouer à + a game]]. [[Mon boulot|My job|familier]], c'est [[tranquille|chilled]], [[donc|so]] [[c'est moi qui décide|I'm the one who decides]] !</p>
      `,
      translation: `
      <p>On Saturday I tidied my mum's attic. There were old photo albums, cards and lots of toys. Some are maybe vintage! I got rid of all the old stuff, but I kept the albums.</p>
      <p>On Sunday we went to Avoriaz to play in the snow with the dog. I wanted to make a snowman, but the dog broke everything! So I went to take photos. It was so cool.</p>
      <p>On Monday evening at the pub, Boris asked me, “What's new?” I said, “Not much. I work a lot!” The card machine wasn't working, so I said to the customers, “Try again! It's not you, it's the machine.”</p>
      <p>Tomorrow we're going to eat at the restaurant, and on Saturday we're going bowling. My job is chilled, so I'm the one who decides!</p>
      `,
    },
  ],

  // ----------------------------------------------------------- workbook --
  workbook_chapters: [
    {
      slug: 'oct28-ch25',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 25,
      title: 'Buses, dates and the bike shop',
      subtitle: 'du… au…, le premier, and the infinitive after je peux',
      level: 'A1.3',
      rule: {
        heading: 'Plain numbers in dates; du… au… for a range',
        paras: [
          'Dates take plain numbers — <em>le vingt décembre</em> — except <em>le premier</em>. Floors take ordinals: <em>le troisième étage</em>.',
          '<em>Du… au…</em> for dates and days (de + le, à + le); <em>de… à…</em> when there\'s no <em>le</em>, as with hours.',
          'After <em>je peux, je veux, je dois</em>: the infinitive. <em>Comment je peux y aller ?</em>',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'du-au',
          title: 'Du… au… or de… à…?',
          instructions: 'Pick the words for the range.',
          questions: [
            choice('Le bus passe ___ vingt décembre ___ six avril.', ['du … au', 'de … à']),
            choice('Le magasin est ouvert ___ neuf heures ___ dix-huit heures.', ['de … à', 'du … au']),
            choice('Je travaille ___ lundi ___ vendredi.', ['du … au', 'de … à']),
            choice("Les remontées sont ouvertes ___ premier décembre ___ quinze avril.", ['du … au', 'de … à']),
            choice('Le bar est fermé ___ quatorze heures ___ dix-sept heures.', ['de … à', 'du … au']),
          ],
        },
        {
          slug: 'say-the-date',
          title: 'Say the date',
          instructions: 'Write the number in words, the way you say it.',
          questions: [
            typed('20/12 → le ___ décembre', 'vingt'),
            typed('6/4 → le ___ avril', 'six'),
            typed('1/1 → le ___ janvier', 'premier', { hint: 'The one exception.' }),
            typed('14/7 → le ___ juillet', 'quatorze'),
            typed('3rd floor → le ___ étage', 'troisième', { hint: 'Floors do take ordinals.' }),
          ],
        },
        {
          slug: 'infinitive',
          title: 'Which form?',
          instructions: 'After <em>je peux, je veux, je dois</em> or <em>pour</em>, the next verb is the infinitive.',
          questions: [
            choice('Comment je peux y ___ ?', ['aller', 'va']),
            choice('Je voudrais ___ un vélo.', ['louer', 'loue']),
            choice('Je veux ___ un bonhomme de neige.', ['faire', 'fais']),
            choice('Je dois ___ ce soir.', ['bosser', 'bosse']),
            choice('Je loue un vélo pour ___ dans la montagne.', ['aller', 'vais']),
            choice('Je ___ un magasin de vélos.', ['cherche', 'cherche pour']),
          ],
        },
        {
          slug: 'bike-shop',
          title: 'At the bike shop',
          instructions: 'Say it out loud, then type it.',
          questions: [
            typed('What time does the bus come?', 'À quelle heure passe le bus ?'),
            typed("I'm looking for a bike shop.", 'Je cherche un magasin de vélos.'),
            typed('How can I get there?', 'Comment je peux y aller ?', {
              acceptable: ['comment est-ce que je peux y aller'] }),
            typed("I'd like to hire a bike.", 'Je voudrais louer un vélo.'),
            typed("I'll take it.", 'Je le prends.'),
            typed('Do you need a helmet? (vous)', "Vous avez besoin d'un casque ?", {
              acceptable: ["est-ce que vous avez besoin d'un casque"] }),
            typed('Be careful! (vous)', 'Faites attention !'),
          ],
        },
      ],
    },
    {
      slug: 'oct28-ch26',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 26,
      title: 'Registers, aller and faire',
      subtitle: 'bosser or travailler, jouer à or faire de, and the card machine',
      level: 'A2.1',
      rule: {
        heading: 'Know the register; when stuck, aller or faire',
        paras: [
          '<em>Courant</em> is everyday French; <em>familier</em> is for friends — <em>bosser, mon boulot, dégager</em>; <em>vulgaire</em> is crude.',
          '<em>Jouer à</em> for games and sports (<em>au foot, à la pétanque</em>); <em>faire de</em> for the rest (<em>du ski, de la danse</em>).',
          '<em>Aller + infinitive</em>: <em>on va manger</em> (future), <em>je suis allé faire des photos</em> (past).',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'register',
          title: 'Which register?',
          instructions: 'Courant or familier?',
          questions: [
            choice('bosser', ['familier', 'courant']),
            choice('travailler', ['courant', 'familier']),
            choice('mon boulot', ['familier', 'courant']),
            choice('les toilettes', ['courant', 'familier']),
            choice('Dégage !', ['familier', 'courant']),
            choice("C'était trop cool !", ['familier', 'courant']),
          ],
        },
        {
          slug: 'courant-version',
          title: 'Say it for the guests',
          instructions: 'Swap the familier word for the courant one.',
          questions: [
            typed('Je bosse ce soir. → Je ___ ce soir.', 'travaille'),
            typed("J'adore mon boulot. → J'adore mon ___.", 'travail', { hint: 'One L.' }),
            typed('Tu bosses à quelle heure ? → Tu ___ à quelle heure ?', 'travailles'),
            typed('Elles sont où, les chiottes ? → Elles sont où, les ___ ?', 'toilettes'),
          ],
        },
        {
          slug: 'jouer-faire',
          title: 'Jouer à or faire de?',
          instructions: 'Pick the little word.',
          questions: [
            choice('Je joue ___ foot.', ['au', 'du']),
            choice('On a joué ___ pétanque.', ['à la', 'de la']),
            choice('Ma sœur fait ___ danse.', ['de la', 'à la']),
            choice('Je fais ___ ski.', ['du', 'au']),
            choice('On va jouer ___ bowling.', ['au', 'du']),
            choice('Ils jouent ___ cartes.', ['aux', 'des']),
          ],
        },
        {
          slug: 'card-machine',
          title: 'The card machine',
          instructions: "A customer's card won't go through. Say it in French.",
          questions: [
            typed('Try again. (vous)', 'Réessayez.'),
            typed("It didn't work.", "Ça n'a pas marché."),
            typed("It's not you, it's the machine.", "Ce n'est pas vous, c'est la machine."),
            typed("There's a problem with the machine.", 'Il y a un problème avec la machine.', {
              acceptable: ['il y a un problème avec le tpe'] }),
            typed('Can you pay in cash? (vous)', 'Vous pouvez payer en espèces ?', {
              acceptable: ['est-ce que vous pouvez payer en espèces'] }),
          ],
        },
        {
          slug: 'my-weekend',
          title: 'My weekend',
          instructions: 'Tell Mathilde about the weekend. Lois: <em>allée</em>.',
          questions: [
            typed("I tidied my mum's attic.", "J'ai rangé le grenier de ma mère."),
            typed('We went to Avoriaz.', 'On est allés à Avoriaz.', {
              acceptable: ['nous sommes allés à avoriaz'] }),
            typed('I wanted to make a snowman.', 'Je voulais faire un bonhomme de neige.'),
            typed('I went to take photos.', 'Je suis allé faire des photos.', {
              acceptable: ['je suis allée faire des photos'] }),
            typed('It was so cool!', "C'était trop cool !"),
            typed("Tomorrow we're going to eat at the restaurant.", 'Demain, on va manger au restaurant.', {
              acceptable: ['demain on va manger au restaurant', 'on va manger au restaurant demain'] }),
          ],
        },
      ],
    },
  ],
};
