"use client"

import React from 'react'
import styles from './WeatherHeader.module.css'
import { DateInput } from '@mantine/dates'

const WeatherHeader = () => {
    return (
        <div className={styles.header} >
            <div className={styles.leftSide} >
                <DateInput size='xs' />
            </div>
        </div>
    )
}

export default WeatherHeader