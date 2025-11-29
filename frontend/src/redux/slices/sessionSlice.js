import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload
    },
    updateSession: (state, action) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.sessions[index] = action.payload
      }
    },
  },
})

export const { setSessions, setCurrentSession, updateSession } = sessionSlice.actions
export default sessionSlice.reducer

