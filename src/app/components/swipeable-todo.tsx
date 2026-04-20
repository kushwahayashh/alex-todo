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
  const [expanded, setExpanded] = useState(false);

  // Right swipe (complete) - green background opacity
  const completeOpacity = useTransform(x, [0, COMPLETE_THRESHOLD], [0, 1]);
  const completeIconOpacity = useTransform(
    x,
    [COMPLETE_THRESHOLD - 20, COMPLETE_THRESHOLD],
    [0, 1]
  );

  // Left swipe (delete) - red background opacity
  const deleteOpacity = useTransform(x, [DELETE_THRESHOLD, 0], [1, 0]);
  const deleteIconOpacity = useTransform(
    x,
    [DELETE_THRESHOLD, DELETE_THRESHOLD + 20],
    [1, 0]
  );

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;

    if (offset > COMPLETE_THRESHOLD) {
      onToggle(todo.id);
    } else if (offset < DELETE_THRESHOLD) {
      onDelete(todo.id);
    }
    
    // Always bounce back
    animate(x, 0, {
      type: "spring",
      stiffness: 500,
      damping: 35,
    });
    setSwiping(false);
  };

  return (
    <div className="relative overflow-hidden border-b border-neutral-200 shadow-none">
      {/* Complete action (green, behind right swipe) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-start pl-5 bg-emerald-500"
        style={{ opacity: completeOpacity }}
      >
        <motion.div style={{ opacity: completeIconOpacity }}>
          <IconCheck size={22} stroke={2.5} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Delete action (red, behind left swipe) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-5 bg-red-500"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ opacity: deleteIconOpacity }}>
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
        <motion.span
          onClick={() => !swiping && setExpanded(!expanded)}
          animate={{ height: expanded ? "auto" : "1.25rem" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`flex-1 text-sm font-medium cursor-pointer overflow-hidden ${
            expanded ? "" : "truncate"
          } ${todo.completed ? "text-neutral-400" : "text-black"}`}
        >
          {todo.text}
        </motion.span>
      </motion.div>
    </div>
  );
}
