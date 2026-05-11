import { useState, useEffect } from 'react';

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Use a precise interval synced to the second
    const tick = () => {
      setNow(new Date());
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekday = WEEKDAYS[now.getDay()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6 w-full">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-500 tracking-wide text-sm">
          {year}年{month}月{day}日 &nbsp;
          <span className="text-slate-700">{weekday}</span>
        </span>
      </div>
      <div
        className="tabular-nums tracking-widest text-slate-800"
        style={{ fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.08em' }}
      >
        <span>{hours}</span>
        <span className="mx-0.5 opacity-60">:</span>
        <span>{minutes}</span>
        <span className="mx-0.5 opacity-60">:</span>
        <span className="text-emerald-500">{seconds}</span>
      </div>
    </div>
  );
}
