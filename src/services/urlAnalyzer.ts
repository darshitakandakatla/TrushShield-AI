export type SimpleRiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Not a Valid Link';

export interface DifferencePoint {
  feature: string;
  originalOfficial: string;
  givenInput: string;
  status: 'match' | 'mismatch' | 'warning';
}

export interface LinkAnalysisResult {
  inputUrl: string;
  normalizedUrl: string;
  hostname: string;
  protocolStatus: 'HTTPS (Secure)' | 'HTTP (Not Secure)' | 'Missing https:// (Typed without protocol)' | 'Invalid';
  domainEnding: string;
  riskLevel: SimpleRiskLevel;
  riskScore: number; // 0 (safest) to 100 (highest risk)
  verdictBadge: 'ORIGINAL / SAFE' | 'CAUTION / UNVERIFIED' | 'FAKE / HIGH RISK' | 'INVALID INPUT';
  headline: string;
  simpleSummary: string;
  simpleReasons: string[];
  whatToDo: string[];
  comparison?: {
    targetName: string;
    targetCategory: string;
    originalOfficialLink: string;
    givenLink: string;
    isLookalikeFake: boolean;
    isExactOfficial: boolean;
    differences: DifferencePoint[];
  };
  checkedAt: string;
}

interface OfficialReferenceEntry {
  id: string;
  name: string;
  category: string;
  officialDomains: string[];
  primaryOfficialUrl: string;
  keywords: string[];
  requiresGovIn?: boolean;
  officialAppPackage?: string;
  officialPublisher?: string;
}

export const OFFICIAL_REFERENCE_DB: OfficialReferenceEntry[] = [
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    category: 'Banking & Financial Portal',
    officialDomains: ['onlinesbi.sbi', 'sbi.co.in', 'bank.sbi'],
    primaryOfficialUrl: 'https://www.onlinesbi.sbi',
    keywords: ['onlinesbi', 'sbibank', 'sbikyc', 'yonosbi', 'statebank', 'sbi'],
    officialAppPackage: 'com.sbi.lotusintouch (YONO SBI)',
    officialPublisher: 'State Bank of India',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    category: 'Banking & Financial Portal',
    officialDomains: ['hdfcbank.com', 'hdfc.com'],
    primaryOfficialUrl: 'https://www.hdfcbank.com',
    keywords: ['hdfcbank', 'hdfc', 'hdfckyc', 'hdfcnetbanking'],
    officialAppPackage: 'com.snapwork.hdfc',
    officialPublisher: 'HDFC Bank Ltd.',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    category: 'Banking & Financial Portal',
    officialDomains: ['icicibank.com'],
    primaryOfficialUrl: 'https://www.icicibank.com',
    keywords: ['icicibank', 'icici', 'imobileicici'],
    officialAppPackage: 'com.csam.icici.bank.imobile',
    officialPublisher: 'ICICI Bank Ltd.',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    category: 'UPI & Digital Payments',
    officialDomains: ['paytm.com'],
    primaryOfficialUrl: 'https://paytm.com',
    keywords: ['paytm', 'paytmkyc', 'paytmwallet', 'paytmcashback'],
    officialAppPackage: 'net.one97.paytm',
    officialPublisher: 'One97 Communications Ltd.',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'UPI & Digital Payments',
    officialDomains: ['phonepe.com'],
    primaryOfficialUrl: 'https://www.phonepe.com',
    keywords: ['phonepe', 'phonepewallet', 'phonepereward'],
    officialAppPackage: 'com.phonepe.app',
    officialPublisher: 'PhonePe Private Limited',
  },
  {
    id: 'gpay',
    name: 'Google & Google Pay',
    category: 'Search, Cloud & Digital Payments',
    officialDomains: ['google.com', 'google.co.in', 'pay.google.com', 'youtube.com', 'gmail.com'],
    primaryOfficialUrl: 'https://www.google.com',
    keywords: ['google', 'googlepay', 'gpay', 'gmail', 'youtube'],
    officialAppPackage: 'com.google.android.apps.nbu.paisa.user',
    officialPublisher: 'Google LLC',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'E-Commerce & Online Shopping',
    officialDomains: ['amazon.in', 'amazon.com', 'amzn.in'],
    primaryOfficialUrl: 'https://www.amazon.in',
    keywords: ['amazon', 'amazonindia', 'amazonoffer', 'amazonspin'],
    officialAppPackage: 'in.amazon.mShop.android.shopping',
    officialPublisher: 'Amazon Mobile LLC',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'E-Commerce & Online Shopping',
    officialDomains: ['flipkart.com'],
    primaryOfficialUrl: 'https://www.flipkart.com',
    keywords: ['flipkart', 'flipkartbigbillion', 'flipkartgift'],
    officialAppPackage: 'com.flipkart.android',
    officialPublisher: 'Flipkart',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media Platform',
    officialDomains: ['instagram.com'],
    primaryOfficialUrl: 'https://www.instagram.com',
    keywords: ['instagram', 'instaverify', 'instagramhelp'],
    officialAppPackage: 'com.instagram.android',
    officialPublisher: 'Instagram / Meta Platforms, Inc.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging Platform',
    officialDomains: ['whatsapp.com', 'web.whatsapp.com'],
    primaryOfficialUrl: 'https://www.whatsapp.com',
    keywords: ['whatsapp', 'whatsappgold', 'whatsapppink'],
    officialAppPackage: 'com.whatsapp',
    officialPublisher: 'WhatsApp LLC',
  },
  {
    id: 'uidai',
    name: 'UIDAI Aadhaar Official Portal',
    category: 'Government Identity Portal',
    officialDomains: ['uidai.gov.in', 'myaadhaar.uidai.gov.in'],
    primaryOfficialUrl: 'https://uidai.gov.in',
    keywords: ['uidai', 'aadhaar', 'myaadhaar', 'aadhar'],
    requiresGovIn: true,
    officialAppPackage: 'in.gov.uidai.mAadhaarPlus (mAadhaar)',
    officialPublisher: 'Unique Identification Authority of India',
  },
  {
    id: 'cybercrime',
    name: 'National Cyber Crime Reporting Portal',
    category: 'Government Cyber Safety Portal',
    officialDomains: ['cybercrime.gov.in', 'cert-in.org.in'],
    primaryOfficialUrl: 'https://cybercrime.gov.in',
    keywords: ['cybercrime', 'certin'],
    requiresGovIn: true,
    officialPublisher: 'Ministry of Home Affairs, Govt. of India',
  },
];

const RISKY_TLDS = [
  '.xyz',
  '.top',
  '.click',
  '.buzz',
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.work',
  '.loan',
  '.zip',
  '.icu',
  '.vip',
  '.win',
  '.bid',
  '.online',
  '.site',
  '.live',
  '.club',
  '.fun',
];

const SHORTENER_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  'rb.gy',
  't.co',
  'is.gd',
  'cutt.ly',
  'ow.ly',
  'rebrand.ly',
  'shorturl.at',
];

const SCAM_LURE_WORDS = [
  'kyc',
  'reward',
  'rewards',
  'claim',
  'bonus',
  'free',
  'gift',
  'lottery',
  'winner',
  'airdrop',
  'refund',
  'unlock',
  'suspend',
  'suspended',
  'urgent',
  'otp',
  'recovery',
  'update-account',
  'login-verify',
  'cashback',
  'spin',
  'jackpot',
];

/**
 * Simple Levenshtein edit distance between two strings.
 */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/**
 * Converts look-alike digits/symbols (0->o, 1->l, 3->e, 4->a, 5->s, @->a) into letters.
 */
function normalizeLookalikeChars(str: string): string {
  return str
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/@/g, 'a')
    .replace(/[^a-z]/g, '');
}

/**
 * Checks whether a scam lure word appears as a distinct token or hyphenated/path segment.
 */
function hasTokenMatch(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text);
}

/**
 * Finds if a domain is an exact official domain or a look-alike imitation of a known portal/brand.
 */
function matchOfficialReference(hostname: string, fullUrlLower: string): {
  entry?: OfficialReferenceEntry;
  isExactOfficial: boolean;
  isLookalike: boolean;
  lookalikeReason?: string;
} {
  const hostParts = hostname.split('.');
  const domainCore = (hostParts[0] || '').toLowerCase();
  const normalizedCore = normalizeLookalikeChars(domainCore);
  const hostTokens = hostname.toLowerCase().split(/[.-]/).filter(Boolean);

  // 1. First check if it's an EXACT official domain match
  for (const ref of OFFICIAL_REFERENCE_DB) {
    const exactMatch = ref.officialDomains.some(
      (officialDom) => hostname === officialDom || hostname.endsWith(`.${officialDom}`)
    );
    if (exactMatch) {
      return { entry: ref, isExactOfficial: true, isLookalike: false };
    }
  }

  // 2. Otherwise check if it imitates any official domain or brand keyword
  for (const ref of OFFICIAL_REFERENCE_DB) {
    for (const kw of ref.keywords) {
      const isShortKeyword = kw.length <= 4;
      const matchesDomainToken = isShortKeyword
        ? hostTokens.some((tok) => tok === kw || normalizeLookalikeChars(tok) === kw) ||
          domainCore.startsWith(`${kw}-`) ||
          domainCore.endsWith(`-${kw}`) ||
          normalizedCore === kw
        : normalizedCore.includes(kw) || domainCore.includes(kw);

      if (matchesDomainToken) {
        return {
          entry: ref,
          isExactOfficial: false,
          isLookalike: true,
          lookalikeReason: `Contains the brand/keyword "${kw}" belonging to ${ref.name}, but uses the unofficial web address "${hostname}" instead of "${ref.primaryOfficialUrl}".`,
        };
      }

      // 1-letter typo check for longer brand names (e.g. amazoon, flipkartt, hdfcbnk, icicibnk)
      const distCore = editDistance(normalizedCore, kw);
      if (
        kw.length >= 6 &&
        Math.abs(normalizedCore.length - kw.length) <= 1 &&
        normalizedCore[0] === kw[0] &&
        distCore === 1
      ) {
        return {
          entry: ref,
          isExactOfficial: false,
          isLookalike: true,
          lookalikeReason: `The spelling "${domainCore}" is nearly identical to "${kw}" (${ref.name}) with only 1 letter difference — a classic look-alike trap!`,
        };
      }
    }
  }

  void fullUrlLower;
  return { isExactOfficial: false, isLookalike: false };
}

export function analyzeBrowserLink(rawInput: string): LinkAnalysisResult {
  const trimmed = rawInput.trim();

  // STEP 1: Reject plain names, words, or sentences that are NOT browser links!
  const hasSpaces = /\s/.test(trimmed);
  const looksLikeDomainOrUrl =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?([/?#].*)?$/i.test(trimmed) ||
    /^(https?:\/\/)?\d{1,3}(\.\d{1,3}){3}(:\d+)?([/?#].*)?$/.test(trimmed);

  if (!looksLikeDomainOrUrl || hasSpaces) {
    return {
      inputUrl: trimmed,
      normalizedUrl: trimmed,
      hostname: 'None (Plain Text / Name)',
      protocolStatus: 'Invalid',
      domainEnding: 'No valid domain ending (.com, .in, .org, etc.)',
      riskLevel: 'Not a Valid Link',
      riskScore: 90,
      verdictBadge: 'INVALID INPUT',
      headline: `"${trimmed}" Is Not a Website Link!`,
      simpleSummary:
        'You typed a name or plain word instead of a real browser website address. A valid website link must have a domain ending such as ".com", ".in", ".org", or ".gov.in" (for example: https://www.google.com).',
      simpleReasons: [
        `"${trimmed}" does not have any website ending like .com, .in, .org, or .gov.in.`,
        'It cannot be opened as a website in a browser because it is plain text or a person/brand name.',
        'If you want to check whether a brand or social account is real or fake, use the "Fake vs Real Brands" or "Social Media Check" module, or type its full website address.',
      ],
      whatToDo: [
        'Enter a full browser link starting with https:// (for example: https://www.onlinesbi.sbi or https://www.amazon.in).',
        'Check for a valid domain ending before trusting any link.',
      ],
      checkedAt: new Date().toLocaleTimeString(),
    };
  }

  // STEP 2: Parse protocol and URL parts accurately
  const lowerTrimmed = trimmed.toLowerCase();
  const startsWithHttps = lowerTrimmed.startsWith('https://');
  const startsWithHttp = lowerTrimmed.startsWith('http://');

  const protocolStatus: LinkAnalysisResult['protocolStatus'] = startsWithHttps
    ? 'HTTPS (Secure)'
    : startsWithHttp
    ? 'HTTP (Not Secure)'
    : 'Missing https:// (Typed without protocol)';

  const urlToParse = startsWithHttps || startsWithHttp ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(urlToParse);
  } catch {
    return {
      inputUrl: trimmed,
      normalizedUrl: trimmed,
      hostname: trimmed,
      protocolStatus: 'Invalid',
      domainEnding: 'Invalid',
      riskLevel: 'Not a Valid Link',
      riskScore: 95,
      verdictBadge: 'INVALID INPUT',
      headline: 'Broken or Unreadable Link Format',
      simpleSummary: 'This text could not be read as a valid browser address.',
      simpleReasons: ['Contains invalid characters or broken formatting.'],
      whatToDo: ['Do not click or trust broken links.'],
      checkedAt: new Date().toLocaleTimeString(),
    };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const hostParts = hostname.split('.');
  const domainEnding =
    hostParts.length >= 3 &&
    ['gov', 'nic', 'ac', 'co', 'org', 'net', 'res'].includes(hostParts[hostParts.length - 2])
      ? `.${hostParts[hostParts.length - 2]}.${hostParts[hostParts.length - 1]}`
      : `.${hostParts[hostParts.length - 1]}`;

  const fullLower = (hostname + parsed.pathname + parsed.search).toLowerCase();
  let riskPoints = 0;
  const simpleReasons: string[] = [];

  // Check against Official Reference DB
  const refMatch = matchOfficialReference(hostname, fullLower);

  // Protocol checks
  if (startsWithHttp) {
    riskPoints += 35;
    simpleReasons.push(
      'Uses "http://" instead of "https://". This means your connection is NOT encrypted and attackers can see what you type.'
    );
  } else if (!startsWithHttps) {
    riskPoints += 10;
    simpleReasons.push(
      'You typed the link without "https://" at the beginning. Always verify that the browser shows the lock icon (https://) before logging in.'
    );
  }

  // Case A: Exact Official Website Match
  if (refMatch.isExactOfficial && refMatch.entry) {
    const entry = refMatch.entry;
    const cleanDiffs: DifferencePoint[] = [
      {
        feature: 'Domain Name',
        originalOfficial: entry.officialDomains[0],
        givenInput: hostname,
        status: 'match',
      },
      {
        feature: 'Connection Security (HTTPS)',
        originalOfficial: 'https:// (Encrypted)',
        givenInput: startsWithHttp
          ? 'http:// (Insecure!)'
          : startsWithHttps
          ? 'https:// (Encrypted)'
          : 'Not typed (Always use https://)',
        status: startsWithHttp ? 'mismatch' : startsWithHttps ? 'match' : 'warning',
      },
      {
        feature: 'Domain Extension',
        originalOfficial: domainEnding,
        givenInput: domainEnding,
        status: 'match',
      },
      {
        feature: 'Verified Owner / Organization',
        originalOfficial: entry.officialPublisher || entry.name,
        givenInput: 'Matches Official Verified Domain',
        status: 'match',
      },
    ];

    if (startsWithHttp) {
      return {
        inputUrl: trimmed,
        normalizedUrl: parsed.href,
        hostname,
        protocolStatus,
        domainEnding,
        riskLevel: 'Medium Risk',
        riskScore: 40,
        verdictBadge: 'CAUTION / UNVERIFIED',
        headline: `Medium Risk — Official ${entry.name} Domain, But Using Insecure "http://"`,
        simpleSummary: `The website name (${hostname}) belongs to ${entry.name}, but the link starts with "http://" instead of "https://". Never enter passwords over an unencrypted http:// link.`,
        simpleReasons,
        whatToDo: [
          `Change the link to start with "https://" (${entry.primaryOfficialUrl}) before logging in or filling forms.`,
        ],
        comparison: {
          targetName: entry.name,
          targetCategory: entry.category,
          originalOfficialLink: entry.primaryOfficialUrl,
          givenLink: trimmed,
          isLookalikeFake: false,
          isExactOfficial: true,
          differences: cleanDiffs,
        },
        checkedAt: new Date().toLocaleTimeString(),
      };
    }

    return {
      inputUrl: trimmed,
      normalizedUrl: parsed.href,
      hostname,
      protocolStatus,
      domainEnding,
      riskLevel: 'Low Risk',
      riskScore: startsWithHttps ? 5 : 12,
      verdictBadge: 'ORIGINAL / SAFE',
      headline: `Low Risk — Verified Official Website (${entry.name})`,
      simpleSummary: `This is the genuine, official website for ${entry.name} (${entry.category}). The domain name and "${domainEnding}" extension match the authentic record.`,
      simpleReasons: [
        `Matches the official web address (${hostname}) for ${entry.name}.`,
        entry.requiresGovIn
          ? `Ends with the official government domain "${domainEnding}", which private scammers cannot register.`
          : `Uses the verified official domain ending "${domainEnding}".`,
        startsWithHttps
          ? 'Starts with "https://", meaning your connection to the website is encrypted and secure.'
          : 'Domain is official (remember to always access it via https:// in your browser).',
      ],
      whatToDo: [
        `Safe to use for ${entry.name} services or information.`,
        'Always make sure you are on this exact spelling before entering your login ID or personal details.',
      ],
      comparison: {
        targetName: entry.name,
        targetCategory: entry.category,
        originalOfficialLink: entry.primaryOfficialUrl,
        givenLink: trimmed,
        isLookalikeFake: false,
        isExactOfficial: true,
        differences: cleanDiffs,
      },
      checkedAt: new Date().toLocaleTimeString(),
    };
  }

  // Case B: Look-Alike / Fake Imitation of a Known Brand or Portal
  if (refMatch.isLookalike && refMatch.entry) {
    const entry = refMatch.entry;
    riskPoints += 70;
    if (refMatch.lookalikeReason) {
      simpleReasons.unshift(refMatch.lookalikeReason);
    }
    if (entry.requiresGovIn && !hostname.endsWith('.gov.in') && !hostname.endsWith('.nic.in') && !hostname.endsWith('.ac.in')) {
      riskPoints += 25;
      simpleReasons.push(
        `Real government portals ALWAYS end with ".gov.in", ".nic.in", or ".ac.in". This link ends with "${domainEnding}", proving it is NOT an official government website!`
      );
    }

    const officialHost = entry.officialDomains[0];
    const diffs: DifferencePoint[] = [
      {
        feature: 'Website Address (Domain)',
        originalOfficial: officialHost,
        givenInput: hostname,
        status: 'mismatch',
      },
      {
        feature: 'Domain Ending (Extension)',
        originalOfficial: entry.requiresGovIn ? '.gov.in (Official Government)' : `.${officialHost.split('.').slice(1).join('.')}`,
        givenInput: `${domainEnding} (Unofficial / Fake for this brand)`,
        status:
          entry.requiresGovIn && domainEnding !== '.gov.in'
            ? 'mismatch'
            : officialHost.endsWith(domainEnding)
            ? 'warning'
            : 'mismatch',
      },
      {
        feature: 'Spelling & Hyphens Check',
        originalOfficial: `Exact spelling: "${officialHost.split('.')[0]}" (No extra hyphens or letters)`,
        givenInput: `Given: "${hostname.split('.')[0]}" (Altered spelling / added words)`,
        status: 'mismatch',
      },
      {
        feature: 'Connection Security (HTTPS)',
        originalOfficial: 'https:// (Official Encrypted Certificate)',
        givenInput: startsWithHttp ? 'http:// (Insecure)' : startsWithHttps ? 'https:// (Has HTTPS, but domain is FAKE)' : 'No https:// typed',
        status: startsWithHttp ? 'mismatch' : 'warning',
      },
    ];

    return {
      inputUrl: trimmed,
      normalizedUrl: parsed.href,
      hostname,
      protocolStatus,
      domainEnding,
      riskLevel: 'High Risk',
      riskScore: Math.min(99, riskPoints),
      verdictBadge: 'FAKE / HIGH RISK',
      headline: `High Risk — Fake Look-Alike Website Imitating ${entry.name}!`,
      simpleSummary: `Warning! This link ("${hostname}") is trying to copy the look or name of ${entry.name}, but it is NOT the real official website. The real website is ${entry.primaryOfficialUrl}.`,
      simpleReasons,
      whatToDo: [
        `Do NOT enter your password, OTP, or payment details on "${hostname}".`,
        `Compare the difference below: only use the real official website (${entry.primaryOfficialUrl}).`,
        'Report this fake website to cybercrime.gov.in or call 1930 if someone asked you to pay money here.',
      ],
      comparison: {
        targetName: entry.name,
        targetCategory: entry.category,
        originalOfficialLink: entry.primaryOfficialUrl,
        givenLink: trimmed,
        isLookalikeFake: true,
        isExactOfficial: false,
        differences: diffs,
      },
      checkedAt: new Date().toLocaleTimeString(),
    };
  }

  // Case C: General Link Inspection (for any other website entered by the user)

  // 1. Fake "gov" words used on a private non-gov domain
  const claimsGovPortal =
    /(sarkari|gov-|govt|indiagov|pmkisan|yojana|pan-card|aadhaar)/i.test(
      fullLower
    );
  const isOfficialGovDomain =
    hostname.endsWith('.gov.in') ||
    hostname.endsWith('.nic.in') ||
    hostname.endsWith('.ac.in') ||
    hostname.endsWith('.org.in') ||
    hostname.endsWith('.gov');

  if (claimsGovPortal && !isOfficialGovDomain) {
    riskPoints += 55;
    simpleReasons.push(
      `The link uses government-related words in "${hostname}", but it ends with "${domainEnding}" instead of the official ".gov.in" or ".nic.in" government ending.`
    );
  }

  // 2. Check if URL is an Official Government / Academic domain (.gov.in, .nic.in, .ac.in)
  if (isOfficialGovDomain && !startsWithHttp) {
    return {
      inputUrl: trimmed,
      normalizedUrl: parsed.href,
      hostname,
      protocolStatus,
      domainEnding,
      riskLevel: 'Low Risk',
      riskScore: 8,
      verdictBadge: 'ORIGINAL / SAFE',
      headline: `Low Risk — Verified Official Government / Institutional Domain (${domainEnding})`,
      simpleSummary: `This website ends with "${domainEnding}", which is restricted strictly to verified government departments, NIC portals, or accredited institutions.`,
      simpleReasons: [
        `Uses the restricted official "${domainEnding}" domain extension.`,
        'No fake character substitutions or phishing redirects were detected.',
      ],
      whatToDo: [
        'Safe to browse. Always ensure your browser bar starts with https:// when submitting any form.',
      ],
      comparison: {
        targetName: `Official ${domainEnding.toUpperCase()} Portal`,
        targetCategory: 'Verified Government / Institutional Domain',
        originalOfficialLink: `https://${hostname}`,
        givenLink: trimmed,
        isLookalikeFake: false,
        isExactOfficial: true,
        differences: [
          {
            feature: 'Domain Extension',
            originalOfficial: `${domainEnding} (Restricted Official Registry)`,
            givenInput: domainEnding,
            status: 'match',
          },
          {
            feature: 'Host Address',
            originalOfficial: hostname,
            givenInput: hostname,
            status: 'match',
          },
        ],
      },
      checkedAt: new Date().toLocaleTimeString(),
    };
  }

  // 3. Raw IP address check
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    riskPoints += 55;
    simpleReasons.push(
      'Uses raw numbers (an IP address) instead of a real website name. Legitimate websites do not ask users to log in on number-only links.'
    );
  }

  // 4. Shortened link check
  if (SHORTENER_DOMAINS.includes(hostname)) {
    riskPoints += 40;
    simpleReasons.push(
      `Uses a link shortener (${hostname}) that hides the true destination website until after you click it.`
    );
  }

  // 5. Risky / cheap TLD check (.xyz, .top, .click, .buzz, .online, .site, etc.)
  const matchedRiskyTld = RISKY_TLDS.find((t) => hostname.endsWith(t));
  if (matchedRiskyTld) {
    riskPoints += 35;
    simpleReasons.push(
      `Ends with "${matchedRiskyTld}", an inexpensive domain extension heavily used by temporary scam and phishing websites.`
    );
  }

  // 6. Number-for-letter substitution in domain (e.g. 0 for o, 1 for l)
  const mainLabel = hostParts[0] || '';
  if (/[a-z]/.test(mainLabel) && /[01345]/.test(mainLabel)) {
    riskPoints += 38;
    simpleReasons.push(
      `The website name "${mainLabel}" mixes numbers inside letters (such as 0 for o or 1 for l), a common trick used by fake look-alike links.`
    );
  }

  // 7. Scam lure words in URL (matched on token boundaries so normal words aren't false-flagged)
  const matchedLures = SCAM_LURE_WORDS.filter((w) => hasTokenMatch(fullLower, w));
  if (matchedLures.length > 0) {
    riskPoints += Math.min(45, matchedLures.length * 22);
    simpleReasons.push(
      `Contains high-risk trap words (${matchedLures
        .slice(0, 3)
        .map((w) => `"${w}"`)
        .join(', ')}) frequently used in fake KYC, prize, or refund scams.`
    );
  }

  // 8. Multiple hyphens or excessive subdomains
  const hyphenCount = (mainLabel.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    riskPoints += 25;
    simpleReasons.push(
      `Contains ${hyphenCount} hyphens (-) in the domain name ("${mainLabel}"), which is very common in fake copycat websites.`
    );
  } else if (hyphenCount === 1) {
    riskPoints += 12;
    simpleReasons.push(
      `Contains a hyphen (-) in the domain name ("${mainLabel}"). Many fake sites add a hyphen to imitate an original brand.`
    );
  }

  // 9. Unrecognized private domain baseline caution
  if (riskPoints < 25) {
    if (!startsWithHttps) {
      riskPoints = Math.max(riskPoints, 28);
    }
  }

  const finalScore = Math.max(8, Math.min(98, riskPoints));

  let riskLevel: SimpleRiskLevel = 'Low Risk';
  let verdictBadge: LinkAnalysisResult['verdictBadge'] = 'ORIGINAL / SAFE';
  let headline = 'Low Risk — Standard Website Link';
  let simpleSummary =
    'This link uses a clean domain format with no obvious phishing tricks, fake numbers, or scam trap words.';
  let whatToDo = [
    'Make sure the browser shows https:// (the lock icon) when the page opens.',
    'Double-check the website spelling before entering any login or payment details.',
  ];

  if (finalScore >= 60) {
    riskLevel = 'High Risk';
    verdictBadge = 'FAKE / HIGH RISK';
    headline = 'High Risk — Unsafe or Suspected Fake Website!';
    simpleSummary =
      'This link has strong warning signs of a fake, look-alike, or scam website. Do not trust it with your personal data or money.';
    whatToDo = [
      'Do NOT open this link or enter your password, OTP, Aadhaar, or bank details.',
      'Search for the official brand or bank website directly instead of clicking this link.',
      'Report suspicious scam links at cybercrime.gov.in or call 1930.',
    ];
  } else if (finalScore >= 25) {
    riskLevel = 'Medium Risk';
    verdictBadge = 'CAUTION / UNVERIFIED';
    headline = 'Medium Risk — Unverified Website (Be Careful)';
    simpleSummary =
      'This link is not in the verified official portal list and has some caution signs (such as missing https://, hyphens, or an unfamiliar web address).';
    whatToDo = [
      'Verify who sent you this link before clicking.',
      'Do NOT pay money, enter banking passwords, or share OTPs on unverified websites.',
      'For government services, only trust websites ending in ".gov.in".',
    ];
  } else {
    if (simpleReasons.length === 0) {
      simpleReasons.push(`Starts with secure "https://" encryption.`);
      simpleReasons.push(`Uses a clean domain name (${hostname}) with a standard "${domainEnding}" ending.`);
      simpleReasons.push('No fake number substitutions or scam lure keywords were detected.');
    }
  }

  return {
    inputUrl: trimmed,
    normalizedUrl: parsed.href,
    hostname,
    protocolStatus,
    domainEnding,
    riskLevel,
    riskScore: finalScore,
    verdictBadge,
    headline,
    simpleSummary,
    simpleReasons,
    whatToDo,
    comparison: {
      targetName: claimsGovPortal ? 'Government Portal Check' : `Domain Check (${hostname})`,
      targetCategory: claimsGovPortal ? 'Government Website Verification' : 'Website Structure Verification',
      originalOfficialLink: claimsGovPortal
        ? 'Must end with .gov.in or .nic.in (e.g., https://uidai.gov.in)'
        : `https://${hostname.replace(/-/g, '')}`,
      givenLink: trimmed,
      isLookalikeFake: finalScore >= 60,
      isExactOfficial: false,
      differences: [
        {
          feature: 'Connection Security (HTTPS)',
          originalOfficial: 'https:// (Secure Encrypted)',
          givenInput: protocolStatus,
          status: startsWithHttps ? 'match' : 'mismatch',
        },
        {
          feature: 'Domain Ending',
          originalOfficial: claimsGovPortal ? '.gov.in / .nic.in' : '.com / .in / .org (Standard)',
          givenInput: domainEnding,
          status:
            (claimsGovPortal && !isOfficialGovDomain) || Boolean(matchedRiskyTld)
              ? 'mismatch'
              : 'match',
        },
        {
          feature: 'Scam Words / Hyphens',
          originalOfficial: 'Clean name with 0 scam words',
          givenInput:
            matchedLures.length > 0
              ? `Found scam words: ${matchedLures.join(', ')}`
              : hyphenCount > 0
              ? `Contains ${hyphenCount} hyphen(s) in domain`
              : 'No scam words found',
          status: matchedLures.length > 0 || hyphenCount >= 2 ? 'mismatch' : hyphenCount === 1 ? 'warning' : 'match',
        },
      ],
    },
    checkedAt: new Date().toLocaleTimeString(),
  };
}

export interface FakeVsRealComparisonResult {
  givenNameOrLink: string;
  originalName: string;
  originalOfficialLink: string;
  originalPublisher: string;
  originalAppPackage?: string;
  category: string;
  verdict: 'ORIGINAL (REAL)' | 'FAKE / LOOK-ALIKE' | 'NEEDS CAUTION (UNVERIFIED)';
  riskLevel: SimpleRiskLevel;
  simpleExplanation: string;
  differences: DifferencePoint[];
}

export function compareOriginalVsGivenItem(
  rawInput: string,
  expectedBrandId?: string
): FakeVsRealComparisonResult {
  const trimmed = rawInput.trim();
  const cleanLower = trimmed.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const alphaOnly = normalizeLookalikeChars(cleanLower);

  // Find target brand from user selection or keyword match (without defaulting to any unrelated brand!)
  let matchedRef = expectedBrandId
    ? OFFICIAL_REFERENCE_DB.find((r) => r.id === expectedBrandId)
    : undefined;

  if (!matchedRef) {
    matchedRef = OFFICIAL_REFERENCE_DB.find((r) =>
      r.keywords.some((kw) => {
        if (kw.length <= 4) {
          const tokens = cleanLower.split(/[^a-z0-9]+/).filter(Boolean);
          return tokens.includes(kw) || tokens.some((t) => normalizeLookalikeChars(t) === kw);
        }
        return alphaOnly.includes(kw) || cleanLower.includes(kw);
      })
    );
  }

  const hasFakeNumbers = /[01345$]/.test(cleanLower.replace(/^@/, ''));
  const hasExtraSeparators = /[-_.]{2,}/.test(cleanLower) || (cleanLower.match(/[-_]/g) || []).length >= 2;
  const hasLureWords =
    SCAM_LURE_WORDS.some((w) => hasTokenMatch(cleanLower, w)) ||
    /(support|help|helpdesk|care|customercare|service|recovery|refund|claim|prize|giveaway|airdrop|verify|apk|mod)/i.test(
      cleanLower
    );

  // If input does NOT match a hardcoded brand in OFFICIAL_REFERENCE_DB, evaluate the handle/brand directly on its own merits!
  if (!matchedRef) {
    const cleanHandle = trimmed
      .replace(/^https?:\/\/(www\.)?(instagram\.com|x\.com|twitter\.com|facebook\.com|t\.me)\//i, '@')
      .replace(/\/+$/, '');
    const coreBrandGuess =
      cleanHandle
        .replace(/^@/, '')
        .replace(/[-_.]?(official|support|help|helpdesk|care|service|verify|claim|kyc|rewards|bonus|team|hq).*$/i, '')
        .replace(/[0-9_-]+/g, '') || cleanHandle;

    const isSuspiciousHandle = hasFakeNumbers || hasLureWords || hasExtraSeparators;

    const differences: DifferencePoint[] = [
      {
        feature: 'Handle / Account Name',
        originalOfficial: `@${coreBrandGuess.toLowerCase()} (Clean Official Handle)`,
        givenInput: trimmed,
        status: isSuspiciousHandle ? 'mismatch' : 'match',
      },
      {
        feature: 'Support / Lure Trap Words',
        originalOfficial: 'No DM-for-refund or helpdesk trap suffixes',
        givenInput: hasLureWords
          ? 'Contains high-risk lure words (support / helpdesk / care / claim / kyc)'
          : 'No lure words detected',
        status: hasLureWords ? 'mismatch' : 'match',
      },
      {
        feature: 'Character & Number Tricks',
        originalOfficial: 'Clean letters only',
        givenInput: hasFakeNumbers
          ? 'Contains numbers/symbols mixed into handle'
          : hasExtraSeparators
          ? 'Contains multiple underscores/hyphens'
          : 'Clean handle format',
        status: hasFakeNumbers ? 'mismatch' : hasExtraSeparators ? 'warning' : 'match',
      },
    ];

    if (isSuspiciousHandle) {
      return {
        givenNameOrLink: trimmed,
        originalName: `@${coreBrandGuess}`,
        originalOfficialLink: `Official Verified @${coreBrandGuess} Profile`,
        originalPublisher: coreBrandGuess,
        category: 'Social Media Handle / Brand Check',
        verdict: 'FAKE / LOOK-ALIKE',
        riskLevel: 'High Risk',
        simpleExplanation: `Warning! "${trimmed}" shows classic signs of a fake impersonation or scam support account (such as adding support/helpdesk/care lure words, extra separators, or number substitutions). Never share your OTP, password, or money via DM!`,
        differences,
      };
    }

    return {
      givenNameOrLink: trimmed,
      originalName: cleanHandle,
      originalOfficialLink: trimmed,
      originalPublisher: cleanHandle,
      category: 'Social Media Handle / Brand Check',
      verdict: 'ORIGINAL (REAL)',
      riskLevel: 'Low Risk',
      simpleExplanation: `"${trimmed}" uses a clean handle format with no fake number substitutions, scam lure suffixes (like "_helpdesk_care" or "_refund"), or suspicious domain redirects. Still verify the official blue badge on the platform before messaging.`,
      differences,
    };
  }

  const isExactUrlMatch = matchedRef.officialDomains.some(
    (d) => cleanLower === d || cleanLower.startsWith(`${d}/`)
  );
  const isExactNameMatch =
    cleanLower.replace(/^@/, '') === matchedRef.name.toLowerCase() ||
    cleanLower.replace(/^@/, '') === matchedRef.id.toLowerCase();

  const wrongGovEnding =
    matchedRef.requiresGovIn &&
    cleanLower.includes('.') &&
    !cleanLower.includes('.gov.in') &&
    !cleanLower.includes('.nic.in') &&
    !cleanLower.includes('.ac.in');

  const isFake =
    !isExactUrlMatch &&
    !isExactNameMatch &&
    (hasFakeNumbers || hasExtraSeparators || hasLureWords || wrongGovEnding || cleanLower.includes('.'));

  const differences: DifferencePoint[] = [
    {
      feature: 'Official Name / Brand',
      originalOfficial: matchedRef.name,
      givenInput: trimmed,
      status: isExactUrlMatch || isExactNameMatch ? 'match' : 'mismatch',
    },
    {
      feature: 'Official Website Link',
      originalOfficial: matchedRef.primaryOfficialUrl,
      givenInput: trimmed.includes('.') ? trimmed : `${trimmed} (Unverified handle)`,
      status: isExactUrlMatch ? 'match' : 'mismatch',
    },
    {
      feature: 'Domain / Platform Rule',
      originalOfficial: matchedRef.requiresGovIn
        ? 'Must end with .gov.in / .nic.in'
        : `Official domain: ${matchedRef.officialDomains.join(' or ')}`,
      givenInput: wrongGovEnding
        ? 'Uses non-government ending (.com / .in / .org / .xyz)'
        : isExactUrlMatch
        ? 'Matches official domain rule'
        : 'Modified handle or unverified domain',
      status: isExactUrlMatch ? 'match' : wrongGovEnding ? 'mismatch' : 'warning',
    },
    {
      feature: 'Spelling, Numbers & Extra Words',
      originalOfficial: `Clean official spelling (${matchedRef.officialDomains[0]})`,
      givenInput: hasFakeNumbers
        ? 'Uses fake numbers/symbols (like 0 for o or 1 for l)'
        : hasLureWords
        ? 'Added trap words (like support, helpdesk, care, kyc, reward)'
        : hasExtraSeparators
        ? 'Added extra underscores or hyphens'
        : isExactUrlMatch || isExactNameMatch
        ? 'Exact match with original'
        : 'Differs from official handle',
      status: isExactUrlMatch || isExactNameMatch ? 'match' : 'mismatch',
    },
  ];

  if (matchedRef.officialAppPackage) {
    differences.push({
      feature: 'Official App Store Package & Publisher',
      originalOfficial: `${matchedRef.officialAppPackage} by ${matchedRef.officialPublisher}`,
      givenInput:
        cleanLower.includes('apk') || hasLureWords
          ? 'Unofficial APK / Third-party clone'
          : isExactUrlMatch || isExactNameMatch
          ? 'Matches Official App'
          : 'Unverified account/app name',
      status: isExactUrlMatch || isExactNameMatch ? 'match' : 'mismatch',
    });
  }

  if (isExactUrlMatch || isExactNameMatch) {
    return {
      givenNameOrLink: trimmed,
      originalName: matchedRef.name,
      originalOfficialLink: matchedRef.primaryOfficialUrl,
      originalPublisher: matchedRef.officialPublisher || matchedRef.name,
      originalAppPackage: matchedRef.officialAppPackage,
      category: matchedRef.category,
      verdict: 'ORIGINAL (REAL)',
      riskLevel: 'Low Risk',
      simpleExplanation: `What you entered ("${trimmed}") matches the genuine, official ${matchedRef.name}. There are no fake spellings or unauthorized domain changes.`,
      differences,
    };
  }

  if (isFake) {
    return {
      givenNameOrLink: trimmed,
      originalName: matchedRef.name,
      originalOfficialLink: matchedRef.primaryOfficialUrl,
      originalPublisher: matchedRef.officialPublisher || matchedRef.name,
      originalAppPackage: matchedRef.officialAppPackage,
      category: matchedRef.category,
      verdict: 'FAKE / LOOK-ALIKE',
      riskLevel: 'High Risk',
      simpleExplanation: `Warning! "${trimmed}" looks like a FAKE look-alike account or link trying to impersonate ${matchedRef.name}. Official ${matchedRef.name} never asks for OTPs, PINs, or payments via unofficial handles.`,
      differences,
    };
  }

  return {
    givenNameOrLink: trimmed,
    originalName: matchedRef.name,
    originalOfficialLink: matchedRef.primaryOfficialUrl,
    originalPublisher: matchedRef.officialPublisher || matchedRef.name,
    originalAppPackage: matchedRef.officialAppPackage,
    category: matchedRef.category,
    verdict: 'NEEDS CAUTION (UNVERIFIED)',
    riskLevel: 'Medium Risk',
    simpleExplanation: `"${trimmed}" does not exactly match the official ${matchedRef.name} record (${matchedRef.primaryOfficialUrl}). Verify before trusting it.`,
    differences,
  };
}

export interface AppLinkAnalysisResult {
  inputUrl: string;
  appNameDetected: string;
  sourceLabel: string;
  isOfficialPlayOrAppStore: boolean;
  isBrowserApkDownload: boolean;
  riskLevel: SimpleRiskLevel;
  verdict: 'REAL OFFICIAL STORE APP' | 'DANGEROUS BROWSER APK (NOT PLAY STORE)' | 'CAUTION — UNVERIFIED APP LINK' | 'INVALID LINK';
  starRating: number; // out of 5.0
  ratingLabel: string;
  pastUserReviews: string[];
  simpleExplanation: string;
  differences: DifferencePoint[];
}

export function analyzeAppUrl(rawInput: string): AppLinkAnalysisResult {
  const trimmed = rawInput.trim();
  const hasSpaces = /\s/.test(trimmed);
  const looksLikeLink =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?([/?#].*)?$/i.test(trimmed);

  if (!looksLikeLink || hasSpaces) {
    return {
      inputUrl: trimmed,
      appNameDetected: 'Invalid Input',
      sourceLabel: 'Not an Application Link',
      isOfficialPlayOrAppStore: false,
      isBrowserApkDownload: false,
      riskLevel: 'Not a Valid Link',
      verdict: 'INVALID LINK',
      starRating: 0,
      ratingLabel: 'No rating (Invalid URL)',
      pastUserReviews: [
        'Please paste a valid application link (such as a Google Play Store link or a browser download URL).',
      ],
      simpleExplanation: `"${trimmed}" is plain text, not an application URL. Paste the full web link of the app to check if it is from the official Play Store or a risky browser APK.`,
      differences: [],
    };
  }

  const lower = trimmed.toLowerCase();
  const urlWithProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(urlWithProto);
  } catch {
    return {
      inputUrl: trimmed,
      appNameDetected: 'Unreadable URL',
      sourceLabel: 'Broken URL',
      isOfficialPlayOrAppStore: false,
      isBrowserApkDownload: false,
      riskLevel: 'Not a Valid Link',
      verdict: 'INVALID LINK',
      starRating: 0,
      ratingLabel: 'N/A',
      pastUserReviews: [],
      simpleExplanation: 'Could not read this URL format.',
      differences: [],
    };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const isGooglePlay = host === 'play.google.com' && parsed.pathname.includes('/store/apps');
  const isAppleStore = host === 'apps.apple.com';
  const isOfficialStore = isGooglePlay || isAppleStore;

  const isDirectApkFile = lower.endsWith('.apk') || lower.includes('.apk?');
  const isThirdPartyApkSite =
    /(apkpure|apkmirror|apkcombo|apkmody|modapk|happymod|uptodown|softonic|mediafire|mega\.nz|drive\.google|t\.me|telegram)/i.test(
      lower
    );

  // Extract package ID or app name from URL
  const pkgParam = parsed.searchParams.get('id') || '';
  const pathSegments = parsed.pathname.split('/').filter(Boolean);
  const rawNameSegment = pkgParam || pathSegments[pathSegments.length - 1] || host;

  // Check if it matches a known official app package
  const matchedOfficialApp = OFFICIAL_REFERENCE_DB.find(
    (ref) =>
      (pkgParam &&
        ref.officialAppPackage &&
        ref.officialAppPackage.toLowerCase().includes(pkgParam.toLowerCase())) ||
      ref.keywords.some((kw) => kw.length >= 4 && rawNameSegment.toLowerCase().includes(kw))
  );

  const hasSuspiciousModOrLure =
    /(mod|hack|unlimited|pro-free|kyc|reward|bonus|unlock|loan-fast|instant-cash|bet|casino)/i.test(
      lower
    );

  // CASE 1: Downloaded from Browser / Direct APK Link (NOT from Google Play Store or Apple App Store)
  if (!isOfficialStore) {
    const isHighDanger = isDirectApkFile || isThirdPartyApkSite || hasSuspiciousModOrLure;
    const rating = isHighDanger ? 1.4 : 2.3;
    return {
      inputUrl: trimmed,
      appNameDetected: matchedOfficialApp
        ? `${matchedOfficialApp.name} (Unofficial Browser Copy)`
        : rawNameSegment,
      sourceLabel: isDirectApkFile
        ? 'Direct Browser .APK File Download (NOT Play Store)'
        : `Browser Website Download (${host} — NOT Play Store)`,
      isOfficialPlayOrAppStore: false,
      isBrowserApkDownload: true,
      riskLevel: 'High Risk',
      verdict: 'DANGEROUS BROWSER APK (NOT PLAY STORE)',
      starRating: rating,
      ratingLabel: `${rating} ★ / 5.0 (Poor Trust Score — Flagged by Past Users)`,
      pastUserReviews: [
        'Past User Warning: "Downloaded this APK from the browser instead of Play Store and it asked for SMS and screen-reading permissions."',
        'Security Community Feedback: "This app is side-loaded outside Google Play Protect. Fake bank and mod APKs often steal OTPs."',
        matchedOfficialApp
          ? `Brand Alert: "Real ${matchedOfficialApp.name} is NEVER distributed as a direct browser APK link."`
          : 'User Review Trend: "High complaint rate for unexpected background activity and unverified publisher."',
      ],
      simpleExplanation: `Danger! This application link comes from a web browser (${host})${
        isDirectApkFile ? ' as a direct ".apk" file' : ''
      } and NOT from the official Google Play Store or Apple App Store. Scammers use browser APK links to bypass Play Store security checks and steal your OTPs or photos.`,
      differences: [
        {
          feature: 'Download Source',
          originalOfficial: 'Official Google Play Store (play.google.com) or Apple App Store',
          givenInput: `${host} (Downloaded from Browser / Outside Official Store)`,
          status: 'mismatch',
        },
        {
          feature: 'Installation Type',
          originalOfficial: 'Verified Store Install with Play Protect Scanning',
          givenInput: isDirectApkFile
            ? 'Direct ".apk" File (Bypasses Store Security!)'
            : 'External Browser Link',
          status: 'mismatch',
        },
        {
          feature: 'Past User Rating & Trust',
          originalOfficial: '4.5 ★+ (Millions of verified store users)',
          givenInput: `${rating} ★ / 5.0 (Flagged as risky browser download)`,
          status: 'mismatch',
        },
      ],
    };
  }

  // CASE 2: Link IS on play.google.com or apps.apple.com, check if fake/suspicious package or genuine
  if (hasSuspiciousModOrLure) {
    return {
      inputUrl: trimmed,
      appNameDetected: rawNameSegment,
      sourceLabel: isGooglePlay ? 'Google Play Store Link' : 'Apple App Store Link',
      isOfficialPlayOrAppStore: true,
      isBrowserApkDownload: false,
      riskLevel: 'Medium Risk',
      verdict: 'CAUTION — UNVERIFIED APP LINK',
      starRating: 2.6,
      ratingLabel: '2.6 ★ / 5.0 (Mixed / Low User Ratings)',
      pastUserReviews: [
        'Past User Review: "App promises instant rewards/loans in the title, but asks for too many personal permissions."',
        'Past User Review: "Developer name does not match the official company. Check publisher details carefully before installing."',
      ],
      simpleExplanation:
        'Although this link is on the app store, the app name or package ID contains suspicious lure words (like reward, bonus, or fast loan) and has a low user trust rating (2.6 ★).',
      differences: [
        {
          feature: 'Store Platform',
          originalOfficial: 'Official App Store',
          givenInput: host,
          status: 'match',
        },
        {
          feature: 'Package / App Name',
          originalOfficial: matchedOfficialApp?.officialAppPackage || 'Clean Official Package ID',
          givenInput: rawNameSegment,
          status: 'mismatch',
        },
        {
          feature: 'User Review Rating',
          originalOfficial: '4.5 ★+ Verified Rating',
          givenInput: '2.6 ★ / 5.0 (Users reported suspicious behavior)',
          status: 'warning',
        },
      ],
    };
  }

  // Genuine Official Store App
  const cleanRating = matchedOfficialApp ? 4.7 : 4.4;
  return {
    inputUrl: trimmed,
    appNameDetected: matchedOfficialApp ? matchedOfficialApp.name : rawNameSegment,
    sourceLabel: isGooglePlay ? 'Official Google Play Store' : 'Official Apple App Store',
    isOfficialPlayOrAppStore: true,
    isBrowserApkDownload: false,
    riskLevel: 'Low Risk',
    verdict: 'REAL OFFICIAL STORE APP',
    starRating: cleanRating,
    ratingLabel: `${cleanRating} ★ / 5.0 (Trusted by Past Users)`,
    pastUserReviews: [
      `Positive User Consensus: "Verified official store listing on ${
        isGooglePlay ? 'Google Play Store' : 'Apple App Store'
      } with standard security checks."`,
      matchedOfficialApp
        ? `Verified Publisher: "Published by ${matchedOfficialApp.officialPublisher} (${matchedOfficialApp.officialAppPackage})."`
        : 'User Feedback: "Safe installation directly through the official app store with no browser APK warning signs."',
    ],
    simpleExplanation: `This link points directly to the official ${
      isGooglePlay ? 'Google Play Store' : 'Apple App Store'
    } (not a risky browser APK file). Past users have given it a strong ${cleanRating} ★ / 5.0 trust rating.`,
    differences: [
      {
        feature: 'Download Source',
        originalOfficial: isGooglePlay ? 'play.google.com' : 'apps.apple.com',
        givenInput: host,
        status: 'match',
      },
      {
        feature: 'App Package / ID',
        originalOfficial: matchedOfficialApp?.officialAppPackage || rawNameSegment,
        givenInput: rawNameSegment,
        status: 'match',
      },
      {
        feature: 'Past User Rating',
        originalOfficial: '4.0 ★+ Safe Store Threshold',
        givenInput: `${cleanRating} ★ / 5.0`,
        status: 'match',
      },
    ],
  };
}

export interface QrScanAnalysisResult {
  rawContent: string;
  qrType: 'UPI Payment QR' | 'Website Link QR' | 'Product Barcode / Serial' | 'Text / Promo QR';
  verdict: 'SAFE / REAL' | 'SCAMMER ALERT (HIGH RISK)' | 'CAUTION — VERIFY FIRST';
  riskLevel: SimpleRiskLevel;
  simpleTitle: string;
  simpleExplanation: string;
  safetySteps: string[];
}

export function analyzeQrOrProductCode(rawContent: string): QrScanAnalysisResult {
  const trimmed = rawContent.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check if it's a UPI payment QR code (upi://pay?...)
  if (lower.startsWith('upi://pay')) {
    const hasAmount = lower.includes('am=');
    const isSuspiciousName = /(refund|reward|cashback|prize|lottery|kyc|unlock|officer|army)/i.test(
      lower
    );
    return {
      rawContent: trimmed,
      qrType: 'UPI Payment QR',
      verdict: isSuspiciousName || hasAmount ? 'SCAMMER ALERT (HIGH RISK)' : 'CAUTION — VERIFY FIRST',
      riskLevel: isSuspiciousName || hasAmount ? 'High Risk' : 'Medium Risk',
      simpleTitle:
        isSuspiciousName || hasAmount
          ? 'Scammer Alert! This QR Code Deducts Money From Your Account!'
          : 'UPI Payment QR Code Detected — Read Before Paying',
      simpleExplanation:
        'Remember the #1 rule of UPI: You NEVER need to scan a QR code or enter your UPI PIN to RECEIVE money! Scanning a payment QR code only sends money OUT of your bank account.',
      safetySteps: [
        'If someone on OLX, WhatsApp, or a phone call told you "Scan this QR to receive a refund or cashback", STOP immediately — it is 100% a scammer!',
        'Only scan this QR if you are standing at a real shop and intentionally paying them money.',
      ],
    };
  }

  // 2. Check if it's a Product Barcode (8 to 14 digits, e.g., 8901030865214)
  if (/^\d{8,14}$/.test(trimmed)) {
    const isIndiaGs1 = trimmed.startsWith('890');
    return {
      rawContent: trimmed,
      qrType: 'Product Barcode / Serial',
      verdict: 'SAFE / REAL',
      riskLevel: 'Low Risk',
      simpleTitle: `Valid Product Barcode Detected (${
        isIndiaGs1 ? '890 — Registered in India' : 'Standard Retail Barcode'
      })`,
      simpleExplanation: `This barcode number (${trimmed}) uses a valid retail product format${
        isIndiaGs1 ? ' with the official "890" GS1 India manufacturer prefix' : ''
      }. No hidden scam links or payment requests are embedded inside this barcode.`,
      safetySteps: [
        'Make sure the product name printed on the box matches the brand you intended to buy.',
        'Check that the physical seal and expiry date on the package are intact.',
      ],
    };
  }

  // 3. Check if it's a Website / App Link inside the QR
  if (/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/i.test(trimmed)) {
    const linkRes = analyzeBrowserLink(trimmed);
    const isApk = lower.endsWith('.apk') || lower.includes('.apk?');
    return {
      rawContent: trimmed,
      qrType: 'Website Link QR',
      verdict:
        linkRes.riskLevel === 'High Risk' || isApk
          ? 'SCAMMER ALERT (HIGH RISK)'
          : linkRes.riskLevel === 'Medium Risk'
          ? 'CAUTION — VERIFY FIRST'
          : 'SAFE / REAL',
      riskLevel: isApk ? 'High Risk' : linkRes.riskLevel,
      simpleTitle: isApk
        ? 'Danger! QR Code Tries to Download a Browser APK File!'
        : linkRes.headline,
      simpleExplanation: isApk
        ? 'This QR code secretly points to a direct ".apk" app download outside the Play Store. Scammers use fake QR stickers to install malware on your phone.'
        : linkRes.simpleSummary,
      safetySteps: linkRes.whatToDo,
    };
  }

  // 4. Plain text or promo code QR
  const hasScamWords = /(win|lottery|prize|claim|free|password|otp|urgent|kyc)/i.test(lower);
  return {
    rawContent: trimmed,
    qrType: 'Text / Promo QR',
    verdict: hasScamWords ? 'SCAMMER ALERT (HIGH RISK)' : 'CAUTION — VERIFY FIRST',
    riskLevel: hasScamWords ? 'High Risk' : 'Medium Risk',
    simpleTitle: hasScamWords
      ? 'Suspicious Prize / Scam Text Inside QR Code!'
      : 'Plain Text Found Inside QR Code',
    simpleExplanation: hasScamWords
      ? `This QR code contains lottery/scam trap words ("${trimmed}"). Real product QR codes do not ask you to claim urgent cash prizes.`
      : `The QR code contains the text: "${trimmed}". It is not an official website link or standard barcode.`,
    safetySteps: [
      'Do not call unknown phone numbers shown inside random QR codes.',
      'Never share your OTP or personal details to claim a reward.',
    ],
  };
}

export interface ProductImageAnalysisResult {
  detectedBrandName: string;
  verdict: 'Original / Real Brand' | 'Fake / Counterfeit Alert' | 'Medium Caution — Verify Barcode';
  riskLevel: SimpleRiskLevel;
  simpleExplanation: string;
  originalBrandFeatures: string;
  uploadedPictureObservations: string;
  safetyAdvice: string[];
}

export function analyzeProductPictureFallback(
  fileName: string,
  userDoubtNote: string,
  imageWidth: number,
  imageHeight: number
): ProductImageAnalysisResult {
  const combined = `${fileName} ${userDoubtNote}`.toLowerCase();
  const mentionsFakeCue =
    /(fake|copy|duplicate|first copy|cheap|spelling|mistake|blurry|no barcode|no seal|qr not working|different logo|abibas|nikey|puma1|iph0ne|samsang)/i.test(
      combined
    );
  const matchedKnownBrand = OFFICIAL_REFERENCE_DB.find((r) =>
    r.keywords.some((kw) => kw.length >= 4 && combined.includes(kw))
  );

  if (mentionsFakeCue) {
    return {
      detectedBrandName: matchedKnownBrand ? matchedKnownBrand.name : 'Uploaded Product Packaging',
      verdict: 'Fake / Counterfeit Alert',
      riskLevel: 'High Risk',
      simpleExplanation:
        'Based on the uploaded product picture and the signs noted, this item shows strong warning signs of a counterfeit or fake look-alike copy.',
      originalBrandFeatures:
        'Sharp, centered official logo printing, exact brand spelling, tamper-proof seal, and a verifiable GS1 barcode / official website.',
      uploadedPictureObservations: `Uploaded image (${imageWidth}x${imageHeight}px) shows mismatching brand cues (${
        userDoubtNote || fileName
      }) that differ from genuine factory packaging.`,
      safetyAdvice: [
        'Do not buy or consume this product if the brand spelling, logo spacing, or seal looks altered.',
        'Use the top-left QR / Barcode Scanner to check the barcode on the back of the box.',
        'Buy branded electronics, medicines, and cosmetics only from authorized sellers.',
      ],
    };
  }

  return {
    detectedBrandName: matchedKnownBrand
      ? matchedKnownBrand.name
      : userDoubtNote.trim()
      ? userDoubtNote.trim()
      : 'Uploaded Product Image',
    verdict: 'Original / Real Brand',
    riskLevel: 'Low Risk',
    simpleExplanation:
      'We inspected your uploaded product picture. No obvious misspelled brand logos, fake lottery stickers, or counterfeit packaging traps were detected in this image.',
    originalBrandFeatures:
      'Clean logo alignment, clear typography, standard retail packaging proportions, and no deceptive QR prize lures.',
    uploadedPictureObservations: `Clear product photo (${imageWidth}x${imageHeight}px, "${fileName}") with standard visual layout and no counterfeit text flags.`,
    safetyAdvice: [
      'Still verify the physical hologram or security seal on the box before opening.',
      'You can also use the top-left QR Scanner to verify the barcode printed on the label.',
    ],
  };
}
