import React, { useState, Fragment } from 'react'
import { env } from '../../../../config'
import { Link, useHistory } from 'react-router-dom'
import { Form, FormField, TextInput, Box } from 'grommet'
import { Button, ButtonPrimary } from '../CustomStyle/ButtonCustom'
import { Hide, View } from 'grommet-icons'
import styles from './signup.css'

const defaultValue = {
  email: '',
  password: '',
  passwordRepeat: '',
}

export default function SignupForm() {
  const [value, setValue] = useState(defaultValue)
  const [reveal, setReveal] = useState(false)
  const [userAlreadyFound, setUserAlreadyFound] = useState(false)
  const history = useHistory()

  return (
    <section className={styles.wrap}>
      {userAlreadyFound ? (
        <Box direction='row' justify='center' margin={{ top: 'large' }}>
          <small className={styles.footer}>
            Look like that this user already exists. <br />
            Do you want to <Link to='/signup'>Login</Link>
            <br />
            or reset your password?
          </small>
        </Box>
      ) : (
        <Fragment>
          <Box
            a11yTitle='signup form'
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
                try {
                  const res = await fetch(`${env.API_URL}/api/signup`, {
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
                  if (json.userError) {
                    return setUserAlreadyFound(true)
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

              <FormField
                className='fieldGlobalStyle'
                name='passwordRepeat'
                label='Repeat your password'
                required
                validate={[
                  (passwordRepeat) => {
                    if (passwordRepeat !== value.password)
                      return 'password is not the same'
                    return undefined
                  },
                ]}>
                <Box direction='row' align='center'>
                  <TextInput
                    plain
                    name='passwordRepeat'
                    placeholder='repeat password'
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
                  label='Sign me up!'
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
              Already have an account? <Link to='/login'>Login here</Link>
            </small>
          </Box>
        </Fragment>
      )}
    </section>
  )
}
