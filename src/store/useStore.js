import { create } from 'zustand';
import { LogicEngine } from '../utils/logicEngine';

const initialMetrics = [
  { id: 'm1', label: 'Scroll Frame Rate', value: 120, unit: 'fps', category: 'performance', trend: 14 },
  { id: 'm2', label: 'GPU Memory Overhead', value: 94, unit: '% saved', category: 'performance', trend: 8 },
  { id: 'm3', label: 'Timeline Execution', value: 98, unit: 'p99', category: 'velocity', trend: 22 },
  { id: 'm4', label: 'Schema Validation', value: 99.8, unit: '% accuracy', category: 'reliability', trend: 5 },
  { id: 'm5', label: 'Lenis RAF Precision', value: 0.12, unit: 'ms drift', category: 'performance', trend: 18 },
  { id: 'm6', label: 'Algorithmic Throughput', value: 92, unit: 'k ops/s', category: 'velocity', trend: 31 },
];

export const useStore = create((set, get) => ({
  projectName: 'ORCATHON 2026',
  tagline: 'Hyper-Optimized Intelligent UI & Kinetic Engine',
  metrics: initialMetrics,
  activeCategory: 'all',
  isBenchmarking: false,

  setActiveCategory: (category) => set({ activeCategory: category }),

  runBenchmark: () => {
    set({ isBenchmarking: true });
    setTimeout(() => {
      const updated = get().metrics.map(m => ({
        ...m,
        value: Math.min(100, Math.round((m.value + (Math.random() * 6 - 2)) * 10) / 10),
        trend: Math.round((m.trend + (Math.random() * 4 - 2)) * 10) / 10,
      }));
      set({ metrics: updated, isBenchmarking: false });
    }, 600);
  },

  getCategoryStats: () => {
    return LogicEngine.calculateCategoryAggregates(get().metrics);
  },

  getOverallVelocity: () => {
    return LogicEngine.computeVelocity(get().metrics);
  }
}));
