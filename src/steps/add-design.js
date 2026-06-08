import * as p from '@clack/prompts';
import pc from 'picocolors';
import { runCommand } from '../utils/execute.js';

const GITHUB_API = 'https://api.github.com/repos/VoltAgent/awesome-design-md/contents/design-md';
const GITHUB_RAW = 'https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main';
const CATEGORIES = {
  'AI & LLM Platforms': ['claude', 'cohere', 'elevenlabs', 'lovable', 'minimax', 'mistral.ai', 'together.ai', 'x.ai', 'composio', 'ollama'],
  'Developer Tools & IDEs': ['cursor', 'expo', 'opencode.ai', 'replicate', 'resend', 'vercel', 'warp', 'posthog', 'slack'],
  'Backend, Database & DevOps': ['clickhouse', 'hashicorp', 'ibm', 'mongodb', 'nvidia', 'supabase', 'sentry'],
  'Productivity & SaaS': ['airtable', 'cal', 'intercom', 'linear.app', 'mintlify', 'miro', 'notion', 'raycast', 'superhuman', 'zapier', 'uber'],
  'Design & Creative Tools': ['clay', 'figma', 'framer', 'pinterest', 'runwayml', 'sanity', 'webflow'],
  'Fintech & Crypto': ['binance', 'coinbase', 'kraken', 'mastercard', 'revolut', 'stripe', 'wise'],
  'E-commerce & Retail': ['airbnb', 'shopify', 'starbucks', 'hp'],
  'Media & Consumer Tech': ['apple', 'meta', 'nike', 'playstation', 'spotify', 'theverge', 'wired', 'voltagent'],
  'Automotive': ['bmw', 'bmw-m', 'bugatti', 'dell-1996', 'ferrari', 'lamborghini', 'nintendo-2001', 'renault', 'spacex', 'tesla', 'vodafone'],
};

const SLUG_TO_NAME = {
  'airbnb': 'Airbnb',
  'airtable': 'Airtable',
  'apple': 'Apple',
  'binance': 'Binance',
  'bmw-m': 'BMW M',
  'bmw': 'BMW',
  'bugatti': 'Bugatti',
  'cal': 'Cal.com',
  'claude': 'Claude',
  'clay': 'Clay',
  'clickhouse': 'ClickHouse',
  'cohere': 'Cohere',
  'coinbase': 'Coinbase',
  'composio': 'Composio',
  'cursor': 'Cursor',
  'dell-1996': 'Dell (1996)',
  'elevenlabs': 'ElevenLabs',
  'expo': 'Expo',
  'ferrari': 'Ferrari',
  'figma': 'Figma',
  'framer': 'Framer',
  'hashicorp': 'HashiCorp',
  'hp': 'HP',
  'ibm': 'IBM',
  'intercom': 'Intercom',
  'kraken': 'Kraken',
  'lamborghini': 'Lamborghini',
  'linear.app': 'Linear',
  'lovable': 'Lovable',
  'mastercard': 'Mastercard',
  'meta': 'Meta',
  'minimax': 'MiniMax',
  'mintlify': 'Mintlify',
  'miro': 'Miro',
  'mistral.ai': 'Mistral AI',
  'mongodb': 'MongoDB',
  'nike': 'Nike',
  'nintendo-2001': 'Nintendo (2001)',
  'notion': 'Notion',
  'nvidia': 'NVIDIA',
  'ollama': 'Ollama',
  'opencode.ai': 'OpenCode',
  'pinterest': 'Pinterest',
  'playstation': 'PlayStation',
  'posthog': 'PostHog',
  'raycast': 'Raycast',
  'renault': 'Renault',
  'replicate': 'Replicate',
  'resend': 'Resend',
  'revolut': 'Revolut',
  'runwayml': 'Runway',
  'sanity': 'Sanity',
  'sentry': 'Sentry',
  'shopify': 'Shopify',
  'slack': 'Slack',
  'spacex': 'SpaceX',
  'spotify': 'Spotify',
  'starbucks': 'Starbucks',
  'stripe': 'Stripe',
  'supabase': 'Supabase',
  'superhuman': 'Superhuman',
  'tesla': 'Tesla',
  'theverge': 'The Verge',
  'together.ai': 'Together AI',
  'uber': 'Uber',
  'vercel': 'Vercel',
  'vodafone': 'Vodafone',
  'voltagent': 'VoltAgent',
  'warp': 'Warp',
  'webflow': 'Webflow',
  'wired': 'WIRED',
  'wise': 'Wise',
  'x.ai': 'xAI',
  'zapier': 'Zapier',
};

export async function fetchDesigns() {
  try {
    const res = await fetch(GITHUB_API);
    if (!res.ok) return null;
    const data = await res.json();
    return data
      .filter(d => d.type === 'dir')
      .map(d => ({
        slug: d.name,
        name: SLUG_TO_NAME[d.name] || d.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        category: getCategory(d.name),
      }));
  } catch {
    return null;
  }
}

function getCategory(slug) {
  for (const [cat, slugs] of Object.entries(CATEGORIES)) {
    if (slugs.includes(slug)) return cat;
  }
  return 'Other';
}

function groupByCategory(designs) {
  const groups = {};
  for (const d of designs) {
    const cat = d.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(d);
  }
  return groups;
}

export async function addDesignSystem({ design } = {}) {
  if (design) {
    await installDesign(design);
    return design;
  }

  p.log.step('Fetching available design systems...');

  const s = p.spinner();
  s.start('Loading designs from getdesign.md...');

  const designs = await fetchDesigns();
  s.stop(`Found ${designs ? designs.length : 0} design systems`);

  if (!designs || designs.length === 0) {
    p.log.warn('Could not fetch design list. Enter slug manually.');
    const manual = await p.text({
      message: 'Design system slug (e.g. "vercel", "stripe", "linear"):',
      validate: v => v ? undefined : 'Required',
    });
    if (p.isCancel(manual)) {
      p.cancel('Cancelled.');
      process.exit(0);
    }
    await installDesign(manual);
    return manual;
  }

  const grouped = groupByCategory(designs);
  const categoryOrder = Object.keys(CATEGORIES).filter(c => grouped[c]);
  const other = grouped['Other'];
  if (other) categoryOrder.push('Other');

  const options = [];
  for (const cat of categoryOrder) {
    options.push({ label: cat, value: `__cat__${cat}`, hint: `${grouped[cat].length} designs` });
    for (const d of grouped[cat]) {
      options.push({ label: `  ${d.name}`, value: d.slug });
    }
  }

  const selected = await p.select({
    message: 'Pick a design system to apply:',
    options,
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }

  await installDesign(selected);
  return selected;
}

async function installDesign(slug) {
  p.log.step(`Installing ${pc.cyan(SLUG_TO_NAME[slug] || slug)} design system...`);

  const result = await runCommand('npx', [
    'getdesign@latest', 'add', slug,
  ]);

  if (result.exitCode === 0) {
    p.log.success('DESIGN.md created. Ask your AI agent to reference it for UI work.');
    return;
  }

  p.log.warn('getdesign CLI failed, trying direct download...');

  const fallback = await downloadDesignRaw(slug);
  if (fallback) {
    p.log.success('DESIGN.md downloaded. Ask your AI agent to reference it for UI work.');
  } else {
    p.log.warn(`Could not install ${slug}. Try: npx getdesign@latest add ${slug}`);
  }
}

async function downloadDesignRaw(slug) {
  const s = p.spinner();
  s.start('Downloading DESIGN.md from GitHub...');

  try {
    const res = await fetch(`${GITHUB_RAW}/design-md/${slug}/DESIGN.md`);
    if (!res.ok) {
      s.stop('Download failed');
      return false;
    }
    const content = await res.text();
    const { writeFileSync } = await import('fs');
    writeFileSync('DESIGN.md', content, 'utf-8');
    s.stop('DESIGN.md saved');
    return true;
  } catch {
    s.stop('Download failed');
    return false;
  }
}
