import React, { Fragment, useState } from 'react'
import {
  RadioButtonGroup,
  CheckBox,
  Form,
  FormField,
  TextInput,
  Box,
  TextArea,
  Meter,
} from 'grommet'
import { Button, ButtonPrimary } from '../CustomStyle/ButtonCustom'
import styles from './registration.css'

const defaultValues = {
  name: '',
  goal: '',
  skills: [],
  frequency: null,
  timeOfDay: [],
  weekDays: '',
  projectDescription: '',
  groupWork: false,
}

export default function RegistrationForm() {
  const [formValue, setFormValue] = useState(defaultValues)

  // const [goal, setGoal] = useState()
  // const [frequency, setFrequency] = useState()
  // const [weekDays, setWeekDays] = useState()
  // const [timeOfDay, setTimeOfDay] = useState([])
  // const [groupWork, setGroupWork] = useState()
  // const [projectDescription, setProjectDescription] = useState()

  const [visibleStep, setVisibleStep] = useState(1)
  const timeOfDaysValues = ['morning', 'afternoon', 'evening']
  let isLearner

  function renderRegistrationSteps(visibleStep) {
    switch (visibleStep) {
      case 1:
        return (
          <section>
            <h2>What is the main reason you come here?</h2>
            <RadioButtonGroup
              name='goal'
              options={[
                { value: 'coach', label: 'I want to coach' },
                { value: 'learner', label: 'I want to learn' },
              ]}
              // value={goal}
              onChange={({ target: { value } }) => {
                isLearner = value
                // setFormValue(...formValue, { goal: value })
              }}
            />

            <Button onClick={() => setVisibleStep(2)}>Go to next step ></Button>
          </section>
        )

      case 2:
        return (
          <section>
            <h2>Let's get start!</h2>

            <Meter
              type='bar'
              background='light-2'
              values={[{ value: 25, color: 'var(--violet)' }]}
            />
            <h3>What's your name?</h3>
            <FormField className='fieldGlobalStyle' name='name' required>
              <TextInput type='name' name='name' placeholder='Your Name' />
            </FormField>

            <Button onClick={() => setVisibleStep(3)}>Go to next step ></Button>
          </section>
        )

      case 3:
        return (
          <section>
            <Meter
              type='bar'
              background='light-2'
              values={[{ value: 50, color: 'var(--violet)' }]}
            />
            <h3>{`What do you want to ${isLearner ? 'learn' : 'coach'}`}?</h3>
            todo: autocomplete dropdown
            <Button onClick={() => setVisibleStep(4)}>Go to next step ></Button>
          </section>
        )

      case 4:
        return (
          <section>
            <Meter
              type='bar'
              background='light-2'
              values={[{ value: 75, color: 'var(--violet)' }]}
            />
            <h3>What's your ideal availability?</h3>
            <h4>
              How often would you like to ${isLearner ? 'learn' : 'coach'} in a
              week?
            </h4>
            <FormField className='fieldGlobalStyle' name='daysPerWeek' required>
              <RadioButtonGroup
                name='daysPerWeek'
                options={[
                  { value: 1, label: '1 day' },
                  { value: 3, label: 'from 1 to 3 days' },
                  { value: 5, label: 'from 3 to 5 days' },
                ]}
                // value={frequency}
                onChange={(event) => {
                  // setFormValue(event.target.value)
                }}
              />
            </FormField>

            <h4>What time span is best for you?</h4>
            <FormField className='fieldGlobalStyle' name='timeOfDay' required>
              {timeOfDaysValues.map((item) => (
                <CheckBox
                  key={item}
                  checked={timeOfDay.includes(item)}
                  label={item}
                  onChange={(event) => {
                    if (event.target.checked) {
                      // setFormValue([...timeOfDay, value])
                    } else {
                      // setFormValue(timeOfDay.filter((item) => item !== value))
                    }
                  }}
                />
              ))}
            </FormField>

            <h4>Which days are best for you?</h4>
            <FormField className='fieldGlobalStyle' name='weekDays' required>
              <RadioButtonGroup
                name='weekDays'
                options={[
                  { value: 'weekdays', label: 'week days' },
                  { value: 'weekend', label: 'weekend only' },
                  { value: 'all', label: 'both works for me' },
                ]}
                // value={weekDays}
                onChange={({ target: { value } }) => {
                  // setFormValue(value)
                }}
              />
            </FormField>

            <Button onClick={() => setVisibleStep(5)}>Go to next step ></Button>
          </section>
        )

      case 5:
        return (
          <section>
            <Meter
              type='bar'
              background='status-ok'
              values={[{ value: 100, color: 'var(--violet)' }]}
            />
            {isLearner && (
              <Fragment>
                <h3>
                  If you have a project or a goal in mind, describe it here so
                  coaches can have a better understanding if they can help out
                  or not
                </h3>
                <TextArea
                  // value={projectDescription}
                  // onChange={({ target: { value } }) => setFormValue(value)}
                  fill
                />
              </Fragment>
            )}

            <h3>Are you interested to work in groups?</h3>
            <RadioButtonGroup
              name='groupWork'
              options={['yes', 'no']}
              // value={groupWork}
              onChange={({ target: { value } }) => {
                // setGroupWork(value)
              }}
            />
            <ButtonPrimary type='submit'>See matches!</ButtonPrimary>
          </section>
        )
    }
  }

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
          value={formValue}
          onChange={(nextValue) => {
            setFormValue(nextValue)
          }}
          onSubmit={({ value, touched }) =>
            console.log('submit', value, touched)
          }
          validate='blur'>
          {renderRegistrationSteps(visibleStep)}
        </Form>
      </Box>
      {visibleStep === 1 && (
        <Box direction='row' justify='center' margin={{ top: 'large' }}>
          <small className={styles.footer}>
            Don't worry, later you will have the possibility to create a double
            profile if you wish to learn and coach.
          </small>
        </Box>
      )}
    </section>
  )
}
