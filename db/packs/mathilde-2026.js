// Lessons with Mathilde, August–October 2026.
//
// Built from Mathilde's lesson notes for Lois and Martyn. The lessons are about
// spoken French, so most of this is for saying out loud: Daily 10 prompts and
// role-plays first, with decks, quizzes, workbook chapters and explainers
// behind them for the grammar the conversations lean on.
//
// Same shape as the upload parser's output (api/_lib/schema.js), plus two
// things uploads don't produce: workbook questions can offer `options`
// (multiple choice) and `acceptable` alternative answers.
//
// Slugs and the pack key are permanent — progress is stored against them.

// --------------------------------------------------------------- helpers --

// A stable stand-in for shuffling: the quiz and workbook screens show options
// in the order given, so the right answer can't always sit in the same place.
function spot(text, n) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h % n;
}

function placed(prompt, right, wrong) {
  const opts = [...wrong];
  const at = spot(prompt, wrong.length + 1);
  opts.splice(at, 0, right);
  return { opts, at };
}

/** Quiz question. The right answer comes first in `options`. */
function mc(prompt, en, [right, ...wrong], note) {
  const { opts, at } = placed(prompt, right, wrong);
  return { prompt, en, opts, answer_idx: at, note };
}

/** Typed workbook question. Answers without hyphens are accepted too. */
function typed(prompt, answer, { acceptable = [], hint, notes } = {}) {
  const accept = new Set(acceptable);
  for (const a of [answer, ...acceptable]) {
    if (a.includes('-')) accept.add(a.replace(/-/g, ' '));
  }
  accept.delete(answer);
  const q = { prompt, answer };
  if (accept.size) q.acceptable = [...accept];
  if (hint) q.hint = hint;
  if (notes) q.notes = notes;
  return q;
}

/** Multiple-choice workbook question. The right answer comes first. */
function choice(prompt, [right, ...wrong], notes) {
  const q = { prompt, answer: right, options: placed(prompt, right, wrong).opts };
  if (notes) q.notes = notes;
  return q;
}

/** Daily 10 prompts for one category: [en, fr, note] triples. */
function drills(cat, level, rows) {
  return rows.map(([en, fr, note = '']) => ({ cat, en, fr, note, level }));
}

/** A role-play line: [who, fr, en]. */
const lines = (rows) => rows.map(([who, fr, en]) => ({ who, fr, en }));

/** Present-tense table from the six forms, je to ils/elles. */
function forms(je, tu, il, nous, vous, ils) {
  return { je, tu, 'il/elle/on': il, nous, vous, 'ils/elles': ils };
}

// The eight times Mathilde used to test telling the time: the 24-hour way,
// the everyday way, and the part of the day that tells 6h45 from 18h45.
const TIMES = [
  ['13h30', 'treize heures trente', 'une heure et demie', "de l'après-midi"],
  ['20h45', 'vingt heures quarante-cinq', 'neuf heures moins le quart', 'du soir'],
  ['7h45', 'sept heures quarante-cinq', 'huit heures moins le quart', 'du matin'],
  ['18h30', 'dix-huit heures trente', 'six heures et demie', 'du soir'],
  ['17h40', 'dix-sept heures quarante', 'six heures moins vingt', "de l'après-midi"],
  ['6h45', 'six heures quarante-cinq', 'sept heures moins le quart', 'du matin'],
  ['18h45', 'dix-huit heures quarante-cinq', 'sept heures moins le quart', 'du soir'],
  ['8h30', 'huit heures trente', 'huit heures et demie', 'du matin'],
];

// ------------------------------------------------------------------ pack --

export default {
  key: 'mathilde-2026',
  title: 'Lessons with Mathilde',
  summary:
    'Spoken French from the lessons with Mathilde, August to October 2026: telling the time, ' +
    "phone numbers, telling stories in the past, manquer, pouvoir/vouloir/devoir, and Lois's " +
    'hotel reception and bar. Built mainly as things to say out loud.',

  // ----------------------------------------------------------- Daily 10 --
  drills: [
    ...drills('time', 'A1.3', [
      ...TIMES.flatMap(([t, h24, h12]) => [
        [`Say the time the 24-hour way, as on a timetable: ${t}`, `Il est ${h24}.`,
         'The 24-hour way just reads the hours, then the minutes.'],
        [`Say ${t} the everyday way, as you would to a friend.`, `Il est ${h12}.`,
         h12.includes('moins')
           ? 'After half past, name the next hour and count back with moins.'
           : 'Everyday times use 1–12, with et quart, et demie and moins le quart.'],
      ]),
      ['Ask: What time is it?', 'Il est quelle heure ?', 'Spoken French. The textbook version is Quelle heure est-il ?'],
      ['Ask: What time does the bar open?', 'Le bar ouvre à quelle heure ?', 'In speech, à quelle heure often goes at the end.'],
      ['Say: I start work at quarter to eight.', 'Je commence le travail à huit heures moins le quart.'],
      ['Say: The lesson is at half past six.', 'Le cours est à six heures et demie.', 'Demie with an e after heure — heure is feminine.'],
      ["Say: It's half past twelve, it's the lunch break.", "Il est midi et demi, c'est la pause du midi.", 'Midi is masculine, so no e on demi here.'],
      ["Say: We're arriving around eight o'clock.", 'On arrive vers huit heures.', 'Vers = around (for times).'],
      ['Say this phone number: 06 39 98 77 14', 'Zéro six, trente-neuf, quatre-vingt-dix-huit, soixante-dix-sept, quatorze.', 'French numbers are read in pairs.'],
      ['Say this phone number: 07 15 92 44 70', 'Zéro sept, quinze, quatre-vingt-douze, quarante-quatre, soixante-dix.', '70 = soixante-dix (sixty-ten), 92 = quatre-vingt-douze (four-twenties-twelve).'],
      ['Say this phone number: 06 11 17 13 19', 'Zéro six, onze, dix-sept, treize, dix-neuf.', 'The teens: 11–16 are single words, 17–19 are dix + number.'],
      ['Say this phone number: 04 65 71 12 16', 'Zéro quatre, soixante-cinq, soixante et onze, douze, seize.', '71 = soixante et onze, with et — like vingt et un.'],
      ["Ask: What's your phone number?", "C'est quoi ton numéro de téléphone ?", 'Polite version: Quel est votre numéro de téléphone ?'],
      ['Count from 11 to 20 out loud.', 'Onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt.', "Mathilde's homework for Martyn: get the teens automatic."],
      ['Count from 1 to 10 out loud.', 'Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.'],
    ]),

    ...drills('chat', 'A2.1', [
      ["Ask a friend: What's new?", 'Quoi de neuf ?'],
      ['Answer: Nothing much.', 'Rien de spécial.', 'Also: Pas grand-chose.'],
      ['Answer “Did you like it?” with: Not really.', 'Pas vraiment.'],
      ['Ask: How do you say “hangover” in French?', 'Comment tu dis « hangover » en français ?', 'Your most useful lesson phrase. Formal: Comment dit-on… ?'],
      ['Say: I miss my dog.', 'Mon chien me manque.', 'Back to front: the dog is the subject — “my dog is missing to me”.'],
      ['Say to Lois: I miss you.', 'Tu me manques.', 'Not je te manque — that means “you miss me”.'],
      ['Say: I miss England a bit.', "L'Angleterre me manque un peu."],
      ['Say: My friends miss me.', 'Je manque à mes amis.', 'The one being missed (je) is the subject; à + the people missing you.'],
      ['Say: Martyn is going to miss me.', 'Je vais manquer à Martyn.', "Mathilde's example."],
      ['Say: She misses her mother.', 'Sa mère lui manque.', 'Lui = to her. Her mother is the subject.'],
      ["Say: That's scary!", 'Ça fait peur !'],
      ["Say: I'm scared of heights.", "J'ai le vertige.", 'Avoir le vertige — literally “to have vertigo”.'],
      ['Say: Our goal is to speak French at work.', "Notre objectif, c'est de parler français au travail."],
      ["Say: We're taking French lessons.", 'On prend des cours de français.', 'Un cours = a lesson. Les courses = the shopping.'],
      ["Say: I'm going to eat better this week.", 'Je vais mieux manger cette semaine.', 'Mieux goes before the infinitive.'],
      ['Ask: What do you think of it?', "Qu'est-ce que tu en penses ?", 'En = of it.'],
      ["Say: In my opinion, it's too expensive.", "À mon avis, c'est trop cher."],
      ['Say: I think the festival was great.', 'Je trouve que le festival était génial.', 'Je trouve que… is the everyday way to give an opinion.'],
      ['Say: I love living here, especially for the mountains.', "J'adore vivre ici, surtout pour les montagnes.", 'Surtout = especially, above all.'],
      ["Say: He's talking nonsense!", "Il dit n'importe quoi !"],
      ['Say: You can ask me anything.', "Tu peux me demander n'importe quoi.", "N'importe quoi = anything at all (and, said about talk, “nonsense”)."],
      ['Say: The festival is ten minutes from our house.', 'Le festival est à dix minutes de chez nous.', 'Distance and travel time take à. Chez nous = our place.'],
      ['Ask: When are you free?', 'Quand est-ce que tu es dispo ?', 'Dispo = disponible, informal.'],
      ["Say: I'm free on Thursday after six.", 'Je suis dispo jeudi après dix-huit heures.'],
    ]),

    ...drills('story', 'A2.2', [
      ['Say: I got a fine.', "J'ai eu une amende.", "J'ai eu = passé composé of avoir: I got / I had."],
      ['Say: We waited for an hour.', 'On a attendu une heure.', 'Attendre already means “wait for” — no pour.'],
      ['Say: It was packed — the queue went all the way to the pharmacy.', "C'était bondé, la queue allait jusqu'à la pharmacie.", "Setting the scene → imparfait: c'était, allait."],
      ['Say: It was raining and there was a storm.', 'Il pleuvait et il y avait un orage.', 'Weather in the background of a story → imparfait.'],
      ['Say: I used to fall all the time when I was learning.', "Je tombais tout le temps quand j'apprenais.", '“Used to” and “was …-ing” → imparfait.'],
      ['Say: Yesterday I fell three times.', 'Hier, je suis tombé trois fois.', 'One-off events → passé composé. Tomber takes être (tombée for Lois).'],
      ['Say: We tasted oysters.', 'On a goûté des huîtres.'],
      ['Say: We did a wine tasting.', 'On a fait une dégustation de vin.'],
      ['Say: The landscapes were beautiful, especially by the sea.', 'Les paysages étaient magnifiques, surtout au bord de la mer.'],
      ["Say: I take photos of everything that's beautiful.", 'Je prends en photo tout ce qui est beau.', 'Tout ce qui = everything that.'],
      ['Say: I got lost in town.', 'Je me suis perdu en ville.', 'Reflexive verbs take être. Lois writes perdue — it sounds the same.'],
      ['Say: I should have taken a map.', "J'aurais dû prendre une carte.", "J'aurais dû + infinitive = I should have."],
      ['Say: We won the first match but lost the second.', 'On a gagné le premier match, mais on a perdu le deuxième.'],
      ['Say: We lost anyway.', 'On a perdu quand même.', 'Quand même = anyway, all the same.'],
      ['Ask: Did you train this weekend?', "Est-ce que tu t'es entraîné ce week-end ?", "S'entraîner is reflexive, so être: tu t'es entraîné(e)."],
      ['Say: Last night we went to the bar.', 'Hier soir, on est allés au bar.', 'Aller takes être. With on = we, allés is usually plural.'],
      ['Say: I have a hangover.', "J'ai la gueule de bois.", 'Informal, but everyone says it.'],
      ['Say: Last time, we talked about the festival.', 'La dernière fois, on a parlé du festival.', 'De + le = du.'],
      ['Say: We met some really nice people.', 'On a rencontré des gens très sympas.', 'Rencontrer = meet for the first time.'],
      ['Say: It was your lucky day!', "C'était ton jour de chance !"],
      ['Say: While I was cooking, it started to rain.', 'Pendant que je faisais à manger, il a commencé à pleuvoir.', 'Imparfait for the background, passé composé for what happened.'],
      ['Ask: What did you do at the weekend?', "Qu'est-ce que vous avez fait ce week-end ?", 'How most lessons start — have an answer ready.'],
      ['Say: We did a zip line in Finale Ligure. I was scared!', "On a fait une tyrolienne à Finale Ligure. J'ai eu peur !", "Avoir peur = to be scared; in a story, j'ai eu peur."],
      ['Say: We caught up with our friends on the slope.', 'On a rattrapé nos amis sur la piste.', 'Rattraper = to catch up with.'],
    ]),

    ...drills('plans', 'A2.1', [
      ['Say: On Monday I have to work until eleven at night.', "Lundi, je dois travailler jusqu'à vingt-trois heures.", 'Devoir + infinitive = have to.'],
      ["Say: I can't come on Tuesday, I'm working.", 'Je ne peux pas venir mardi, je travaille.'],
      ['Ask: Do you want to go to the festival on Saturday?', 'Tu veux aller au festival samedi ?', 'No le before a day when you mean this coming one.'],
      ['Say: We have to do the food shopping before the weekend.', 'On doit faire les courses avant le week-end.', 'Faire les courses = food shopping.'],
      ['Say: We need bread and milk.', 'On a besoin de pain et de lait.', 'Avoir besoin de = to need.'],
      ['Say: We have to pack tonight.', 'On doit faire les valises ce soir.'],
      ["Say: We can't go there anymore.", 'Nous ne pouvons plus y aller.', 'Ne… plus = not anymore. Y = there.'],
      ["Say: We've planned to see some friends on Sunday.", 'On a prévu de voir des amis dimanche.', 'Prévoir de + infinitive = to plan to.'],
      ['Say: I should have called you.', "J'aurais dû t'appeler."],
      ['Say: It should have been easier.', 'Ça aurait dû être plus facile.'],
      ['Say: I want to earn more money this winter.', "Je veux gagner plus d'argent cet hiver.", 'Gagner = to earn, as well as to win.'],
      ['Say: I have to catch up on the lessons.', 'Je dois rattraper les cours.'],
      ['Ask: Can you help me on Friday morning?', "Tu peux m'aider vendredi matin ?"],
      ["Say: Lois can't, she has to work at the hotel.", "Lois ne peut pas, elle doit travailler à l'hôtel."],
      ['Say: We want to go to Geneva to go clothes shopping.', 'On veut aller à Genève pour faire les magasins.', 'Pour + infinitive = in order to.'],
      ["Say: Let's do it next week.", 'On le fait la semaine prochaine.', 'The present tense is fine for arranged plans.'],
      ['Ask: What do you have to do tomorrow?', "Qu'est-ce que tu dois faire demain ?"],
      ['Say: Before going to sleep, I want to watch a film.', "Avant d'aller dormir, je veux regarder un film.", 'Avant de + infinitive, where English uses -ing.'],
      ['Say: The bar is open every day during the off-season.', "Le bar est ouvert tous les jours pendant l'intersaison."],
      ["Say: I'm late — I've got to go!", 'Je suis en retard, je dois y aller !', "Je dois y aller = I've got to go."],
      ["Say: We're early, we can have a coffee.", 'On est en avance, on peut prendre un café.', 'En avance = early (for something); tôt = early (in the day).'],
    ]),

    ...drills('hotel', 'A2.2', [
      ['Greet a guest arriving in the evening and offer to help.', 'Bonsoir, je peux vous aider ?'],
      ['Ask a walk-in guest: Do you have a reservation?', 'Vous avez une réservation ?', 'More formal: Avez-vous une réservation ?'],
      ['Ask: What name is it under?', "C'est à quel nom ?"],
      ["Say: One moment, I'll go and check.", 'Un instant, je vais vérifier.', 'Buys you time — say it, then look at the screen.'],
      ['Say: Good news, we have one room left.', 'Bonne nouvelle, il nous reste une chambre.', 'Il nous reste… = we have … left.'],
      ["Say: I'm sorry, we're full tonight.", "Je suis désolée, c'est complet ce soir.", 'Désolée with an e for Lois.'],
      ['Ask: For how many nights?', "C'est pour combien de nuits ?"],
      ['Ask: For how many people?', "C'est pour combien de personnes ?"],
      ["Say: It's a double room with a view of the mountains.", "C'est une chambre double avec vue sur les montagnes."],
      ["Say: It's 120 euros a night, breakfast included.", "C'est cent vingt euros la nuit, petit-déjeuner compris.", 'La nuit = per night.'],
      ['Say: The room is on the second floor, at the end of the corridor.', 'La chambre est au deuxième étage, au bout du couloir.'],
      ['Say: The lift is on the left.', "L'ascenseur est à gauche."],
      ['Say: Breakfast is served from half past seven to ten.', 'Le petit-déjeuner est servi de sept heures et demie à dix heures.'],
      ['Say: Breakfast is in the room next to the bar.', 'Le petit-déjeuner est dans la salle à côté du bar.', 'À côté de + le = à côté du.'],
      ['Say: When the bar is closed, you can use the other door with the code.', "Quand le bar est fermé, vous pouvez utiliser l'autre porte avec le code."],
      ['Say: The code is 4 5 1 8.', "Le code, c'est quatre, cinq, un, huit.", 'Give codes digit by digit, slowly.'],
      ["Say: Here's your key. Have a good evening!", 'Voici votre clé. Bonne soirée !'],
      ['Ask: Would you like to pay now or when you leave?', 'Vous voulez payer maintenant ou au départ ?'],
      ['Say: The wifi password is on the card.', 'Le mot de passe du wifi est sur la carte.'],
      ['Ask a guest in the morning: Did you sleep well?', 'Vous avez bien dormi ?'],
      ['Say: You need to check out before eleven.', 'Il faut libérer la chambre avant onze heures.', 'Libérer la chambre = to check out.'],
      ['Ask at the bar: What can I get you?', "Qu'est-ce que je vous sers ?", 'The classic opener behind a bar.'],
      ['Ask: Shall I put it on your room?', 'Je vous le mets sur la chambre ?'],
      ['Say: Last orders! The bar closes in ten minutes.', 'Dernière commande ! Le bar ferme dans dix minutes.'],
      ["As the guest, ask: Do you have a room for tonight? We haven't booked.", "Vous avez une chambre pour ce soir ? On n'a pas réservé.", "Martyn's line when he plays the walk-in guest."],
      ['As the guest, ask: Is the bar still open?', 'Le bar est encore ouvert ?'],
      ['As the guest, ask: Can I have the code for the other door?', "Je peux avoir le code de l'autre porte ?"],
      ['As the guest, order a draught beer and a glass of white.', "Une pression et un verre de blanc, s'il vous plaît.", 'Une pression = a draught beer.'],
      ['As the guest, ask: Is breakfast included?', 'Le petit-déjeuner est compris ?'],
    ]),
  ],

  // --------------------------------------------------------- role-plays --
  roleplays: [
    {
      title: 'Un client sans réservation',
      ctx: "Lois at the hotel desk: a couple walks in without a booking. You're the receptionist.",
      lines: lines([
        ['them', 'Bonsoir ! Vous avez une chambre pour ce soir ?', 'Good evening! Do you have a room for tonight?'],
        ['you', 'Bonsoir ! Vous avez une réservation ?', 'Good evening! Do you have a reservation?'],
        ['them', "Non, on n'a pas réservé.", "No, we haven't booked."],
        ['you', "D'accord. C'est pour combien de personnes, et combien de nuits ?", 'OK. For how many people, and how many nights?'],
        ['them', 'Deux personnes, une nuit.', 'Two people, one night.'],
        ['you', 'Un instant, je vais vérifier… Bonne nouvelle, il nous reste une chambre double.', "One moment, I'll go and check… Good news, we have one double room left."],
        ['them', "Super ! C'est combien ?", 'Great! How much is it?'],
        ['you', "C'est cent vingt euros la nuit, petit-déjeuner compris.", "It's 120 euros a night, breakfast included."],
        ['them', 'Parfait, on la prend.', "Perfect, we'll take it."],
        ['you', "Très bien. Je peux avoir votre nom et une pièce d'identité, s'il vous plaît ?", 'Very good. Can I have your name and some ID, please?'],
        ['them', 'Oui, voilà. On paie maintenant ?', 'Yes, here you go. Do we pay now?'],
        ['you', 'Comme vous voulez : maintenant ou au départ.', 'As you like: now or when you leave.'],
      ]),
      notes: "<strong>Je vais vérifier</strong> buys you time — say it, then look at the screen. <strong>Il nous reste…</strong> = we have … left. If it's full: <em>Je suis désolée, c'est complet ce soir.</em> Then swap: Martyn plays the receptionist.",
    },
    {
      title: 'La chambre, le petit-déjeuner et la porte',
      ctx: 'The same guests have checked in. Tell them where everything is.',
      lines: lines([
        ['you', 'Voici votre clé. Vous avez la chambre douze.', "Here's your key. You're in room twelve."],
        ['them', 'Merci. Elle est où, la chambre ?', "Thanks. Where's the room?"],
        ['you', "Au deuxième étage. L'ascenseur est à gauche, et la chambre est au bout du couloir.", 'On the second floor. The lift is on the left, and the room is at the end of the corridor.'],
        ['them', 'Il y a une salle de bains dans la chambre ?', 'Is there a bathroom in the room?'],
        ['you', 'Oui, avec une douche. Et le mot de passe du wifi est sur la carte.', 'Yes, with a shower. And the wifi password is on the card.'],
        ['them', 'Le petit-déjeuner est à quelle heure ?', 'What time is breakfast?'],
        ['you', 'Il est servi de sept heures et demie à dix heures, dans la salle à côté du bar.', "It's served from half past seven to ten, in the room next to the bar."],
        ['them', 'Et si on rentre tard ce soir ?', 'And if we come back late tonight?'],
        ['you', "Pas de problème. Quand le bar est fermé, vous pouvez utiliser l'autre porte avec le code.", 'No problem. When the bar is closed, you can use the other door with the code.'],
        ['them', "C'est quoi, le code ?", "What's the code?"],
        ['you', "C'est quatre, cinq, un, huit. Il est aussi écrit sur votre carte.", "It's 4518. It's also written on your card."],
        ['them', 'Merci beaucoup !', 'Thanks very much!'],
        ['you', 'Je vous en prie. Bonne soirée !', "You're welcome. Have a good evening!"],
      ]),
      notes: '<strong>Au bout du couloir</strong> (at the end of the corridor) and <strong>à côté du bar</strong> (next to the bar) both hide <em>de + le = du</em>. Give the code digit by digit, slowly.',
    },
    {
      title: "Au bar de l'hôtel",
      ctx: "Martyn is the customer, Lois is behind the bar. You're Lois.",
      lines: lines([
        ['them', 'Bonsoir ! Le bar est encore ouvert ?', 'Good evening! Is the bar still open?'],
        ['you', "Oui, jusqu'à vingt-trois heures. Qu'est-ce que je vous sers ?", 'Yes, until 11pm. What can I get you?'],
        ['them', "Une pression, s'il vous plaît. Et un verre de vin rouge.", 'A draught beer, please. And a glass of red wine.'],
        ['you', 'Je reviens tout de suite… Voilà. Je vous le mets sur la chambre ?', "I'll be right back… There you go. Shall I put it on your room?"],
        ['them', 'Oui, chambre douze. Vous êtes ouverts tous les jours ?', 'Yes, room twelve. Are you open every day?'],
        ['you', "Oui, tous les jours pendant l'intersaison, de dix-sept heures à vingt-trois heures.", 'Yes, every day during the off-season, from 5pm to 11pm.'],
        ['them', 'Et après vingt-trois heures, on rentre comment ?', 'And after 11pm, how do we get in?'],
        ['you', "Par l'autre porte, avec le code. Il est sur votre carte.", "Through the other door, with the code. It's on your card."],
        ['them', 'Parfait. Vous avez quelque chose à manger ?', 'Perfect. Do you have anything to eat?'],
        ['you', 'Pas vraiment, juste des chips et des cacahuètes. Désolée !', 'Not really, just crisps and peanuts. Sorry!'],
        ['them', 'Pas de souci. Des chips, alors !', 'No worries. Crisps then!'],
        ['you', "Ça marche ! Dernière commande dans dix minutes, d'accord ?", 'Coming up! Last orders in ten minutes, OK?'],
      ]),
      notes: "<strong>Qu'est-ce que je vous sers ?</strong> is the classic bar opener. <strong>Ça marche</strong> = coming right up. Play it for real: Martyn orders, Lois answers without looking — then swap.",
    },
    {
      title: 'Quoi de neuf ?',
      ctx: 'Start of the lesson: Mathilde asks about your week.',
      lines: lines([
        ['them', 'Salut ! Quoi de neuf depuis la dernière fois ?', "Hi! What's new since last time?"],
        ['you', 'Pas grand-chose… Ah si ! Samedi, on est allés au festival.', 'Not much… Oh yes! On Saturday we went to the festival.'],
        ['them', "Ah, c'est loin de chez vous ?", 'Oh, is it far from your place?'],
        ['you', 'Non, il est à dix minutes de chez nous.', "No, it's ten minutes from our place."],
        ['them', "C'était bien ?", 'Was it good?'],
        ['you', "Oui, mais c'était bondé ! La queue allait jusqu'à la pharmacie.", 'Yes, but it was packed! The queue went all the way to the pharmacy.'],
        ['them', 'Et vous êtes rentrés tard ?', 'And did you get home late?'],
        ['you', "Très tard. Le lendemain, j'avais la gueule de bois !", 'Very late. The next day I had a hangover!'],
        ['them', 'Ha ha ! Et le match de dimanche ?', "Ha ha! And Sunday's match?"],
        ['you', "On a perdu trois à un. On s'est entraînés, mais on a perdu quand même.", 'We lost 3–1. We trained, but we lost anyway.'],
        ['them', "Dommage ! Et cette semaine, qu'est-ce que tu as de prévu ?", 'Shame! And this week, what have you got planned?'],
        ['you', 'Je dois travailler tous les soirs, mais je veux faire du sport le matin.', 'I have to work every evening, but I want to do some sport in the mornings.'],
      ]),
      notes: "Every lesson starts like this — have three things ready to tell. What happened: passé composé (<em>on est allés, on a perdu</em>). What it was like: imparfait (<em>c'était bondé, la queue allait</em>).",
    },
    {
      title: 'Notre voyage dans le sud',
      ctx: 'Tell Mathilde about your trip to the south of France.',
      lines: lines([
        ['them', 'Alors, ce voyage dans le sud ?', 'So, how was the trip to the south?'],
        ['you', "C'était génial ! Les paysages étaient magnifiques, surtout au bord de la mer.", 'It was great! The scenery was beautiful, especially by the sea.'],
        ['them', "Qu'est-ce que vous avez fait ?", 'What did you do?'],
        ['you', 'On a goûté des huîtres et on a fait une dégustation de vin.', 'We tried oysters and we did a wine tasting.'],
        ['them', 'Les huîtres, tu as aimé ?', 'The oysters — did you like them?'],
        ['you', "Pas vraiment… mais c'était la première fois, alors je suis content d'avoir goûté !", "Not really… but it was the first time, so I'm glad I tried them!"],
        ['them', 'Et tu as pris beaucoup de photos ?', 'And did you take lots of photos?'],
        ['you', 'Oui, je prends en photo tout ce qui est beau !', "Yes, I take photos of everything that's beautiful!"],
        ['them', 'Vous avez rencontré des gens ?', 'Did you meet anyone?'],
        ['you', 'Oui, on a rencontré un couple très sympa à la dégustation.', 'Yes, we met a really nice couple at the tasting.'],
        ['them', 'Et le dernier jour ?', 'And the last day?'],
        ['you', 'On avait prévu de voir un village, mais il pleuvait. On aurait dû partir plus tôt !', "We'd planned to see a village, but it was raining. We should have left earlier!"],
      ]),
      notes: "<strong>Le temps</strong> vs <strong>une fois</strong>: <em>on n'a pas eu le temps</em> (we didn't have time), <em>c'était la première fois</em> (it was the first time). <em>On aurait dû</em> = we should have. Lois says <em>contente</em>.",
    },
    {
      title: 'On se voit quand ?',
      ctx: 'Fix the next lesson: days, times and a phone number.',
      lines: lines([
        ['them', 'Quand est-ce que tu es dispo la semaine prochaine ?', 'When are you free next week?'],
        ['you', 'Lundi, je ne peux pas, je dois travailler. Mardi, ça va.', "Monday I can't, I have to work. Tuesday is fine."],
        ['them', 'Mardi à quelle heure ?', 'Tuesday at what time?'],
        ['you', 'À six heures et demie, ça te va ?', 'At half past six — does that work for you?'],
        ['them', 'Dix-huit heures trente… oui, parfait.', '18:30… yes, perfect.'],
        ['you', 'On le fait chez nous ou en visio ?', 'Shall we do it at ours or by video call?'],
        ['them', 'Chez vous. Tu peux me redonner ton numéro ?', 'At yours. Can you give me your number again?'],
        ['you', 'Oui : zéro six, trente-neuf, quatre-vingt-dix-huit, vingt et un, quatre-vingt-six.', 'Yes: 06 39 98 21 86.'],
        ['them', "Vingt et un, quatre-vingt-six… c'est noté. Et Lois vient aussi ?", '21, 86… got it. And is Lois coming too?'],
        ['you', 'Non, elle ne peut pas, elle travaille. Elle veut faire un cours seule jeudi.', "No, she can't, she's working. She wants to do a lesson on her own on Thursday."],
        ['them', 'Pas de problème. À mardi !', 'No problem. See you Tuesday!'],
        ['you', 'À mardi ! Et désolé si je suis en retard !', "See you Tuesday! And sorry if I'm late!"],
      ]),
      notes: 'People often repeat a time back the 24-hour way to confirm it (<em>dix-huit heures trente</em>). Phone numbers go in pairs. <strong>Ça te va ?</strong> = does that suit you?',
    },
    {
      title: 'Ça me manque',
      ctx: 'Mathilde asks what you miss about England — and about the zip line in Finale Ligure.',
      lines: lines([
        ['them', "L'Angleterre, qu'est-ce qui te manque le plus ?", 'What do you miss most about England?'],
        ['you', 'Ma famille me manque, et surtout mon chien !', 'I miss my family, and especially my dog!'],
        ['them', 'Oh ! Et toi, tu manques à ta famille ?', 'Oh! And does your family miss you?'],
        ['you', "Oui, je manque beaucoup à ma mère. Elle m'appelle tous les dimanches.", 'Yes, my mum misses me a lot. She calls me every Sunday.'],
        ['them', 'Et la nourriture anglaise, ça te manque ?', 'And English food — do you miss it?'],
        ['you', 'Pas vraiment ! Mais le thé, oui, ça me manque.', 'Not really! But tea, yes, I miss that.'],
        ['them', "Et Finale Ligure, c'était comment ?", 'And Finale Ligure — how was it?'],
        ['you', "Super ! On a fait une tyrolienne. Ça fait peur, j'ai le vertige !", "Great! We did a zip line. It's scary — I'm afraid of heights!"],
        ['them', 'Tu as eu peur ?', 'Were you scared?'],
        ['you', "Oui, très peur ! Mais c'était génial quand même.", 'Yes, really scared! But it was great all the same.'],
      ]),
      notes: '<strong>Manquer</strong> works back to front: the thing you miss is the subject. <em>Mon chien me manque</em> = I miss my dog. <em>Je manque à ma mère</em> = my mum misses me.',
    },
  ],

  // -------------------------------------------------------------- decks --
  decks: [
    {
      slug: 'mathilde_telling_time',
      name: 'Telling the time',
      category: 'Numbers',
      level: 'A1.3',
      cards: [
        { fr: 'Il est quelle heure ?', en: 'What time is it? (spoken)', ex: 'Il est quelle heure ? — Il est midi.' },
        { fr: 'À quelle heure… ?', en: 'At what time…?', ex: 'À quelle heure ouvre le bar ?' },
        ...TIMES.map(([t, h24, h12, part]) => ({
          fr: `Il est ${h12} ${part}.`,
          en: `It's ${t}`,
          ex: `Sur un horaire : ${h24}.`,
        })),
        { fr: 'et quart', en: 'quarter past', ex: 'Il est dix heures et quart.' },
        { fr: 'et demie', en: 'half past', ex: 'Il est onze heures et demie.' },
        { fr: 'moins le quart', en: 'quarter to', ex: 'Il est huit heures moins le quart.' },
        { fr: 'midi / minuit', en: 'midday / midnight', ex: 'Le bar ferme à minuit.' },
        { fr: "du matin / de l'après-midi / du soir", en: 'in the morning / afternoon / evening', ex: 'Je commence à sept heures du matin.' },
        { fr: 'vers huit heures', en: "around eight o'clock", ex: 'On arrive vers huit heures.' },
        { fr: 'pile', en: 'on the dot', ex: 'Il est neuf heures pile.' },
      ],
    },
    {
      slug: 'mathilde_daily_life',
      name: 'Daily life & errands',
      category: 'Vocabulary',
      level: 'A2.1',
      cards: [
        { fr: 'le loyer', en: 'the rent', ex: 'On paie le loyer le premier du mois.' },
        { fr: 'une livraison', en: 'a delivery', ex: "J'attends une livraison cet après-midi." },
        { fr: 'une amende', en: 'a fine', ex: "J'ai eu une amende parce que j'étais mal garé." },
        { fr: "j'ai eu…", en: 'I got… / I had…', ex: "J'ai eu une bonne nouvelle hier." },
        { fr: 'bondé(e)', en: 'packed, rammed', ex: 'Le bar était bondé hier soir.' },
        { fr: 'la queue', en: 'the queue', ex: "La queue allait jusqu'à la pharmacie." },
        { fr: 'faire la queue', en: 'to queue', ex: 'On a fait la queue pendant vingt minutes.' },
        { fr: 'la pause du midi', en: 'the lunch break', ex: 'Je fais les courses pendant la pause du midi.' },
        { fr: 'faire les valises', en: 'to pack (your bags)', ex: 'On doit faire les valises ce soir.' },
        { fr: "gagner de l'argent", en: 'to earn money', ex: "Il travaille l'hiver pour gagner de l'argent." },
        { fr: 'un matelas', en: 'a mattress', ex: 'Mon matelas est trop dur.' },
        { fr: 'un canapé', en: 'a sofa', ex: 'On regarde un film sur le canapé.' },
        { fr: "avant d'aller dormir", en: 'before going to sleep', ex: "Je lis un peu avant d'aller dormir." },
        { fr: 'faire les courses', en: 'to do the food shopping', ex: 'On fait les courses le lundi.' },
        { fr: 'faire les magasins / faire du shopping', en: 'to go (clothes) shopping', ex: 'Samedi, on va faire les magasins à Genève.' },
        { fr: 'une course', en: 'a race (also: an errand)', ex: 'Il a gagné la course.' },
        { fr: 'un cours / les cours', en: 'a lesson / lessons', ex: "J'ai un cours de français ce soir." },
        { fr: 'On prend des cours de français.', en: "We're taking French lessons.", ex: 'On prend des cours de français avec Mathilde.' },
        { fr: 'Quand est-ce que tu es dispo ?', en: 'When are you free?', ex: 'Quand est-ce que tu es dispo cette semaine ?' },
        { fr: 'Je vais mieux manger.', en: "I'm going to eat better.", ex: 'Cette semaine, je vais mieux manger.' },
        { fr: 'le faire la semaine prochaine', en: 'to do it next week', ex: "On n'a pas le temps, on va le faire la semaine prochaine." },
      ],
    },
    {
      slug: 'mathilde_conversation',
      name: 'Chatting: reactions & opinions',
      category: 'Phrases',
      level: 'A2.1',
      cards: [
        { fr: 'Quoi de neuf ?', en: "What's new?", ex: 'Salut Mathilde ! Quoi de neuf ?' },
        { fr: 'Rien de spécial.', en: 'Nothing much.', ex: 'Quoi de neuf ? — Rien de spécial.' },
        { fr: 'Pas vraiment.', en: 'Not really.', ex: 'Tu as aimé le film ? — Pas vraiment.' },
        { fr: 'Comment tu dis… ?', en: 'How do you say…?', ex: 'Comment tu dis « hangover » en français ?' },
        { fr: 'Ça fait peur !', en: "That's scary!", ex: 'La tyrolienne, ça fait peur !' },
        { fr: "J'ai le vertige.", en: "I'm scared of heights.", ex: "Je n'aime pas la tyrolienne, j'ai le vertige." },
        { fr: "C'était ton jour de chance !", en: 'It was your lucky day!', ex: "Tu as gagné ? C'était ton jour de chance !" },
        { fr: 'avoir la gueule de bois', en: 'to have a hangover', ex: "Ce matin, j'ai la gueule de bois." },
        { fr: 'surtout', en: 'especially, above all', ex: "J'aime la France, surtout la nourriture." },
        { fr: "n'importe quoi", en: 'anything at all (also: nonsense)', ex: "Il dit n'importe quoi !" },
        { fr: 'quand même', en: 'anyway, all the same', ex: 'On a perdu quand même.' },
        { fr: 'notre objectif', en: 'our goal', ex: "Notre objectif, c'est de parler français avec les clients." },
        { fr: 'pendant que', en: 'while', ex: 'Je fais à manger pendant que tu fais les courses.' },
        { fr: 'pour + infinitif', en: '(in order) to', ex: 'On prend des cours pour parler avec nos voisins.' },
        { fr: "Qu'est-ce que… ?", en: 'What…?', ex: "Qu'est-ce que tu fais ce week-end ?" },
        { fr: "Qu'est-ce que tu en penses ?", en: 'What do you think (of it)?', ex: "Le festival, qu'est-ce que tu en penses ?" },
        { fr: 'À mon avis…', en: 'In my opinion…', ex: "À mon avis, c'est trop cher." },
        { fr: 'Je trouve que…', en: 'I think that… / I find that…', ex: 'Je trouve que le festival était génial.' },
      ],
    },
    {
      slug: 'mathilde_manquer',
      name: 'Manquer — missing someone',
      category: 'Grammar',
      level: 'A2.2',
      cards: [
        { fr: 'Tu me manques.', en: 'I miss you.', ex: 'Tu me manques quand tu travailles le soir.' },
        { fr: 'Ça me manque.', en: 'I miss it.', ex: "L'Angleterre ? Oui, ça me manque un peu." },
        { fr: 'Mon chien me manque.', en: 'I miss my dog.', ex: 'Mon chien me manque, il est chez ma mère.' },
        { fr: 'Mes amis me manquent.', en: 'I miss my friends.', ex: 'Mes amis me manquent, surtout le week-end.' },
        { fr: 'Sa mère lui manque.', en: 'He/She misses his/her mother.', ex: 'Lois appelle sa mère : sa mère lui manque.' },
        { fr: 'Je vais manquer à Martyn.', en: 'Martyn is going to miss me.', ex: 'Je pars une semaine, je vais manquer à Martyn.' },
        { fr: 'Vous nous manquez.', en: 'We miss you.', ex: 'Venez nous voir, vous nous manquez !' },
        { fr: 'Je te manque ?', en: 'Do you miss me?', ex: 'Alors, je te manque ?' },
        { fr: 'Tu manques à tes parents.', en: 'Your parents miss you.', ex: 'Appelle-les, tu manques à tes parents.' },
        { fr: "J'ai manqué le bus.", en: 'I missed the bus.', ex: "J'ai manqué le bus, alors je suis en retard." },
      ],
    },
    {
      slug: 'mathilde_when_how_often',
      name: 'Early, late & how often',
      category: 'Adverbs',
      level: 'A2.1',
      cards: [
        { fr: 'tôt', en: 'early (in the day)', ex: 'Je me lève tôt pour travailler.' },
        { fr: 'tard', en: 'late (in the day)', ex: "On s'est couchés tard hier soir." },
        { fr: 'être en avance', en: 'to be early (for something)', ex: 'Je suis en avance, le cours commence à dix heures.' },
        { fr: 'être en retard', en: 'to be late (for something)', ex: 'Désolé, je suis en retard !' },
        { fr: "à l'heure", en: 'on time', ex: "Le bus est à l'heure aujourd'hui." },
        { fr: 'hier / hier soir', en: 'yesterday / last night', ex: 'Hier soir, on est allés au bar.' },
        { fr: 'la dernière fois', en: 'last time', ex: 'La dernière fois, on a parlé du festival.' },
        { fr: 'la semaine prochaine', en: 'next week', ex: 'On le fait la semaine prochaine.' },
        { fr: "pendant l'intersaison", en: 'during the off-season', ex: "Le bar est ouvert tous les jours pendant l'intersaison." },
        { fr: 'tous les jours', en: 'every day', ex: 'Je fais du sport tous les jours.' },
        { fr: 'toujours', en: 'always (also: still)', ex: 'Je prends toujours un café le matin.' },
        { fr: 'souvent', en: 'often', ex: 'On va souvent à Genève.' },
        { fr: 'parfois', en: 'sometimes', ex: 'Parfois, je travaille le dimanche.' },
        { fr: 'de temps en temps', en: 'from time to time', ex: 'On mange au restaurant de temps en temps.' },
        { fr: 'rarement', en: 'rarely', ex: 'Je regarde rarement la télé.' },
        { fr: 'ne… jamais', en: 'never', ex: 'Je ne bois jamais de café le soir.' },
        { fr: 'une fois / deux fois par semaine', en: 'once / twice a week', ex: 'On prend des cours une fois par semaine.' },
        { fr: 'le temps', en: 'time (an amount of it) — also the weather', ex: "Je n'ai pas le temps." },
        { fr: 'ne… plus', en: 'not anymore, no longer', ex: 'Nous ne pouvons plus y aller.' },
      ],
    },
    {
      slug: 'mathilde_snow_trips',
      name: 'Snow, trips & weekends',
      category: 'Vocabulary',
      level: 'A2.2',
      cards: [
        { fr: 'une planche de snow / un snow', en: 'a snowboard', ex: "J'ai acheté un nouveau snow." },
        { fr: 'les fixations (les fix)', en: 'the bindings', ex: 'Mes fix sont mal réglées.' },
        { fr: 'les remontées mécaniques', en: 'the ski lifts', ex: 'Les remontées mécaniques ouvrent en décembre.' },
        { fr: 'tomber', en: 'to fall', ex: "Je tombais tout le temps quand j'apprenais." },
        { fr: 'rattraper', en: 'to catch up (with)', ex: 'Attends-moi, je vais te rattraper !' },
        { fr: "s'entraîner", en: 'to train, to practise', ex: "Est-ce que tu t'es entraîné ce week-end ?" },
        { fr: 'gagner / perdre', en: 'to win / to lose', ex: 'On a gagné le premier match, mais on a perdu le deuxième.' },
        { fr: 'une tyrolienne', en: 'a zip line', ex: 'On a fait une tyrolienne à Finale Ligure.' },
        { fr: 'un orage', en: 'a (thunder)storm', ex: 'Il y a eu un gros orage cette nuit.' },
        { fr: 'Il pleuvait.', en: 'It was raining.', ex: 'Il pleuvait, alors on est restés à la maison.' },
        { fr: 'un paysage', en: 'a landscape, scenery', ex: 'Les paysages sont magnifiques dans le sud.' },
        { fr: 'goûter', en: 'to taste, to try (food)', ex: 'On a goûté des huîtres.' },
        { fr: 'des huîtres', en: 'oysters', ex: 'Tu as déjà goûté des huîtres ?' },
        { fr: 'une dégustation de vin', en: 'a wine tasting', ex: 'On a fait une dégustation de vin dans un petit domaine.' },
        { fr: 'prendre en photo', en: 'to take a photo of', ex: 'Je prends en photo tout ce qui est beau.' },
        { fr: 'rencontrer', en: 'to meet (for the first time)', ex: 'On a rencontré des gens très sympas.' },
        { fr: 'On a prévu de…', en: "We've planned to…", ex: 'On a prévu de voir des amis ce week-end.' },
        { fr: 'se perdre', en: 'to get lost', ex: 'Je me suis perdue en ville.' },
        { fr: 'à dix minutes de chez nous', en: 'ten minutes from our place', ex: 'Le festival est à dix minutes de chez nous.' },
      ],
    },
    {
      slug: 'mathilde_hotel_reception',
      name: 'At the hotel reception',
      category: 'Phrases',
      level: 'A2.2',
      cards: [
        { fr: 'Vous avez une réservation ?', en: 'Do you have a reservation?', ex: 'Bonsoir ! Vous avez une réservation ?' },
        { fr: "C'est à quel nom ?", en: 'What name is it under?', ex: "Vous avez réservé ? C'est à quel nom ?" },
        { fr: 'Je vais vérifier.', en: "I'll go and check.", ex: 'Un instant, je vais vérifier.' },
        { fr: 'Il nous reste une chambre.', en: 'We have one room left.', ex: 'Bonne nouvelle, il nous reste une chambre double.' },
        { fr: "C'est complet.", en: "We're full.", ex: "Je suis désolée, c'est complet ce soir." },
        { fr: "C'est pour combien de nuits ?", en: 'For how many nights?', ex: "Très bien. C'est pour combien de nuits ?" },
        { fr: 'une chambre double / à deux lits', en: 'a double / twin room', ex: 'Il nous reste une chambre à deux lits.' },
        { fr: 'au deuxième étage', en: 'on the second floor', ex: 'La chambre est au deuxième étage.' },
        { fr: "l'ascenseur", en: 'the lift', ex: "L'ascenseur est à gauche." },
        { fr: 'au bout du couloir', en: 'at the end of the corridor', ex: 'La chambre douze est au bout du couloir.' },
        { fr: 'Voici votre clé.', en: "Here's your key.", ex: 'Voici votre clé. Bonne soirée !' },
        { fr: 'Le petit-déjeuner est compris.', en: 'Breakfast is included.', ex: "C'est cent vingt euros, le petit-déjeuner est compris." },
        { fr: 'Le petit-déjeuner est servi de… à…', en: 'Breakfast is served from… to…', ex: 'Le petit-déjeuner est servi de sept heures et demie à dix heures.' },
        { fr: 'le mot de passe du wifi', en: 'the wifi password', ex: 'Le mot de passe du wifi est sur la carte.' },
        { fr: "l'autre porte, avec le code", en: 'the other door, with the code', ex: "Quand le bar est fermé, vous pouvez utiliser l'autre porte avec le code." },
        { fr: 'au départ', en: 'when you leave (on departure)', ex: 'Vous voulez payer maintenant ou au départ ?' },
        { fr: 'libérer la chambre', en: 'to check out', ex: 'Il faut libérer la chambre avant onze heures.' },
      ],
    },
    {
      slug: 'mathilde_behind_bar',
      name: 'Behind the bar',
      category: 'Phrases',
      level: 'A2.2',
      cards: [
        { fr: "Qu'est-ce que je vous sers ?", en: 'What can I get you?', ex: "Bonsoir ! Qu'est-ce que je vous sers ?" },
        { fr: 'Vous désirez ?', en: 'What would you like?', ex: 'Bonjour madame, vous désirez ?' },
        { fr: 'une pression', en: 'a draught beer', ex: "Une pression, s'il vous plaît." },
        { fr: 'un verre de rouge / de blanc', en: 'a glass of red / white', ex: 'Un verre de blanc et une pression.' },
        { fr: 'Je reviens tout de suite.', en: "I'll be right back.", ex: 'Je reviens tout de suite avec vos boissons.' },
        { fr: 'Ça marche !', en: 'Coming right up! / Sure!', ex: 'Deux pressions ? Ça marche !' },
        { fr: 'Je vous le mets sur la chambre ?', en: 'Shall I put it on your room?', ex: 'Voilà. Je vous le mets sur la chambre ?' },
        { fr: 'par carte ou en espèces ?', en: 'by card or in cash?', ex: 'Vous payez par carte ou en espèces ?' },
        { fr: 'Le bar ferme à vingt-trois heures.', en: 'The bar closes at 11pm.', ex: 'Le bar ferme à vingt-trois heures ce soir.' },
        { fr: 'Dernière commande !', en: 'Last orders!', ex: 'Dernière commande ! On ferme dans dix minutes.' },
        { fr: 'On est ouverts tous les jours.', en: "We're open every day.", ex: "On est ouverts tous les jours pendant l'intersaison." },
        { fr: 'des cacahuètes / des chips', en: 'peanuts / crisps', ex: 'On a juste des chips et des cacahuètes.' },
        { fr: 'Bonne soirée !', en: 'Have a good evening!', ex: 'Merci, bonne soirée !' },
      ],
    },
  ],

  // ------------------------------------------------------------ quizzes --
  quizzes: [
    {
      slug: 'mathilde_manquer_quiz',
      title: 'Manquer — who misses whom?',
      level: 'A2.2',
      questions: [
        mc('Tu ___ manques.', 'I miss you.', ['me', 'te', 'lui', 'le'],
          'Back to front: tu (the one missed) is the subject, me is the one missing.'),
        mc('Mon chien me ___.', 'I miss my dog.', ['manque', 'manques', 'manquent', 'manquons'],
          'The verb agrees with mon chien — the thing missed.'),
        mc('Mes amis me ___.', 'I miss my friends.', ['manquent', 'manque', 'manques', 'manquez'],
          'Mes amis is plural, so manquent.'),
        mc('Sa mère ___ manque.', 'He misses his mother.', ['lui', 'le', 'se', 'il'],
          "Manquer à quelqu'un — the person missing is lui (to him/her)."),
        mc('Je vais manquer ___ Martyn.', 'Martyn is going to miss me.', ['à', 'de', 'par', 'avec'],
          'Manquer à + the person who does the missing.'),
        mc('Vous ___ manquez !', 'We miss you!', ['nous', 'vous', 'leur', 'me'],
          'Vous (the ones missed) is the subject; nous are the ones missing you.'),
        mc('Est-ce que je te ___ ?', 'Do you miss me?', ['manque', 'manques', 'manquent', 'manquer'],
          'Je is the subject, so je manque.'),
        mc("L'Angleterre, ça ___ manque un peu.", 'I miss England a bit.', ['me', 'moi', 'je', "m'"],
          'Ça me manque = I miss it.'),
        mc('___ manques à tes parents.', 'Your parents miss you.', ['Tu', 'Ils', 'Je', 'Vous'],
          'You are the one being missed, so tu is the subject.'),
        mc("Hier, j'___ manqué le bus.", 'Yesterday I missed the bus.', ['ai', 'suis', 'me', 'avais'],
          "Missing a bus or an event works like English: j'ai manqué (or j'ai raté) le bus."),
      ],
    },
    {
      slug: 'mathilde_confusables',
      title: 'Easily confused words',
      level: 'A2.1',
      questions: [
        mc('On ___ un film sur le canapé.', "We're watching a film on the sofa.", ['regarde', 'voit', 'voir', 'regarder'],
          'Regarder = to watch, to look at — on purpose.'),
        mc('Tu as ___ Mathilde au marché ?', 'Did you see Mathilde at the market?', ['vu', 'regardé', 'voir', 'vue'],
          'Voir = to see, it just happens. Past participle: vu.'),
        mc("Je n'ai pas le ___.", "I don't have (the) time.", ['temps', 'fois', 'heure', 'moment'],
          'Time as an amount = le temps.'),
        mc("C'est la première ___ que je fais du snow.", "It's the first time I've been snowboarding.", ['fois', 'temps', 'heure', 'époque'],
          'An occasion = une fois.'),
        mc("J'ai un ___ de français ce soir.", 'I have a French lesson this evening.', ['cours', 'course', 'courses', 'cour'],
          'Un cours (masculine, always with an s) = a lesson.'),
        mc("Il n'y a plus de lait, on doit faire les ___.", "There's no milk left, we need to do the shopping.", ['courses', 'cours', 'magasins', 'achat'],
          'Faire les courses = food shopping.'),
        mc('Samedi, on va faire les ___ pour acheter des vêtements.', "On Saturday we're going shopping for clothes.", ['magasins', 'courses', 'cours', 'boutique'],
          'Faire les magasins (or faire du shopping) = shopping for fun, clothes.'),
        mc("Désolé, je suis en ___ ! Le bus n'est pas venu.", "Sorry, I'm late! The bus didn't come.", ['retard', 'tard', 'avance', 'tôt'],
          'Late for something = en retard. Tard is just late in the day.'),
        mc('Il est ___, on va se coucher.', "It's late, let's go to bed.", ['tard', 'en retard', 'tôt', 'en avance'],
          'Tard = late in the day — no en.'),
        mc('Le cours est à 10 h et il est 9 h 45 : je suis en ___.', "The lesson is at 10 and it's 9:45: I'm early.", ['avance', 'retard', 'tôt', 'tard'],
          'Early for something = en avance.'),
        mc('Hier, on a ___ le match trois à un !', 'Yesterday we won the match 3–1!', ['gagné', 'perdu', 'gagner', 'joué'],
          'Gagner = to win; perdre = to lose.'),
        mc("On a perdu ___ même, mais c'était sympa.", 'We lost anyway, but it was fun.', ['quand', 'pour', 'tout', 'comme'],
          'Quand même = anyway, all the same.'),
        mc("J'ai ___ un garçon très sympa au festival.", 'I met a really nice guy at the festival.', ['rencontré', 'retrouvé', 'rejoint', 'regardé'],
          'Rencontrer = meet for the first time. Retrouver = meet up with someone you know.'),
        mc("J'aime la France, ___ la nourriture.", 'I love France, especially the food.', ['surtout', 'toujours', 'souvent', 'pendant'],
          'Surtout = especially, above all.'),
      ],
    },
    {
      slug: 'mathilde_past_tense',
      title: 'Telling stories in the past',
      level: 'A2.2',
      questions: [
        mc('Hier, on ___ attendu une heure.', 'Yesterday we waited for an hour.', ['a', 'est', 'avait', 'va'],
          'Passé composé with avoir: on a attendu.'),
        mc('Il ___ quand on est arrivés.', 'It was raining when we arrived.', ['pleuvait', 'a plu', 'pleut', 'pleuvra'],
          'The weather in the background → imparfait.'),
        mc("Je ___ tout le temps quand j'apprenais.", 'I used to fall all the time when I was learning.', ['tombais', 'suis tombé', 'tombe', 'tomberai'],
          'A habit in the past → imparfait.'),
        mc('Hier, je ___ deux fois sur la piste rouge.', 'Yesterday I fell twice on the red run.', ['suis tombé', 'tombais', 'ai tombé', 'tombe'],
          'A finished event → passé composé. Tomber takes être.'),
        mc("J'___ une amende la semaine dernière.", 'I got a fine last week.', ['ai eu', 'avais', 'suis eu', 'ai'],
          "J'ai eu = I got / I had."),
        mc('On ___ des huîtres à Sète.', 'We tried oysters in Sète.', ['a goûté', 'goûtait', 'est goûté', 'goûte'],
          'A one-off thing you did → passé composé with avoir.'),
        mc("Le bar ___ bondé, la queue allait jusqu'à la pharmacie.", 'The bar was packed, the queue went all the way to the pharmacy.', ['était', 'a été', 'est', 'sera'],
          'Describing the scene → imparfait.'),
        mc('Je me ___ perdue en ville.', 'I got lost in town.', ['suis', 'ai', 'vais', 'es'],
          'Reflexive verbs take être: je me suis perdu(e).'),
        mc('Est-ce que tu ___ entraîné ce week-end ?', 'Did you train this weekend?', ["t'es", 'as', "t'as", 'es'],
          "S'entraîner is reflexive: tu t'es entraîné."),
        mc('Pendant que je ___ à manger, Martyn regardait la télé.', 'While I was cooking, Martyn was watching TV.', ['faisais', 'ai fait', 'fais', 'ferai'],
          'Two things going on at the same time → imparfait + imparfait.'),
        mc('Hier soir, on ___ allés au festival.', 'Last night we went to the festival.', ['est', 'a', 'était', 'va'],
          'Aller takes être: on est allés.'),
        mc("C'___ ton jour de chance !", 'It was your lucky day!', ['était', 'avait', 'étais', 'été'],
          "C'était = it was."),
      ],
    },
    {
      slug: 'mathilde_little_words',
      title: 'Little words: au, du, notre, vos, pour',
      level: 'A2.1',
      questions: [
        mc('Je vais ___ cinéma ce soir.', "I'm going to the cinema tonight.", ['au', 'à le', 'à la', 'aux'],
          'À + le always becomes au.'),
        mc('On va ___ pharmacie.', "We're going to the pharmacy.", ['à la', 'au', 'à le', 'aux'],
          'À la never contracts.'),
        mc('Elle explique les horaires ___ clients.', 'She explains the opening times to the guests.', ['aux', 'à les', 'au', 'à la'],
          'À + les becomes aux.'),
        mc('Le festival est ___ dix minutes de chez nous.', 'The festival is ten minutes from our place.', ['à', 'dans', 'pour', 'en'],
          'How far away something is: être à + distance or time.'),
        mc('La salle est à côté ___ bar.', 'The room is next to the bar.', ['du', 'de le', 'de la', 'des'],
          'De + le becomes du.'),
        mc("C'est ___ maison.", "It's our house.", ['notre', 'nos', 'nous', 'votre'],
          'Notre + one thing.'),
        mc('Ce sont ___ amis anglais.', "They're our English friends.", ['nos', 'notre', 'nous', 'vos'],
          'Nos + more than one.'),
        mc("C'est ___ chambre, madame.", 'This is your room, madam.', ['votre', 'vos', 'ton', 'nos'],
          'Polite vous → votre + one thing.'),
        mc('Voici ___ clés, monsieur.', 'Here are your keys, sir.', ['vos', 'votre', 'nos', 'leur'],
          'Polite vous → vos + more than one.'),
        mc('On prend des cours ___ parler avec nos voisins.', "We're taking lessons to be able to talk to our neighbours.", ['pour', 'à', 'de', 'par'],
          'In order to = pour + infinitive.'),
        mc('Je lis un peu avant ___ aller dormir.', 'I read a bit before going to sleep.', ["d'", 'de', 'à', 'pour'],
          "Avant de + infinitive; de becomes d' before a vowel."),
        mc("Nous ne pouvons ___ y aller, c'est fermé.", "We can't go there anymore, it's closed.", ['plus', 'pas', 'jamais', 'rien'],
          'Ne… plus = not anymore.'),
      ],
    },
    {
      slug: 'mathilde_pvd',
      title: 'Can, want, must — and should have',
      level: 'A2.2',
      questions: [
        mc("Mardi, je ___ travailler jusqu'à 22 h.", 'On Tuesday I have to work until 10pm.', ['dois', 'peux', 'veux', 'doit'],
          'Devoir = have to: je dois.'),
        mc('Tu ___ venir jeudi soir ?', 'Can you come on Thursday evening?', ['peux', 'dois', 'veut', 'peut'],
          'Pouvoir = can: tu peux.'),
        mc('On ___ besoin de pain.', 'We need bread.', ['a', 'est', 'doit', 'fait'],
          'Avoir besoin de = to need.'),
        mc('Nous ___ faire les courses avant samedi.', 'We have to do the shopping before Saturday.', ['devons', 'doit', 'pouvons', 'voulons'],
          'Nous devons.'),
        mc('Ils ___ aller au festival, mais ils travaillent.', "They want to go to the festival, but they're working.", ['veulent', 'voulent', 'veut', 'peuvent'],
          'Vouloir is irregular: ils veulent.'),
        mc("J'___ dû partir plus tôt.", 'I should have left earlier.', ['aurais', 'ai', 'avais', 'aurai'],
          "J'aurais dû + infinitive = I should have."),
        mc('Ça aurait ___ être plus facile.', 'It should have been easier.', ['dû', 'du', 'devoir', 'doit'],
          'Dû takes a circumflex — du without one means “some”.'),
        mc("Vous ___ utiliser l'autre porte avec le code.", 'You can use the other door with the code.', ['pouvez', 'devez', 'voulez', 'pouvons'],
          'Vous pouvez = you can.'),
        mc('Elle ne ___ plus y aller.', "She can't go there anymore.", ['peut', 'peux', 'doit', 'veux'],
          'Elle peut; ne… plus around the verb.'),
        mc('Quand est-ce que tu ___ commencer ?', 'When do you want to start?', ['veux', 'veut', 'dois', 'voulez'],
          'Tu veux.'),
      ],
    },
  ],

  // -------------------------------------------------------------- verbs --
  verbs: [
    { infinitive: 'regarder', meaning: 'to watch, to look at', level: 'A1.2',
      forms: forms('regarde', 'regardes', 'regarde', 'regardons', 'regardez', 'regardent') },
    { infinitive: 'commencer', meaning: 'to start', level: 'A1.3',
      forms: forms('commence', 'commences', 'commence', 'commençons', 'commencez', 'commencent') },
    { infinitive: 'manquer', meaning: 'to miss, to be missing', level: 'A2.2',
      forms: forms('manque', 'manques', 'manque', 'manquons', 'manquez', 'manquent') },
    { infinitive: 'gagner', meaning: 'to win, to earn', level: 'A2.1',
      forms: forms('gagne', 'gagnes', 'gagne', 'gagnons', 'gagnez', 'gagnent') },
    { infinitive: 'rencontrer', meaning: 'to meet', level: 'A2.1',
      forms: forms('rencontre', 'rencontres', 'rencontre', 'rencontrons', 'rencontrez', 'rencontrent') },
    { infinitive: 'goûter', meaning: 'to taste, to try', level: 'A2.1',
      forms: forms('goûte', 'goûtes', 'goûte', 'goûtons', 'goûtez', 'goûtent') },
    { infinitive: 'tomber', meaning: 'to fall', level: 'A2.1',
      forms: forms('tombe', 'tombes', 'tombe', 'tombons', 'tombez', 'tombent') },
    { infinitive: 'attendre', meaning: 'to wait (for)', level: 'A2.1',
      forms: forms('attends', 'attends', 'attend', 'attendons', 'attendez', 'attendent') },
    { infinitive: 'perdre', meaning: 'to lose', level: 'A2.1',
      forms: forms('perds', 'perds', 'perd', 'perdons', 'perdez', 'perdent') },
    { infinitive: 'voir', meaning: 'to see', level: 'A2.1',
      forms: forms('vois', 'vois', 'voit', 'voyons', 'voyez', 'voient') },
  ],

  // ----------------------------------------------------------- concepts --
  concepts: [
    {
      slug: 'mathilde-manquer',
      title: 'Manquer — missing someone',
      subtitle: 'Tu me manques · Ça me manque · Je manque à…',
      category: 'A2.2',
      paragraphs: [
        'In English the person who misses comes first: <em>I miss you</em>. French turns it round. The person or thing that is <strong>missed</strong> is the subject, and the person missing them is an indirect object: <em>Tu me manques</em> is literally “you are missing to me”.',
        'So the verb agrees with what is missed: <em>mon chien me manque</em> (one dog), <em>mes amis me manquent</em> (plural). The person doing the missing sits before the verb as <em>me, te, lui, nous, vous, leur</em>.',
        'To name that person, use <strong>à</strong>: <em>Je vais manquer à Martyn</em> = Martyn is going to miss me. <em>Sa mère lui manque</em> = he/she misses his/her mother.',
        "Missing a bus, a train or an event works like English: <em>j'ai manqué le bus</em> (people also say <em>j'ai raté le bus</em>).",
      ],
      table_rows: [
        { en: 'I miss you', fr: 'Tu me manques' },
        { en: 'I miss it', fr: 'Ça me manque' },
        { en: 'I miss my dog', fr: 'Mon chien me manque' },
        { en: 'I miss my friends', fr: 'Mes amis me manquent' },
        { en: 'She misses her mother', fr: 'Sa mère lui manque' },
        { en: 'We miss you', fr: 'Vous nous manquez' },
        { en: 'Martyn will miss me', fr: 'Je vais manquer à Martyn' },
      ],
      examples: [
        { fr: "L'Angleterre me manque un peu.", en: 'I miss England a bit.' },
        { fr: 'Est-ce que je te manque ?', en: 'Do you miss me?' },
        { fr: 'Tu manques à tes parents.', en: 'Your parents miss you.' },
      ],
      pitfall: {
        title: 'Saying « je te manque » for “I miss you”',
        body: '<em>Je te manque</em> means “you miss me”. Flip it round: the one being missed is the subject. I miss you = <em>tu me manques</em>.',
      },
    },
    {
      slug: 'mathilde-past-stories',
      title: 'Telling a story: passé composé or imparfait?',
      subtitle: 'On a attendu · Il pleuvait',
      category: 'A2.2',
      paragraphs: [
        'Telling Mathilde about your weekend takes two past tenses. The <strong>passé composé</strong> moves the story on — things that happened and finished: <em>On a attendu une heure. On a goûté des huîtres. Je suis tombé.</em>',
        "The <strong>imparfait</strong> paints the background — weather, what things were like, what was going on, and habits: <em>Il pleuvait. C'était bondé. La queue allait jusqu'à la pharmacie. Je tombais quand j'apprenais.</em>",
        "A quick test: if English would say “was …-ing” or “used to”, it's imparfait. If it's one thing that happened, it's passé composé. They often share a sentence: <em>Il pleuvait quand on est arrivés.</em>",
        "Verbs that take <strong>être</strong> in the passé composé include <em>aller, tomber, rentrer</em> and every reflexive verb: <em>on est allés, je suis tombé, je me suis perdue, tu t'es entraîné ?</em>",
      ],
      table_rows: [
        { en: 'It was raining', fr: 'Il pleuvait' },
        { en: 'It was packed', fr: "C'était bondé" },
        { en: 'I used to fall', fr: 'Je tombais' },
        { en: 'We waited', fr: 'On a attendu' },
        { en: 'I got a fine', fr: "J'ai eu une amende" },
        { en: 'I fell', fr: 'Je suis tombé(e)' },
        { en: 'I got lost', fr: 'Je me suis perdu(e)' },
      ],
      examples: [
        { fr: 'Il pleuvait et il y avait un orage, alors on a attendu dans le bar.', en: 'It was raining and there was a storm, so we waited in the bar.' },
        { fr: "Je tombais tout le temps quand j'apprenais le snow.", en: 'I used to fall all the time when I was learning to snowboard.' },
        { fr: 'Pendant que je faisais à manger, Martyn a appelé sa mère.', en: 'While I was cooking, Martyn called his mum.' },
      ],
      pitfall: {
        title: 'Putting the weather in the passé composé',
        body: "<em>Il a plu</em> exists, but it reports the rain as a finished event. When the rain is the backdrop to your story, it's <em>il pleuvait</em>.",
      },
    },
    {
      slug: 'mathilde-telling-time',
      title: 'Telling the time',
      subtitle: 'treize heures trente · une heure et demie',
      category: 'A1.3',
      paragraphs: [
        'French has two ways to give a time. The <strong>24-hour</strong> way — timetables, work, bookings — reads the hours, then the minutes: 13h30 = <em>treize heures trente</em>, 20h45 = <em>vingt heures quarante-cinq</em>.',
        'The <strong>everyday</strong> way uses 1 to 12 with <em>et quart</em> (quarter past), <em>et demie</em> (half past) and <em>moins le quart</em> (quarter to): <em>une heure et demie</em>, <em>neuf heures moins le quart</em>.',
        "After half past, name the <strong>next</strong> hour and count back: 17h40 = <em>six heures moins vingt</em>. Add <em>du matin, de l'après-midi</em> or <em>du soir</em> if it could be either.",
        '<em>Heure(s)</em> is never left out: <em>il est huit heures</em>, not <em>il est huit</em>. To ask: <em>Il est quelle heure ?</em> or <em>À quelle heure… ?</em>',
      ],
      table_rows: TIMES.map(([t, h24, h12]) => ({ en: t, fr: `${h24} · ${h12}` })),
      examples: [
        { fr: 'Le bar ouvre à dix-sept heures.', en: 'The bar opens at 5pm.' },
        { fr: 'On se retrouve à sept heures moins le quart ?', en: 'Shall we meet at quarter to seven?' },
        { fr: "Il est midi et demi, c'est la pause du midi.", en: "It's half past twelve — lunch break." },
      ],
      pitfall: {
        title: 'Forgetting to count back',
        body: 'Quarter to eight (7h45) is <em>huit heures moins le quart</em> — eight minus a quarter. <em>Sept heures moins le quart</em> is 6h45.',
      },
    },
    {
      slug: 'mathilde-contracted-articles',
      title: 'Au, aux, du, des — when articles merge',
      subtitle: 'à + le = au · de + le = du',
      category: 'A1.3',
      paragraphs: [
        "<em>À</em> (to, at) and <em>de</em> (of, from) can't sit next to <em>le</em> or <em>les</em> — they merge: <strong>à + le = au</strong>, <strong>à + les = aux</strong>, <strong>de + le = du</strong>, <strong>de + les = des</strong>.",
        "<em>La</em> and <em>l'</em> never merge: <em>à la pharmacie</em>, <em>à l'hôtel</em>, <em>de la gare</em>, <em>de l'hôtel</em>.",
        "They're all over directions and plans: <em>je vais au bar</em>, <em>à côté du bar</em>, <em>au bout du couloir</em>, <em>on a parlé du festival</em>, <em>je parle aux clients</em>.",
      ],
      table_rows: [
        { en: 'to the bar', fr: 'au bar' },
        { en: 'to the pharmacy', fr: 'à la pharmacie' },
        { en: 'to the hotel', fr: "à l'hôtel" },
        { en: 'to the guests', fr: 'aux clients' },
        { en: 'next to the bar', fr: 'à côté du bar' },
        { en: 'at the end of the corridor', fr: 'au bout du couloir' },
        { en: 'we talked about the festival', fr: 'on a parlé du festival' },
      ],
      examples: [
        { fr: 'On va au cinéma, puis au restaurant.', en: "We're going to the cinema, then to the restaurant." },
        { fr: 'La chambre est au bout du couloir.', en: 'The room is at the end of the corridor.' },
        { fr: 'Elle explique les horaires aux clients.', en: 'She explains the opening times to the guests.' },
      ],
      pitfall: {
        title: 'Saying « à le » or « de le »',
        body: "Before a noun they're always wrong. If you hear yourself say <em>à le bar</em>, merge it: <em>au bar</em>.",
      },
    },
    {
      slug: 'mathilde-should-have',
      title: "J'aurais dû — I should have",
      subtitle: "j'aurais dû + infinitive · ça aurait dû",
      category: 'B1.1',
      paragraphs: [
        "To say what you should have done, use <strong>j'aurais dû</strong> + an infinitive: <em>J'aurais dû partir plus tôt</em> = I should have left earlier. The second verb stays in the infinitive.",
        'Change who it is with <em>avoir</em>: <em>tu aurais dû, il/elle aurait dû, on aurait dû, nous aurions dû, vous auriez dû, ils auraient dû</em>.',
        '<strong>Ça aurait dû</strong> + infinitive = it should have: <em>Ça aurait dû être plus facile</em>. Note the circumflex on <em>dû</em>, which tells it apart from <em>du</em> (some).',
        "The family: <em>je dois</em> (I must), <em>je devrais</em> (I should), <em>j'aurais dû</em> (I should have).",
      ],
      table_rows: [
        { en: 'I must', fr: 'je dois' },
        { en: 'I should', fr: 'je devrais' },
        { en: 'I should have', fr: "j'aurais dû" },
        { en: 'you should have', fr: 'tu aurais dû' },
        { en: 'we should have', fr: 'on aurait dû' },
        { en: 'it should have', fr: 'ça aurait dû' },
      ],
      examples: [
        { fr: "J'aurais dû prendre une carte : je me suis perdue !", en: 'I should have taken a map: I got lost!' },
        { fr: 'On aurait dû réserver.', en: 'We should have booked.' },
        { fr: 'Tu aurais dû me le dire !', en: 'You should have told me!' },
      ],
      pitfall: {
        title: 'A past participle after dû',
        body: "English says “should have <em>left</em>”, so it's tempting to say <em>j'aurais dû parti</em>. French keeps the infinitive: <em>j'aurais dû partir</em>.",
      },
    },
  ],

  // ------------------------------------------------------ grammar notes --
  grammar_notes: [
    {
      title: "Mathilde's notes — August",
      body: `<p>Lessons of 10, 18 and 26 August, tidied up. Tap any French to hear it.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>J'ai eu</em></td><td>I got / I had</td></tr>
        <tr><td class="fr"><em>le loyer</em></td><td>the rent</td></tr>
        <tr><td class="fr"><em>une livraison</em></td><td>a delivery</td></tr>
        <tr><td class="fr"><em>une amende</em></td><td>a fine</td></tr>
        <tr><td class="fr"><em>le faire la semaine prochaine</em></td><td>to do it next week</td></tr>
        <tr><td class="fr"><em>bondé</em></td><td>packed</td></tr>
        <tr><td class="fr"><em>La queue allait jusqu'à la pharmacie.</em></td><td>The queue went all the way to the pharmacy.</td></tr>
        <tr><td class="fr"><em>la pause du midi</em></td><td>the lunch break</td></tr>
        <tr><td class="fr"><em>Pas vraiment.</em></td><td>Not really.</td></tr>
        <tr><td class="fr"><em>faire les valises</em></td><td>to pack</td></tr>
        <tr><td class="fr"><em>hier</em></td><td>yesterday</td></tr>
        <tr><td class="fr"><em>gagner de l'argent</em></td><td>to earn money</td></tr>
        <tr><td class="fr"><em>Le festival est à dix minutes de leur maison.</em></td><td>The festival is ten minutes from their house.</td></tr>
      </table>
      <p><strong>Also covered:</strong> telling the time (13h30, 20h45, 7h45, 18h30, 17h40, 6h45, 18h45, 8h30 — see the <strong>Telling the time</strong> explainer), phone numbers, numbers 1–20, and a first look at <em>vouloir, pouvoir, devoir</em>.</p>`,
    },
    {
      title: "Mathilde's notes — September",
      body: `<p>Lessons of 3, 8, 14 and 23 September.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>On a attendu.</em></td><td>We waited.</td></tr>
        <tr><td class="fr"><em>tard · je suis en retard</em></td><td>late · I'm late</td></tr>
        <tr><td class="fr"><em>tôt · je suis en avance</em></td><td>early · I'm early</td></tr>
        <tr><td class="fr"><em>raconter</em></td><td>to tell (a story)</td></tr>
        <tr><td class="fr"><em>Il pleuvait. Un orage.</em></td><td>It was raining. A storm.</td></tr>
        <tr><td class="fr"><em>notre / nos · votre / vos</em></td><td>our · your</td></tr>
        <tr><td class="fr"><em>mon matelas · un canapé</em></td><td>my mattress · a sofa</td></tr>
        <tr><td class="fr"><em>rattraper · tomber</em></td><td>to catch up · to fall</td></tr>
        <tr><td class="fr"><em>les remontées mécaniques</em></td><td>the ski lifts</td></tr>
        <tr><td class="fr"><em>Je tombais quand j'apprenais.</em></td><td>I used to fall when I was learning.</td></tr>
        <tr><td class="fr"><em>une planche de snow · un snow · des fix</em></td><td>a snowboard · bindings</td></tr>
        <tr><td class="fr"><em>faire du shopping · faire les magasins · faire les courses</em></td><td>to go shopping · to go round the shops · to do the food shopping</td></tr>
        <tr><td class="fr"><em>On a besoin de… · on doit…</em></td><td>We need… · we must…</td></tr>
        <tr><td class="fr"><em>voir · regarder</em></td><td>to see · to watch, look at</td></tr>
        <tr><td class="fr"><em>avant d'aller dormir</em></td><td>before going to sleep</td></tr>
        <tr><td class="fr"><em>Ça fait peur. Tu as le vertige.</em></td><td>It's scary. You're scared of heights.</td></tr>
        <tr><td class="fr"><em>une tyrolienne</em></td><td>a zip line</td></tr>
        <tr><td class="fr"><em>Ça me manque. Tu me manques.</em></td><td>I miss it. I miss you.</td></tr>
        <tr><td class="fr"><em>la dernière fois · hier soir</em></td><td>last time · last night</td></tr>
        <tr><td class="fr"><em>Le bar est ouvert tous les jours pendant l'intersaison.</em></td><td>The bar is open every day in the off-season.</td></tr>
        <tr><td class="fr"><em>Nous ne pouvons plus y aller.</em></td><td>We can't go there anymore.</td></tr>
        <tr><td class="fr"><em>C'était ton jour de chance.</em></td><td>It was your lucky day.</td></tr>
        <tr><td class="fr"><em>Comment tu dis… ?</em></td><td>How do you say…?</td></tr>
        <tr><td class="fr"><em>notre objectif</em></td><td>our goal</td></tr>
        <tr><td class="fr"><em>Est-ce que tu t'es entraîné ?</em></td><td>Did you train?</td></tr>
        <tr><td class="fr"><em>avoir la gueule de bois</em></td><td>to have a hangover</td></tr>
        <tr><td class="fr"><em>On a gagné · on a perdu · on a perdu quand même</em></td><td>We won · we lost · we lost anyway</td></tr>
        <tr><td class="fr"><em>On a goûté des huîtres. Une dégustation de vin.</em></td><td>We tried oysters. A wine tasting.</td></tr>
        <tr><td class="fr"><em>On a prévu de voir…</em></td><td>We've planned to see…</td></tr>
        <tr><td class="fr"><em>le temps · une fois</em></td><td>time (amount) · one time (occasion)</td></tr>
        <tr><td class="fr"><em>surtout · un paysage · n'importe quoi</em></td><td>especially · a landscape · anything</td></tr>
        <tr><td class="fr"><em>Je prends en photo tout ce qui est beau.</em></td><td>I take photos of everything beautiful.</td></tr>
        <tr><td class="fr"><em>rencontrer · qu'est-ce que</em></td><td>to meet · what</td></tr>
      </table>`,
    },
    {
      title: "Mathilde's notes — October",
      body: `<p>Lessons of 7 and 15 October.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>pendant que</em></td><td>while</td></tr>
        <tr><td class="fr"><em>Quoi de neuf ? — Rien.</em></td><td>What's new? — Nothing.</td></tr>
        <tr><td class="fr"><em>à + le = au</em></td><td>contracted article: <em>je vais au bar</em></td></tr>
        <tr><td class="fr"><em>Je vais mieux manger.</em></td><td>I'm going to eat better.</td></tr>
        <tr><td class="fr"><em>une course · les courses</em></td><td>a race · the food shopping</td></tr>
        <tr><td class="fr"><em>un cours · les cours</em></td><td>a lesson · lessons</td></tr>
        <tr><td class="fr"><em>On prend des cours de français.</em></td><td>We're taking French lessons.</td></tr>
        <tr><td class="fr"><em>pour</em></td><td>in order to / for</td></tr>
        <tr><td class="fr"><em>Je me suis perdue.</em></td><td>I got lost.</td></tr>
        <tr><td class="fr"><em>J'aurais dû… · ça aurait dû…</em></td><td>I should have… · it should have…</td></tr>
        <tr><td class="fr"><em>commencer</em></td><td>to start</td></tr>
        <tr><td class="fr"><em>Quand est-ce que tu es dispo ?</em></td><td>When are you free?</td></tr>
      </table>
      <p><strong>Lois at the hotel:</strong> walk-ins without a booking, where the room is, questions about rooms and breakfast, and the other door with the code when the bar is closed. See the hotel role-plays and the <strong>Hotel &amp; bar</strong> Daily 10.</p>`,
    },
    {
      title: 'Easily confused pairs',
      body: `<table class="gr-table">
        <tr><th class="fr">French</th><th>Use it for</th></tr>
        <tr><td class="fr"><em>voir</em></td><td>to see — it just happens: <em>J'ai vu Mathilde au marché.</em></td></tr>
        <tr><td class="fr"><em>regarder</em></td><td>to watch, to look at — on purpose: <em>On regarde un film.</em></td></tr>
        <tr><td class="fr"><em>le temps</em></td><td>time as an amount: <em>Je n'ai pas le temps.</em></td></tr>
        <tr><td class="fr"><em>une fois</em></td><td>one time, an occasion: <em>la première fois, deux fois par semaine</em></td></tr>
        <tr><td class="fr"><em>un cours</em></td><td>a lesson: <em>un cours de français</em></td></tr>
        <tr><td class="fr"><em>une course</em></td><td>a race (or an errand): <em>Il a gagné la course.</em></td></tr>
        <tr><td class="fr"><em>faire les courses</em></td><td>food shopping</td></tr>
        <tr><td class="fr"><em>faire les magasins / du shopping</em></td><td>shopping for fun, clothes</td></tr>
        <tr><td class="fr"><em>tôt / tard</em></td><td>early / late in the day: <em>Il est tard.</em></td></tr>
        <tr><td class="fr"><em>en avance / en retard</em></td><td>early / late for something: <em>Je suis en retard.</em></td></tr>
        <tr><td class="fr"><em>rencontrer</em></td><td>meet for the first time</td></tr>
        <tr><td class="fr"><em>retrouver</em></td><td>meet up with someone you know</td></tr>
        <tr><td class="fr"><em>gagner</em></td><td>to win — and to earn: <em>gagner de l'argent</em></td></tr>
        <tr><td class="fr"><em>on a besoin de</em></td><td>we need: <em>On a besoin de pain.</em></td></tr>
        <tr><td class="fr"><em>on doit</em></td><td>we must, we have to: <em>On doit partir.</em></td></tr>
      </table>`,
    },
    {
      title: 'How often? Frequency words',
      body: `<p>From most to least often. They usually go straight after the verb: <em>Je vais souvent à Genève.</em></p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>toujours</em></td><td>always</td></tr>
        <tr><td class="fr"><em>tous les jours</em></td><td>every day</td></tr>
        <tr><td class="fr"><em>souvent</em></td><td>often</td></tr>
        <tr><td class="fr"><em>deux fois par semaine</em></td><td>twice a week</td></tr>
        <tr><td class="fr"><em>parfois / quelquefois</em></td><td>sometimes</td></tr>
        <tr><td class="fr"><em>de temps en temps</em></td><td>from time to time</td></tr>
        <tr><td class="fr"><em>rarement</em></td><td>rarely</td></tr>
        <tr><td class="fr"><em>ne… jamais</em></td><td>never</td></tr>
      </table>
      <p><em>Jamais</em> wraps round the verb like <em>pas</em>: <em>Je ne bois jamais de café le soir.</em> In a time phrase, <em>tous les jours</em> and <em>une fois par semaine</em> usually go at the end.</p>`,
    },
    {
      title: 'Être or avoir in the past?',
      body: `<p>Most verbs build the passé composé with <strong>avoir</strong>: <em>on a attendu, j'ai eu, on a goûté, on a gagné</em>.</p>
      <p>A short list uses <strong>être</strong> — mostly movement and change: <em>aller, venir, partir, arriver, rentrer, tomber, rester</em>. And every <strong>reflexive</strong> verb: <em>se perdre, s'entraîner, se coucher, se lever</em>.</p>
      <table class="gr-table">
        <tr><th class="fr">French</th><th>English</th></tr>
        <tr><td class="fr"><em>On est allés au bar.</em></td><td>We went to the bar.</td></tr>
        <tr><td class="fr"><em>Je suis tombé.</em></td><td>I fell.</td></tr>
        <tr><td class="fr"><em>Je me suis perdue.</em></td><td>I got lost.</td></tr>
        <tr><td class="fr"><em>Tu t'es entraîné ?</em></td><td>Did you train?</td></tr>
        <tr><td class="fr"><em>On s'est couchés tard.</em></td><td>We went to bed late.</td></tr>
      </table>
      <p>With être the ending agrees with the person: Lois says <em>je suis tombée</em>, <em>je me suis perdue</em>. You can't hear it — it only shows when written.</p>`,
    },
    {
      title: 'Saying phone numbers',
      body: `<p>French phone numbers have ten digits and are said in <strong>pairs</strong>: 06 39 98 77 14 is <em>zéro six, trente-neuf, quatre-vingt-dix-huit, soixante-dix-sept, quatorze</em>.</p>
      <p>That makes every number from 0 to 99 matter, and the hard ones are 70–99:</p>
      <table class="gr-table">
        <tr><th>Number</th><th class="fr">French</th></tr>
        <tr><td>70, 71, 77</td><td class="fr"><em>soixante-dix, soixante et onze, soixante-dix-sept</em></td></tr>
        <tr><td>80, 81, 86</td><td class="fr"><em>quatre-vingts, quatre-vingt-un, quatre-vingt-six</em></td></tr>
        <tr><td>90, 92, 98</td><td class="fr"><em>quatre-vingt-dix, quatre-vingt-douze, quatre-vingt-dix-huit</em></td></tr>
        <tr><td>11–16</td><td class="fr"><em>onze, douze, treize, quatorze, quinze, seize</em></td></tr>
        <tr><td>17–19</td><td class="fr"><em>dix-sept, dix-huit, dix-neuf</em></td></tr>
      </table>
      <p>To ask: <em>C'est quoi ton numéro ?</em> (friendly) or <em>Quel est votre numéro de téléphone ?</em> (polite).</p>`,
    },
  ],

  // ------------------------------------------------------------ stories --
  stories: [
    {
      slug: 'mathilde-journee-compliquee',
      title: 'Une journée compliquée',
      blurb: 'A bad day of errands — fines, queues and a late delivery. Press Read aloud and listen first.',
      level: 'A2',
      tags: ['passé composé', 'imparfait', 'daily life', 'listening'],
      focus: [
        "<em>J'ai eu, on a attendu, il est arrivé</em> — passé composé for what happened",
        "<em>Il pleuvait, c'était bondé, la queue allait</em> — imparfait for the scene",
        'Telling the time: <em>à six heures moins le quart</em>',
      ],
      body: `
      <p>[[Lundi dernier|Last Monday]], [[j'ai eu|I had|passé composé of avoir]] une journée [[compliquée|complicated]]. [[D'abord|First]], j'ai trouvé une [[amende|fine]] sur la voiture : [[quarante-cinq euros|forty-five euros]] ! [[Ensuite|Then]], j'ai payé [[le loyer|the rent]], et mon compte était presque [[vide|empty]].</p>
      <p>[[Pendant la pause du midi|During the lunch break]], je suis allé [[à la pharmacie|to the pharmacy]]. [[C'était bondé|It was packed|imparfait: describing the scene]] ! [[La queue allait jusqu'à|The queue went all the way to]] la boulangerie. [[On a attendu|We waited|attendre already means to wait for]] vingt minutes.</p>
      <p>[[L'après-midi|In the afternoon]], [[j'attendais|I was waiting for|imparfait: something in progress]] une [[livraison|delivery]] : un nouveau [[matelas|mattress]]. Le livreur devait arriver [[à quatorze heures|at 2pm]]… Il est arrivé [[à six heures moins le quart|at quarter to six]] ! Il était [[en retard|late]], mais il était très [[sympa|nice]].</p>
      <p>[[Le soir|In the evening]], [[il pleuvait|it was raining]] et [[il y avait un orage|there was a storm]]. On a regardé un film [[sur le canapé|on the sofa]], et [[avant d'aller dormir|before going to sleep|avant de + infinitive]], j'ai essayé le nouveau matelas. [[Parfait|Perfect]] ! [[Finalement|In the end]], ce n'était pas une si mauvaise journée.</p>
      `,
      translation: `
      <p>Last Monday I had a complicated day. First, I found a fine on the car: forty-five euros! Then I paid the rent, and my account was almost empty.</p>
      <p>During the lunch break I went to the pharmacy. It was packed! The queue went all the way to the bakery. We waited twenty minutes.</p>
      <p>In the afternoon I was waiting for a delivery: a new mattress. The delivery man was supposed to arrive at 2pm… He arrived at quarter to six! He was late, but he was very nice.</p>
      <p>In the evening it was raining and there was a storm. We watched a film on the sofa, and before going to sleep I tried the new mattress. Perfect! In the end, it wasn't such a bad day.</p>
      `,
    },
    {
      slug: 'mathilde-semaine-sud',
      title: 'Une semaine dans le sud',
      blurb: 'Oysters, a wine tasting and getting lost — the trip south, told by Lois.',
      level: 'A2',
      tags: ['passé composé', 'travel', "j'aurais dû", 'listening'],
      focus: [
        '<em>On a goûté, on a rencontré, je me suis perdue</em> — passé composé, with être for reflexive verbs',
        "<em>J'aurais dû, on aurait dû</em> — should have",
        '<em>Le temps</em> vs <em>une fois</em>',
      ],
      body: `
      <p>[[Le mois dernier|Last month]], on est partis [[dans le sud|to the south]] pour une semaine. [[Avant de partir|Before leaving]], on a [[fait les valises|packed|faire les valises = to pack]] en dix minutes… [[On aurait dû|We should have|conditional past of devoir]] prendre plus de temps : j'ai oublié mon [[maillot de bain|swimsuit]] !</p>
      <p>[[Les paysages|The scenery]] étaient magnifiques, [[surtout|especially]] [[au bord de la mer|by the sea]]. Je [[prends en photo|take photos of]] [[tout ce qui est beau|everything that's beautiful]], alors j'ai pris trois cents photos !</p>
      <p>[[Un jour|One day]], on a [[goûté des huîtres|tried oysters|goûter = to taste, to try]]. [[La première fois|The first time|une fois = an occasion]], c'était [[bizarre|strange]], mais [[la deuxième fois|the second time]], j'ai adoré. [[Le lendemain|The next day]], on a fait [[une dégustation de vin|a wine tasting]] dans un petit [[domaine|wine estate]]. On a [[rencontré|met|rencontrer = to meet for the first time]] un couple de Lyon, très sympa.</p>
      <p>[[Le dernier jour|On the last day]], [[on avait prévu de voir|we had planned to see]] un vieux village. Mais [[je me suis perdue|I got lost|reflexive verbs take être; perdue agrees with Lois]] dans les petites rues ! [[J'aurais dû|I should have]] prendre une carte. [[On n'a pas eu le temps|We didn't have time|le temps = time as an amount]] de tout voir, mais [[ce n'est pas grave|it doesn't matter]] : on va [[revenir|come back]] !</p>
      `,
      translation: `
      <p>Last month we went south for a week. Before leaving, we packed in ten minutes… We should have taken more time: I forgot my swimsuit!</p>
      <p>The scenery was beautiful, especially by the sea. I take photos of everything that's beautiful, so I took three hundred photos!</p>
      <p>One day we tried oysters. The first time it was strange, but the second time I loved it. The next day we did a wine tasting at a small wine estate. We met a couple from Lyon, really nice.</p>
      <p>On the last day we had planned to see an old village. But I got lost in the little streets! I should have taken a map. We didn't have time to see everything, but it doesn't matter: we're going to come back!</p>
      `,
    },
    {
      slug: 'mathilde-saison-snow',
      title: 'Ma première saison de snow',
      blurb: "Falling, catching up, a packed bar and missing the dog — Martyn's season so far.",
      level: 'A2',
      tags: ['imparfait', 'manquer', 'mountains', 'listening'],
      focus: [
        "<em>Je tombais quand j'apprenais</em> — imparfait for habits",
        '<em>Mon chien me manque</em> — manquer, back to front',
        '<em>Ne… plus, ne… jamais</em>',
      ],
      body: `
      <p>[[Quand on est arrivés à Morzine|When we arrived in Morzine]], je ne savais pas faire du snow. [[Je tombais|I used to fall|imparfait: something that kept happening]] [[tout le temps|all the time]] [[quand j'apprenais|when I was learning]] ! Mes [[fix|bindings|short for fixations]] étaient mal réglées, et [[les remontées mécaniques|the ski lifts]], [[ça faisait peur|that was scary]].</p>
      <p>[[Aujourd'hui|Today]], ça va mieux. Je [[m'entraîne|practise|s'entraîner = to train, to practise]] [[deux fois par semaine|twice a week]] avec Lois. Elle skie depuis longtemps, alors [[j'essaie de la rattraper|I try to catch up with her|rattraper = to catch up]] sur les pistes. [[Je n'y arrive jamais|I never manage it|ne… jamais = never]] !</p>
      <p>[[Hier soir|Last night]], il y avait [[une soirée|a party]] au bar. Le bar est [[ouvert tous les jours|open every day]] [[pendant l'intersaison|during the off-season]], mais hier, [[c'était bondé|it was packed]]. On est rentrés [[très tard|very late]]… et ce matin, j'ai [[la gueule de bois|a hangover]] !</p>
      <p>[[Mon chien me manque|I miss my dog|manquer: the one missed is the subject]] — il est [[chez ma mère|at my mum's]] en Angleterre. Mais [[je ne veux plus|I don't want … anymore|ne… plus = not anymore]] partir d'ici : les montagnes, c'est ma maison maintenant.</p>
      `,
      translation: `
      <p>When we arrived in Morzine, I couldn't snowboard. I used to fall all the time when I was learning! My bindings were badly set, and the ski lifts — they were scary.</p>
      <p>Today it's going better. I practise twice a week with Lois. She's been skiing for a long time, so I try to catch up with her on the slopes. I never manage it!</p>
      <p>Last night there was a party at the bar. The bar is open every day during the off-season, but yesterday it was packed. We got home very late… and this morning I have a hangover!</p>
      <p>I miss my dog — he's at my mum's in England. But I don't want to leave here anymore: the mountains are my home now.</p>
      `,
    },
  ],

  // ----------------------------------------------------------- workbook --
  workbook_chapters: [
    {
      slug: 'mathilde-ch16',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 16,
      title: 'Telling the time & numbers',
      subtitle: "Mathilde's eight times, both ways — plus numbers 1–20 and phone numbers",
      level: 'A1.3',
      rule: {
        heading: 'Two ways to say a time',
        paras: [
          "The <strong>24-hour</strong> way reads the hours, then the minutes: 18h45 = <em>dix-huit heures quarante-cinq</em>. It's what you hear on timetables and at work.",
          'The <strong>everyday</strong> way uses 1–12 with <em>et quart, et demie, moins le quart</em>. After half past, name the next hour and count back: 18h45 = <em>sept heures moins le quart</em>.',
          'Phone numbers are read in pairs, so you need every number from 0 to 99 — the teens most of all.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'time-24h',
          title: 'The 24-hour way',
          instructions: 'Write the time in words, the 24-hour way — as a timetable or a booking would say it.',
          questions: TIMES.map(([t, h24]) => typed(`${t} → Il est ___.`, h24, { acceptable: [`il est ${h24}`] })),
        },
        {
          slug: 'time-everyday',
          title: 'The everyday way',
          instructions: "Now the way you'd say it to a friend: 1–12, with <em>et quart, et demie, moins le quart</em>.",
          questions: TIMES.map(([t, , h12]) => typed(`${t} → Il est ___.`, h12, {
            acceptable: [`il est ${h12}`],
            hint: h12.includes('moins') ? 'After half past: next hour, then count back.' : '',
          })),
        },
        {
          slug: 'numbers-1-20',
          title: 'Numbers 1–20',
          instructions: 'Write the number in words. The teens are the ones to get automatic.',
          questions: [
            [3, 'trois'], [6, 'six'], [9, 'neuf'], [11, 'onze'], [12, 'douze'], [13, 'treize'],
            [14, 'quatorze'], [15, 'quinze'], [16, 'seize'], [17, 'dix-sept'], [18, 'dix-huit'],
            [19, 'dix-neuf'], [20, 'vingt'],
          ].map(([n, w]) => typed(`${n} → ___`, w)),
        },
        {
          slug: 'phone-numbers',
          title: 'Phone numbers',
          instructions: "Say each one out loud first, then pick the number you'd write down.",
          questions: [
            choice('« Zéro six, trente-neuf, quatre-vingt-dix-huit, soixante-dix-sept, quatorze »',
              ['06 39 98 77 14', '06 39 98 67 14', '06 39 98 77 40', '06 29 98 77 14']),
            choice('« Zéro sept, quinze, quatre-vingt-douze, quarante-quatre, soixante-dix »',
              ['07 15 92 44 70', '07 50 92 44 70', '07 15 82 44 70', '07 15 92 44 60']),
            choice('« Zéro six, onze, dix-sept, treize, dix-neuf »',
              ['06 11 17 13 19', '06 12 17 13 19', '06 11 16 13 19', '06 11 17 03 19']),
            choice('« Zéro quatre, soixante-cinq, soixante et onze, douze, seize »',
              ['04 65 71 12 16', '04 65 61 12 16', '04 75 71 12 16', '04 65 71 12 06']),
            choice('« Zéro six, trente-neuf, quatre-vingt-dix-huit, quatre-vingts, quatre-vingt-dix-neuf »',
              ['06 39 98 80 99', '06 39 98 20 99', '06 39 98 80 89', '06 39 88 80 99']),
          ],
        },
      ],
    },
    {
      slug: 'mathilde-ch17',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 17,
      title: 'Telling stories in the past',
      subtitle: 'On a attendu, il pleuvait — what happened, and what it was like',
      level: 'A2.2',
      rule: {
        heading: 'Passé composé moves the story; imparfait sets the scene',
        paras: [
          "What happened, once and finished: <strong>passé composé</strong> — <em>on a attendu, j'ai eu une amende, on a goûté des huîtres</em>.",
          "Background, descriptions, habits, “was …-ing”: <strong>imparfait</strong> — <em>il pleuvait, c'était bondé, je tombais quand j'apprenais</em>.",
          'Verbs of movement like <em>aller</em> and <em>tomber</em>, and all reflexive verbs, take <em>être</em>: <em>on est allés, je suis tombé, je me suis perdue</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'passe-compose',
          title: 'What happened — passé composé',
          instructions: 'Put the verb in brackets into the passé composé. Write both parts, e.g. <em>a attendu</em>.',
          questions: [
            typed('Hier, on ___ une heure. (attendre)', 'a attendu'),
            typed("J'___ une amende la semaine dernière. (avoir)", 'ai eu'),
            typed('On ___ des huîtres. (goûter)', 'a goûté'),
            typed('On ___ le premier match ! (gagner)', 'a gagné'),
            typed('On ___ quand même. (perdre)', 'a perdu'),
            typed('Nous ___ un couple très sympa. (rencontrer)', 'avons rencontré'),
            typed('Je ___ trois fois sur la piste. (tomber)', 'suis tombé', {
              acceptable: ['suis tombée'], hint: 'Tomber takes être.' }),
            typed('Hier soir, on ___ au bar. (aller)', 'est allés', {
              acceptable: ['est allé', 'est allées', 'est allée'], hint: 'Aller takes être.' }),
            typed('Je me ___ en ville. (se perdre)', 'suis perdu', {
              acceptable: ['suis perdue'], hint: 'Reflexive verbs take être.' }),
            typed("Est-ce que tu ___ ce week-end ? (s'entraîner)", "t'es entraîné", {
              acceptable: ["t'es entraînée"], hint: 'Keep the reflexive pronoun.' }),
          ],
        },
        {
          slug: 'imparfait',
          title: 'Setting the scene — imparfait',
          instructions: 'Put the verb in brackets into the imparfait.',
          questions: [
            typed('Il ___ quand on est arrivés. (pleuvoir)', 'pleuvait'),
            typed("C'___ bondé. (être)", 'était'),
            typed("La queue ___ jusqu'à la pharmacie. (aller)", 'allait'),
            typed("Je ___ tout le temps quand j'apprenais. (tomber)", 'tombais'),
            typed('Il y ___ un orage. (avoir)', 'avait'),
            typed('Les paysages ___ magnifiques. (être)', 'étaient'),
            typed('Pendant que je ___ à manger, il a commencé à pleuvoir. (faire)', 'faisais'),
            typed("Quand j'___ petit, j'adorais la neige. (être)", 'étais'),
          ],
        },
        {
          slug: 'which-tense',
          title: 'Which tense?',
          instructions: 'Something that happened, or the background? Pick the right form.',
          questions: [
            choice('Il ___ quand on est arrivés.', ['pleuvait', 'a plu'],
              'The rain is the backdrop when you arrived → imparfait.'),
            choice('Hier, je ___ trois fois.', ['suis tombé', 'tombais'],
              'Three falls yesterday, all finished → passé composé.'),
            choice("Quand j'apprenais, je ___ tout le temps.", ['tombais', 'suis tombé'],
              '“Used to, all the time” → imparfait.'),
            choice("C'___ bondé, il y avait du monde partout.", ['était', 'a été'],
              'Describing what it was like → imparfait.'),
            choice('Soudain, mon téléphone ___.', ['a sonné', 'sonnait'],
              'Soudain (suddenly) marks an event → passé composé.'),
            choice('On ___ une heure, puis on est partis.', ['a attendu', 'attendait'],
              'A wait with a clear end, then the next event → passé composé.'),
            choice("Pendant qu'on ___ le film, il y a eu un orage.", ['regardait', 'a regardé'],
              'What was going on when the storm hit → imparfait.'),
          ],
        },
        {
          slug: 'translate',
          title: 'Say it in French',
          instructions: 'Translate. Say it out loud before you type it.',
          questions: [
            typed('We tried oysters.', 'On a goûté des huîtres.', {
              acceptable: ['nous avons goûté des huîtres'] }),
            typed('It was raining and there was a storm.', 'Il pleuvait et il y avait un orage.'),
            typed('We waited for an hour.', 'On a attendu une heure.', {
              acceptable: ['nous avons attendu une heure', 'on a attendu pendant une heure', 'nous avons attendu pendant une heure'] }),
            typed('It was your lucky day!', "C'était ton jour de chance !", {
              acceptable: ["c'était votre jour de chance"] }),
            typed('I got lost in town.', 'Je me suis perdu en ville.', {
              acceptable: ['je me suis perdue en ville'] }),
            typed('We lost anyway.', 'On a perdu quand même.', {
              acceptable: ['nous avons perdu quand même'] }),
          ],
        },
      ],
    },
    {
      slug: 'mathilde-ch18',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 18,
      title: 'Manquer — missing people and places',
      subtitle: 'Tu me manques, ça me manque, je vais manquer à Martyn',
      level: 'A2.2',
      rule: {
        heading: 'The one who is missed is the subject',
        paras: [
          '<em>Tu me manques</em> — you are missing to me — I miss you. The verb agrees with the person or thing that is missed.',
          'The person doing the missing is <em>me, te, lui, nous, vous, leur</em> before the verb, or <em>à</em> + a name after it: <em>je vais manquer à Martyn</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'who-misses-whom',
          title: 'Who misses whom?',
          instructions: 'Pick what each sentence means. Read it back to front.',
          questions: [
            choice('« Tu me manques »', ['I miss you', 'You miss me']),
            choice('« Je te manque »', ['You miss me', 'I miss you']),
            choice('« Sa mère lui manque »', ['He misses his mother', 'His mother misses him']),
            choice('« Je vais manquer à Martyn »', ['Martyn is going to miss me', "I'm going to miss Martyn"]),
            choice('« Vous nous manquez »', ['We miss you', 'You miss us']),
            choice('« Tu manques à tes parents »', ['Your parents miss you', 'You miss your parents']),
          ],
        },
        {
          slug: 'fill-the-gap',
          title: 'Fill the gap',
          instructions: 'One word each.',
          questions: [
            typed('Mon chien ___ manque. (I miss my dog.)', 'me'),
            typed('Mes amis me ___. (I miss my friends.)', 'manquent'),
            typed('Tu ___ manques. (I miss you.)', 'me'),
            typed('Sa mère ___ manque. (She misses her mother.)', 'lui'),
            typed("L'Angleterre ___ manque. (We miss England.)", 'nous'),
            typed('Je vais manquer ___ Martyn. (Martyn will miss me.)', 'à'),
            typed('Est-ce que je te ___ ? (Do you miss me?)', 'manque'),
            typed('Vous nous ___ ! (We miss you!)', 'manquez'),
          ],
        },
        {
          slug: 'translate',
          title: 'Say it in French',
          instructions: 'Translate, and say each one out loud.',
          questions: [
            typed('I miss you.', 'Tu me manques.'),
            typed('I miss my dog.', 'Mon chien me manque.'),
            typed('I miss it.', 'Ça me manque.'),
            typed('My friends miss me.', 'Je manque à mes amis.'),
            typed('She misses her mother.', 'Sa mère lui manque.'),
            typed('I missed the bus.', "J'ai manqué le bus.", { acceptable: ["j'ai raté le bus"] }),
          ],
        },
      ],
    },
    {
      slug: 'mathilde-ch19',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 19,
      title: 'Can, want, must — your week',
      subtitle: "Pouvoir, vouloir, devoir from a timetable — and j'aurais dû",
      level: 'A2.1',
      rule: {
        heading: 'Pouvoir, vouloir, devoir + infinitive',
        paras: [
          '<em>Je peux</em> (I can), <em>je veux</em> (I want), <em>je dois</em> (I must) — each followed by an infinitive: <em>je dois travailler</em>.',
          'In full: <em>peux, peux, peut, pouvons, pouvez, peuvent</em> · <em>veux, veux, veut, voulons, voulez, veulent</em> · <em>dois, dois, doit, devons, devez, doivent</em>.',
          "For regrets: <em>j'aurais dû</em> + infinitive = I should have. <em>Ça aurait dû être plus facile.</em>",
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'timetable',
          title: "Lois's week",
          instructions: "Lois's timetable: <strong>Monday</strong> works at the hotel 17h–23h · <strong>Tuesday</strong> evening free · <strong>Wednesday</strong> French lesson at 18h30 · <strong>Thursday</strong> works 7h–15h · <strong>Saturday</strong> festival, which she'd love to go to. Fill in <em>peut, veut</em> or <em>doit</em> (or another form) — then say each sentence out loud.",
          questions: [
            typed("Lundi soir, Lois ___ travailler à l'hôtel.", 'doit'),
            typed('Mardi soir, elle ___ venir au restaurant : elle est libre.', 'peut'),
            typed('Samedi, elle ___ aller au festival.', 'veut'),
            typed('Mercredi, elle ___ aller au cours de français à six heures et demie.', 'doit'),
            typed('Jeudi matin, elle ne ___ pas faire de snow : elle travaille.', 'peut'),
            typed('Lois et Martyn ___ aller au festival ensemble. (want)', 'veulent'),
            typed('Nous ___ faire les courses avant samedi. (must)', 'devons'),
            typed("Vous ___ utiliser l'autre porte avec le code. (can)", 'pouvez'),
            typed('Tu ___ venir jeudi ? (can)', 'peux'),
            typed("Je ___ gagner plus d'argent cet hiver. (want)", 'veux'),
          ],
        },
        {
          slug: 'should-have',
          title: "Should have — j'aurais dû",
          instructions: 'Fill the gap.',
          questions: [
            typed("J'___ réserver. (I should have booked.)", 'aurais dû'),
            typed('On ___ partir plus tôt. (We should have left earlier.)', 'aurait dû'),
            typed('Ça ___ être plus facile. (It should have been easier.)', 'aurait dû'),
            typed('Tu ___ me le dire ! (You should have told me!)', 'aurais dû'),
            typed("J'aurais dû ___ une carte. (I should have taken a map.)", 'prendre', {
              hint: 'The second verb stays in the infinitive.' }),
          ],
        },
        {
          slug: 'translate',
          title: 'Say it in French',
          instructions: 'Translate, then say it out loud as if you were planning your week with Mathilde.',
          questions: [
            typed("I can't come on Tuesday.", 'Je ne peux pas venir mardi.'),
            typed('Do you want to go to the festival?', 'Tu veux aller au festival ?', {
              acceptable: ['est-ce que tu veux aller au festival', 'vous voulez aller au festival'] }),
            typed('We need bread.', 'On a besoin de pain.', { acceptable: ['nous avons besoin de pain'] }),
            typed("We can't go there anymore.", 'Nous ne pouvons plus y aller.', {
              acceptable: ['on ne peut plus y aller'] }),
            typed('We have to pack tonight.', 'On doit faire les valises ce soir.', {
              acceptable: ['nous devons faire les valises ce soir'] }),
          ],
        },
      ],
    },
    {
      slug: 'mathilde-ch20',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 20,
      title: 'The little words',
      subtitle: 'au, du, notre, vos, pour, avant de, pendant que',
      level: 'A1.3',
      rule: {
        heading: 'Small words that hold sentences together',
        paras: [
          "<strong>à + le = au</strong>, <strong>à + les = aux</strong>, <strong>de + le = du</strong>, <strong>de + les = des</strong>. <em>La</em> and <em>l'</em> never merge.",
          '<em>Notre / votre</em> for one thing, <em>nos / vos</em> for more than one.',
          '<em>Pour</em> + infinitive = in order to. <em>Avant de</em> + infinitive = before …-ing. <em>Pendant que</em> = while.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'au-a-la',
          title: "au, à la, à l', aux",
          instructions: 'Fill the gap.',
          questions: [
            typed('Je vais ___ cinéma.', 'au'),
            typed('On va ___ pharmacie.', 'à la'),
            typed('Elle travaille ___ hôtel.', "à l'"),
            typed('Je parle ___ clients.', 'aux'),
            typed('On va ___ festival samedi.', 'au'),
            typed('La chambre est ___ deuxième étage.', 'au'),
            typed('On prend des cours ___ maison.', 'à la'),
          ],
        },
        {
          slug: 'du-de-la',
          title: "du, de la, de l'",
          instructions: 'Fill the gap.',
          questions: [
            typed('La salle est à côté ___ bar.', 'du'),
            typed('On a parlé ___ festival.', 'du'),
            typed('La chambre est au bout ___ couloir.', 'du'),
            typed('Je reviens ___ pharmacie.', 'de la'),
            typed("C'est loin ___ hôtel ?", "de l'"),
            typed('Le mot de passe ___ wifi est sur la carte.', 'du'),
          ],
        },
        {
          slug: 'notre-votre',
          title: 'notre / nos, votre / vos',
          instructions: 'One thing or more than one?',
          questions: [
            choice("C'est ___ maison.", ['notre', 'nos']),
            choice('Ce sont ___ amis.', ['nos', 'notre']),
            choice('Voici ___ clé, madame.', ['votre', 'vos']),
            choice('Voici ___ clés, monsieur.', ['vos', 'votre']),
            choice("___ objectif, c'est de parler français.", ['Notre', 'Nos']),
            choice('Où sont ___ valises, madame ?', ['vos', 'votre']),
          ],
        },
        {
          slug: 'linking-words',
          title: 'pour, avant de, pendant',
          instructions: 'Fill the gap.',
          questions: [
            typed('On prend des cours ___ parler avec nos voisins. (in order to)', 'pour'),
            typed('Je lis un peu avant ___ dormir. (before)', 'de'),
            typed('Avant ___ aller dormir, je regarde un film.', "d'"),
            typed('Je fais à manger ___ tu fais les courses. (while)', 'pendant que'),
            typed("Le bar est ouvert tous les jours ___ l'intersaison. (during)", 'pendant'),
          ],
        },
      ],
    },
    {
      slug: 'mathilde-ch21',
      book: 'II',
      book_title: 'Lessons with Mathilde',
      num: 21,
      title: 'At the hotel desk',
      subtitle: 'Walk-ins, rooms, breakfast and the door code',
      level: 'A2.2',
      rule: {
        heading: 'Polite, short and clear',
        paras: [
          "With guests, use <em>vous</em>: <em>Vous avez une réservation ? Vous pouvez utiliser l'autre porte.</em>",
          "Buy time with <em>Un instant, je vais vérifier</em>. Say what's left with <em>il nous reste…</em>, and that you're full with <em>c'est complet</em>.",
          'Directions: <em>au deuxième étage, à gauche, au bout du couloir, à côté du bar</em>.',
        ],
      },
      vocab: [],
      exercises: [
        {
          slug: 'what-would-you-say',
          title: 'What would you say?',
          instructions: 'Pick what Lois would say to the guest.',
          questions: [
            choice('A couple walks in without a booking. You ask if they have a reservation:',
              ['Vous avez une réservation ?', 'Vous avez réservé une table ?', 'Vous êtes complet ?']),
            choice("You need a moment to check what's free:",
              ['Un instant, je vais vérifier.', 'Je vais vérifier demain.', 'Vous pouvez vérifier ?']),
            choice("There's one room left:",
              ['Il nous reste une chambre.', 'Nous restons une chambre.', 'La chambre reste à nous.']),
            choice('The hotel is full:',
              ["Je suis désolée, c'est complet.", "Je suis désolée, c'est fermé.", 'Je suis désolée, je suis pleine.'],
              "<em>Je suis pleine</em> means you've eaten too much — not that the hotel is full."),
            choice('Telling them where breakfast is:',
              ['Le petit-déjeuner est dans la salle à côté du bar.', 'Le petit-déjeuner est à côté de le bar.', 'Le déjeuner est dans le bar.']),
            choice('Explaining how to get in late at night:',
              ["Quand le bar est fermé, vous pouvez utiliser l'autre porte avec le code.", 'Quand le bar est fermé, vous devez dormir dehors.', 'Le bar est fermé, au revoir.']),
          ],
        },
        {
          slug: 'translate',
          title: 'Say it to the guest',
          instructions: 'Translate, then say it as if the guest were in front of you.',
          questions: [
            typed('Do you have a reservation?', 'Vous avez une réservation ?', {
              acceptable: ['avez-vous une réservation', 'est-ce que vous avez une réservation'] }),
            typed('For how many nights?', "C'est pour combien de nuits ?", {
              acceptable: ['pour combien de nuits'] }),
            typed('The room is on the second floor.', 'La chambre est au deuxième étage.'),
            typed('The lift is on the left.', "L'ascenseur est à gauche."),
            typed('Breakfast is included.', 'Le petit-déjeuner est compris.', {
              acceptable: ['le petit-déjeuner est inclus'] }),
            typed("Here's your key.", 'Voici votre clé.', { acceptable: ['voilà votre clé'] }),
            typed('Have a good evening!', 'Bonne soirée !'),
          ],
        },
      ],
    },
  ],
};
