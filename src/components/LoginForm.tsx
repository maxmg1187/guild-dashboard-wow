import { useState } from 'react'

type Props = {
  onLogin: (email: string, password: string) => void
  error: string
}

export const LoginForm = ({ onLogin, error }: Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <h1>V Cute <span>Guild Dashboard</span></h1>
          <p className="header-sub">Illidan — US</p>
        </div>
      </div>
      <div className="search-card">
        <h2>Officer Login</h2>
        <div className="search-inputs">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin(email, password)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin(email, password)}
          />
          <button onClick={() => onLogin(email, password)}>Login</button>
        </div>
        {error && <p className="search-error">{error}</p>}
      </div>
    </div>
  )
}