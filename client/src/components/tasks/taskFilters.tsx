import { useBoards } from '../../api/boards'
import { useUsers } from '../../api/tasks'
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'

interface TaskFiltersProps {
  statusFilter: string
  setStatusFilter: (value: string) => void
  boardFilter: number | ''
  setBoardFilter: (value: number | '') => void
  assigneeFilter: string
  setAssigneeFilter: (value: string) => void
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  boardFilter,
  setBoardFilter,
  assigneeFilter,
  setAssigneeFilter,
}) => {
  const { data: boards } = useBoards()
  const { data: users } = useUsers()

  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as string)}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Board</InputLabel>
        <Select
          value={boardFilter}
          onChange={(e) => setBoardFilter(e.target.value as number)}
          label="Board"
        >
          <MenuItem value="">All</MenuItem>
          {boards?.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Assignee</InputLabel>
        <Select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value as string)}
          label="Assignee"
        >
          <MenuItem value="">All</MenuItem>
          {users?.map((user) => (
            <MenuItem key={user.id} value={user.fullName}>
              {user.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default TaskFilters