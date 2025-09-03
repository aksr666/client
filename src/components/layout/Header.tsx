import { useAtom } from 'jotai';
import React from 'react';

import { useAuth } from '../../features/auth';
import { useSocket } from '../../features/socket';
import { authAtom, socketAtom } from '../../store';
import Button from '../Button';

const Header: React.FC = () => {
  const [auth] = useAtom(authAtom);
  const [socket] = useAtom(socketAtom);
  const { logout } = useAuth();

  // Initialize socket connection
  useSocket();

  const isConnected = socket?.connected;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Collaboration App</h1>

          {/* Socket Connection Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {auth.user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {auth.user.firstName} {auth.user.lastName}
                </p>
                <p className="text-xs text-gray-500">{auth.user.email}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {auth.user.firstName[0]}
                  {auth.user.lastName[0]}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
