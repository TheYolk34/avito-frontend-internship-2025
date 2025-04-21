import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Autocomplete, ToggleButton, Button, Modal, Box, Typography } from '@mui/material';
import { useCreateTask, Task, User, useUsers } from '../api/tasks';
import { useBoards } from '../api/boards';
import { RootState } from '../store';
import { updateForm, resetForm } from '../store/taskFormSlice';

interface CreateTaskFormProps {
  open: boolean;
  onClose: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formState = useSelector((state: RootState) => state.taskForm);
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: '',
      assignee: '',
      boardId: undefined as number | undefined,
    },
  });

  const createTaskMutation = useCreateTask();
  const { data: boards } = useBoards();
  const { data: users } = useUsers();

  const selectedPriority = watch('priority');

  // Load form data from Redux store (persisted via localStorage)
  useEffect(() => {
    if (formState) {
      setValue('title', formState.title || '');
      setValue('description', formState.description || '');
      setValue('priority', formState.priority || '');
      setValue('assignee', formState.assignee || '');
      setValue('boardId', formState.boardId || undefined);
    }
  }, [formState, setValue]);

  // Reset form fields when modal opens (but don't clear the draft)
  useEffect(() => {
    if (open) {
      reset({
        title: formState.title || '',
        description: formState.description || '',
        priority: formState.priority || '',
        assignee: formState.assignee || '',
        boardId: formState.boardId || undefined,
      });
    }
  }, [open, formState, reset]);

  const onSubmit = (data: any) => {
    const selectedUser = users?.find((user: User) => user.fullName === data.assignee) || {
      id: 0,
      fullName: data.assignee || '',
      email: '',
      avatarUrl: '',
    };
    const selectedBoardId = data.boardId || 0;

    const taskData = {
      ...data,
      status: 'Backlog',
      assignee: selectedUser,
      boardId: selectedBoardId,
    };

    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        dispatch(resetForm()); // Clear the draft on successful submission
        reset({
          title: '',
          description: '',
          priority: '',
          assignee: '',
          boardId: undefined,
        });
        onClose();
      },
    });
  };

  const handleClear = () => {
    dispatch(resetForm()); // Clear the Redux store state
    reset({
      title: '',
      description: '',
      priority: '',
      assignee: '',
      boardId: undefined,
    }); // Reset the form fields
  };

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
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" sx={{ mb: 0, fontWeight: 'bold' }}>
          Создание Задачи
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                label="Название"
                fullWidth
                margin="normal"
                variant="outlined"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateForm({ title: e.target.value }));
                }}
                sx={{ mb: 1 }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Описание"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(updateForm({ description: e.target.value }));
                }}
                sx={{ mb: 1 }}
              />
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Приоритет
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <ToggleButton
                    value="Low"
                    selected={selectedPriority === 'Low'}
                    onChange={() => {
                      const newValue = selectedPriority === 'Low' ? '' : 'Low';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #66dd70',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#66dd70',
                        color: 'white',
                        '&:hover': { backgroundColor: '#55cc60' },
                      },
                      '&:hover': { backgroundColor: '#66dd7020' },
                    }}
                  >
                    Низкий
                  </ToggleButton>
                  <ToggleButton
                    value="Medium"
                    selected={selectedPriority === 'Medium'}
                    onChange={() => {
                      const newValue = selectedPriority === 'Medium' ? '' : 'Medium';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #8e60e1',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#8e60e1',
                        color: 'white',
                        '&:hover': { backgroundColor: '#7d50d1' },
                      },
                      '&:hover': { backgroundColor: '#8e60e120' },
                    }}
                  >
                    Средний
                  </ToggleButton>
                  <ToggleButton
                    value="High"
                    selected={selectedPriority === 'High'}
                    onChange={() => {
                      const newValue = selectedPriority === 'High' ? '' : 'High';
                      field.onChange(newValue);
                      dispatch(updateForm({ priority: newValue }));
                    }}
                    sx={{
                      flex: 1,
                      color: 'text.secondary',
                      border: '1px solid #ea5058',
                      borderRadius: '8px !important',
                      '&.Mui-selected': {
                        backgroundColor: '#ea5058',
                        color: 'white',
                        '&:hover': { backgroundColor: '#da4048' },
                      },
                      '&:hover': { backgroundColor: '#ea505820' },
                    }}
                  >
                    Высокий
                  </ToggleButton>
                </Box>
              </Box>
            )}
          />
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={users || []}
                getOptionLabel={(option: User) => option.fullName || ''}
                onChange={(e, value) => {
                  const assigneeName = value?.fullName || '';
                  field.onChange(assigneeName);
                  dispatch(updateForm({ assignee: assigneeName }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Исполнитель"
                    variant="outlined"
                    margin="normal"
                    sx={{ mb: 1 }}
                  />
                )}
                sx={{ mb: 1 }}
                value={users?.find((user: User) => user.fullName === formState.assignee) || null}
              />
            )}
          />
          <Controller
            name="boardId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={boards || []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(e, value) => {
                  const boardId = value?.id || undefined;
                  field.onChange(boardId);
                  dispatch(updateForm({ boardId }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Board"
                    variant="outlined"
                    margin="normal"
                    sx={{ mb: 1 }}
                  />
                )}
                sx={{ mb: 1 }}
                value={boards?.find((board) => board.id === formState.boardId) || null}
              />
            )}
          />
          <Box sx={{ mt: 1, display: 'flex', gap: 26, justifyContent: 'flex-start' }}>
            <Button type="submit" variant="contained" sx={{ borderRadius: '8px', px: 4 }}>
              Создать
            </Button>
            <Button onClick={handleClear} variant="outlined" sx={{ borderRadius: '8px' }}>
              Очистить
            </Button>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
              Отменить
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateTaskForm;