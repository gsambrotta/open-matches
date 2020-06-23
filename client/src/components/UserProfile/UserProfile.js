import React from 'react'

export default function UserProfile({ token }) {
  const email = token ? token.email : ''
  return (
    <div>
      <h3 style={{ color: 'white' }}>user email: {email}</h3>
    </div>
  )
}
