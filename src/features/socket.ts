import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import { socketAtom, authAtom, roomsAtom } from '../store'

const SOCKET_URL = 'ws://localhost:3001'

export const useSocket = () => {
  const [socket, setSocket] = useAtom(socketAtom)
  const [auth] = useAtom(authAtom)
  const [, setRooms] = useAtom(roomsAtom)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (auth.token && !socket) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: auth.token
        }
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
      })

      newSocket.on('user:left', (data) => {
        console.log('User left:', data)
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
  }, [auth.token, socket, setSocket, setRooms])

  return socket
}

export const useSocketEvents = () => {
  const [socket] = useAtom(socketAtom)

  const createRoom = (roomData: { name: string; password?: string; isPrivate: boolean }) => {
    if (socket) {
      socket.emit('room:create', roomData)
    }
  }

  const joinRoom = (roomId: string, password?: string) => {
    if (socket) {
      socket.emit('room:join', { roomId, password })
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('room:leave', { roomId })
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
