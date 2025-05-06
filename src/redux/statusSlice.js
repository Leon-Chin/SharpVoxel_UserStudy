import { createSlice } from "@reduxjs/toolkit"
const orders = ["NDC", "NMC", "NMCLite", "done", "submited"]
const initialState = {
    currentPhase: "NDC"
}

export const StatusSlicer = createSlice({
    name: 'status',
    initialState,
    reducers: {
        moveToNextPhase: (state) => {
            if (state.currentPhase === "submited") return
            const index = orders.indexOf(state.currentPhase)
            state.currentPhase = orders[index + 1]
        },
        restart: (state) => {
            state.currentPhase = "NDC"
        },
        // loginSuccess: (state, action) => {
        //     state.loading = false
        //     state.currentUser = action.payload
        //     state.currentTheme = action.payload.preferedTheme
        //     state.userLocale = action.payload.preferedLanguage
        //     state.currentTutorial = null
        //     switch (action.payload.preferedLanguage) {
        //         case 'zh_CN':
        //             state.userLocale = "zh_CN"
        //             break;
        //         case 'en_US':
        //             state.userLocale = "en_US"
        //             break;
        //         default:
        //             const start = navigator.language.substring(0, 2)
        //             if (start === 'zh') {
        //                 state.userLocale = "zh_CN"
        //             } else {
        //                 state.userLocale = "en_US"
        //             }
        //             break;
        //     }
        // },
        // loginFailure: (state) => {
        //     state.loading = false
        //     state.error = true
        // },
        // logout: (state) => {
        //     state.loading = false
        //     state.currentUser = null
        //     state.error = false
        //     state.currentTutorial = null
        // },
        // setTheme: (state, action) => {
        //     state.currentTheme = action.payload
        // },
        // setLocale: (state, action) => {
        //     state.userLocale = action.payload
        // },
        // setLoading: (state, action) => {
        //     state.loading = action.payload
        // }
    }
})

export const { moveToNextPhase, restart } = StatusSlicer.actions

export default StatusSlicer.reducer