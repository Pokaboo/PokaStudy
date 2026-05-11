import { useMemo, useState, useRef, useEffect } from 'react';
import type { CheckIn } from '../types';
import { formatDate, formatDisplayDate, HEATMAP_COLORS, getHeatmapLevel } from '../utils';

interface HeatmapChartProps {
  checkIns: CheckIn[];
}

const MONTH_NAMES = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];

const DOW_DISPLAY = [
  { index: 0, label: '日' },
  { index: 3, label: '三' },
  { index: 6, label: '六' },
];

const CELL_SIZE = 11;
const CELL_GAP = 2;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const LEFT_OFFSET = 24;

interface TooltipState {
  x: number;
  y: number;
  dateStr: string;
  count: number;
  tasks: string[];
}

export function HeatmapChart({ checkIns }: HeatmapChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { weeks, dateMap, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDow = today.getDay();
    const thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() - todayDow);

    const startSunday = new Date(thisSunday);
    startSunday.setDate(thisSunday.getDate() - 52 * 7);

    const dateMap: Record<string, { count: number; tasks: string[] }> = {};
    checkIns.forEach((ci) => {
      if (!dateMap[ci.date]) dateMap[ci.date] = { count: 0, tasks: [] };
      dateMap[ci.date].count++;
      if (!dateMap[ci.date].tasks.includes(ci.taskName)) {
        dateMap[ci.date].tasks.push(ci.taskName);
      }
    });

    const weeks: (string | null)[][] = [];
    const monthLabels: { colIndex: number; label: string }[] = [];
    const current = new Date(startSunday);
    let prevMonth = -1;

    while (current <= thisSunday) {
      const week: (string | null)[] = [];
      let newMonthInWeek: number | null = null;

      for (let dow = 0; dow < 7; dow++) {
        const d = new Date(current);
        d.setDate(current.getDate() + dow);
        if (d > today) {
          week.push(null);
        } else {
          week.push(formatDate(d));
          if (d.getDate() === 1) newMonthInWeek = d.getMonth();
        }
      }

      if (newMonthInWeek !== null && newMonthInWeek !== prevMonth) {
        monthLabels.push({ colIndex: weeks.length, label: MONTH_NAMES[newMonthInWeek] });
        prevMonth = newMonthInWeek;
      } else if (prevMonth === -1) {
        const firstDay = week.find((d) => d !== null);
        if (firstDay) {
          const m = new Date(firstDay).getMonth();
          monthLabels.push({ colIndex: 0, label: MONTH_NAMES[m] });
          prevMonth = m;
        }
      }

      weeks.push(week);
      current.setDate(current.getDate() + 7);
    }

    return { weeks, dateMap, monthLabels };
  }, [checkIns]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks]);

  const handleMouseEnter = (e: React.MouseEvent, dateStr: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      dateStr,
      count: dateMap[dateStr]?.count || 0,
      tasks: dateMap[dateStr]?.tasks || [],
    });
  };

  const totalWidth = weeks.length * CELL_STEP;
  const todayStr = formatDate(new Date());

  return (
    <div>
      <div ref={scrollRef} className="overflow-x-auto pb-2 select-none">
        <div style={{ minWidth: totalWidth + LEFT_OFFSET + 10 }}>
          {/* Month labels row */}
          <div
            className="relative mb-1"
            style={{ height: 16, marginLeft: LEFT_OFFSET }}
          >
            {monthLabels.map((ml, i) => (
              <span
                key={i}
                className="absolute text-xs text-slate-400"
                style={{ left: ml.colIndex * CELL_STEP }}
              >
                {ml.label}
              </span>
            ))}
          </div>

          {/* Grid + weekday labels */}
          <div className="flex">
            {/* Weekday labels */}
            <div
              className="relative shrink-0"
              style={{ width: LEFT_OFFSET, height: 7 * CELL_STEP - CELL_GAP }}
            >
              {DOW_DISPLAY.map(({ index, label }) => (
                <span
                  key={index}
                  className="absolute text-xs text-slate-400 right-1"
                  style={{
                    top: index * CELL_STEP,
                    lineHeight: `${CELL_SIZE}px`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className="flex" style={{ gap: CELL_GAP }}>
              {weeks.map((week, colIndex) => (
                <div key={colIndex} className="flex flex-col" style={{ gap: CELL_GAP }}>
                  {week.map((dateStr, rowIndex) => {
                    const level = dateStr
                      ? getHeatmapLevel(dateMap[dateStr]?.count || 0)
                      : 0;
                    const color = HEATMAP_COLORS[level];
                    const isToday = dateStr === todayStr;

                    return (
                      <div
                        key={rowIndex}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderRadius: 2,
                          backgroundColor: dateStr ? color : 'transparent',
                          cursor: dateStr ? 'pointer' : 'default',
                          outline: isToday ? '2px solid #10b981' : 'none',
                          outlineOffset: 1,
                          transition: 'transform 0.1s ease',
                        }}
                        className={dateStr ? 'hover:scale-125' : ''}
                        onMouseEnter={
                          dateStr ? (e) => handleMouseEnter(e, dateStr) : undefined
                        }
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            className="flex items-center gap-1.5 mt-3"
            style={{ marginLeft: LEFT_OFFSET }}
          >
            <span className="text-xs text-slate-400">少</span>
            {HEATMAP_COLORS.map((color, i) => (
              <div
                key={i}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderRadius: 2,
                  backgroundColor: color,
                }}
              />
            ))}
            <span className="text-xs text-slate-400">多</span>
          </div>
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 shadow-2xl max-w-52 text-left">
            <div className="font-semibold mb-1 text-slate-100">
              {formatDisplayDate(tooltip.dateStr)}
            </div>
            {tooltip.count === 0 ? (
              <div className="text-slate-400">暂无打卡记录</div>
            ) : (
              <>
                <div className="text-emerald-400 mb-1.5">
                  共打卡 {tooltip.count} 次
                </div>
                <div className="flex flex-col gap-1">
                  {tooltip.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{task}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Arrow */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
