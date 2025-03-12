import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTasks,
  addTask,
  toggleTask,
  updateTask,
} from "../app/api/addTask/addtaskApi";
import { fetchPriorities } from "@/app/api/priority/priorityApi";
import { RootState } from "./store";
import { fetchTasksForOtherUsers } from "@/app/api/fetchTasksForOtherUsers/fetchTasksForOtherUsers";
import { toast } from "react-toastify";
import { fetchEmails } from "@/app/api/emails/emalApi";

export interface PriorityType {
  id: number | null;
  value: string;
  description: string;
}

export interface Task {
  id: number | string;
  title: string;
  status: string;
}

export interface AddTask {
  id?: string;
  tasktitle: string;
  description: string;
  startdate: string;
  enddate: string;
  priority: string;
  assignee: string;
  email: string;
  status?: string;
}

export type EmailType = {
  email: string;
};

export interface AddTasksState {
  priorities?: PriorityType[];
  emails?: EmailType[];
  username: string;
  tasks: AddTask[];
  loading: boolean;
  error: string | null;
}

const initialStateForPriority: PriorityType[] = [
  {
    id: null,
    value: "",
    description: "",
  },
];

const initialState: AddTasksState = {
  priorities: initialStateForPriority,
  emails: [],
  tasks: [],
  username: "",
  loading: false,
  error: null,
};

export const fetchTaskFnSlice = createAsyncThunk(
  "addTasks/fetchTasks",
  async () => {
    return await fetchTasks();
  }
);

// Add a new task
export const addTaskFnSlice = createAsyncThunk(
  "addTasks/addTask",
  async (data: AddTask, { rejectWithValue }) => {
    try {
      const response = await addTask(data);
      console.log("resss111", response);
      toast.success("Success! One Task is added");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding task");
    }
  }
);

// Update  a task
export const updateTaskFnSlice = createAsyncThunk(
  "addTasks/updateTask",
  async (updatedTask: AddTask, { rejectWithValue }) => {
    try {
      const response = await updateTask(updatedTask);
      console.log("resss111", response);
      toast.success("Success! One Task is added");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error adding task");
    }
  }
);

//Get all tasks
export const getTaskFnSlice = createAsyncThunk(
  "addTasks/fetchTasks",
  async () => {
    const response = await fetchTasks();
    return response;
  }
);

//Get all tasks for non-admin users
export const getTaskForOtherUsersSlice = createAsyncThunk(
  "addTasks/fetchTasksForOtherUsers",
  async (email: string) => {
    const response = await fetchTasksForOtherUsers(email);
    return response;
  }
);

//Get all priorities
export const getPrioritiesFnInSlice = createAsyncThunk(
  "addTasks/fetchPriorities",
  async () => {
    const response = await fetchPriorities();
    return response;
  }
);

//Get all emails
export const getEmailsFnInSlice = createAsyncThunk(
  "addTasks/getAllEmails",
  async () => {
    const response = await fetchEmails("All");
    return response;
  }
);

//Get all emails
export const getEmailForAssigneeFnInSlice = createAsyncThunk(
  "addTasks/getEmailByAssignee",
  async (emailType: string) => {
    const response = await fetchEmails(emailType);
    return response;
  }
);
// Toggle task status
export const toggleTaskThunk = createAsyncThunk(
  "addTasks/toggleTask",
  async ({ id, status }: { id: number | string; status: boolean }) => {
    return await toggleTask(id, status);
  }
);

const addTasksSlice = createSlice({
  name: "addTasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
    },
    setTasks: (state, action) => {
      console.log("aaaaaaaaaa", action);
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskForOtherUsersSlice.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaskForOtherUsersSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTaskForOtherUsersSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load tasks";
      })
      .addCase(fetchTaskFnSlice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskFnSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTaskFnSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load tasks";
      })
      .addCase(addTaskFnSlice.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload); // Add new task to the top
      })
      .addCase(toggleTaskThunk.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index].status = action.payload.status;
        }
      })
      .addCase(getPrioritiesFnInSlice.fulfilled, (state, action) => {
        state.priorities = action.payload; // Store the response in state
      })
      .addCase(getPrioritiesFnInSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load priorities";
      })
      .addCase(getEmailsFnInSlice.fulfilled, (state, action) => {
        state.emails = action.payload; // Store the response in state
      })
      .addCase(getEmailForAssigneeFnInSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed emails";
      })
      .addCase(getEmailForAssigneeFnInSlice.fulfilled, (state, action) => {
        state.username = action.payload; // Store the response in state
      })
      .addCase(getEmailsFnInSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed emails";
      });
  },
});
export const { clearTasks, setTasks } = addTasksSlice.actions;
export const addTaskSelector = (state: RootState) => state.addTask;
export default addTasksSlice.reducer;
