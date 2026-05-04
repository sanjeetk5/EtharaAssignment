import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (projectId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchMyTasks = createAsyncThunk('tasks/fetchMyTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/tasks', data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to load tasks';
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
