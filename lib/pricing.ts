import { BACKGROUNDS } from '../app/constants/backgrounds';

/**
 * Server-side price calculator. This is the single source of truth for how much
 * a checkout should cost and MUST mirror the pricing shown in the builder
 * Sidebar (app/components/Sidebar.tsx). Never trust a client-supplied amount.
 */

export interface PricingConfig {
  animationId?: string;
  showQA?: boolean;
  questions?: unknown[];
  showStory?: boolean;
  showRSVP?: boolean;
  eventDate?: string;
}

const BASE_PRICE = 50;
const STORY_PRICE = 5;
const RSVP_PRICE = 5;
const QA_EXTRA_PRICE = 2; // per question beyond the first 3
const RETENTION_PRICE_PER_MONTH = 5;

export function calculateRetention(eventDate?: string): { price: number; months: number } {
  if (!eventDate) return { price: 0, months: 0 };
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    const extraDays = diffDays - 30;
    const extraMonths = Math.ceil(extraDays / 30);
    return { price: extraMonths * RETENTION_PRICE_PER_MONTH, months: extraMonths };
  }
  return { price: 0, months: 0 };
}

export interface PricingBreakdown {
  basePrice: number;
  bgPrice: number;
  effectName: string | null;
  qaPrice: number;
  extraQuestionsCount: number;
  storyPrice: number;
  rsvpPrice: number;
  retentionPrice: number;
  retentionMonths: number;
  total: number;
}

export function calculatePricing(config: PricingConfig): PricingBreakdown {
  const selectedBg = BACKGROUNDS.find((bg) => bg.id === config?.animationId);
  const bgPrice = selectedBg?.price || 0;

  const extraQuestionsCount = config?.showQA ? Math.max(0, (config.questions?.length || 3) - 3) : 0;
  const qaPrice = config?.showQA ? extraQuestionsCount * QA_EXTRA_PRICE : 0;
  const storyPrice = config?.showStory ? STORY_PRICE : 0;
  const rsvpPrice = config?.showRSVP ? RSVP_PRICE : 0;

  const { price: retentionPrice, months: retentionMonths } = calculateRetention(config?.eventDate);

  const total = BASE_PRICE + bgPrice + qaPrice + storyPrice + rsvpPrice + retentionPrice;

  return {
    basePrice: BASE_PRICE,
    bgPrice,
    effectName: selectedBg?.name || null,
    qaPrice,
    extraQuestionsCount,
    storyPrice,
    rsvpPrice,
    retentionPrice,
    retentionMonths,
    total,
  };
}

/** Convenience: authoritative total (in pesos) for a given config. */
export function calculateTotal(config: PricingConfig): number {
  return calculatePricing(config).total;
}
