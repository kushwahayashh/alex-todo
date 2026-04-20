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
        <ul>
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
      <div className="fixed bottom-4 left-0 right-0 px-4 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto max-w-md">
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
            className="relative flex items-center rounded-full bg-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-neutral-200/60"
          >
            <input
              type="text"
              name="text"
              placeholder="New todo..."
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              className="flex-1 bg-transparent py-3.5 pl-5 pr-5 text-[15px] text-black placeholder:text-neutral-400 outline-none"
            />
          </form>
        </div>
      </div>
    </>
  );
}
