import { getTodos } from "./actions";
import { TodoApp } from "./components/todo-app";
import { IconCircleCheck } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="sticky top-0 bg-neutral-200 px-4 py-3">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-lg font-bold text-black flex items-center gap-2">
            <IconCircleCheck size={20} stroke={2} />
            AlexTodo
          </h1>
        </div>
      </div>
      <div className="flex-1 px-4 pt-6 pb-24">
        <div className="mx-auto w-full max-w-md">
          <TodoApp todos={todos} />
        </div>
      </div>
    </div>
  );
}
