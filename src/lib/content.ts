/**
 * Sav tekst sajta na jednom mestu.
 * ⚠ Nacrt za demo — pisan po tonu Heleninih objava. Sve označeno sa TODO potvrditi s njom.
 */

export const SITE = {
  name: 'Helena Laister',
  handle: 'divine.quintessence.369',
  instagram: 'https://www.instagram.com/divine.quintessence.369/',
  youtube: '#', // TODO: link na kanal
  whatsapp: '#', // TODO: broj (bez +387 na sajtu?)
  email: 'hello@example.com', // TODO: pravi e-mail
}

export const HERO = {
  eyebrow: 'why we are here',
  title: ['you didn’t come here', 'to fit in.', 'you came here', 'to remember.'],
  text: 'A home outside the algorithm — for the ones who feel the old script no longer runs them.',
}

export const WHY = {
  title: 'why we are here',
  paragraphs: [
    'Because something in you already knows the world you were handed is not the whole story.',
    'This is not another feed to scroll. My page was deleted — twice. So I built a place no algorithm can switch off: the teachings in one place, in order, for the ones who are ready.',
    'We are here to remember the original blueprint, to let our energy run the way it was designed to run — and to stay sovereign while we do it.',
  ],
  quote: 'the only way out — is through.',
}

export const PATHS = {
  title: 'what i guide you through',
  intro: 'Four ways to walk this with me. Each one meets you where you are — none of them asks you to give your power away.',
  items: [
    {
      code: 'merkaba',
      name: '1:1 Activation',
      text: 'A private session on Zoom. We find where your field is looping, and I place the key codes that let it run differently.',
      meta: 'private · zoom',
    },
    {
      code: 'star-gate',
      name: 'Guidance',
      text: 'For when life breaks open after an awakening. Clear direction, no dogma — what is happening to you, and what to do next.',
      meta: 'private · ongoing',
    },
    {
      code: 'kathara-grid',
      name: 'Teachings',
      text: 'Live lectures: merkaba mechanics, the body as a filter of consciousness, light codes, the phantom matrix — and how to step out of it.',
      meta: 'group · live on zoom',
    },
    {
      code: 'flower-of-life',
      name: 'The Circle',
      text: 'A monthly membership for students: every teaching, every recording, the live calls and the codes — in one place.',
      meta: 'membership · opening soon',
    },
  ],
}

/** Tačno 5 rečenica. TODO: zameniti njenim rečima; potvrditi godine i "25+ years". */
export const ABOUT = {
  title: 'who i am',
  sentences: [
    'I’m Helena — a guide for those who feel the 3d script no longer fits.',
    'My path opened in 1992 with an initiation into Advaita, the teaching of non-duality, and cracked wide open years later inside the Great Pyramid at Giza.',
    'For more than two decades I have studied Krystic ascension mechanics — merkaba fields, key codes and the architecture of the human light body.',
    'Today I work one-on-one and with a circle of students, translating these teachings into something you can feel in your own field.',
    'No gurus, no dogma — just you, your free will, and the codes you came here to remember.',
  ],
  signature: '— helena',
}

export const CODES = {
  title: 'key codes',
  text: 'Key codes are high-frequency symbols. When a code is infused into your energy, that energy begins to run in a completely different way — the old loops lose their grip, and the original pattern comes back online.',
}

export const MANIFEST = ['stay strong.', 'stay sovereign.', 'stay free.']

/* ---------------- HOME: kriva sa koracima (stari "pipeline") ---------------- */
export const SHIFTS = {
  title: 'what shifts when a code lands',
  text: 'A key code doesn’t add anything to you. It removes what was never yours — here is what people feel, in this order.',
  steps: [
    { title: 'Recognition', copy: 'A quiet click. Something in the body knows the pattern before the mind can name it.' },
    { title: 'The loop loosens', copy: 'Old reactions lose their charge. The program keeps playing — it just stops running you.' },
    { title: 'Re-patterning', copy: 'Energy finds its original route. Sleep, focus and mood often move first.' },
    { title: 'Sovereign field', copy: 'Your field holds its own shape. Less noise gets in. Free will becomes something you can feel.' },
  ],
}

/* ---------------- HOME: The Circle (stari telefon + kartice) ---------------- */
export const CIRCLE = {
  tag: 'The Circle · membership',
  title: ['every teaching,', 'in one place'],
  text: 'A private space for students — no algorithm, no deleted posts. One monthly exchange, renewed automatically on the 1st.',
  cta: 'join the waitlist',
  left: [
    { code: 'kathara-grid', title: 'Live teachings', text: 'Monthly lectures on Zoom — merkaba mechanics, light codes, the phantom matrix.' },
    { code: 'star-gate', title: 'The vault', text: 'Every recording, in order. Start at the beginning or go straight to what you need.' },
  ],
  right: [
    { code: 'eckasha', title: 'Key code library', text: 'Each code with its meaning, its use and a short practice to receive it.' },
    { code: 'flower-of-life', title: 'Circle calls', text: 'A live call with Helena and the group — questions, integration, real talk.' },
  ],
}

/* ---------------- /paths (stari "teacher training" nivoi) ---------------- */
export const PATHS_PAGE = {
  hero: ['four ways', 'to walk this', 'with me'],
  heroText: 'From a single activation to a living circle of students. Choose the door that fits where you are now.',
  levels: [
    {
      numeral: 'I',
      code: 'merkaba',
      name: '1:1 Activation',
      statement: 'A private session where your field is read, cleared and re-coded.',
      info: [
        ['Format', 'Private · Zoom'],
        ['Length', 'One session'],
        ['For', 'Anyone ready to feel the shift'],
        ['Exchange', 'On request'],
      ],
      overview:
        'We begin with what you feel — where you are stuck, looping or heavy. I read the field, locate the distortion and place the key codes that let your energy run its original route. You leave with one simple practice to keep the code alive.',
      cta: 'book an activation',
    },
    {
      numeral: 'II',
      code: 'star-gate',
      name: 'Guidance',
      statement: 'Clear direction for when life breaks open after an awakening.',
      info: [
        ['Format', 'Private · Zoom'],
        ['Length', 'Ongoing, at your pace'],
        ['For', 'Awakening, transition, timeline jumps'],
        ['Exchange', 'On request'],
      ],
      overview:
        'Awakening rarely arrives politely. Relationships shift, work stops making sense, the body reacts. Guidance is a steady line through it — what is happening to you, what is yours and what isn’t, and what to do next. No dogma, no dependency.',
      cta: 'ask for guidance',
    },
    {
      numeral: 'III',
      code: 'kathara-grid',
      name: 'Teachings',
      statement: 'Live lectures on the mechanics behind ascension — explained plainly.',
      info: [
        ['Format', 'Group · live on Zoom'],
        ['Length', 'Monthly'],
        ['For', 'Students who want to understand'],
        ['Exchange', 'Per lecture or via The Circle'],
      ],
      overview:
        'Merkaba fields and why they run in reverse. The body as a filter of consciousness. Light codes, DNA, the phantom matrix — and how to step out of it without fear. Every lecture is recorded and archived in the vault.',
      cta: 'see the next lecture',
    },
    {
      numeral: 'IV',
      code: 'flower-of-life',
      name: 'The Circle',
      statement: 'A living membership — every teaching, every code, one community.',
      info: [
        ['Format', 'Membership · online'],
        ['Rhythm', 'Renews on the 1st of each month'],
        ['For', 'Committed students'],
        ['Status', 'Opening soon'],
      ],
      overview:
        'The Circle holds everything in one place: the live teachings, the full vault of recordings, the key code library and a monthly call with the group. One automatic monthly exchange — no chasing payments, no lost posts.',
      cta: 'join the waitlist',
    },
  ],
}

/* ---------------- /sessions (stari "studio" raspored) ---------------- */
export const SESSIONS_PAGE = {
  title: 'live sessions & openings',
  text: 'Lectures, circle calls and 1:1 openings — shown in your own time zone. Request a place and I’ll confirm personally.',
  where: ['Online · Zoom', 'Link sent after confirmation'],
}

/* ---------------- /about (stari "about") ---------------- */
export const ABOUT_PAGE = {
  hero: ['the body is', 'a filter of', 'consciousness'],
  heroText: 'Breathe with the code: four seconds in, seven held, nine out. Let the field settle before you read on.',
  mission: [
    'I’m here to help you remember what was edited out — the original blueprint of your energy, before the programs, the fear and the noise.',
    'For more than two decades I’ve walked the Krystic teachings, non-duality and the mechanics of the light body. Most of it was never meant to stay theory. It is meant to be felt.',
    'So this is what I do: I translate it into something you can use — a code, a breath, a clear sentence — and I leave you sovereign enough to walk on without me.',
  ],
  portal: 'a key code is a doorway into',
  pairs: [
    ['Remembrance', 'Sovereignty'],
    ['Clarity', 'Free will'],
    ['Light', 'Structure'],
    ['Heart', 'Ground'],
  ],
  principlesTitle: 'the rules of this space',
  principles: [
    { title: 'Sovereignty first', text: 'Nothing here asks you to hand your power to anyone — including me. Take what resonates, leave the rest.' },
    { title: 'Free will', text: 'You exist inside a framework of co-creation. Every session starts with your consent and your intention.' },
    { title: 'No dogma', text: 'I question the comfortable phrases — “we are all one”, “turn the other cheek”, “forgive everything”. Discernment is a spiritual skill.' },
    { title: 'Through, not around', text: 'There are no shortcuts out of the 3d circus. The only way out is through — and you don’t have to walk it alone.' },
    { title: 'Humor is holy', text: 'Processing light codes and laundry at the same time is allowed. Laughing is part of the frequency.' },
  ],
  bio: [
    'Helena has guided people through awakening, activation and the long, practical work of integration for more than two decades.',
    'Her work moves between Advaita’s quiet recognition of what is already here and the precise mechanics of the Krystic teachings — merkaba fields, key codes, the architecture of the light body.',
    'She teaches the way she speaks: directly, with a little irony, and without asking anyone to believe her. The point is not to follow. The point is to feel it for yourself.',
  ],
}

export const CONTACT = {
  title: 'let’s begin',
  text: 'Sessions are booked personally. Write to me on any channel and tell me, in one sentence, what brought you here.',
}
