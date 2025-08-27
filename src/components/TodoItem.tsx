import React, { useEffect, useId, useRef, useState } from 'react';
import type { Todo } from '../hooks/useTodos';

export type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const textId = useId();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editing]);

  useEffect(() => setValue(todo.text), [todo.text]);

  const commit = (save: boolean) => {
    if (!editing) return;
    setEditing(false);
    if (save) onEdit(todo.id, value);
    else setValue(todo.text);
    // Restore focus to the task text after finishing edit
    setTimeout(() => { textRef.current?.focus(); }, 0);
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} data-id={todo.id} role="listitem">
      <input
        type="checkbox"
        className="check"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-labelledby={textId}
      />

      {editing ? (
        <>
        <input
          ref={inputRef}
          className="edit"
          value={value}
          aria-label="Edit task"
          aria-describedby={`edit-controls-${todo.id}`}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => commit(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(true); }
            if (e.key === 'Escape') { e.preventDefault(); commit(false); }
          }}
        />
          <span id={`edit-controls-${todo.id}`} className="sr-only">Press Enter to save, Escape to cancel. Leaving the field saves.</span>
        </>
      ) : (
        <>
        <div
          ref={textRef}
          id={textId}
          className="text"
          tabIndex={0}
          onDoubleClick={() => setEditing(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'F2') { e.preventDefault(); setEditing(true); }
          }}
          aria-describedby={`edit-hint-${todo.id}`}
          title="Double-click or press Enter/F2 to edit"
        >
          {todo.text}
        </div>
          <span id={`edit-hint-${todo.id}`} className="sr-only">Press Enter or F2 to edit this task.</span>
        </>
      )}

      <div className="actions">
        <button className="icon-btn danger" onClick={() => onDelete(todo.id)} aria-label={`Delete task: ${todo.text}`}>🗑️</button>
      </div>
    </div>
  );
};

export default TodoItem;
