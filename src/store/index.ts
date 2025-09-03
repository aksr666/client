import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { Socket } from 'socket.io-client';

import { AuthState, CursorState, Room } from '../types';

// Auth atom with localStorage persistence
export const authAtom = atomWithStorage<AuthState>('auth', {
  token: null,
  user: null,
});

// Socket atom
export const socketAtom = atom<Socket | null>(null);

// rooms
export const roomsAtom = atom<Room[]>([]);

export const roomsAtomFamily = atomFamily((roomId: string | null) =>
  atom((get) => {
    if (!roomId) return null;

    const rooms = get(roomsAtom);
    const room = rooms.find((room) => room.id === roomId);
    return room ?? null;
  }),
);

export const currentRoomIdAtom = atom<string | null>(null);

// Sidebar visibility atom
export const sidebarVisibleAtom = atom<boolean>(true);

export const cursorAtom = atom<Record<string, CursorState>>({});
export const cursorsAtomFamily = atomFamily((userId: number) =>
  atom(
    (get) => get(cursorAtom)[userId],
    (get, set, update: Partial<CursorState>) => {
      const prev = get(cursorAtom);

      set(cursorAtom, {
        ...prev,
        [userId]: { ...prev[userId], ...update },
      });
    },
  ),
);
