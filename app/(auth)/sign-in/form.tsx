'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useSession } from '~/lib/auth/context'

export default function SignInForm(): JSX.Element | null {

  const router = useRouter()
  const { user, setUser } = useSession()
  const [values, setValues] = useState(() => ({ username: '', password: '' }))

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
    setValues(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }
    const res = await fetch('/api/sign-in', req)
    if (res.ok) {
      const user = await res.json()
      setUser(user)
      router.push('/')
    }
  }

  useEffect(() => {
    if (user != null) router.replace('/')
  }, [user])

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input
          name="username"
          type="text"
          required
          value={values.username}
          onChange={handleChange} />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          value={values.password}
          onChange={handleChange} />
      </label>
      <div>
        <button type="submit">Log in</button>
      </div>
    </form>
  )
}
