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

export default function RegistrationForm() {
  const [value, setValue] = useState()
  const [goal, setGoal] = useState()
  const [frequency, setFrequency] = useState()
  const [weekDays, setWeekDays] = useState()
  const [timeOfDay, setTimeOfDay] = useState([])
  const [groupWork, setGroupWork] = useState()
  const [projectDescription, setProjectDescription] = useState()
  const [visibleSteps, setVisibleSteps] = useState(1)
  const timeOfDaysValues = ['morning', 'afternoon', 'evening']
  const isLearner = goal && goal === 'I want to coach' ? false : true

  function onCheck(event, value) {
    if (event.target.checked) {
      setTimeOfDay([...timeOfDay, value])
    } else {
      setTimeOfDay(timeOfDay.filter((item) => item !== value))
    }
  }

  function renderRegistrationSteps(visibleSteps) {
    switch (visibleSteps) {
      case 1:
        return (
          <section>
            <h2>What is the main reason you come here?</h2>
            <RadioButtonGroup
              name='goal'
              options={['I want to coach', 'I want to learn']}
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
              }}
            />

            <Button onClick={() => setVisibleSteps(2)}>
              Go to next step >
            </Button>
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

            <Button onClick={() => setVisibleSteps(3)}>
              Go to next step >
            </Button>
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
            <Button onClick={() => setVisibleSteps(4)}>
              Go to next step >
            </Button>
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
                options={['1 day', 'from 1 to 3 days', 'from 3 to 5 days']}
                value={frequency}
                onChange={(event) => {
                  setFrequency(event.target.value)
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
                  onChange={(event) => onCheck(event, item)}
                />
              ))}
            </FormField>

            <h4>Which days are best for you?</h4>
            <FormField className='fieldGlobalStyle' name='weekDays' required>
              <RadioButtonGroup
                name='weekDays'
                options={['week days', 'weekend only', 'both works for me']}
                value={weekDays}
                onChange={(event) => {
                  setWeekDays(event.target.value)
                }}
              />
            </FormField>

            <Button onClick={() => setVisibleSteps(5)}>
              Go to next step >
            </Button>
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
                  value={projectDescription}
                  onChange={(event) =>
                    setProjectDescription(event.target.value)
                  }
                  fill
                />
              </Fragment>
            )}

            <h3>Are you interested to work in groups?</h3>
            <RadioButtonGroup
              name='groupWork'
              options={['yes', 'no']}
              value={groupWork}
              onChange={(event) => {
                setGroupWork(event.target.value)
              }}
            />
            <Button type='submit' onClick={() => console.log('submit')}>
              See matches!
            </Button>
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
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue)
          }}
          onSubmit={({ value: values, touched }) =>
            console.log('submit', value)
          }
          validate='blur'>
          {renderRegistrationSteps(visibleSteps)}
        </Form>
      </Box>
      {visibleSteps === 1 && (
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
