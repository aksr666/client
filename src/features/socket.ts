import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { io, Socket } from 'socket.io-client'
import { socketAtom, authAtom, roomsAtom, currentRoomIdAtom, sidebarVisibleAtom, cursorAtom } from '../store'

const SOCKET_URL = 'http://localhost:3001'

export const useSocket = () => {
  const [auth] = useAtom(authAtom);
  const [socket, setSocket] = useAtom(socketAtom)
  const [, setCursor] = useAtom(cursorAtom);
  const [, setRooms] = useAtom(roomsAtom);
  const socketRef = useRef<Socket | null>(null);

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

      newSocket.on('rooms_list', (rooms) => {
        setRooms(rooms)
      })

      newSocket.on('room_created', (room) => {
        setRooms((prev) => [...prev, room])
      })

      newSocket.on('room_deleted', (roomId) => {
        setRooms((prev) => prev.filter(room => room.id !== roomId))
      })

      newSocket.on('user_joined', (data) => {
        console.log(data);
      })

      newSocket.on('user_left', (data) => {
        console.log(data);
        
      })

      newSocket.on('user_cursor_move', (data) => {
        setCursor((prev) => ({
          ...prev,
          [data.userId]: {
            x: data.x,
            y: data.y,
            user: data.user
          }
        }))
      })

      newSocket.on('user_cursor_leave', (data) => {
       setCursor((prev) => ({
          ...prev,
          [data.userId]: null
        }))
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
  }, [auth.token, setSocket, setRooms])

  return socket
}

export const useSocketEvents = () => {
  const [socket] = useAtom(socketAtom)
  const [, setCurrentRoomId] = useAtom(currentRoomIdAtom)
  const [, setSidebarVisible] = useAtom(sidebarVisibleAtom)

  const createRoom = (roomData: { name: string; password?: string; isPrivate: boolean }) => {
    if (socket) {
      socket.emit('create_room', roomData)
    }
  }

  const joinRoom = (roomId: string, password?: string) => {
    if (socket) {
      socket.emit('join_room', { roomId, password })
      setCurrentRoomId(roomId)
      setSidebarVisible(false)
    }
  }

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave_room', roomId)
      setCurrentRoomId(null)
      setSidebarVisible(true)
    }
  }

  const deleteRoom = (roomId: string) => {
    if (socket) {
      socket.emit('delete_room', roomId)
    }
  }

  const moveCursor = (data: { x: number; y: number; roomId: string }) => {
    if (socket) {
      socket.emit('cursor_move', data)
    }
  }

  const leaveCursor = (roomId: string) => {
    if (socket) {
      socket.emit('cursor_leave', roomId)
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