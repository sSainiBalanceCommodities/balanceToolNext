import React from 'react'
import styles from './page.module.css'
import WeatherHeader from '../../components/weather/header/WeatherHeader'

const page = () => {
    return (
        <div className={styles.weather} >
            <WeatherHeader />
            <div className='divider'></div>

        </div>
    )
}

export default page