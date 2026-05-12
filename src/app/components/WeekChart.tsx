import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CheckIn, Task } from '../types';
import { formatDate, getTodayStr } from '../utils';
import { BarChart3 } from 'lucide-react';

interface WeekChartProps {
  checkIns: CheckIn[];
  tasks: Task[];
}

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function WeekChart({ checkIns, tasks }: WeekChartProps) {
  const today = getTodayStr();

  const { chartData, hasData } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    let hasAnyData = false;

    const data = WEEKDAY_LABELS.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDate(d);
      const isToday = dateStr === today;
      const isFuture = d > now && dateStr !== today;

      const row: Record<string, string | number> = { day: label, date: dateStr };

      tasks.forEach((task) => {
        const count = isFuture
          ? 0
          : checkIns.filter((ci) => ci.taskId === task.id && ci.date === dateStr).length;
        row[task.name] = count;
        if (count > 0) hasAnyData = true;
      });

      row._isToday = isToday ? 1 : 0;
      row._isFuture = isFuture ? 1 : 0;

      return row;
    });

    return { chartData: data, hasData: hasAnyData };
  }, [checkIns, tasks, today]);

  if (tasks.length === 0) return null;

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-slate-500" />
        <h3 className="text-slate-800" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          本周概览
        </h3>
      </div>

      {hasData ? (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: 12,
                  padding: '8px 12px',
                }}
                labelFormatter={(label: string) => {
                  const item = chartData.find((d) => d.day === label);
                  return item ? `${label} (${item.date})` : label;
                }}
              />
              {tasks.map((task) => (
                <Bar
                  key={task.id}
                  dataKey={task.name}
                  fill={task.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
          <p>本周暂无打卡数据</p>
        </div>
      )}
    </div>
  );
}
