"use client";

import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. Загружаем задачи из LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('my-ai-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
      setLoading(false);
    } else {
      // Если в памяти пусто, тянем из интернета
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=3")
        .then(res => res.json())
        .then(data => {
          setTasks(data);
          setLoading(false);
        });
    }
  }, []);

  // 2. Сохраняем при каждом изменении
  useEffect(() => {
    localStorage.setItem('my-ai-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

const analyzeTasks = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const optimized = tasks.map(t => {
        // Убираем ракету из старого текста, если она там была
        const cleanTitle = t.title.replace("🚀 ", ""); 
        
        return {
          ...t,
          // Добавляем "СРОЧНО:" только если его еще нет
          title: cleanTitle.startsWith("СРОЧНО:") 
            ? cleanTitle 
            : `СРОЧНО: ${cleanTitle}`
        };
      });
      setTasks(optimized);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black text-white p-5 md:p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Заголовок */}
        <header className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <h1 className="text-5xl font-black mb-2 tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Task Zen
          </h1>
          <p className="text-slate-400">Твой продуктивный космос</p>
        </header>

        {/* Поле ввода */}
        <div className="flex gap-2 mb-10 p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md focus-within:border-purple-500/50 transition-all">
          <input
            className="flex-1 bg-transparent px-4 py-2 outline-none text-white placeholder:text-slate-500"
            placeholder="Какая задача на сегодня?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all active:scale-95"
          >
            Добавить
          </button>
        </div>

        {/* Список задач */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Синхронизация с орбитой...</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`text-lg transition-all ${task.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                    {task.title}
                  </span>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Кнопка ИИ */}
        {tasks.length > 0 && (
          <button
            onClick={analyzeTasks}
            disabled={isAnalyzing}
            className="mt-12 w-full py-4 relative overflow-hidden group rounded-2xl font-black text-xl border border-purple-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] disabled:opacity-50"
          >
            <span className="relative z-10">
              {isAnalyzing ? " ИИ КЛАССИФИЦИРУЕТ..." : " ОПТИМИЗИРОВАТЬ ЧЕРЕЗ ИИ"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
          </button>
        )}

        <footer className="mt-20 text-center text-slate-600 text-xs tracking-widest uppercase">
          © 2026 Developed by Anastasia Weektorova • Powered by AI
        </footer>
      </div>
    </main>
  );
}