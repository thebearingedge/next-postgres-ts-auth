import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '~/lib/auth/get-session'

type LayoutProps = {
  children: ReactNode
}

export default async function AuthLayout({ children }: LayoutProps): Promise<JSX.Element> {
  const user = await getSession()
  if (user != null) redirect('/')
  return (
    <>
      {children}
    </>
  )
}
