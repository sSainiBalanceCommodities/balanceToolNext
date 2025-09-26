"use client"
import React from 'react'
import styles from './WeatherChart.module.css'
import AppChart from '@/utils/appComponents/AppChart'

const WeatherChart = () => {
    return (
        <div className={styles.weather} >
            <AppChart />
        </div>
    )
}

export default WeatherChart