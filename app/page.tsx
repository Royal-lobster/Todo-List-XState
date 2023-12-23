"use client";
import { useMachine } from "@xstate/react";
import { todosMachine } from "./lib/machines/todoMachine";

export default function Home() {
	const [
		{
			context: { filter, todos, todo },
		},
		send,
	] = useMachine(todosMachine);

	return (
		<div className="container mx-auto px-4">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					send({ type: "newTodo.commit", value: todo });
				}}
				className="flex items-center justify-between my-5"
			>
				<input
					value={todo}
					onChange={(e) => {
						send({
							type: "newTodo.change",
							value: e?.currentTarget.value,
						});
					}}
					type="text"
					name="todo"
					placeholder="New Todo"
					className="border-2 border-gray-300 p-2 w-full rounded-md"
				/>
				<button
					type="submit"
					className="ml-2 bg-blue-500 text-white p-2 rounded-md"
				>
					Add
				</button>
			</form>
			<div className="flex space-x-2 mb-5">
				<button
					type="button"
					onClick={() => send({ type: "filter.change", filter: "all" })}
					className="bg-blue-500 text-white p-2 rounded-md"
				>
					All
				</button>
				<button
					type="button"
					onClick={() => send({ type: "filter.change", filter: "active" })}
					className="bg-blue-500 text-white p-2 rounded-md"
				>
					Active
				</button>
				<button
					type="button"
					onClick={() => send({ type: "filter.change", filter: "completed" })}
					className="bg-blue-500 text-white p-2 rounded-md"
				>
					Completed
				</button>
			</div>
			<ul className="space-y-2">
				{todos
					.filter((v) => {
						if (filter === "all") return true;
						if (filter === "active") return !v.completed;
						if (filter === "completed") return v.completed;
						return true;
					})
					.map((todo) => (
						<li
							key={todo.id}
							className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
						>
							<span className="text-lg">{todo.title}</span>
							<div className="space-x-2">
								<button
									type="button"
									onClick={() =>
										send({
											type: "todo.mark",
											mark: todo.completed ? "active" : "completed",
											id: todo.id,
										})
									}
									className="bg-green-500 text-white p-2 rounded-md"
								>
									{todo.completed ? "☑️" : "🔲"}
								</button>
								<button
									type="button"
									onClick={() => send({ type: "todo.delete", id: todo.id })}
									className="bg-red-500 text-white p-2 rounded-md"
								>
									🗑️
								</button>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}
