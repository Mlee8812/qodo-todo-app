import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads todos from localStorage on mount', async () => {
    localStorage.setItem(
      'qodo_todos_react_v1',
      JSON.stringify([{ id: 'x', text: 'Loaded from storage', completed: false, createdAt: Date.now() }])
    );
    render(<App />);
    expect(await screen.findByText('Loaded from storage')).toBeInTheDocument();
  });

  it('adds a todo via Enter and button click, and persists to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);

    await user.type(input, 'First task{enter}');
    expect(await screen.findByText('First task')).toBeInTheDocument();

    // Also check persistence
    const stored = localStorage.getItem('qodo_todos_react_v1');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)[0].text).toBe('First task');

    // Add via button
    await user.clear(input);
    await user.type(input, 'Second task');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(await screen.findByText('Second task')).toBeInTheDocument();
  });

  it('toggles completion and updates items left', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Go running{enter}');

    const checkbox = await screen.findByRole('checkbox');
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();

    await user.click(checkbox);
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument();

    await user.click(checkbox);
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  it('edits a todo inline (double-click, Enter to save, Escape to cancel)', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Editable{enter}');

    const text = await screen.findByText('Editable');

    // Start editing
    await user.dblClick(text);
    const edit = screen.getByDisplayValue('Editable');

    // Change text and save with Enter
    await user.clear(edit);
    await user.type(edit, 'Edited{enter}');
    expect(await screen.findByText('Edited')).toBeInTheDocument();

    // Start editing again, then cancel with Escape
    const text2 = await screen.findByText('Edited');
    await user.dblClick(text2);
    const edit2 = screen.getByDisplayValue('Edited');
    await user.type(edit2, ' (tmp){escape}');

    // Should remain unchanged
    expect(screen.getByText('Edited')).toBeInTheDocument();
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, 'Delete me{enter}');

    const item = await screen.findByText('Delete me');
    const todoRow = item.closest('.todo')!;
    const { getByRole } = within(todoRow);

    await user.click(getByRole('button', { name: /delete task/i }));

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  it('filters All/Active/Completed and clears completed', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);

    // Add two tasks
    await user.type(input, 'Task A{enter}');
    await user.type(input, 'Task B{enter}');

    // Complete A (it's the older item at the bottom; find both checkboxes and click the second)
    const checkboxes = await screen.findAllByRole('checkbox');
    // In our App, newest appears top; Task B is first checkbox, Task A second
    await user.click(checkboxes[1]);

    // Active filter (only Task B)
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.queryByText('Task B')).toBeInTheDocument();
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();

    // Completed filter (only Task A)
    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.queryByText('Task A')).toBeInTheDocument();
    expect(screen.queryByText('Task B')).not.toBeInTheDocument();

    // Clear completed removes Task A
    await user.click(screen.getByRole('button', { name: /clear completed/i }));
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();

    // All filter
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.queryByText('Task B')).toBeInTheDocument();
  });
});
