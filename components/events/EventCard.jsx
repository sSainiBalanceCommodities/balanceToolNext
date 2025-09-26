import React from 'react'
import styles from './EventCard.module.css'
import Image from 'next/image'


const EventCard = () => {
    return (
        <div className={styles.birthdayCard} >
            <div className={styles.cardWrapper} >
                <div className={styles.image} >
                    <Image src='/assets/card.jpg' width={100} height={100} alt="Card" />
                </div>
                <div className={styles.info} >
                    <text className={styles.title} >Happy Birthday</text>
                    <div className={styles.userInfo} >
                        <text className={styles.name} >User Name</text>
                        <text className={styles.designation} >user designation</text>
                    </div>
                    <text className={styles.date} >26-09-2012</text>
                </div>
            </div>
        </div>
    )
}

export default EventCard