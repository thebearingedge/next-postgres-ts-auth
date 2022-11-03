import signature from 'cookie-signature'
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '~/lib/auth/config'
import { withSql } from '~/database'
import { COOKIE_SECRET } from '~/lib/auth/config'

type User = {
  userId: number
  username: string
}

export async function getSession(): Promise<User | undefined> {
  const cookie = cookies().get(COOKIE_NAME)?.value
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
