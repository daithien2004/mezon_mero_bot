import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface TarotApiCard {
  type: string;
  name_short: string;
  name: string;
  value: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  suit?: string;
}

interface TarotApiResponse {
  nhits: number;
  cards: TarotApiCard[];
}

@Injectable()
export class TarotApiService {
  private readonly logger = new Logger(TarotApiService.name);
  private readonly API_BASE_URL = 'https://tarotapi.dev/api/v1';
  private cardsCache: TarotApiCard[] | null = null;

  /**
   * Fetch all 78 tarot cards from API
   */
  async getAllCards(): Promise<TarotApiCard[]> {
    // Return from cache if available
    if (this.cardsCache) {
      this.logger.log('Returning cards from cache');
      return this.cardsCache;
    }

    try {
      const response = await axios.get<TarotApiResponse>(`${this.API_BASE_URL}/cards`);
      this.cardsCache = response.data.cards;
      this.logger.log(`Fetched ${this.cardsCache.length} cards from API`);
      return this.cardsCache;
    } catch (error) {
      this.logger.error('Failed to fetch cards from API', error);
      throw new Error('Unable to fetch tarot cards');
    }
  }

  /**
   * Get random cards using seeded randomization
   */
  async getRandomCards(count: number, seed?: string): Promise<TarotApiCard[]> {
    const allCards = await this.getAllCards();
    
    if (!seed) {
      // Pure random
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    }

    // Seeded random for consistency
    const rng = this.createSeededRNG(seed);
    const shuffled = [...allCards].sort(() => rng() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Search for a specific card by name
   */
  async searchCard(name: string): Promise<TarotApiCard | null> {
    const allCards = await this.getAllCards();
    const normalized = name.toLowerCase().trim();
    
    return allCards.find(card => 
      card.name.toLowerCase().includes(normalized) ||
      card.name_short.toLowerCase() === normalized
    ) || null;
  }

  /**
   * Create seeded RNG function (same as tarot.handler)
   */
  private createSeededRNG(seedStr: string): () => number {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
      seed |= 0;
    }
    
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
}