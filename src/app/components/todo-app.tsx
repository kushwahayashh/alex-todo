"use client";

import { useOptimistic, useRef, useState, startTransition } from "react";
import { addTodo, toggleTodo, deleteTodo } from "../actions";
import { SwipeableTodo } from "./swipeable-todo";
import { motion, AnimatePresence } from "framer-motion";
import type { Todo } from "../types";

type RenderTodo = Todo & { clientKey?: string };

type OptimisticAction =
  | { type: "add"; text: string; clientKey: string }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number };

export function TodoApp({ todos }: { todos: Todo[] }) {
  const [clientKeyById, setClientKeyById] = useState<Partial<Record<number, string>>>({});

  const [optimisticTodos, dispatch] = useOptimistic<RenderTodo[], OptimisticAction>(
    todos,
    (state, action) => {
      switch (action.type) {
        case "add":
          return [
            {
              id: -Date.now(),
              text: action.text,
              completed: false,
              clientKey: action.clientKey,
            },
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
      <AnimatePresence mode="wait">
        {optimisticTodos.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="py-8 text-center text-sm text-neutral-400"
          >
            No todos yet. Add one below.
          </motion.p>
        ) : (
          <motion.ul
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence initial={false}>
              {optimisticTodos.map((todo) => (
                <motion.li
                  key={
                    todo.id < 0
                      ? todo.clientKey ?? `temp-${Math.abs(todo.id)}`
                      : clientKeyById[todo.id] ?? `todo-${todo.id}`
                  }
                  initial={
                    todo.id < 0
                      ? { opacity: 0, height: 0, scale: 0.95 }
                      : false
                  }
                  animate={{
                    opacity: 1,
                    height: "auto",
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      opacity: { duration: 0.2 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    scale: 0.95,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      opacity: { duration: 0.15 },
                    },
                  }}
                  layout
                  style={{ overflow: "hidden" }}
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
          </motion.ul>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        className="fixed bottom-4 left-0 right-0 px-4 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="mx-auto max-w-md">
          <form
            ref={formRef}
            autoComplete="off"
            action={async (formData) => {
              const text = formData.get("text") as string;
              if (!text?.trim()) return;
              const clientKey = `todo-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`;
              formRef.current?.reset();
              startTransition(() => {
                dispatch({ type: "add", text: text.trim(), clientKey });
              });
              const inserted = await addTodo(formData, clientKey);
              if (!inserted || !inserted.clientKey) return;
              setClientKeyById((prev) => ({
                ...prev,
                [inserted.id]: inserted.clientKey,
              }));
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
      </motion.div>
    </>
  );
}
