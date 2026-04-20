"use client";

import { useOptimistic, useRef, startTransition } from "react";
import { addTodo, toggleTodo, deleteTodo } from "../actions";
import { IconCircleArrowUpFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { SwipeableTodo } from "./swipeable-todo";
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
      {optimisticTodos.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">
          No todos yet. Add one below.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {optimisticTodos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  height: { type: "spring", stiffness: 400, damping: 35 },
                }}
              >
                <SwipeableTodo
                  todo={todo}
                  onToggle={async (id) => {
                    startTransition(() => {
                      dispatch({ type: "toggle", id });
                    });
                    await toggleTodo(id);
                  }}
                  onDelete={async (id) => {
                    startTransition(() => {
                      dispatch({ type: "delete", id });
                    });
                    await deleteTodo(id);
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
        <form
          ref={formRef}
          autoComplete="off"
          action={async (formData) => {
            const text = formData.get("text") as string;
            if (!text?.trim()) return;
            formRef.current?.reset();
            startTransition(() => {
              dispatch({ type: "add", text: text.trim() });
            });
            await addTodo(formData);
          }}
          className="mx-auto max-w-md relative"
        >
          <input
            type="text"
            name="text"
            placeholder="Add a todo..."
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            className="w-full rounded-lg border-2 border-neutral-300 bg-white pl-4 pr-12 py-3 text-sm font-medium text-black placeholder:text-neutral-400 outline-none focus:border-black hover:border-black"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black transition-colors"
          >
            <IconCircleArrowUpFilled size={32} />
          </button>
        </form>
      </div>
    </>
  );
}
