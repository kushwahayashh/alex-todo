import { getTodos } from "./actions";
import { TodoApp } from "./components/todo-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="min-h-dvh bg-white">
      <div className="pt-6 pb-24">
        <div className="mx-auto w-full max-w-md">
          <TodoApp todos={todos} />
        </div>
      </div>
    </div>
  );
}
