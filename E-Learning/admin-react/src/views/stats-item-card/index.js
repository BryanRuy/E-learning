import React from 'react'
import './style.scss'

export const StatsItemCard = (props) => {

    const getFormattedLabel = (label) => {
        if (!label) return ""
        let string = label.split(" ")
        return <>{string[0]}<br />{string[1] || "  "}</>
    }

    return <div className=" dashboard-stats-item ">
        <div className="heading">
            {
                getFormattedLabel(props.label)
            }
        </div>
        <div className="count text-primary">
            {props.value ? props.value : "0"}
        </div>
    </div>
}