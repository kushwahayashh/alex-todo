"use server";

import { revalidatePath } from "next/cache";
import { getTodos as fetchTodos, insertTodo, toggleTodoById, deleteTodoById } from "./db";

export async function getTodos() {
  return fetchTodos();
}

export async function addTodo(formData: FormData, clientKey?: string) {
  const text = formData.get("text") as string;
  if (!text || text.trim() === "") return null;
  const id = await insertTodo(text.trim());
  revalidatePath("/");
  return { id, clientKey: clientKey ?? null };
}

export async function toggleTodo(id: number) {
  await toggleTodoById(id);
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await deleteTodoById(id);
  revalidatePath("/");
}
