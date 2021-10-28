import mysql from 'serverless-mysql'

const db = mysql({
  config:{
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE
  }
});

export default async function executeQuery ({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}
