import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import { socketAtom, authAtom, roomsAtom, currentRoomAtom, participantsAtom, cursorsAtom, sidebarVisibleAtom } from '../store'

const SOCKET_URL = 'http://localhost:3001'

export const useSocket = () => {
  const [socket, setSocket] = useAtom(socketAtom)
  const [auth] = useAtom(authAtom)
  const [, setRooms] = useAtom(roomsAtom)
  const [, setParticipants] = useAtom(participantsAtom)
  const [, setCursors] = useAtom(cursorsAtom)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (auth.token && !socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: auth.token
        },
      })

      newSocket.on('connect', () => {
        console.log('Connected to socket server')
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server')
      })

      newSocket.on('rooms:list', (rooms) => {
        setRooms(rooms)
      })

      newSocket.on('room:created', (room) => {
        setRooms((prev) => [...prev, room])
      })

      newSocket.on('room:deleted', (roomId) => {
        setRooms((prev) => prev.filter(room => room.id !== roomId))
      })

      newSocket.on('user:joined', (data) => {
        console.log('User joined:', data)
        setParticipants((prev) => [...prev, data.user])
      })

      newSocket.on('user:left', (data) => {
        console.log('User left:', data)
        setParticipants((prev) => prev.filter(user => user.id !== data.userId))
        setCursors((prev) => {
          const newCursors = { ...prev }
          delete newCursors[data.userId]
          return newCursors
        })
      })

      newSocket.on('cursor:move', (data) => {
        setCursors((prev) => ({
          ...prev,
          [data.userId]: {
            x: data.x,
            y: data.y,
            user: data.user,
            lastSeen: Date.now()
          }
        }))
      })

      newSocket.on('cursor:leave', (data) => {
        setCursors((prev) => {
          const newCursors = { ...prev }
          delete newCursors[data.userId]
          return newCursors
        })
      })

      socketRef.current = newSocket
      setSocket(newSocket)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
      }
    }
  }, [auth.token, setSocket, setRooms, setParticipants, setCursors])

  return socket
}

export const useSocketEvents = () => {
  const [socket] = useAtom(socketAtom)
  const [rooms] = useAtom(roomsAtom)
  const [, setCurrentRoom] = useAtom(currentRoomAtom)
  const [, setParticipants] = useAtom(participantsAtom)
  const [, setCursors] = useAtom(cursorsAtom)
  const [, setSidebarVisible] = useAtom(sidebarVisibleAtom)

  const createRoom = (roomData: { name: string; password?: string; isPrivate: boolean }) => {
    if (socket) {
      console.log(roomData);
      
      socket.emit('room:create', roomData)
    }
  }

  const joinRoom = (roomId: string, password?: string) => {
    if (socket) {
      const room = rooms.find(r => r.id === roomId)
      if (room) {
        socket.emit('room:join', { roomId, password }, (response: any) => {
          if (response.success) {
            setParticipants(response.participants || [])
          }
        })
        setCurrentRoom(room)
        setSidebarVisible(false)
      }
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('room:leave', { roomId })
      setCurrentRoom(null)
      setParticipants([])
      setCursors({})
      setSidebarVisible(true)
    }
  }

  const deleteRoom = (roomId: string) => {
    if (socket) {
      socket.emit('room:delete', { roomId })
    }
  }

  const moveCursor = (data: { x: number; y: number; roomId: string }) => {
    if (socket) {
      socket.emit('cursor:move', data)
    }
  }

  const leaveCursor = (roomId: string) => {
    if (socket) {
      socket.emit('cursor:leave', { roomId })
    }
  }

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
    moveCursor,
    leaveCursor
  }
}