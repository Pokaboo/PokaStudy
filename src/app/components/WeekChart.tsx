import { useMemo, useState } from 'react';
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
import { BarChart3, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

interface WeekChartProps {
  checkIns: CheckIn[];
  tasks: Task[];
}

const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function WeekChart({ checkIns, tasks }: WeekChartProps) {
  const today = getTodayStr();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

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

  const handleBarClick = (data: Record<string, unknown>) => {
    if (data && data.date) {
      setSelectedDay(data.date as string);
      setPopoverOpen(true);
    }
  };

  const selectedDayLabel = selectedDay
    ? WEEKDAY_LABELS[chartData.findIndex((d) => d.date === selectedDay)] || ''
    : '';

  const selectedDayRecords = selectedDay
    ? checkIns.filter((ci) => ci.date === selectedDay)
    : [];

  const getTaskColor = (taskId: string) =>
    tasks.find((t) => t.id === taskId)?.color || '#10b981';

  if (tasks.length === 0) return null;

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-slate-500" />
        <h3 className="text-slate-800" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          本周概览
        </h3>
      </div>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div style={{ width: '100%', height: hasData ? 200 : 'auto' }}>
            {hasData ? (
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
                      cursor="pointer"
                      onClick={(data) => handleBarClick(data as Record<string, unknown>)}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
                <p>本周暂无打卡数据</p>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="center" sideOffset={8}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-800">{selectedDayLabel}</span>
                <span className="text-xs text-slate-400 ml-2">{selectedDay}</span>
              </div>
              <button
                onClick={() => setPopoverOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            {selectedDayRecords.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedDayRecords.map((ci) => {
                  const task = tasks.find((t) => t.id === ci.taskId);
                  return (
                    <div
                      key={ci.id}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                      style={{ backgroundColor: getTaskColor(ci.taskId) + '10' }}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: getTaskColor(ci.taskId) }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: getTaskColor(ci.taskId) }}
                      >
                        {ci.taskName}
                      </span>
                      {task?.description && (
                        <span className="text-xs text-slate-400 truncate max-w-[120px]">
                          {task.description}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 ml-auto">{ci.time?.substring(0, 5)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">当天无打卡记录</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
