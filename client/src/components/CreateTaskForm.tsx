import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Select, MenuItem, Button, Modal, Box, FormControl, InputLabel } from '@mui/material'
import { useCreateTask, Task, User, useUsers } from '../api/tasks'
import { useBoards } from '../api/boards'
import { RootState } from '../store'
import { updateForm, resetForm } from '../store/taskFormSlice'

interface CreateTaskFormProps {
  open: boolean
  onClose: () => void
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formState = useSelector((state: RootState) => state.taskForm)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: formState,
  })

  const createTaskMutation = useCreateTask()
  const { data: boards } = useBoards()
  const { data: users } = useUsers()

  useEffect(() => {
    dispatch(resetForm())
    reset(formState)
  }, [dispatch, reset])

  const onSubmit = (data: any) => {
    const selectedUser = users?.find((user: User) => user.fullName === data.assignee)
    const taskData = {
      ...data,
      assignee: selectedUser || { id: 0, fullName: data.assignee, email: '', avatarUrl: '' },
    }

    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        dispatch(resetForm())
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
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
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  dispatch(updateForm({ title: e.target.value }))
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  dispatch(updateForm({ description: e.target.value }))
                }}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    dispatch(updateForm({ status: e.target.value }))
                  }}
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    dispatch(updateForm({ priority: e.target.value }))
                  }}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Assignee</InputLabel>
                <Select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    dispatch(updateForm({ assignee: e.target.value }))
                  }}
                >
                  {users?.map((user) => (
                    <MenuItem key={user.id} value={user.fullName}>
                      {user.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="boardId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Board</InputLabel>
                <Select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    dispatch(updateForm({ boardId: Number(e.target.value) }))
                  }}
                >
                  {boards?.map((board) => (
                    <MenuItem key={board.id} value={board.id}>
                      {board.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              Create
            </Button>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateTaskForm