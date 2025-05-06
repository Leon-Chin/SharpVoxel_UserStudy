import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    answers: {}
}

export const AnswerSlicer = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        addAnswer: (state, action) => {
            const { model_ID, value } = action.payload
            state.answers[model_ID] = value
        },
        resetAnswers: (state) => {
            state.answers = {}
        }
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

export const { addAnswer, resetAnswers } = AnswerSlicer.actions

export default AnswerSlicer.reducer