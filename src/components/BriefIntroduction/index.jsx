import { Button } from 'antd'
import React from 'react'

export default function BriefIntroduction({ numberOfComparison = 3, numberOfModels = 0 }) {
    const containerStyle = {
        padding: "0 20px",
        paddingBottom: "10px",
    }
    return (
        <div style={containerStyle}>
            <h1>SharpVoxel User Study</h1>
            <p>Please look at the following models to select the one you prefer!</p>
            <p>There are total {numberOfComparison} comparisons, and {numberOfModels} models to be compared</p>
        </div>
    )
}
