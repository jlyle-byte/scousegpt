// scousegpt palette — extracted from the Claude Design asset set
// (icon.png starburst, public/og.png hero, public/title.png wordmark).
// These exact hex values are the design bible — do not adjust without
// regenerating the assets.
export const PALETTE = {
  bgDark: "#1a1410",       // very dark warm brown-black, page background
  nearBlack: "#0d0a08",    // deepest background areas
  cream: "#f0e8d0",        // warm off-white — wordmark, message body
  red: "#c8102e",          // Liverpool red — bottom stripe, accents
  redShadow: "#7a1410",    // deep red — wordmark drop shadow (in title.png)
  gold: "#c8a020",         // mustard gold — stamp text, tagline
  // Legacy aliases kept so dependent components don't all need renaming at once.
  ink: "#1a1410",
  black: "#0d0a08",
  goldDeep: "#a08016",
  creamDeep: "#e8dcc0",
  redDark: "#7a1410",
};

export const PAYWALL = {
  freeMessages: 3,
  messagesPerBeer: 30,
  messagesPerCase: 200,
  priceBeer: "$2",
  priceCase: "$10",
};

export const STRIPE = {
  beerLink: process.env.NEXT_PUBLIC_STRIPE_BEER_LINK ?? "#",
  caseLink: process.env.NEXT_PUBLIC_STRIPE_CASE_LINK ?? "#",
};

export const SUGGESTIONS = [
  "Write mi a letter to get out of jury duty la",
  "Me mum keeps interfering in me relationship",
  "Best chippy in Liverpool — settle it",
  "How do I blag a sick day without getting caught?",
];

export const PAYWALL_PHRASES = [
  "Eh, you've been giving me a proper grilling there la. Throat's gone, head's gone — sort us a pint and we'll crack on, sound?",
  "Right, me ma always said never trust a man with a dry mouth to give proper advice. Stand us a pint la.",
  "Tell ya what, you've drained me. Like queuing at the Sandon on derby day — completely cooked. Get us a pint and we're back on it.",
  "Listen, I'm not stingy with the wisdom but the wisdom needs a refill. Pint of anything cold and we crack on.",
  "Three free questions la, that's generous. After that even me uncle charged for advice — usually in pints, mind.",
  "Honest to God, throat's like the Mersey at low tide. Quick pint and I'm back rattling out the answers.",
  "Oi, fair's fair la — back in the day they paid the elders in pints. We're keeping tradition alive, sound?",
  "You're proper picking me brain now! Even Tommy needs wetting. Throw us a pint la.",
  "I've been talking that much I forgot the question. Pint'll bring it right back, watch.",
  "Listen son, you want quick advice or proper advice? Proper advice comes after a sip. Set us up.",
  "Nan said a man without a drink in his hand has no business giving sermons. She wasn't wrong.",
  "Eh, you've kept us busier than the 86 bus on a Saturday. Pint and we're sound to carry on.",
  "Tell ya what la, the brain works on cold lager. It's science. Sort us out.",
  "Right, advice is running dry like the bar on a Sunday. Pint please and we keep going.",
  "Me throat's that dry I'm starting to sound posh. Pint sorts that quick. Help us out.",
  "You're asking proper questions la, fair play. Just need a top-up — pint and we go again.",
  "Listen, in Liverpool we sort each other out. You sort the pint, I sort the answers. Sound?",
  "Ay, even the lads down the Cavern took breaks for a pint. I'm in good company here.",
  "Three free's the standard la. After that the meter's running — but the meter's a pint, not a fortune.",
  "Fair play to ya, you've kept me on me toes. Pint and I'm match-fit again.",
];

export const PAYWALL_MESSAGE = PAYWALL_PHRASES[0];


export const DISCLAIMER_LINE =
  "For entertainment only. Not medical, financial, or legal advice. Tommy la is an AI — sound, but not a professional.";

export const STAMPS = {
  left: "★ LIVERPOOL · THE MERSEY · BEYOND ★",
  right: "SOUND AS A POUND",
  footerText: "for fun la, but the advice is boss",
};

export const CHARACTER_NAME = "Tommy la";
export const CHARACTER_TAGLINE = "sound advice from a proper Scouse lad";
export const DOMAIN = "scousegpt.com";

export const CASE_SESSION_WARNING =
  "⚠ A session lasts the one sitting la — drink up while you've got it, sound?";
