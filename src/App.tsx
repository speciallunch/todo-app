import { Dispatch, SetStateAction, useState } from 'react'
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Input, Button, Checkbox, ToggleButton } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers'
import CheckIcon from '@mui/icons-material/Check'
import './App.css'

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  getTodo,
  updateTodo,
} from './api/todo'
import dayjs from 'dayjs'
import { ToDo, ToDoRequest } from './types/api'

const MAX_DEADLINE = 3
const MAX_PAGES = [5, 10, 20]

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Todos />
      </LocalizationProvider>
    </QueryClientProvider>
  )
}

interface ToDoItemProps {
  todo: ToDo
  editTodo: ToDo | undefined
  handleEditTodo: Dispatch<SetStateAction<ToDo | undefined>>
  handleEditFinish: () => void
}

const TodoItem = ({
  todo,
  editTodo,
  handleEditTodo,
  handleEditFinish,
}: ToDoItemProps) => {
  const isEditing = !!editTodo && editTodo.id === todo.id

  const onChangeDone = () => {
    handleEditTodo((prev) => {
      if (!prev) return prev
      return { ...prev, done: !prev.done }
    })
  }

  const onChangeDeadline = (day: dayjs.Dayjs | null) => {
    if (!day) return

    handleEditTodo((prev) => {
      if (!prev) return prev
      return { ...prev, deadline: day.valueOf() }
    })
  }

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleEditTodo((prev) => {
      if (!prev) return prev
      return { ...prev, text: e.target.value }
    })
  }

  return (
    <>
      {isEditing ? (
        <div className="todo-item-editing">
          <ToggleButton
            value="check"
            selected={editTodo.done}
            onClick={onChangeDone}
          >
            <CheckIcon />
          </ToggleButton>
          <DateTimePicker
            label="Deadline"
            value={dayjs(editTodo.deadline)}
            onChange={onChangeDeadline}
          />
          <Input type="text" value={editTodo.text} onChange={onChangeText} />
          <Button onClick={handleEditFinish}>확인</Button>
        </div>
      ) : (
        <div className="todo-item">
          <span>
            <ToggleButton value="check" selected={todo.done} disabled>
              <CheckIcon />
            </ToggleButton>
          </span>
          <span>{dayjs(todo.deadline).format('YYYY-MM-DD HH:mm')}</span>
          <span>{todo.text}</span>
        </div>
      )}
    </>
  )
}

const Todos = () => {
  const [newTodoText, setNewTodoText] = useState('')
  const [newDeadline, setNewDeadline] = useState(dayjs().valueOf())
  const [searchText, setSearchText] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [editTodo, setEditTodo] = useState<ToDo | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const filteredTodos = todos?.filter((todo) =>
    todo.text.toLowerCase().includes(searchText.toLowerCase())
  )
  const totalPages = filteredTodos
    ? Math.max(Math.ceil(filteredTodos.length / pageSize), 1)
    : 1
  const paginatedTodos = filteredTodos?.slice(
    (page - 1) * pageSize,
    page * pageSize
  )
  const isDeadlineComing = (deadline: number) => {
    const timeLimit = dayjs().add(MAX_DEADLINE, 'day')
    return dayjs(deadline).isBefore(timeLimit)
  }

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      updatedTodo,
    }: {
      id: number
      updatedTodo: ToDoRequest
    }) => updateTodo(id, updatedTodo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  const { mutateAsync } = useMutation({
    mutationFn: getTodo,
  })

  const handleAddTodo = () => {
    createTodoMutation.mutate({
      text: newTodoText,
      deadline: newDeadline,
      done: false,
    })
  }

  const handleUpdateTodo = () => {
    if (!editTodo) return

    updateTodoMutation.mutate({
      id: editTodo.id,
      updatedTodo: editTodo,
    })
  }

  const handleRemoveTodo = () => {
    for (const id of selectedIds) {
      deleteTodoMutation.mutate(id)
    }
    setSelectedIds([])
  }

  const handleEditTodo = async () => {
    if (selectedIds.length === 1) {
      try {
        const selectedTodo = await mutateAsync(selectedIds[0])
        setEditTodo(selectedTodo)
      } catch (err) {
        console.error(err)
      }
    }
  }

  ///////

  const handleNewDeadlineChange = (day: dayjs.Dayjs | null) => {
    if (!day) return
    setNewDeadline(day.valueOf())
  }

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleEditFinish = () => {
    handleUpdateTodo()
    setEditTodo(undefined)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      <div className="add-container">
        <DateTimePicker
          label="Deadline"
          value={dayjs(newDeadline)}
          onChange={handleNewDeadlineChange}
        />
        <Input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <Button onClick={handleAddTodo}>추가</Button>
      </div>
      <div className="list-container">
        <div className="list-search-edit-container">
          <Input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="할 일을 검색하세요"
          />
          <Button onClick={handleEditTodo} disabled={selectedIds.length !== 1}>
            수정
          </Button>
          <Button
            onClick={handleRemoveTodo}
            disabled={selectedIds.length === 0}
          >
            삭제
          </Button>
          <div className={'list-maxpage-container'}>
            {MAX_PAGES.map((maxSize) => {
              return (
                <Button
                  disabled={pageSize === maxSize}
                  onClick={() => handlePageSizeChange(maxSize)}
                >
                  {maxSize}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="list-todos-container">
          <ul>
            {isLoading && <p>불러오는 중...</p>}
            {isError && <p>에러 발생</p>}
            {!isLoading && todos?.length === 0 && <p>할 일이 없습니다.</p>}
            {paginatedTodos?.map((todo: ToDo) => (
              <li
                key={todo.id}
                className={`todo-item-container ${
                  isDeadlineComing(todo.deadline) ? 'urgent' : ''
                }`}
              >
                <Checkbox
                  checked={selectedIds.includes(todo.id)}
                  onChange={() => handleCheckboxChange(todo.id)}
                />
                <TodoItem
                  todo={todo}
                  editTodo={editTodo}
                  handleEditTodo={setEditTodo}
                  handleEditFinish={handleEditFinish}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="list-pagination-container">
          <Button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            이전
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
