import React from 'react'
import styles from './page.module.css'
import Header from '../../components/deamnd/header/DemandHeader'
import DemandHeader from '../../components/deamnd/header/DemandHeader'
import DemandChart from '../../components/deamnd/chart/DemandChart'

const page = () => {
    return (
        <div className={styles.demand} >
            <DemandHeader />
            <div className='divider' ></div>
            <DemandChart />
        </div>
    )
}

export default page