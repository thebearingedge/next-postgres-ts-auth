import uid from 'uid-safe'
import argon2 from 'argon2'
import cookie from 'cookie'
import signature from 'cookie-signature'
import type { NextApiHandler } from 'next'
import { withSql } from '~/database'
import {
  COOKIE_NAME, COOKIE_SECRET, COOKIE_SECURE, COOKIE_MAX_AGE_IN_SECONDS
} from '~/lib/auth/config'

type User = {
  userId: number
  username: string
  hashedPassword: string
}

const handler: NextApiHandler = async (req, res) => {
  const credentials = req.body
  if (typeof credentials.username === 'undefined' || typeof credentials.password === 'undefined') {
    res.status(401).json({ error: 'invalid login' })
    return
  }
  const user = await withSql(async sql => {
    const [user] = await sql<[User | undefined]>`
      select "userId",
             "username",
             "hashedPassword"
        from "users"
       where "username" = ${credentials.username}
    `
    return user
  })
  if (user == null) {
    res.status(401).json({ error: 'invalid login' })
    return
  }
  const isAuthenticated = await argon2.verify(user.hashedPassword, credentials.password)
  if (!isAuthenticated) {
    res.status(401).json({ error: 'invalid login' })
    return
  }
  const { userId, username } = user
  const sessionId = await uid(18)
  const signedSessionId = signature.sign(sessionId, COOKIE_SECRET)
  await withSql(async sql => {
    await sql`
      insert into "sessions" ("sessionId", "userId")
      values (${sessionId}, ${userId})
    `
  })
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, signedSessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE,
    maxAge: COOKIE_MAX_AGE_IN_SECONDS * 1000,
    expires: new Date(Date.now() + COOKIE_MAX_AGE_IN_SECONDS * 1000)
  }))
  res.status(200).json({ userId, username })
}

export default handler
