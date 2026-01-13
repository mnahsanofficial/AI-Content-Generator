import Sentiment from 'sentiment';
import { logger } from '../utils/logger';

const sentiment = new Sentiment();

export interface SentimentResult {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
}

export class SentimentService {
  /**
   * Analyze sentiment of text
   * Returns score (-1 to 1) and label (positive/negative/neutral)
   */
  static analyzeSentiment(text: string): SentimentResult {
    try {
      if (!text || text.trim().length === 0) {
        return {
          score: 0,
          label: 'neutral',
        };
      }

      const result = sentiment.analyze(text);
      const score = result.score;

      // Normalize score to -1 to 1 range
      // Sentiment library uses comparative score, we'll normalize it
      const normalizedScore = Math.max(-1, Math.min(1, score / 10));

      // Determine label based on score
      let label: 'positive' | 'negative' | 'neutral';
      if (normalizedScore > 0.1) {
        label = 'positive';
      } else if (normalizedScore < -0.1) {
        label = 'negative';
      } else {
        label = 'neutral';
      }

      logger.info(`Sentiment analysis: ${label} (score: ${normalizedScore.toFixed(2)})`);

      return {
        score: normalizedScore,
        label,
      };
    } catch (error: any) {
      logger.error('Sentiment analysis error:', error);
      return {
        score: 0,
        label: 'neutral',
      };
    }
  }
}
