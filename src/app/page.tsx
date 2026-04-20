import { getTodos } from "./actions";
import { TodoList } from "./components/todo-list";
import { AddTodo } from "./components/add-todo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="flex min-h-dvh items-start justify-center bg-white px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-2xl font-semibold text-black">Todos</h1>
        <AddTodo />
        <div className="mt-6">
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  );
}
