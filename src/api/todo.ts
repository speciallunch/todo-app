import { APIResponse, ToDo, ToDoRequest } from '../types/api'

export async function fetchTodos(): Promise<ToDo[]> {
  const response = await fetch(`/api/todos`)

  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.status}`)
  }

  const result: APIResponse<ToDo[]> = await response.json()

  if (result.code !== 200) {
    throw new Error(`${result.code} : ${result.message}`)
  }

  return result.data || []
}

export async function createTodo(todo: ToDoRequest): Promise<ToDo> {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    throw new Error(`Failed to create todos: ${response.status}`)
  }

  const result: APIResponse<ToDo> = await response.json()

  if (result.code !== 200) {
    throw new Error(`${result.code} : ${result.message}`)
  }

  if (!result.data) {
    throw new Error('response data is undefined')
  }

  return result.data
}

export async function getTodo(id: number): Promise<ToDo> {
  const response = await fetch(`/api/todos/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.status}`)
  }

  const result: APIResponse<ToDo> = await response.json()

  if (result.code !== 200) {
    throw new Error(`${result.code} : ${result.message}`)
  }

  if (!result.data) {
    throw new Error('response data is undefined')
  }

  return result.data
}

export async function updateTodo(id: number, todo: ToDoRequest): Promise<ToDo> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    throw new Error(`Failed to create todos: ${response.status}`)
  }

  const result: APIResponse<ToDo> = await response.json()

  if (result.code !== 200) {
    throw new Error(`${result.code} : ${result.message}`)
  }

  if (!result.data) {
    throw new Error('response data is undefined')
  }

  return result.data
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to create todos: ${response.status}`)
  }

  const result: APIResponse<ToDo> = await response.json()

  if (result.code !== 200) {
    throw new Error(`${result.code} : ${result.message}`)
  }

  return
}
