import type { Raider } from '../hooks/useRoster'

type Props = {
  roster: Raider[]
  region: string
  onRemove: (id: number) => void
  onUpdateNote: (id: number, note: string) => void
}

export const RosterTable = ({ roster, region, onRemove, onUpdateNote }: Props) => {
  return (
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
                  onChange={(e) => onUpdateNote(raider.id, e.target.value)}
                />
              </td>
              <td>
                <a
                  href={`https://www.warcraftlogs.com/character/${region}/${raider.realm}/${raider.name.toLowerCase()}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Logs
                </a>
              </td>
              <td>
                <button className="remove-btn" onClick={() => onRemove(raider.id)}>
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
  )
}