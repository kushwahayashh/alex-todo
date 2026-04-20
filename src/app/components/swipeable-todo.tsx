"use client";

import { useState, useRef } from "react";
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

  // Right swipe (complete) - green background opacity
  const completeOpacity = useTransform(x, [0, COMPLETE_THRESHOLD], [0, 1]);
  const completeScale = useTransform(x, [0, 40, COMPLETE_THRESHOLD], [0.5, 0.8, 1]);

  // Left swipe (delete) - red background opacity
  const deleteOpacity = useTransform(x, [DELETE_THRESHOLD, 0], [1, 0]);
  const deleteScale = useTransform(x, [DELETE_THRESHOLD, -40, 0], [1, 0.8, 0.5]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;

    if (offset > COMPLETE_THRESHOLD) {
      await animate(x, 400, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      onToggle(todo.id);
      animate(x, 0, { duration: 0 });
    } else if (offset < DELETE_THRESHOLD) {
      await animate(x, -400, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      onDelete(todo.id);
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 35,
      });
    }
    setSwiping(false);
  };

  return (
    <div className="relative overflow-hidden border-b border-neutral-200">
      {/* Complete action (green, behind right swipe) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-start pl-5 bg-emerald-500"
        style={{ opacity: completeOpacity }}
      >
        <motion.div style={{ scale: completeScale }}>
          <IconCheck size={22} stroke={2.5} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Delete action (red, behind left swipe) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-5 bg-red-500"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ scale: deleteScale }}>
          <IconSquareRoundedMinusFilled size={22} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Foreground - original todo item UI */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        style={{ x }}
        onDragStart={() => setSwiping(true)}
        onDragEnd={handleDragEnd}
        className="relative flex items-center gap-3 bg-white py-3 px-4 touch-pan-y"
      >
        <button
          onClick={() => !swiping && onToggle(todo.id)}
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
          className={`flex-1 text-sm font-medium transition-all duration-200 ${
            todo.completed ? "text-neutral-400" : "text-black"
          }`}
        >
          {todo.text}
        </span>
      </motion.div>
    </div>
  );
}
