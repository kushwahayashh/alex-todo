"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import { IconCheck, IconSquareRoundedMinusFilled } from "@tabler/icons-react";
import type { Todo } from "../types";

const COMPLETE_THRESHOLD = 80;
const DELETE_THRESHOLD = -80;

export function SwipeableTodo({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const x = useMotionValue(0);
  const [swiping, setSwiping] = useState(false);

  const completeOpacity = useTransform(x, [0, COMPLETE_THRESHOLD], [0, 1]);
  const completeIconOpacity = useTransform(
    x,
    [COMPLETE_THRESHOLD - 20, COMPLETE_THRESHOLD],
    [0, 1]
  );

  const deleteOpacity = useTransform(x, [DELETE_THRESHOLD, 0], [1, 0]);
  const deleteIconOpacity = useTransform(
    x,
    [DELETE_THRESHOLD, DELETE_THRESHOLD + 20],
    [1, 0]
  );

  const handleDragEnd = async (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;

    if (offset > COMPLETE_THRESHOLD) {
      onToggle(todo.id);
    } else if (offset < DELETE_THRESHOLD) {
      onDelete(todo.id);
    }
    
    animate(x, 0, {
      type: "spring",
      stiffness: 500,
      damping: 35,
    });
    setSwiping(false);
  };

  return (
    <div className="relative overflow-hidden border-b border-neutral-200 shadow-none">
      <motion.div
        className="absolute inset-0 flex items-center justify-start pl-5 bg-emerald-500"
        style={{ opacity: completeOpacity }}
      >
        <motion.div style={{ opacity: completeIconOpacity }}>
          <IconCheck size={22} stroke={2.5} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-5 bg-red-500"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ opacity: deleteIconOpacity }}>
          <IconSquareRoundedMinusFilled size={22} className="text-white" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        style={{ x }}
        onDragStart={() => setSwiping(true)}
        onDragEnd={handleDragEnd}
        className="relative flex items-start gap-3 bg-white py-3 px-4 touch-pan-y"
      >
        <motion.button
          onClick={() => !swiping && onToggle(todo.id)}
          whileTap={{ scale: 0.75 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors duration-200 ${
            todo.completed
              ? "border-black bg-black"
              : "border-neutral-300 bg-white"
          }`}
        >
          <motion.div
            initial={false}
            animate={{
              scale: todo.completed ? 1 : 0,
              opacity: todo.completed ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <IconCheck size={14} stroke={3} className="text-white" />
          </motion.div>
        </motion.button>
        <div className="flex-1">
          <span
            className={`block text-sm font-medium ${
              todo.completed
                ? "text-neutral-400 line-through decoration-neutral-300"
                : "text-black"
            }`}
          >
            {todo.text}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
