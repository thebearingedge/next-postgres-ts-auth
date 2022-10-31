'use client'
import { useRouter } from 'next/navigation'
import { useSession } from '~lib/auth/context'

export default function SignOutButton(): JSX.Element {
  const router = useRouter()
  const { user, setUser } = useSession()
  const handleClick = async () => {
    const req = {
      method: 'POST'
    }
    await fetch('/api/sign-out', req)
    setUser(undefined)
    router.push('/sign-in')
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
