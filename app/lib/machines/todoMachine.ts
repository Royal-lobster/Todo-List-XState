import { assign, createMachine } from "xstate";

export interface TodoItem {
	id: string;
	title: string;
	completed: boolean;
}

export type TodosFilter = "all" | "active" | "completed";

export const todosMachine = createMachine({
	/** @xstate-layout N4IgpgJg5mDOIC5QBcD2FWwMQDswHcAVdVAOgGMALAQxxgG0AGAXUVAAdMBLZL1HNiAAeiAMyNSANgAcAdgCsAGhABPRDNFTZARjnyAvvuVoM2PERIVUAW2s8mrJCE6wefAU5EJxpACwyFZTUEeTlSHT1DYxJsEzJyGztkB0EXN35BL39SAE5GSQAmJVVEXxztcMl5QoMjEDjYywgwABswZDAUpzTeDM9EeQqC3wLdQJLvHPlSaW0iqPqYrAAzLhaOgCcKGjpOllTuXo9QLNlSAtmioMQCnJyZ+RzRBQWGrDjSa2oNgGsujkO7kyA2mskuxWCBUYmjyNVeSw+X1+AEEWi1-s5AX0TqVJH5fPJRHMIYhtIwzlMifM6m8GhQ2t8AMI2dhtDoQDE9IH9BBza68gqGOo4dBwQQNA6uI7AhCyXykbSiC7E-lg+VwoVAA */
	id: "todos",
	types: {} as {
		context: {
			todo: string;
			todos: TodoItem[];
			filter: TodosFilter;
		};
		events:
			| { type: "newTodo.change"; value: string }
			| { type: "newTodo.commit"; value: string }
			| { type: "todo.commit"; todo: TodoItem }
			| { type: "todo.delete"; id: string }
			| { type: "filter.change"; filter: TodosFilter }
			| { type: "todo.mark"; id: string; mark: "active" | "completed" }
			| { type: "todo.markAll"; mark: "active" | "completed" }
			| { type: "todos.clearCompleted" };
	},
	context: {
		todo: "",
		todos: [
			{
				id: "1",
				title: "Learn state machines",
				completed: false,
			},
		],
		filter: "all",
	},
	on: {
		"newTodo.change": {
			actions: assign({
				todo: ({ event }) => event.value,
			}),
		},
		"newTodo.commit": {
			guard: ({ event }) => event.value.trim().length > 0,
			actions: assign({
				todo: "",
				todos: ({ context, event }) => {
					const newTodo: TodoItem = {
						id: Math.random().toString(36).substring(7),
						title: event.value,
						completed: false,
					};

					return [...context.todos, newTodo];
				},
			}),
		},
		"todo.commit": {
			actions: assign({
				todos: ({ context, event }) => {
					const { todo: todoToUpdate } = event;

					if (!todoToUpdate.title.trim().length) {
						return context.todos.filter((todo) => todo.id !== todoToUpdate.id);
					}

					return context.todos.map((todo) => {
						if (todo.id === todoToUpdate.id) {
							return todoToUpdate;
						}

						return todo;
					});
				},
			}),
		},
		"todo.delete": {
			actions: assign({
				todos: ({ context, event }) => {
					const { id } = event;

					return context.todos.filter((todo) => todo.id !== id);
				},
			}),
		},
		"filter.change": {
			actions: assign({
				filter: ({ event }) => event.filter,
			}),
		},
		"todo.mark": {
			actions: assign({
				todos: ({ context, event }) => {
					const { mark } = event;

					return context.todos.map((todo) => {
						if (todo.id === event.id) {
							return {
								...todo,
								completed: mark === "completed",
							};
						}

						return todo;
					});
				},
			}),
		},
		"todo.markAll": {
			actions: assign({
				todos: ({ context, event }) => {
					const { mark } = event;

					return context.todos.map((todo) => {
						return {
							...todo,
							completed: mark === "completed",
						};
					});
				},
			}),
		},
		"todos.clearCompleted": {
			actions: assign({
				todos: ({ context }) => {
					return context.todos.filter((todo) => !todo.completed);
				},
			}),
		},
	},
});
