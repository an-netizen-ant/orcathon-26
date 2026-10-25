import { z } from 'zod';
import * as _ from 'radash';

/**
 * Zod Schemas for Hackathon Data Validation
 */
export const MetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().nonnegative(),
  unit: z.string(),
  category: z.enum(['performance', 'velocity', 'reliability', 'intelligence']),
  trend: z.number(),
});

export const HackathonProjectSchema = z.object({
  name: z.string().min(1),
  tagline: z.string(),
  tracks: z.array(z.string()),
  score: z.number().min(0).max(100),
  activeSprint: z.boolean(),
  metrics: z.array(MetricSchema),
});

/**
 * Core Algorithm Engine
 * Utilizes radash for functional data manipulation and optimization.
 */
export const LogicEngine = {
  /**
   * Calculate aggregated performance scores by category
   */
  calculateCategoryAggregates(metrics) {
    const validMetrics = metrics.filter(m => MetricSchema.safeParse(m).success);
    const grouped = _.group(validMetrics, m => m.category);

    return Object.entries(grouped).map(([category, items]) => {
      const totalScore = _.sum((items || []).map(i => i.value));
      const avgTrend = (items || []).length > 0 
        ? _.sum((items || []).map(i => i.trend)) / (items || []).length 
        : 0;

      return {
        category,
        count: (items || []).length,
        total: Math.round(totalScore * 10) / 10,
        averageTrend: Math.round(avgTrend * 10) / 10,
      };
    });
  },

  /**
   * Rank and filter high-impact features using radash sorting & sifting
   */
  filterTopPerformers(metrics, threshold = 85) {
    const sifted = _.sift(metrics.map(m => (m.value >= threshold ? m : null)));
    return _.sort(sifted, m => m.value, true);
  },

  /**
   * Compute real-time hackathon telemetry velocity
   */
  computeVelocity(metrics) {
    const rawSum = _.sum(metrics.map(m => m.value * (1 + m.trend / 100)));
    return Math.round(rawSum / (metrics.length || 1));
  }
};
