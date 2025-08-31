import React from 'react'
import { useAtom } from 'jotai'
import { sidebarVisibleAtom, currentRoomAtom } from '../../store'
import Header from './Header'
import Sidebar from './Sidebar'
import RoomView from '../RoomView'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible] = useAtom(sidebarVisibleAtom)
  const [currentRoom] = useAtom(currentRoomAtom)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        {sidebarVisible && !currentRoom && <Sidebar />}
        <main className={`transition-all duration-300 ${sidebarVisible && !currentRoom ? 'flex-1 p-6' : 'w-full'}`}>
          {currentRoom ? <RoomView /> : children}
        </main>
      </div>
    </div>
  )
}

export default Layout
