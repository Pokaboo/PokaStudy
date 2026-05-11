import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Check,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, CheckIn } from '../types';
import { getTodayStr, TASK_COLORS } from '../utils';

interface TaskSectionProps {
  tasks: Task[];
  checkIns: CheckIn[];
  onAddTask: (name: string, description: string, color: string) => void;
  onEditTask: (id: string, name: string, description: string) => void;
  onDeleteTask: (id: string) => void;
  onCheckIn: (taskId: string) => void;
}

interface TaskCardProps {
  task: Task;
  isCheckedToday: boolean;
  lastCheckIn: CheckIn | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onCheckIn: () => void;
}

function TaskCard({ task, isCheckedToday, lastCheckIn, onEdit, onDelete, onCheckIn }: TaskCardProps) {
  const [animate, setAnimate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCheckIn = () => {
    if (isCheckedToday) return;
    setAnimate(true);

    // Trigger confetti burst
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fff'],
      scalar: 0.9,
    });

    onCheckIn();
    setTimeout(() => setAnimate(false), 700);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group"
    >
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
              style={{ backgroundColor: task.color + '20' }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-slate-800 truncate" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {task.name}
              </div>
              {task.description && (
                <div className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                  {task.description}
                </div>
              )}
              {isCheckedToday && lastCheckIn && (
                <div className="flex items-center gap-1 mt-1.5 text-emerald-600 text-xs">
                  <Clock3 size={11} />
                  <span>今日已打卡 · {lastCheckIn.time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
              title="编辑任务"
            >
              <Edit3 size={14} />
            </button>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="删除任务"
              >
                <Trash2 size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                  className="px-2 py-1 rounded-lg text-xs text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  确认
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Check-in button */}
        <div className="mt-3">
          <motion.button
            animate={
              animate
                ? {
                    scale: [1, 0.88, 1.18, 1.0, 1],
                    x: [0, -3, 3, -2, 2, 0],
                  }
                : { scale: 1, x: 0 }
            }
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onClick={handleCheckIn}
            disabled={isCheckedToday}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200 select-none"
            style={
              isCheckedToday
                ? {
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    border: '1.5px solid #bbf7d0',
                    cursor: 'not-allowed',
                    boxShadow: animate
                      ? '0 0 0 6px rgba(16,185,129,0.2), 0 0 24px rgba(16,185,129,0.35)'
                      : 'none',
                  }
                : {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    border: '1.5px solid transparent',
                    cursor: 'pointer',
                    boxShadow: animate
                      ? '0 0 0 8px rgba(16,185,129,0.25), 0 0 32px rgba(16,185,129,0.4)'
                      : '0 2px 8px rgba(16,185,129,0.3)',
                  }
            }
          >
            {isCheckedToday ? (
              <>
                <CheckCircle2 size={16} />
                <span className="text-sm">今日已完成</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span className="text-sm">立即打卡</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

interface EditFormProps {
  task: Task;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

function EditForm({ task, onSave, onCancel }: EditFormProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 overflow-hidden"
    >
      <div className="px-4 py-3 flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="任务名称"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="任务描述（可选）"
          rows={2}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => name.trim() && onSave(name.trim(), description.trim())}
            className="flex-1 py-2 rounded-xl text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            保存
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function TaskSection({
  tasks,
  checkIns,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCheckIn,
}: TaskSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState(TASK_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const today = getTodayStr();

  const getIsCheckedToday = (taskId: string) =>
    checkIns.some((ci) => ci.taskId === taskId && ci.date === today);

  const getLastCheckIn = (taskId: string) =>
    checkIns
      .filter((ci) => ci.taskId === taskId && ci.date === today)
      .sort((a, b) => b.datetime.localeCompare(a.datetime))[0];

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddTask(newName.trim(), newDesc.trim(), newColor);
    setNewName('');
    setNewDesc('');
    setNewColor(TASK_COLORS[tasks.length % TASK_COLORS.length]);
    setShowAddForm(false);
    setShowColorPicker(false);
  };

  const todayCheckedCount = tasks.filter((t) => getIsCheckedToday(t.id)).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-800" style={{ fontWeight: 700, fontSize: '1rem' }}>
            我的任务
          </h2>
          {tasks.length > 0 && (
            <p className="text-slate-400 text-xs mt-0.5">
              今日已完成 {todayCheckedCount} / {tasks.length}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <Plus size={15} />
          新增任务
        </button>
      </div>

      {/* Add task form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="任务名称（必填）"
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                {/* Color picker trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-9 h-9 rounded-xl border-2 border-white shadow-md shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: newColor }}
                    title="选择颜色"
                  >
                    {showColorPicker ? (
                      <ChevronUp size={12} className="text-white" />
                    ) : (
                      <ChevronDown size={12} className="text-white" />
                    )}
                  </button>
                  {showColorPicker && (
                    <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl p-2 shadow-lg z-10 flex flex-wrap gap-1.5 w-32">
                      {TASK_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setNewColor(c); setShowColorPicker(false); }}
                          className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                          style={{
                            backgroundColor: c,
                            outline: newColor === c ? `2px solid ${c}` : 'none',
                            outlineOffset: 2,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="任务描述（可选）"
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="flex-1 py-2 rounded-xl text-sm text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  添加任务
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setShowColorPicker(false); }}
                  className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      {tasks.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Plus size={24} className="text-slate-300" />
          </div>
          <p className="text-sm">还没有任务，点击「新增任务」开始吧</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) =>
            editingId === task.id ? (
              <EditForm
                key={task.id}
                task={task}
                onSave={(name, desc) => {
                  onEditTask(task.id, name, desc);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <TaskCard
                key={task.id}
                task={task}
                isCheckedToday={getIsCheckedToday(task.id)}
                lastCheckIn={getLastCheckIn(task.id)}
                onEdit={() => setEditingId(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onCheckIn={() => onCheckIn(task.id)}
              />
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}