import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchUserData = createAsyncThunk("fetchUser", async(_, thunk) => {
    try {
        const res = await axios.get(import.meta.env.VITE_DOMAIN + "/get-user-data", { withCredentials : true})
        // console.log(res)
        return res.data.data
        

    } catch (error) {
          console.log("Error");
          
        return thunk.rejectWithValue(error.response.data.error)
    }

})



const userSlice = createSlice({
    initialState : {
        data : null,
        loading : true,
        error : null
    },
    name : "user",
    reducers : {
        addUser : (state, action) => {
            state.data = action.payload
        },
        addPost : (state, action) => {
            state.data.post.push(action.payload)
        },
        updateLikes : (state, action) => {
            const obj = action.payload
            for(let i = 0; i < state.data.post.length; i++)
            {
                if(state.data.post[i]._id == obj._id)
                {
                    state.data.post[i] = obj
                    break
                }
            }

        },
        logoutUser : (state, action) => {
            return {
                data : null,
                loading : false,
                error : null
            }
        },
        followUser : (state, action) => {
            state.data.following.push(action.payload)
        },
        unfollowUser : (state, action) => {
            const filteredFollowing = state.data.following.filter((item) => {
                return item != action.payload
            })

            state.data.following = filteredFollowing
        }

    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchUserData.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.loading = false
            state.data = action.payload
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            console.log(action)
            state.loading = false
            state.error = action.payload
        })
    }
})


export default userSlice.reducer
export const{ addUser , addPost, updateLikes, logoutUser, followUser, unfollowUser} = userSlice.actions