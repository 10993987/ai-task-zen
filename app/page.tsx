"use client";

import { useEffect, useState } from "react";

// Описываем структуру данных
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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

  const analyzeTasks = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const optimized = tasks.map(t => ({
        ...t,
        title: t.title.startsWith("🚀") ? t.title : `🚀 СРОЧНО: ${t.title}`
      }));
      setTasks(optimized);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <main className="p-6 md:p-10 bg-white min-h-screen max-w-2xl mx-auto font-sans text-slate-900">
      <h1 className="text-4xl font-black mb-8 tracking-tight">AI Task Zen</h1>

      {/* Поле ввода */}
      <div className="flex gap-2 mb-10">
        <input
          className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          placeholder="Что нужно сделать?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button 
          onClick={addTask}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
        >
          Добавить
        </button>
      </div>

      {/* Список задач */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-slate-400 animate-pulse">Загрузка данных...</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-5 border-2 border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ID: {task.id}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${task.completed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {task.completed ? "ГОТОВО" : "В РАБОТЕ"}
                </span>
              </div>
              <p className="text-xl font-semibold mb-5 leading-tight">{task.title}</p>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-sm font-bold text-red-500 hover:text-red-700 underline underline-offset-4"
              >
                Удалить задачу
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
          className="mt-12 w-full py-4 border-4 border-blue-600 text-blue-600 rounded-2xl font-black text-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:border-slate-300 disabled:text-slate-300"
        >
          {isAnalyzing ? "ИИ АНАЛИЗИРУЕТ..." : "ОПТИМИЗИРОВАТЬ ЧЕРЕЗ ИИ"}
        </button>
      )}
    </main>
  );
}