import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTasks, Task } from '../api/tasks'
import { Card, CardContent, Typography, Button, Box, TextField, Modal } from '@mui/material'
import CreateTaskForm from '../components/CreateTaskForm'
import EditTaskForm from '../components/EditTaskForm'
import TaskFilters from '../components/tasks/taskFilters'

const TasksPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: tasks, isLoading, error } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [boardFilter, setBoardFilter] = useState<number | ''>('')
  const [titleSearch, setTitleSearch] = useState<string>('')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('')

  // Отладка: выведем задачи и их assignee в консоль
  useEffect(() => {
    if (tasks) {
      console.log('Tasks:', tasks)
      tasks.forEach((task) => {
        console.log(`Task ID: ${task.id}, Assignee:`, task.assignee)
      })
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (!tasks) return []
    return tasks.filter((task: Task) => {
      const matchesStatus = statusFilter ? task.status === statusFilter : true
      const matchesBoard = boardFilter ? task.boardId === boardFilter : true
      const matchesTitle = titleSearch ? task.title.toLowerCase().includes(titleSearch.toLowerCase()) : true
      const matchesAssignee = assigneeFilter
        ? task.assignee?.fullName?.toLowerCase().includes(assigneeFilter.toLowerCase())
        : true
      return matchesStatus && matchesBoard && matchesTitle && matchesAssignee
    })
  }, [tasks, statusFilter, boardFilter, titleSearch, assigneeFilter])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCreateTask = () => {
    setIsCreatingTask(true)
  }

  const handleCloseTaskForm = () => {
    setSelectedTask(undefined)
    setIsCreatingTask(false)
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const handleBoardClick = (task: Task) => {
    navigate(`/boards/${task.boardId}`, { state: { openTaskId: task.id } })
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* Поля поиска слева */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Поиск по Названию"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            variant="outlined"
            sx={{
              width: 210,
              backgroundColor: 'white',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                paddingRight: 0,
                '& fieldset': {
                  borderColor: '#00aaff',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#00aaff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00aaff',
                },
              },
              '& input': {
                padding: '10px 14px',
                color: '#222', // Сделали текст темнее
              },
            }}
          />

          <TextField
            placeholder="Поиск по Исполнителю"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            variant="outlined"
            sx={{
              width: 210,
              backgroundColor: 'white',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                paddingRight: 0,
                '& fieldset': {
                  borderColor: '#00aaff',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: '#00aaff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00aaff',
                },
              },
              '& input': {
                padding: '10px 14px',
                color: '#222', // Сделали текст темнее
              },
            }}
          />
        </Box>
        {/* Кнопка фильтров справа */}
        <Button
          variant="contained"
          onClick={() => setIsFiltersOpen(true)}
          sx={{ alignSelf: 'flex-end', width: 200 }}
        >
          Фильтры
        </Button>
      </Box>

      {/* Окно с задачами */}
      <Box
        sx={{
          flex: 1,
          border: '2px solid rgb(148, 199, 244)',
          borderRadius: 2,
          overflowY: 'auto',
          p: 1.125,
          mb: 1,
          maxHeight: '60vh',
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
        }}
      >
        {filteredTasks.length ? (
          filteredTasks.map((task: Task) => (
            <Card
              key={task.id}
              sx={{
                mt: 0.75, 
                mb: 0.75, 
                boxShadow: 'none',
                border: '2px solid #4ba7f6',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 0,
                }}
              >
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                    {task.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mr: 2, alignItems: 'center' }}>
                  <Button
                    onClick={() => handleEditTask(task)}
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 3,
                      width: 200,
                      borderWidth: '2px',
                      fontWeight: 750,
                      fontSize: '12px', 
                    }}
                  >
                    Редактировать задачу
                  </Button>
                  <Button
                    onClick={() => handleBoardClick(task)}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 200,
                      borderWidth: '2px',
                      fontWeight: 750,
                      fontSize: '12px', 
                    }}
                  >
                    Перейти к доске
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>Нет доступных задач</Typography>
        )}
      </Box>

      {/* Кнопка "Создать задачу" снизу справа */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTask}
          sx={{ width: 200 }}
        >
          Создать задачу
        </Button>
      </Box>

      {/* Форма редактирования задачи */}
      {selectedTask && (
        <EditTaskForm open={!!selectedTask} onClose={handleCloseTaskForm} task={selectedTask} />
      )}

      {/* Форма создания задачи */}
      {isCreatingTask && (
        <CreateTaskForm open={isCreatingTask} onClose={handleCloseTaskForm} />
      )}

      {/* Модальное окно с фильтрами */}
      <Modal open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            minWidth: 400,
          }}
        >
          <TaskFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            boardFilter={boardFilter}
            setBoardFilter={setBoardFilter}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
          />
          <Button
            variant="contained"
            onClick={() => setIsFiltersOpen(false)}
            sx={{ mt: 2, width: 200 }}
          >
            Применить фильтры
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default TasksPage