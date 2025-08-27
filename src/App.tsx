import React, { useRef, useState } from 'react';
import { Filter, useTodos } from './hooks/useTodos';
import { TodoList } from './components/TodoList';

const styles = `
:root {
  --bg: #0f172a;
  --panel: #111827;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --accent: #22c55e;
  --danger: #ef4444;
  --outline: #374151;
}
*{box-sizing:border-box}
body{margin:0;background:#0b1220;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:var(--text)}
.app{max-width:720px;margin:40px auto;background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid var(--outline);border-radius:16px;box-shadow:0 10px 20px rgba(0,0,0,.35);overflow:hidden}
.header{padding:20px 20px 8px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--outline)}
.title{display:flex;align-items:center;gap:12px;font-weight:700;letter-spacing:.2px}
.title .logo{width:28px;height:28px;display:grid;place-items:center;background:#16a34a22;color:#22c55e;border:1px solid #16a34a44;border-radius:8px;font-size:16px}
.input-row{padding:12px 20px 20px;display:grid;grid-template-columns:1fr auto;gap:10px}
.input-row input[type=text]{width:100%;padding:14px 14px;background:#0b1220;border:1px solid var(--outline);border-radius:10px;color:var(--text);outline:none}
.input-row input[type=text]::placeholder{color:var(--muted)}
.btn{appearance:none;border:1px solid var(--outline);background:#0b1220;color:var(--text);padding:12px 14px;border-radius:10px;cursor:pointer;transition:transform .08s ease,background .2s ease,border-color .2s ease}
.btn:hover{transform:translateY(-1px);border-color:#4b5563}
.btn:active{transform:translateY(0)}
.btn.primary{background:#16a34a22;border-color:#16a34a55;color:#a7f3d0}
.toolbar{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;gap:12px;border-top:1px solid var(--outline);border-bottom:1px solid var(--outline)}
.filters{display:flex;gap:6px;flex-wrap:wrap}
.filter-btn{padding:8px 10px;font-size:14px;border-radius:8px;background:#0b1220;border:1px solid var(--outline);color:var(--text);cursor:pointer}
.filter-btn.active{background:#111827;border-color:#4b5563}
.list{padding:8px 10px 8px 8px}
.todo{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px 12px;margin:8px 0;background:#0b1220;border:1px solid var(--outline);border-radius:10px}
.todo.completed{opacity:.7}
.todo .check{width:20px;height:20px;cursor:pointer;accent-color:var(--accent)}
.todo .text{padding:8px 10px;border-radius:8px;min-height:20px;word-break:break-word}
.todo.completed .text{text-decoration:line-through;color:var(--muted)}
.todo .actions{display:flex;gap:6px}
.icon-btn{border:1px solid var(--outline);background:transparent;color:var(--muted);width:34px;height:34px;display:grid;place-items:center;border-radius:8px;cursor:pointer}
.icon-btn:hover{color:var(--text);border-color:#4b5563}
.icon-btn.danger:hover{color:#fecaca;border-color:#ef4444;background:#ef44441a}
.footer{display:flex;align-items:center;justify-content:space-between;padding:12px 20px 18px;gap:12px}
.muted{color:var(--muted);font-size:14px}
.empty{padding:16px;color:var(--muted)}
.edit{width:100%;padding:8px 10px;background:#0b1220;border:1px solid var(--outline);border-radius:8px;color:var(--text)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;

export const App: React.FC = () => {
  const { filteredTodos, addTodo, toggleTodo, removeTodo, editTodo, clearCompleted, itemsLeft, filter, setFilter } = useTodos();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAdd = () => {
    if (!input.trim()) return;
    addTodo(input);
    setInput('');
    // Return focus to the input for rapid entry
    inputRef.current?.focus();
  };

  const FilterButton: React.FC<{ name: Filter; label: string }> = ({ name, label }) => (
    <button
      className={`filter-btn ${filter === name ? 'active' : ''}`}
      onClick={() => setFilter(name)}
      aria-pressed={filter === name}
    >
      {label}
    </button>
  );

  return (
    <div className="app" aria-labelledby="app-title">
      <style>{styles}</style>
      <header className="header">
        <div className="title">
          <div className="logo" aria-hidden>✔</div>
          <h1 id="app-title" style={{ margin: 0 }}>Qodo To-Do (React + TS)</h1>
        </div>
      </header>

      <section className="input-row" aria-label="Add new task">
        <label htmlFor="new-todo" className="sr-only">Add a task</label>
        <input
          id="new-todo"
          ref={inputRef}
          type="text"
          placeholder="What needs to be done? (Press Enter to add)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          aria-describedby="add-instructions"
        />
        <button className="btn primary" onClick={handleAdd} aria-label="Add task">Add</button>
        <span id="add-instructions" className="sr-only">Press Enter to add the task</span>
      </section>

      <section className="toolbar" aria-label="Filters and actions">
        <div className="filters" role="tablist" aria-label="Filter tasks">
          <FilterButton name="all" label="All" />
          <FilterButton name="active" label="Active" />
          <FilterButton name="completed" label="Completed" />
        </div>
        <div>
          <button className="btn" onClick={clearCompleted} aria-label="Clear completed tasks">Clear completed</button>
        </div>
      </section>

      <TodoList items={filteredTodos} onToggle={toggleTodo} onDelete={removeTodo} onEdit={editTodo} />

      <footer className="footer">
        <div className="muted">{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</div>
        <div className="muted">Double-click a task to edit</div>
      </footer>
    </div>
  );
};

export default App;
