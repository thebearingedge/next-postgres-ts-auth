import { redirect } from 'next/navigation'
import { getSession } from '~/lib/auth/get-session'
import SignInForm from './form'

export default async function SignIn(): Promise<JSX.Element> {
  const user = await getSession()
  if (user != null) redirect('/')
  return (
    <SignInForm />
  )
}
