import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

const GUILD = { name: "V Cute", realm: "Illidan", region: "us" }

type Raider = {
  id: number
  name: string
  class: string
  spec: string
  ilvl: number
  realm: string
  note: string
}

function App() {
  const [roster, setRoster] = useState<Raider[]>([])
  const [searchName, setSearchName] = useState("")
  const [searchRealm, setSearchRealm] = useState("illidan")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRoster = async () => {
      const { data, error } = await supabase
        .from('raiders')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching roster:', error)
      } else {
        setRoster(data)
      }
    }

    fetchRoster()
  }, [])

  const searchCharacter = async () => {
    setLoading(true)
    setError("")
    setSearchResult(null)
    try {
      const response = await fetch(
        `https://raider.io/api/v1/characters/profile?region=${GUILD.region}&realm=${searchRealm}&name=${searchName}&fields=gear,spec`
      )
      const data = await response.json()
      if (data.statusCode === 400) {
        setError("Character not found.")
      } else {
        setSearchResult(data)
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const addRaider = async () => {
    if (!searchResult) return
    if (roster.find(r => r.name.toLowerCase() === searchResult.name.toLowerCase())) {
  setError("That raider is already on the roster.")
  return
}

    const newRaider: Raider = {
      id: Date.now(),
      name: searchResult.name,
      class: searchResult.class,
      spec: searchResult.active_spec_name,
      ilvl: Math.round(searchResult.gear.item_level_equipped),
      realm: searchResult.realm.toLowerCase(),
      note: "",
    }
    const { data, error } = await supabase
      .from('raiders')
      .insert([newRaider])
      .select()

    if (error) {
      setError("Failed to add raider.")
      console.error(error)
    } else {
      setRoster(prev => [...prev, data[0]])
    }
    setSearchResult(null)
    setSearchName("")
    setSearchRealm("illidan")

  }

  const updateNote = async (id: number, note: string) => {
  setRoster(prev => prev.map(r => r.id === id ? { ...r, note } : r))
  
  const { error } = await supabase
    .from('raiders')
    .update({ note })
    .eq('id', id)

  if (error) {
    console.error('Error updating note:', error)
  }
}

  const removeRaider = async (id: number) => {
  const { error } = await supabase
    .from('raiders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error removing raider:', error)
  } else {
    setRoster(prev => prev.filter(r => r.id !== id))
  }
}

  return (
    <div>
      <div className="header">
        <div className="header-left">
          <h1>V Cute <span>Guild Dashboard</span></h1>
          <p className="header-sub">Illidan — US</p>
        </div>
        <div className="raider-count">{roster.length} Raiders</div>
      </div>

      <div className="search-card">
        <h2>Add Raider</h2>
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Character name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCharacter()}
          />
          <input
            type="text"
            placeholder="Realm"
            value={searchRealm}
            onChange={(e) => setSearchRealm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCharacter()}
          />
          <button onClick={searchCharacter}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="search-error">{error}</p>}
        {searchResult && (
          <div className="search-result">
            <div className="search-result-info">
              <p className="search-result-name">{searchResult.name}</p>
              <p className="search-result-sub">
                {searchResult.active_spec_name} {searchResult.class} — {Math.round(searchResult.gear.item_level_equipped)} ilvl
              </p>
            </div>
            <button onClick={addRaider}>Add</button>
          </div>
        )}
      </div>

      <div className="roster">
        <h2>Raid Team <span>{roster.length} raiders</span></h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Spec</th>
              <th>ilvl</th>
              <th>Note</th>
              <th>Logs</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roster.map((raider) => (
              <tr key={raider.id}>
                <td>{raider.name}</td>
                <td>{raider.class}</td>
                <td>{raider.spec}</td>
                <td>{raider.ilvl}</td>
                <td>
                <input
                  type="text"
                  className="note-input"
                  placeholder="Add note..."
                  value={raider.note}
                  onChange={(e) => updateNote(raider.id, e.target.value)}
                />
</td>
                <td>
                  <a
                    href={`https://www.warcraftlogs.com/character/${GUILD.region}/${raider.realm}/${raider.name.toLowerCase()}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Logs
                  </a>
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeRaider(raider.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {roster.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">No raiders yet — search to add someone</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App