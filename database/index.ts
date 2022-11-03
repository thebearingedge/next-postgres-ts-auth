import postgres, { Sql } from "postgres"

type WithSqlCallback<T> = (sql: Sql) => Promise<T>

export async function withSql<T>(fn: WithSqlCallback<T>): Promise<T> {
  const sql = postgres(process.env.DATABASE_URL ?? '')
  try {
    return await fn(sql)
  } finally {
    void sql.end()
  }
}
