'use client'
import { useSession } from '~/lib/auth/context'

export default function SignOutButton(): JSX.Element {
  const { user, setUser } = useSession()
  const handleClick = async () => {
    const req = {
      method: 'POST'
    }
    await fetch('/api/sign-out', req)
    setUser(undefined)
  }
  return (
    <>
      {
        user != null &&
        <button onClick={handleClick}>Sign out</button>
      }
    </>
  )
}
