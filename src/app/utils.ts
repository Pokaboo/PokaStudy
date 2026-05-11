import type { Task, CheckIn } from './types';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayStr(): string {
  return formatDate(new Date());
}

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

// Seeded pseudo-random for deterministic sample data
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (h >>> 0) / 0xffffffff;
}

export const TASK_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task_default_1',
    name: '晨间冥想',
    description: '每天早晨 10 分钟冥想，专注呼吸，开启平静的一天',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#6366f1',
  },
  {
    id: 'task_default_2',
    name: '阅读',
    description: '阅读 30 分钟，拓展认知边界',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#f59e0b',
  },
  {
    id: 'task_default_3',
    name: '运动健身',
    description: '30 分钟有氧或力量训练，保持健康体态',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    color: '#10b981',
  },
];

export function generateSampleCheckIns(tasks: Task[]): CheckIn[] {
  const checkIns: CheckIn[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= 240; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const dow = date.getDay();

    // Higher prob on weekdays, lower on weekends
    const baseProb = dow === 0 || dow === 6 ? 0.45 : 0.72;
    const roll = seededRandom(dateStr);
    if (roll > baseProb) continue;

    // Decide how many tasks to check in
    const numTasks = Math.ceil(seededRandom(dateStr + 'n') * Math.min(tasks.length, 3));
    const shuffled = [...tasks].sort(
      (a, b) => seededRandom(dateStr + a.id) - seededRandom(dateStr + b.id)
    );

    for (let j = 0; j < numTasks; j++) {
      const task = shuffled[j];
      checkIns.push({
        id: `sample_${i}_${j}`,
        taskId: task.id,
        taskName: task.name,
        date: dateStr,
        time: '08:00:00',
        datetime: date.toISOString(),
      });
    }
  }

  return checkIns;
}

export function calculateStreak(checkIns: CheckIn[]): number {
  const uniqueDates = new Set(checkIns.map((ci) => ci.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(today);
  // If today has no check-in, start checking from yesterday
  if (!uniqueDates.has(formatDate(current))) {
    current.setDate(current.getDate() - 1);
  }

  let streak = 0;
  while (uniqueDates.has(formatDate(current))) {
    streak++;
    current.setDate(current.getDate() - 1);
    if (streak > 10000) break; // safety
  }
  return streak;
}

export function calculateTotalDays(checkIns: CheckIn[]): number {
  return new Set(checkIns.map((ci) => ci.date)).size;
}

export function calculateMonthlyCount(checkIns: CheckIn[]): number {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return checkIns.filter((ci) => ci.date.startsWith(prefix)).length;
}

export function getHeatmapLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export const HEATMAP_COLORS = [
  '#ebedf0', // level 0
  '#9be9a8', // level 1
  '#40c463', // level 2
  '#30a14e', // level 3
  '#216e39', // level 4
];
