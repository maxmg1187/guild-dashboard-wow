import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export type Raider = {
  id: number
  name: string
  class: string
  spec: string
  ilvl: number
  realm: string
  note: string
}

type NewRaider = Omit<Raider, 'id'>

export const useRoster = () => {
  const [roster, setRoster] = useState<Raider[]>([])

  useEffect(() => {
    const fetchRoster = async () => {
      const { data, error } = await supabase
        .from('raiders')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) console.error('Error fetching roster:', error)
      else setRoster(data)
    }
    fetchRoster()
  }, [])

  const addRaider = async (newRaider: NewRaider) => {
    const { data, error } = await supabase
      .from('raiders')
      .insert([newRaider])
      .select()
    if (error) throw new Error("Failed to add raider.")
    setRoster(prev => [...prev, data[0]])
  }

  const removeRaider = async (id: number) => {
    const { error } = await supabase
      .from('raiders')
      .delete()
      .eq('id', id)
    if (error) console.error('Error removing raider:', error)
    else setRoster(prev => prev.filter(r => r.id !== id))
  }

  const updateNote = async (id: number, note: string) => {
    setRoster(prev => prev.map(r => r.id === id ? { ...r, note } : r))
    const { error } = await supabase
      .from('raiders')
      .update({ note })
      .eq('id', id)
    if (error) console.error('Error updating note:', error)
  }

  return { roster, addRaider, removeRaider, updateNote }
}