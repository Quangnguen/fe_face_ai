import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

export const get_leaverequests = createAsyncThunk(
  'leaverequest/get_leaverequests',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return rejectWithValue('No access token available') // Handle token absence
    }
    try {
      const { data } = await api.get('/leave_request/getAll', {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
        withCredentials: true,
      })
      return data // Return data directly instead of fulfillWithValue
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Something went wrong' // Handle missing data in error response
      )
    }
  }
)

export const update_status_leave_request = createAsyncThunk(
  'leaverequest/update_status_leave_request',
  async ({ status, id }, { rejectWithValue, fulfillWithValue }) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return rejectWithValue('No access token available') // Handle token absence
    }
    try {
      if (status === 'approve') {
        const { data } = await api.post(
          `/leave_request/approve/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to header
            },
          }
        )
        return fulfillWithValue(data)
      } else {
        const { data } = await api.post(
          `/leave_request/reject/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to header
            },
          }
        )
        return fulfillWithValue(data)
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const get_leaverequest_by_id = createAsyncThunk(
  'leaverequest/get_leaverequest_by_id',
  async (leaverequestId, { rejectWithValue, fulfillWithValue }) => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      return rejectWithValue('No access token available') // Handle token absence
    }
    try {
      const { data } = await api.get(
        `/leave_request/employee_requests`,
        leaverequestId,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
          withCredentials: true,
        }
      )
      console.log(data)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const update_leaverequest = createAsyncThunk(
  'leaverequest/update_leaverequest',
  async (product, { rejectWithValue, fulfillWithValue }) => {
    const { id } = product.id
    try {
      const { data } = await api.post(`/leaverequest/update/${id}`, product, {
        withCredentials: true,
      })
      console.log(data)
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// End Method

export const leaverequestReducer = createSlice({
  name: 'leaverequest',
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    leaverequests: [],
    totalleaverequest: 0,
    leaverequest: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(get_leaverequests.fulfilled, (state, { payload }) => {
        // state.totalleaverequest = payload.data.total
        state.leaverequests = payload
      })

      .addCase(update_leaverequest.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.data.message
        const index = state.leaverequests.findIndex(
          (cat) => cat._id === payload.data.leaverequest._id
        )
        if (index !== -1) {
          state.leaverequests[index] = payload.data.leaverequest
        }
      })

      .addCase(update_leaverequest.rejected, (state, { payload }) => {
        state.loader = false
        state.errorMessage = payload.error
      })

      .addCase(update_status_leave_request.fulfilled, (state, { payload }) => {
        state.loader = false
        state.successMessage = payload.message
      })

      .addCase(update_status_leave_request.rejected, (state, { payload }) => {
        state.loader = false
        // state.errorMessage = payload.error
      })

      .addCase(get_leaverequest_by_id.fulfilled, (state, { payload }) => {
        state.loader = false
        state.leaverequest = payload.data.result
      })

    // .addCase(
    //   update_status_reject_leave_request.fulfilled,
    //   (state, { payload }) => {
    //     state.loader = false
    //     state.successMessage = payload.message
    //   }
    // )

    // .addCase(
    //   update_status_reject_leave_request.rejected,
    //   (state, { payload }) => {
    //     state.loader = false
    //     state.errorMessage = payload.error
    //   }
    // )
  },
})
export const { messageClear } = leaverequestReducer.actions
export default leaverequestReducer.reducer
