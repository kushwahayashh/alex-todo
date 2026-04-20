"use client";

import { useRef } from "react";
import { addTodo } from "../actions";

export function AddTodo() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTodo(formData);
        formRef.current?.reset();
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
  );
}
