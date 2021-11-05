import { useState } from 'react'
import fetchJson from '../lib/fetchJson'
import withoutAuth from '../lib/withoutAuth'

export async function getServerSideProps(context) {
  return withoutAuth(context, () => ({
    props: {},
  }))
}

const Register = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { username, password, nama } = e.currentTarget
    const body = {
      username: username.value,
      password: password.value,
      nama: nama.value,
    }
    const create = await fetchJson('/api/peserta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setMessage(create.message)
    if (!create.error) e.target.reset()
  }

  return (
    <div className="register">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Buat akun peserta</h1>
        <input type="text" name="username" required placeholder="Username" />
        <input type="text" name="nama" required placeholder="Nama Lengkap" />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
        />
        <input type="submit" value="Register" />
      </form>
      {message !== '' && <b>{message}</b>}
    </div>
  )
}

export default Register
