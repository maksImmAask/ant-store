import { create } from 'zustand'
import type { TodoItem } from './App'

type TStore = {
  todos: TodoItem[]
  add: (todo: TodoItem) => void
  remove: (id: number) => void
  update: (id: number, updated: Partial<TodoItem>) => void
}

export const useStore = create<TStore>((set) => ({
  todos: [],
  add: (todo: TodoItem) => set((state) => ({ todos: [...state.todos, todo] })),
  remove: (id: number) => set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
  update: (id, updated) => set((state) => ({ todos: state.todos.map((todo) => todo.id === id ? { ...todo, ...updated } : todo) })),
}))