"use client";

import { toggleTodo, deleteTodo } from "../actions";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { Todo } from "../types";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 py-3"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
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
              onClick={() => deleteTodo(todo.id)}
              className="shrink-0 text-neutral-300 hover:text-black transition-colors"
            >
              <IconX size={16} stroke={1.5} />
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
