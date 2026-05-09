import { useAuth } from './hooks/useAuth'
import { useRoster } from './hooks/useRoster'
import { LoginForm } from './components/LoginForm'
import { SearchCard } from './components/SearchCard'
import { RosterTable } from './components/RosterTable'
import './App.css'

const GUILD = { name: "V Cute", realm: "Illidan", region: "us" }

function App() {
  const { session, login, logout, error } = useAuth()
  const { roster, addRaider, removeRaider, updateNote } = useRoster()

  if (!session) {
    return <LoginForm onLogin={login} error={error} />
  }

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <h1>V Cute <span>Guild Dashboard</span></h1>
          <p className="header-sub">Illidan — US</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="raider-count">{roster.length} Raiders</div>
          <button className="remove-btn" onClick={logout}>Logout</button>
        </div>
      </div>
      <SearchCard
        realm={GUILD.realm}
        region={GUILD.region}
        roster={roster}
        onAdd={addRaider}
      />
      <RosterTable
        roster={roster}
        region={GUILD.region}
        onRemove={removeRaider}
        onUpdateNote={updateNote}
      />
    </div>
  )
}

export default App