import uid from 'uid-safe'
import argon2 from 'argon2'
import { FastifyPluginAsync } from 'fastify'
import { Type, Static } from '@sinclair/typebox'
import { COOKIE_NAME, COOKIE_SECURE, COOKIE_MAX_AGE_IN_SECONDS } from '../lib/auth/config.js'

type User = {
  userId: number
  hashedPassword: string
}

const auth: FastifyPluginAsync = async app => {

  const { sql } = app.services

  const credentials = Type.Object({
    username: Type.String(),
    password: Type.String()
  })

  app.post<{ Body: Static<typeof credentials> }>(
    '/api/sign-up',
    { schema: { body: credentials } },
    async (req, res) => {
      const { username, password } = req.body
      if (String(username).trim() === '' || String(password).trim() === '') {
        res.status(400).send({ error: 'username and password cannot be empty' })
        return
      }
      const hashedPassword = await argon2.hash(password)
      const [user] = await sql<[{ userId: number, username: string } | undefined]>`
        insert into "users" ("username", "hashedPassword")
        values (${username}, ${hashedPassword})
            on conflict ("username")
            do nothing
        returning "userId",
                  "username"
      `
      if (user == null) {
        res.status(409).send({ error: `the username "${username}" is not available` })
        return
      }
      res.status(201).send(user)
    })

  app.post<{ Body: Static<typeof credentials> }>(
    '/api/sign-in',
    { schema: { body: credentials } },
    async (req, res) => {
      const { username, password } = req.body
      const [user] = await sql<[User | undefined]>`
        select "userId",
               "hashedPassword"
          from "users"
        where "username" = ${username}
      `
      if (user == null) {
        res.status(401).send({ error: 'invalid login' })
        return
      }
      const { userId, hashedPassword } = user
      const isAuthenticated = await argon2.verify(hashedPassword, password)
      if (!isAuthenticated) {
        res.status(401).send({ error: 'invalid login' })
        return
      }
      const sessionId = await uid(18)
      await sql`
        insert into "sessions" ("sessionId", "userId")
        values (${sessionId}, ${userId})
      `
      res.cookie(COOKIE_NAME, sessionId, {
        path: '/',
        signed: true,
        httpOnly: true,
        sameSite: 'lax',
        secure: COOKIE_SECURE,
        maxAge: COOKIE_MAX_AGE_IN_SECONDS * 1000,
        expires: new Date(Date.now() + COOKIE_MAX_AGE_IN_SECONDS * 1000)
      })
      res.status(200).send({ userId, username })
    })

  app.post('/api/sign-out', async (req, res) => {
    const { value: sessionId } = req.unsignCookie(req.cookies[COOKIE_NAME] ?? '')
    if (sessionId == null) {
      res.send()
      return
    }
    res.cookie(COOKIE_NAME, '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
    })
    await sql`
      delete
        from "sessions"
       where "sessionId" = ${sessionId}
    `
    res.send()
  })

}

export default auth
