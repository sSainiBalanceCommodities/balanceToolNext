

import React from 'react'
import styles from './page.module.css'
import { DateInput, DatePickerInput } from '@mantine/dates'
import { ActionIcon, Text } from '@mantine/core'
import PositionNLTable from '../../components/positionNL/table/PositionNLTable.jsx'

const page = () => {
    return (
        <div className={styles.positionWrapper} >
            <div className={styles.header} >
                <div className={styles.leftHeader} >
                    <Text>Home</Text>
                    <Text>/</Text>
                    <Text>PositionNL</Text>
                </div>
                <div className={styles.rightHeader} >
                    <div className={styles.info} >
                        <Text className={styles.title}> PnL : </Text>
                        <Text className={styles.number}>4528</Text>
                    </div>
                    <div className={styles.info} >
                        <Text className={styles.title}> UnPnL : </Text>
                        <Text className={styles.number}>4528</Text>
                    </div>
                    <DateInput size='xs' />
                    <ActionIcon variant="filled" aria-label="Settings" color="cyan" size='md'>
                        {/* <IconAdjustments style={{ width: '70%', height: '70%' }} stroke={1.5} /> */}
                    </ActionIcon>
                </div>

            </div>
            <div className='divider' ></div>
            <div className={styles.content} >
                <PositionNLTable />
            </div>

        </div>
    )
}

export default page