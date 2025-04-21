import { useNavigate } from 'react-router-dom'
import { useBoards } from '../api/boards'
import { useTasks } from '../api/tasks' // Add this import to fetch tasks
import { Card, CardContent, Typography, Box } from '@mui/material'
import { PieChart } from 'react-minimal-pie-chart'

const BoardsPage = () => {
  const navigate = useNavigate()
  const { data: boards, isLoading: boardsLoading, error: boardsError } = useBoards()
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks() // Fetch tasks

  // Combine loading and error states
  if (boardsLoading || tasksLoading) return <div>Loading...</div>
  if (boardsError) return <div>Error: {(boardsError as Error).message}</div>
  if (tasksError) return <div>Error: {(tasksError as Error).message}</div>

  console.log('Boards data:', boards)
  console.log('Tasks data:', tasks)

  const handleViewBoard = (boardId: number) => {
    navigate(`/boards/${boardId}`)
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          width: '80%',
          alignSelf: 'center',
          mt: 6,
        }}
      >
        {Array.isArray(boards) && boards.length > 0 ? (
          boards.map((board) => {
            // Filter tasks for the current board
            const boardTasks = tasks?.filter((task) => task.boardId === board.id) || []

            // Count tasks by status for this board
            const statusCounts = {
              Backlog: boardTasks.filter((task) => task.status === 'Backlog').length,
              InProgress: boardTasks.filter((task) => task.status === 'InProgress').length,
              Done: boardTasks.filter((task) => task.status === 'Done').length,
            }

            const totalTasks = statusCounts.Backlog + statusCounts.InProgress + statusCounts.Done

            const pieData = [
              { title: 'Не сделано', value: statusCounts.Backlog, color: '#ea5058' },
              { title: 'Делается', value: statusCounts.InProgress, color: '#8e60e1' },
              { title: 'Сделано', value: statusCounts.Done, color: '#66dd70' },
            ].filter((entry) => entry.value > 0)

            const percentages = {
              Backlog: totalTasks ? ((statusCounts.Backlog / totalTasks) * 100).toFixed(1) : '0.0',
              InProgress: totalTasks ? ((statusCounts.InProgress / totalTasks) * 100).toFixed(1) : '0.0',
              Done: totalTasks ? ((statusCounts.Done / totalTasks) * 100).toFixed(1) : '0.0',
            }

            return (
              <Box
                key={board.id}
                onClick={() => handleViewBoard(board.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleViewBoard(board.id)}
                role="button"
                tabIndex={0}
              >
                <Card
                  sx={{
                    mb: 2,
                    borderRadius: '12px',
                    boxShadow: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 1 }}>
                        {board.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.9rem' }}>
                        {board.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                        {board.taskCount} задач
                      </Typography>
                    </Box>
                    {totalTasks > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PieChart
                          data={pieData}
                          radius={40}
                          lineWidth={40}
                          paddingAngle={2}
                          labelPosition={0}
                          style={{ height: '100px', width: '100px' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#66dd70', borderRadius: '2px' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              Сделано: {percentages.Done}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#8e60e1', borderRadius: '2px' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              Делается: {percentages.InProgress}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, backgroundColor: '#ea5058', borderRadius: '2px' }} />
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              Не сделано: {percentages.Backlog}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem', mr: 2 }}>
                        Нет задач
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )
          })
        ) : (
          <Typography>Нет доступных досок</Typography>
        )}
      </Box>
    </Box>
  )
}

export default BoardsPage