import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import type { Task, CheckIn } from './types';
import {
  getTodayStr,
  formatDate,
  TASK_COLORS,
  calculateStreak,
  calculateTotalDays,
  calculateMonthlyCount,
} from './utils';
import { Clock } from './components/Clock';
import { StatsBar } from './components/StatsBar';
import { TaskSection } from './components/TaskSection';
import { HeatmapChart } from './components/HeatmapChart';
import { LoginPage } from './pages/LoginPage';
import { Activity, LogOut } from 'lucide-react';

type Page = 'login' | 'main';

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('habit_tasks_v1');
    localStorage.removeItem('habit_checkins_v1');
    localStorage.removeItem('habit_initialized_v1');
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setCurrentPage('main');
    } else {
      setCurrentPage('login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    loadUserData();
  }, [user?.id]);

  const loadUserData = async () => {
    if (!user) return;
    setDataLoading(true);

    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (existingTasks && existingTasks.length > 0) {
      const todayStr = getTodayStr();
      const mappedTasks: Task[] = existingTasks
        .map((t: Record<string, unknown>) => ({
          id: t.id as string,
          name: t.name as string,
          description: t.description as string,
          createdAt: t.created_at as string,
          color: t.color as string,
        }))
        .filter((t) => t.createdAt.substring(0, 10) === todayStr);
      setTasks(mappedTasks);
    } else {
      setTasks([]);
    }

    const { data: existingCheckIns } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id);

    if (existingCheckIns) {
      const mappedCheckIns: CheckIn[] = existingCheckIns.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        taskId: c.task_id as string,
        taskName: c.task_name as string,
        date: c.date as string,
        time: c.time as string,
        datetime: c.datetime as string,
      }));
      setCheckIns(mappedCheckIns);
    } else {
      setCheckIns([]);
    }

    setDataLoading(false);
  };

  const handleAddTask = useCallback(
    async (name: string, description: string, color: string) => {
      if (!user) return;
      const task: Task = {
        id: `task_${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        color: color || TASK_COLORS[tasks.length % TASK_COLORS.length],
      };
      setTasks((prev) => [...prev, task]);

      await supabase.from('tasks').insert({
        id: task.id,
        user_id: user.id,
        name: task.name,
        description: task.description,
        created_at: task.createdAt,
        color: task.color,
      });
    },
    [tasks.length, user]
  );

  const handleEditTask = useCallback(
    async (id: string, name: string, description: string) => {
      if (!user) return;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, name, description } : t))
      );
      setCheckIns((prev) =>
        prev.map((ci) => (ci.taskId === id ? { ...ci, taskName: name } : ci))
      );

      await supabase
        .from('tasks')
        .update({ name, description })
        .eq('id', id);

      await supabase
        .from('checkins')
        .update({ task_name: name })
        .eq('task_id', id);
    },
    [user]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      if (!user) return;
      setTasks((prev) => prev.filter((t) => t.id !== id));

      await supabase.from('tasks').delete().eq('id', id);
    },
    [user]
  );

  const handleCheckIn = useCallback(
    async (taskId: string) => {
      if (!user) return;
      const today = getTodayStr();
      const alreadyChecked = checkIns.some(
        (ci) => ci.taskId === taskId && ci.date === today
      );
      if (alreadyChecked) return;

      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const now = new Date();
      const checkIn: CheckIn = {
        id: `checkin_${Date.now()}`,
        taskId,
        taskName: task.name,
        date: today,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        datetime: now.toISOString(),
      };
      setCheckIns((prev) => [...prev, checkIn]);

      await supabase.from('checkins').insert({
        id: checkIn.id,
        user_id: user.id,
        task_id: checkIn.taskId,
        task_name: checkIn.taskName,
        date: checkIn.date,
        time: checkIn.time,
        datetime: checkIn.datetime,
      });
    },
    [checkIns, tasks, user]
  );

  const handleSignOut = async () => {
    await signOut();
    setTasks([]);
    setCheckIns([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #f0fdf4 0%, #f8fafc 40%, #faf5ff 100%)' }}>
        <div className="text-slate-400 text-sm">加载中...</div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #f0fdf4 0%, #f8fafc 40%, #faf5ff 100%)' }}>
        <div className="text-slate-400 text-sm">加载数据中...</div>
      </div>
    );
  }

  const streak = calculateStreak(checkIns);
  const totalDays = calculateTotalDays(checkIns);
  const monthlyCount = calculateMonthlyCount(checkIns);
  const totalCheckIns = checkIns.length;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: 'linear-gradient(145deg, #f0fdf4 0%, #f8fafc 40%, #faf5ff 100%)',
      }}
    >
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <Activity size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-slate-800 leading-tight"
                  style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}
                >
                  PokaStudy
                </span>
                <span className="text-xs text-slate-400 tracking-wide">时光有痕，不负朝夕</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2" />

            <div className="flex-1 min-w-0">
              <Clock />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 truncate max-w-[160px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        <StatsBar
          totalDays={totalDays}
          streak={streak}
          monthlyCount={monthlyCount}
          totalCheckIns={totalCheckIns}
        />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <TaskSection
              tasks={tasks}
              checkIns={checkIns}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCheckIn={handleCheckIn}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-slate-800" style={{ fontWeight: 700, fontSize: '1rem' }}>
                    打卡热力图
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">过去一年的打卡记录</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-400">
                    {totalDays} 天有打卡记录
                  </div>
                </div>
              </div>

              <HeatmapChart checkIns={checkIns} />
            </div>

            <RecentActivity checkIns={checkIns} tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
}

function RecentActivity({ checkIns, tasks }: { checkIns: CheckIn[]; tasks: Task[] }) {
  const today = getTodayStr();

  const getYesterdayStr = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return formatDate(y);
  };

  const recentDays: { date: string; items: CheckIn[] }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const items = checkIns.filter((ci) => ci.date === dateStr);
    if (items.length > 0) {
      recentDays.push({ date: dateStr, items });
    }
  }

  const getTaskColor = (taskId: string) =>
    tasks.find((t) => t.id === taskId)?.color || '#10b981';

  if (recentDays.length === 0) return null;

  const yesterday = getYesterdayStr();

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-slate-800 mb-3" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
        近期动态
      </h3>
      <div className="flex flex-col gap-3">
        {recentDays.map(({ date, items }) => {
          const d = new Date(date + 'T00:00:00');
          const label =
            date === today ? '今天' :
            date === yesterday ? '昨天' :
            `${d.getMonth() + 1}月${d.getDate()}日`;

          return (
            <div key={date} className="flex items-start gap-3">
              <div className="shrink-0 text-xs text-slate-400 w-10 pt-1 text-right">{label}</div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {items.map((ci) => (
                  <div
                    key={ci.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: getTaskColor(ci.taskId) + '18',
                      color: getTaskColor(ci.taskId),
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: getTaskColor(ci.taskId) }}
                    />
                    {ci.taskName}
                    {ci.time && (
                      <span className="opacity-60">{ci.time.substring(0, 5)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
