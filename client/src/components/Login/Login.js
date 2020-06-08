import React, { useState, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { env } from '../../../../config'
import { Form, FormField, TextInput, Box } from 'grommet'
import { Button, ButtonPrimary } from '../CustomStyle/ButtonCustom'
import { Hide, View } from 'grommet-icons'
import styles from './login.css'

const defaultValue = {
  email: '',
  password: '',
}

export default function LoginForm(props) {
  const [value, setValue] = useState(defaultValue)
  const [reveal, setReveal] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)
  const history = useHistory()

  return (
    <section className={styles.wrap}>
      {userNotFound ? (
        <Box direction='row' justify='center' margin={{ top: 'large' }}>
          <small className={styles.footer}>
            Seems this user doesn't exists yet. <br />
            Maybe you want to <Link to='/signup'>Sign Up</Link> for an account
            <br />
            or reset your password.
          </small>
        </Box>
      ) : (
        <Fragment>
          <Box
            a11yTitle='login form'
            align='center'
            justify='center'
            background='var(--azure)'
            elevation='large'
            pad='large'>
            <Form
              value={value}
              onChange={(nextValue) => {
                setValue(nextValue)
              }}
              onSubmit={async ({ value }) => {
                console.log('value', value)
                try {
                  const res = await fetch(`${env.API_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: value.email,
                      password: value.password,
                    }),
                  })

                  const json = await res.json()
                  if (json.noUserError) {
                    return setUserNotFound(true)
                  }

                  if (json && !json.error) {
                    return history.push('/')
                  }
                } catch (err) {
                  console.error(err)
                }
              }}
              validate='blur'>
              <FormField
                className='fieldGlobalStyle'
                name='email'
                label='Your Email'
                required
                validate={{
                  regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message:
                    'Your email address seems invalid. Should be something like: julia@protonmail.com',
                }}>
                <TextInput
                  type='email'
                  name='email'
                  placeholder='julia@protonmail.com'
                />
              </FormField>
              <FormField
                className='fieldGlobalStyle'
                name='password'
                label='Your password'
                required
                info='Password must be minimum 8 characters, including one letter and one number'
                validate={{
                  regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message: 'Your password is not valid',
                }}>
                <Box direction='row' align='center'>
                  <TextInput
                    plain
                    name='password'
                    placeholder='your password'
                    type={reveal ? 'text' : 'password'}
                  />
                  <Button
                    icon={
                      reveal ? <View size='medium' /> : <Hide size='medium' />
                    }
                    onClick={() => setReveal(!reveal)}
                  />
                </Box>
              </FormField>

              <Box direction='row' justify='center' margin={{ top: 'large' }}>
                <ButtonPrimary
                  type='submit'
                  label='Login'
                  primary
                  color='var(--brandColor)'
                  fill
                  a11yTitle='submit button'
                />
              </Box>
            </Form>
          </Box>
          <Box direction='row' justify='center' margin={{ top: 'large' }}>
            <small className={styles.footer}>
              Don't have an account with us yet?{' '}
              <Link to='/signup'>Sign up here</Link>
            </small>
          </Box>
        </Fragment>
      )}
    </section>
  )
}
