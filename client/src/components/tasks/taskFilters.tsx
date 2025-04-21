import { useBoards } from '../../api/boards'
import { useUsers } from '../../api/tasks'
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'

interface TaskFiltersProps {
  statusFilter: string
  setStatusFilter: (value: string) => void
  boardFilter: number | ''
  setBoardFilter: (value: number | '') => void
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  boardFilter,
  setBoardFilter
}) => {
  const { data: boards } = useBoards()

  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Статус</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as string)}
          label="Статус"
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="Backlog">Не сделано</MenuItem>
          <MenuItem value="InProgress">Делается</MenuItem>
          <MenuItem value="Done">Сделано</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Проект</InputLabel>
        <Select
          value={boardFilter}
          onChange={(e) => setBoardFilter(e.target.value as number)}
          label="Проект"
        >
          <MenuItem value="">Все</MenuItem>
          {boards?.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default TaskFilters