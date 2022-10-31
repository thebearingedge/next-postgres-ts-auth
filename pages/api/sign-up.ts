import argon2 from 'argon2'
import type { NextApiHandler } from 'next'
import { withSql } from '~/database'

const handler: NextApiHandler = async (req, res) => {
  const { username, password } = req.body
  if (typeof username === 'undefined' || typeof password === 'undefined') {
    res.status(400).json({ error: 'username and password are required' })
    return
  }
  if (String(username).trim() === '' || String(password).trim() === '') {
    res.status(400).json({ error: 'username and password cannot be empty' })
    return
  }
  const hashedPassword = await argon2.hash(password)
  const user = await withSql(async sql => {
    const [user] = await sql<[{ userId: number, username: string } | undefined]>`
      insert into "users" ("username", "hashedPassword")
      values (${username}, ${hashedPassword})
      on conflict ("username")
      do nothing
      returning "userId",
                "username"
    `
    return user
  })
  if (user == null) {
    res.status(409).json({ error: `the username "${username}" is not available` })
    return
  }
  res.status(201).json(user)
}

export default handler
