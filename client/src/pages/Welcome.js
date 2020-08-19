import React from 'react'
import { Box } from 'grommet'
import { ButtonPrimary } from '../components/CustomStyle/ButtonCustom'
import styles from '../styles/common.css'

export default function Welcome() {
  return (
    <section className={styles.wrap}>
      <Box direction='column' justify='center' margin={{ top: 'large' }}>
        <h2 className={styles.reverse}>
          Find a partner to start your learning journey
        </h2>
        <p className={styles.reverse}>Some cool explanation of how it works</p>
      </Box>
    </section>
  )
}
