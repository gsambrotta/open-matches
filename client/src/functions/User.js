import { env } from '../../../config'

export function onLogout(e, history) {
  e.preventDefault()
  localStorage.removeItem('userToken')
  return history.push(`/`)
}

export async function onLogin(email, password, setUserNotFound, history) {
  try {
    const res = await fetch(`${env.API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    const json = await res.json()

    if (json.error) {
      if (json.error.noUserFound) {
        return setUserNotFound(true)
      } else {
        // show error msg
      }
    } else {
      if (json.profile_id) {
        return history.push('/userProfile')
      } else {
        return history.push('/registration')
      }
    }
  } catch (err) {
    console.error(err)
  }
}

export async function onSignup(email, password, setUserAlreadyExist, history) {
  try {
    const res = await fetch(`${env.API_URL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    const json = await res.json()
    if (json.error) {
      if (json.error.userAlreadyExist) {
        return setUserAlreadyExist(true)
      }
      // todo: error handling screen
    } else {
      return history.push('/')
    }
  } catch (err) {
    console.error(err)
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${env.API_URL}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    })

    const json = await res.json()
    if (json.error) {
      return console.log('err user not found', json.error)
    } else {
      console.log('succ! user found', json)
      return
    }
  } catch (err) {
    console.error(err)
  }
}
