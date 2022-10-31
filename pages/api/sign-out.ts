import type { NextApiHandler } from 'next'
import signature from 'cookie-signature'
import cookie from 'cookie'
import { withSql } from '~/database'
import { COOKIE_NAME, COOKIE_SECRET } from '~/lib/auth/config'

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  }))
  const signedSessionId = req.cookies[COOKIE_NAME]
  if (signedSessionId == null) {
    res.end()
    return
  }
  const verifiedSessionId = signature.unsign(signedSessionId, COOKIE_SECRET)
  if (!verifiedSessionId) {
    res.end()
    return
  }
  await withSql(async sql => {
    await sql`
      delete
        from "sessions"
        where "sessionId" = ${verifiedSessionId}
    `
  })
  res.end()
}

export default handler
