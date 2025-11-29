import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  profile: null,
  sessions: [],
  earnings: null,
  matchNotifications: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const getTutorProfile = createAsyncThunk(
  'tutor/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tutors/profile')
      return response.data.data.tutor
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const getTutorSessions = createAsyncThunk(
  'tutor/getSessions',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/tutors/sessions', { params: filters })
      return response.data.data.sessions
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const getTutorEarnings = createAsyncThunk(
  'tutor/getEarnings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tutors/earnings')
      return response.data.data.earnings
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const getMatchNotifications = createAsyncThunk(
  'tutor/getMatchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/matching/notifications')
      return response.data.data.matchRequests
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const acceptMatchRequest = createAsyncThunk(
  'tutor/acceptMatch',
  async (matchRequestId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/matching/${matchRequestId}/accept`)
      return response.data.data.matchRequest
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getTutorProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTutorProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(getTutorProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get Sessions
      .addCase(getTutorSessions.fulfilled, (state, action) => {
        state.sessions = action.payload
      })
      // Get Earnings
      .addCase(getTutorEarnings.fulfilled, (state, action) => {
        state.earnings = action.payload
      })
      // Get Match Notifications
      .addCase(getMatchNotifications.fulfilled, (state, action) => {
        state.matchNotifications = action.payload
      })
  },
})

export const { clearError } = tutorSlice.actions
export default tutorSlice.reducer

