import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Subject = {
  id: number;
  name: string;
  color: string;
};

export type Task = {
  id: number;
  title: string;
  status: string;
};

export type StudySession = {
  id: number;
  title: string;
  session_date: string;
  start_time: string | null;
  duration_minutes: number;
};

type PlannerState = {
  subjects: Subject[];
  tasks: Task[];
  sessions: StudySession[];
};

const initialState: PlannerState = {
  subjects: [],
  tasks: [],
  sessions: [],
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    setSubjects: (state, action: PayloadAction<Subject[]>) => {
      state.subjects = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    setSessions: (state, action: PayloadAction<StudySession[]>) => {
      state.sessions = action.payload;
    },
  },
});

export const { setSubjects, setTasks, setSessions } =
  plannerSlice.actions;

export default plannerSlice.reducer;