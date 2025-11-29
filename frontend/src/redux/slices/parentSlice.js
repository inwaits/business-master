import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  profile: null,
  students: [],
  dashboard: null,
  isLoading: false,
  error: null,
}

export const getParentProfile = createAsyncThunk(
  'parent/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/parents/profile')
      return response.data.data.parent
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const getParentDashboard = createAsyncThunk(
  'parent/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/parents/dashboard')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

export const createMatchRequest = createAsyncThunk(
  'parent/createMatchRequest',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/matching/request', data)
      return response.data.data.matchRequest
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message)
    }
  }
)

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getParentProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(getParentDashboard.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getParentDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.dashboard = action.payload
      })
      .addCase(getParentDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = parentSlice.actions
export default parentSlice.reducer

