import { useEffect, useState } from 'react'
import './App.css'
import { Input, Button, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers'

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  getTodo,
  updateTodo,
} from './api/todo'
import dayjs from 'dayjs'
import { ToDo, ToDoRequest } from './types/api'

interface ToDoListProps {
  todo: ToDo
  onClickRemove: (id: number) => void
}

const ToDoList = ({ todo, onClickRemove }: ToDoListProps) => {
  return (
    <li key={todo.id} className="todo-container">
      {todo.done ? <s>todo.text</s> : todo.text}
      <Button>수정</Button>
      <Button onClick={() => onClickRemove(todo.id)}>삭제</Button>
    </li>
  )
}

function App() {
  const [todoText, setTodoText] = useState('')
  const [searchText, setSearchText] = useState('')
  const [todos, setTodos] = useState<ToDo[]>([])
  const [deadline, setDeadline] = useState(new Date())

  useEffect(() => {
    fetchTodos().then((data) => {
      setTodos(data)
    })
  }, [])
  const handleTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value)
  }

  const handleSearchTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(event.target.value)
  }

  const handleAddTodo = () => {
    const newTodo: ToDoRequest = {
      text: todoText,
      done: false,
      deadline: deadline.getTime(),
    }
    createTodo(newTodo).then((data) => {
      const addedTodos = [...todos, data]
      setTodos(addedTodos)
    })
  }

  const handleChandeDateTime = (date: dayjs.Dayjs | null) => {
    if (date) {
      setDeadline(date?.toDate())
    }
  }

  const handleRemoveTodo = (id: number) => {
    const removedTodos = todos.filter((todo) => todo.id !== id)
    setTodos(removedTodos)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <h1>Todo App</h1>
        <div className="add-container">
          <DateTimePicker
            label="Deadline"
            value={dayjs(deadline)}
            onChange={handleChandeDateTime}
          />
          <Input
            type="text"
            value={todoText}
            onChange={handleTodoTextChange}
            placeholder="할 일을 입력하세요"
          />
          <Button onClick={handleAddTodo}>Add</Button>
        </div>
        <div className="list-container">
          <div className="list-search-container">
            <Input
              type="text"
              value={searchText}
              onChange={handleSearchTextChange}
              placeholder="할 일을 검색하세요"
            />
          </div>
          <ul>
            {todos.map((todo) => (
              <ToDoList todo={todo} onClickRemove={handleRemoveTodo} />
            ))}
          </ul>
        </div>
      </div>
    </LocalizationProvider>
  )
}

export default App
