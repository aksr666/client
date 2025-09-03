import { useAtom } from 'jotai';
import React from 'react';

import { currentRoomIdAtom, sidebarVisibleAtom } from '../../store';
import RoomView from '../RoomView';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible] = useAtom(sidebarVisibleAtom);
  const [currentRoomId] = useAtom(currentRoomIdAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        {sidebarVisible && !currentRoomId && <Sidebar />}
        <main
          className={`transition-all duration-300 ${sidebarVisible && !currentRoomId ? 'flex-1 p-6' : 'w-full'}`}
        >
          {currentRoomId ? <RoomView /> : children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
