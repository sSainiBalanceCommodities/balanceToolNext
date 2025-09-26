import React from 'react'
import styles from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={styles.navbar} >
            <div className={styles.leftSide} >
                <div className={styles.logo} >Balance</div>
            </div>
            <div className={styles.center} >
                <p>Home</p>
                <p>About</p>
                <p>Finance</p>
                <p>Career</p>
            </div>
            <div className={styles.rightSide} >
                profile
            </div>
        </div>
    )
}

export default Navbar