"use client";

import { toggleTodo, deleteTodo } from "../actions";

import type { Todo } from "../types";

export function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-neutral-400">
        No todos yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center gap-3 py-3">
          <button
            onClick={() => toggleTodo(todo.id)}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              todo.completed
                ? "border-black bg-black"
                : "border-neutral-300 bg-white"
            }`}
          >
            {todo.completed && (
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                className="text-white"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span
            className={`flex-1 text-sm ${
              todo.completed ? "text-neutral-400 line-through" : "text-black"
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="shrink-0 text-neutral-300 hover:text-black"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
