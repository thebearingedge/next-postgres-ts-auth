import { cookies } from 'next/headers'
import signature from 'cookie-signature'
import { withSql } from '~/database'
import { SessionProvider } from '~lib/auth/context'
import { COOKIE_NAME, COOKIE_SECRET } from '~lib/auth/config'

type User = {
  userId: number
  username: string
}

async function getSession(cookie?: string): Promise<User | undefined> {
  if (cookie == null) return
  const verifiedSessionId = signature.unsign(cookie, COOKIE_SECRET)
  if (!verifiedSessionId) return
  return await withSql(async sql => {
    const [user] = await sql<[User | undefined]>`
      select "u"."userId",
             "u"."username"
        from "users" as "u"
        join "sessions" as "s" using ("userId")
       where "s"."sessionId" = ${verifiedSessionId}
    `
    return user
  })
}

type LayoutProps = {
  params: Record<string, string | string[]>
  children: React.ReactNode
}

export default async function RootLayout({ children }: LayoutProps): Promise<JSX.Element> {
  const user = await getSession(cookies().get(COOKIE_NAME))
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
