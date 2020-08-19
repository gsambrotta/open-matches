import React, { useEffect, useState } from 'react'
import { Box } from 'grommet'
import { Link, useHistory } from 'react-router-dom'
import useQuery from '../hooks/useQuery'
import commonStyle from '../styles/common.css'
import { env } from '../../../config'

export default function VerifyEmail() {
  const query = useQuery()
  const tokenParam = query.get('token')
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log({ tokenParam })
    if (tokenParam) {
      async function fetchUser() {
        try {
          const res = await fetch(
            `${env.API_URL}/api/verifyEmail/${tokenParam}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          const json = await res.json()

          if (json.error) {
            console.log('err user not found', json.error)
            return setIsLoading(false)
          } else {
            return history.push('/registration')
          }
        } catch (err) {
          console.error(err)
        }
      }

      fetchUser()
    } else {
      return history.push('/')
    }
  }, [])

  return isLoading ? (
    <section className={commonStyle.wrap}>
      <Box
        direction='row'
        justify='center'
        align='center'
        elevation='large'
        pad='large'
        background='var(--azure)'
        a11yTitle='verify email account'>
        <h2>Verifying your email...</h2>
      </Box>
    </section>
  ) : (
    <section className={commonStyle.wrap}>
      <Box
        direction='row'
        justify='center'
        align='center'
        elevation='large'
        pad='large'
        background='var(--azure)'
        a11yTitle='verify email account'>
        <h2>
          Your token is expired, please sign up again{' '}
          <Link to='/signup'>here</Link>
        </h2>
      </Box>
    </section>
  )
}
