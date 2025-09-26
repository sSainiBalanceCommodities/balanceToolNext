import React from 'react'

import styles from './Header.module.css'
import { DateInput } from '@mantine/dates'
import { Button, Chip, Group, HoverCard, HoverCardDropdown, HoverCardTarget, Switch } from '@mantine/core'
import { demandConfig } from '../chart/ChartConfig'


const DemandHeader = () => {
    return (
        <div className={styles.header} >
            <div className={styles.leftSection} >
                <DateInput size='xs' />
            </div>
            <div className={styles.rightSection} >
            </div>
        </div>
    )
}

export default DemandHeader


const filters = {
    "TRANSMISSION_DEMAND": {
        "actual": [
            "EL_ITSD",
            "EL_ROLLING",
            "EL_ROLLING_AVG"
        ],
        "forecasts": {
            "EL_TSDF": [
                "EL_TSDF_latest",
                "EL_TSDF_00:00",
                "EL_TSDF_04:00",
                "EL_TSDF_08:00",
                "EL_TSDF_12:00",
                "EL_TSDF_16:00",
                "EL_TSDF_20:00"
            ],
            "EN_TSDF": [
                "EN_TSDF_latest",
                "EN_TSDF_00:00",
                "EN_TSDF_04:00",
                "EN_TSDF_08:00",
                "EN_TSDF_12:00",
                "EN_TSDF_16:00",
                "EN_TSDF_20:00"
            ]
        },
        "DA": [
            "EN_TSDF_DA",
            "EL_TSD_DA"
        ]
    },
    "NATIONAL_DEMAND": {
        "actual": [
            "EL_IDO"
        ],
        "forecasts": {
            "EL_IND": [
                "EL_IND_latest",
                "EL_IND_00:00",
                "EL_IND_04:00",
                "EL_IND_08:00",
                "EL_IND_12:00",
                "EL_IND_16:00",
                "EL_IND_20:00"
            ]
        },
        "DA": [
            "EL_IND_DA"
        ]
    }
}