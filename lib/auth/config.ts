export const COOKIE_NAME = 'next.sid'
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? ''
export const COOKIE_SECURE = process.env.NODE_ENV === 'production'
export const COOKIE_MAX_AGE_IN_SECONDS = Number(process.env.COOKIE_MAX_AGE_IN_SECONDS) ?? 0
