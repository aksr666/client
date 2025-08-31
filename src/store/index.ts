import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Socket } from 'socket.io-client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface AuthState {
  token: string | null
  user: User | null
}

export interface Room {
  id: string
  name: string
  isPrivate: boolean
  hasPassword: boolean
  participants?: User[]
}

// Auth atom with localStorage persistence
export const authAtom = atomWithStorage<AuthState>('auth', {
  token: null,
  user: null
})

// Rooms atom
export const roomsAtom = atom<Room[]>([])

// Socket atom
export const socketAtom = atom<Socket | null>(null)

// Current room atom
export const currentRoomAtom = atom<Room | null>(null)

// Participants atom
export const participantsAtom = atom<User[]>([])

// Cursors atom
export const cursorsAtom = atom<Record<string, { x: number; y: number; user: User; lastSeen: number }>>({})

// Sidebar visibility atom
export const sidebarVisibleAtom = atom<boolean>(true)
