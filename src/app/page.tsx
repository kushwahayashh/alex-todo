import { getTodos } from "./actions";
import { TodoList } from "./components/todo-list";
import { AddTodo } from "./components/add-todo";
import { IconCircleCheck } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="sticky top-0 bg-neutral-100 px-4 py-3 shadow-sm">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-lg font-semibold text-black flex items-center gap-2">
            <IconCircleCheck size={20} stroke={2} />
            AlexTodo
          </h1>
        </div>
      </div>
      <div className="flex-1 px-4 pt-6 pb-8">
        <div className="mx-auto w-full max-w-md">
          <TodoList todos={todos} />
          <div className="mt-6">
            <AddTodo />
          </div>
        </div>
      </div>
    </div>
  );
}
