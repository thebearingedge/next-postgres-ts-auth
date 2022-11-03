import type { ReactNode } from 'react'
import { getSession } from '~/lib/auth/get-session'
import { SessionProvider } from '~/lib/auth/context'

type LayoutProps = {
  children: ReactNode
}

export default async function RootLayout({ children }: LayoutProps): Promise<JSX.Element> {
  const user = await getSession()
  return (
    <html lang="en-US">
      <head>
        <title>Next.js Postgres Auth</title>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <SessionProvider user={user}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
