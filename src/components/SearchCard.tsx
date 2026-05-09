import { useState } from 'react'
import { fetchCharacter } from '../services/raiderService'
import type { Raider } from '../hooks/useRoster'

type Props = {
  realm: string
  region: string
  roster: Raider[]
  onAdd: (raider: Omit<Raider, 'id'>) => void
}

export const SearchCard = ({ realm, region, roster, onAdd }: Props) => {
  const [searchName, setSearchName] = useState("")
  const [searchRealm, setSearchRealm] = useState(realm)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const search = async () => {
    setLoading(true)
    setError("")
    setSearchResult(null)
    try {
      const data = await fetchCharacter(searchName, searchRealm, region)
      if (roster.find(r => r.name.toLowerCase() === data.name.toLowerCase())) {
        setError("That raider is already on the roster.")
        return
      }
      setSearchResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    if (!searchResult) return
    onAdd({
      name: searchResult.name,
      class: searchResult.class,
      spec: searchResult.active_spec_name,
      ilvl: Math.round(searchResult.gear.item_level_equipped),
      realm: searchResult.realm.toLowerCase(),
      note: "",
    })
    setSearchResult(null)
    setSearchName("")
    setSearchRealm(realm)
  }

  return (
    <div className="search-card">
      <h2>Add Raider</h2>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Character name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <input
          type="text"
          placeholder="Realm"
          value={searchRealm}
          onChange={(e) => setSearchRealm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search}>
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
          <button onClick={handleAdd}>Add</button>
        </div>
      )}
    </div>
  )
}