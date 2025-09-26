import React from 'react'
import styles from './page.module.css'
import BalanceDeltaHeader from '../../components/balancedelta/header/BalanceDeltaHeader'
import BalanceTable from '../../components/balancedelta/balanceTable/BalanceTable'

const page = () => {
    return (
        <div className={styles.balanceDelta} >
            <BalanceDeltaHeader />
            <div className='divider' ></div>
            <BalanceTable />
        </div>
    )
}

export default page