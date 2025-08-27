import React from 'react';
import { Todo } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';

export type TodoListProps = {
  items: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({ items, onToggle, onDelete, onEdit }) => {
  if (!items.length) {
    return <div className="empty">No tasks</div>;
  }
  return (
    <div className="list">
      {items.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TodoList;
