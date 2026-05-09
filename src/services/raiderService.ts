const RAIDERIO_BASE = "https://raider.io/api/v1"

export const fetchCharacter = async (name: string, realm: string, region: string) => {
  const response = await fetch(
    `${RAIDERIO_BASE}/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=gear,spec`
  )
  const data = await response.json()
  if (data.statusCode === 400) throw new Error("Character not found.")
  return data
}