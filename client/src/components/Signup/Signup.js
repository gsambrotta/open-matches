import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [reveal, setReveal] = React.useState(false)

  return (
    <section className={styles.wrap}>
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
          onSubmit={({ value }) => console.log('submit', value)}
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
                icon={reveal ? <View size='medium' /> : <Hide size='medium' />}
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
                icon={reveal ? <View size='medium' /> : <Hide size='medium' />}
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
    </section>
  )
}
