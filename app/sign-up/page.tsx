import { redirect } from 'next/navigation'
import { getSession } from '~/lib/auth/get-session'
import SignUpForm from './form'

export default async function SignUp(): Promise<JSX.Element> {
  const user = await getSession()
  if (user != null) redirect('/')
  return (
    <SignUpForm />
  )
}
