import React from 'react'
import { Box } from 'grommet'
import { ButtonPrimary } from '../CustomStyle/ButtonCustom'

export default function SignupForm() {
  return (
    <section className={styles.wrap}>
      <Box direction='row' justify='center' margin={{ top: 'large' }}>
        <h2>Find a partner to start your learning journey</h2>

        <Box direction='row' justify='center' margin={{ top: 'large' }}>
          <ButtonPrimary
            label='Signup'
            primary
            color='var(--brandColor)'
            fill
            a11yTitle='signup button'
            href='/signup'
          />
        </Box>
        <Box direction='row' justify='center' margin={{ top: 'large' }}>
          <ButtonPrimary
            label='Login'
            primary
            color='var(--brandColor)'
            fill
            a11yTitle='login button'
            href='/login'
          />
        </Box>
      </Box>
      <style jsx>{`
        .wrap {
          max-width: 400px;
          margin: 0 auto;
          margin-top: 60px;
        }
      `}</style>
    </section>
  )
}
