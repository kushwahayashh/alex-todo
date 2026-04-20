import { getTodos } from "./actions";
import { TodoApp } from "./components/todo-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="flex-1 pt-6 pb-24">
        <div className="mx-auto w-full max-w-md">
          <TodoApp todos={todos} />
        </div>
      </div>
    </div>
  );
}
