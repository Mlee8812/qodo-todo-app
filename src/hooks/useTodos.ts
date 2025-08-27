import { useCallback, useEffect, useMemo, useState } from 'react';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export type Filter = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'qodo_todos_react_v1';

function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore persistence errors
    }
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [{ id: uid(), text: t, completed: false, createdAt: Date.now() }, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    const nt = text.trim();
    if (!nt) {
      // if cleared, remove
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: nt } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const itemsLeft = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return {
    todos,
    filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    clearCompleted,
    setFilter,
    itemsLeft,
  } as const;
}
