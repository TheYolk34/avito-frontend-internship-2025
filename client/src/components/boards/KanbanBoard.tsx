import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import { Task } from '../../api/tasks'

interface KanbanBoardProps {
  columns: { [key: string]: Task[] }
  tasks: Task[]
  onDragEnd: (result: any) => void
  onEditTask: (task: Task) => void
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, tasks, onDragEnd, onEditTask }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box display="flex" gap={2}>
        {Object.keys(columns).map((status) => (
          <Box key={status} width="33%">
            <Typography variant="h6">{status}</Typography>
            <Droppable droppableId={status}>
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  minHeight="200px"
                  bgcolor="#f0f0f0"
                  p={2}
                >
                  {columns[status as keyof typeof columns].map((task: Task, index: number) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ marginBottom: '10px', ...provided.draggableProps.style }}
                        >
                          <CardContent>
                            <Typography>{task.title}</Typography>
                            <Typography>Priority: {task.priority}</Typography>
                            <Button onClick={() => onEditTask(task)}>Edit</Button>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>
        ))}
      </Box>
    </DragDropContext>
  )
}

export default KanbanBoard