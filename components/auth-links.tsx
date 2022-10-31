'use client'
import Link from 'next/link'
import { useSession } from '~lib/auth/context'

export default function AuthLinks(): JSX.Element {
  const { user } = useSession()
  return (
    <>
      {
        user == null &&
        <>
          <Link href="/sign-up">Register</Link><br />
          <Link href="/sign-in">Log in</Link><br />
        </>
      }
      {
        user != null &&
        <p>You are signed in as {user.username}.</p>
      }
    </>
  )
}
