import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useTodos } from './useTodos';

function setStored(value: unknown) {
  localStorage.setItem('qodo_todos_react_v1', JSON.stringify(value));
}

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads from localStorage on init', () => {
    setStored([{ id: 'a', text: 'Saved', completed: false, createdAt: Date.now() }]);
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Saved');
  });

  it('persists to localStorage on change', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Persist me'));

    const raw = localStorage.getItem('qodo_todos_react_v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe('Persist me');
  });

  it('adds a todo (trim, ignore empty)', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('   '));
    expect(result.current.todos).toHaveLength(0);

    act(() => result.current.addTodo(' Task '));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Task');
  });

  it('toggles completion', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('A'));
    const id = result.current.todos[0].id;
    act(() => result.current.toggleTodo(id));
    expect(result.current.todos[0].completed).toBe(true);
    act(() => result.current.toggleTodo(id));
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('edits text or deletes if emptied', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('Edit me'));
    const id = result.current.todos[0].id;

    act(() => result.current.editTodo(id, 'New text'));
    expect(result.current.todos[0].text).toBe('New text');

    act(() => result.current.editTodo(id, '   '));
    expect(result.current.todos).toHaveLength(0);
  });

  it('removes a todo', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('X'));
    const id = result.current.todos[0].id;
    act(() => result.current.removeTodo(id));
    expect(result.current.todos).toHaveLength(0);
  });

  it('filters active and completed and counts itemsLeft', () => {
    const { result } = renderHook(() => useTodos());
    act(() => result.current.addTodo('A'));
    act(() => result.current.addTodo('B'));
    const idA = result.current.todos[1].id; // 'A' was first added, then unshifted
    act(() => result.current.toggleTodo(idA)); // complete A

    // all
    expect(result.current.filteredTodos).toHaveLength(2);

    // active
    act(() => result.current.setFilter('active'));
    expect(result.current.filteredTodos).toHaveLength(1);
    expect(result.current.itemsLeft).toBe(1);

    // completed
    act(() => result.current.setFilter('completed'));
    expect(result.current.filteredTodos).toHaveLength(1);

    // clear completed
    act(() => result.current.clearCompleted());
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].completed).toBe(false);
  });
});
