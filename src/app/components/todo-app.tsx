"use client";

import { useOptimistic, useRef } from "react";
import { addTodo, toggleTodo, deleteTodo } from "../actions";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { Todo } from "../types";

type OptimisticAction =
  | { type: "add"; text: string }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number };

export function TodoApp({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, dispatch] = useOptimistic<Todo[], OptimisticAction>(
    todos,
    (state, action) => {
      switch (action.type) {
        case "add":
          return [
            { id: -Date.now(), text: action.text, completed: false },
            ...state,
          ];
        case "toggle":
          return state.map((t) =>
            t.id === action.id ? { ...t, completed: !t.completed } : t
          );
        case "delete":
          return state.filter((t) => t.id !== action.id);
      }
    }
  );

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <TodoList
        todos={optimisticTodos}
        onToggle={async (id) => {
          dispatch({ type: "toggle", id });
          await toggleTodo(id);
        }}
        onDelete={async (id) => {
          dispatch({ type: "delete", id });
          await deleteTodo(id);
        }}
      />
      <div className="mt-6">
        <form
          ref={formRef}
          action={async (formData) => {
            const text = formData.get("text") as string;
            if (!text?.trim()) return;
            formRef.current?.reset();
            dispatch({ type: "add", text: text.trim() });
            await addTodo(formData);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            name="text"
            placeholder="Add a todo..."
            required
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black"
          />
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
}

function TodoList({
  todos,
  onToggle,
  onDelete,
}: {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
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
            onClick={() => onToggle(todo.id)}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
              todo.completed
                ? "border-black bg-black scale-100"
                : "border-neutral-300 bg-white hover:border-neutral-400"
            }`}
          >
            <IconCheck
              size={14}
              stroke={3}
              className={`text-white transition-all duration-200 ${
                todo.completed ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
          </button>
          <span
            className={`flex-1 text-sm transition-all duration-200 ${
              todo.completed ? "text-neutral-400" : "text-black"
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="shrink-0 text-neutral-300 hover:text-black transition-colors"
          >
            <IconX size={16} stroke={1.5} />
          </button>
        </li>
      ))}
    </ul>
  );
}
