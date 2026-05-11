import { Flame, Calendar, CalendarDays, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  totalDays: number;
  streak: number;
  monthlyCount: number;
  totalCheckIns: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  bg: string;
}

function StatCard({ icon, value, label, color, bg }: StatCardProps) {
  return (
    <div className="flex-1 min-w-0 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
      <div className={`${bg} p-2 rounded-xl shrink-0`}>
        <div className={color}>{icon}</div>
      </div>
      <div className="min-w-0">
        <div
          className="text-slate-800 tabular-nums"
          style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}
        >
          {value.toLocaleString()}
        </div>
        <div className="text-slate-500 text-xs truncate">{label}</div>
      </div>
    </div>
  );
}

export function StatsBar({ totalDays, streak, monthlyCount, totalCheckIns }: StatsBarProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <StatCard
        icon={<Flame size={18} />}
        value={streak}
        label="连续打卡天数"
        color="text-orange-500"
        bg="bg-orange-50"
      />
      <StatCard
        icon={<CalendarDays size={18} />}
        value={totalDays}
        label="累计打卡天数"
        color="text-emerald-600"
        bg="bg-emerald-50"
      />
      <StatCard
        icon={<Calendar size={18} />}
        value={monthlyCount}
        label="本月打卡次数"
        color="text-blue-500"
        bg="bg-blue-50"
      />
      <StatCard
        icon={<CheckCircle2 size={18} />}
        value={totalCheckIns}
        label="总打卡次数"
        color="text-purple-500"
        bg="bg-purple-50"
      />
    </div>
  );
}
