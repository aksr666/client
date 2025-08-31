import React from 'react'
import { useAtom } from 'jotai'
import { currentRoomAtom } from '../store'
import Layout from '../components/layout/Layout'

const AppPage: React.FC = () => {
  const [currentRoom] = useAtom(currentRoomAtom)

  return (
    <Layout>
      <div className="h-full">
        {currentRoom ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentRoom.name}</h2>
                <p className="text-gray-600">
                  {currentRoom.isPrivate ? 'Private Room' : 'Public Room'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {currentRoom.isPrivate && (
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {currentRoom.participants?.length} users
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to {currentRoom.name}!
              </h3>
              <p className="text-gray-600">
                This is where you can collaborate with other users in real-time.
                <br />
                Cursor movements and other collaborative features will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Room
            </h3>
            <p className="text-gray-600">
              Choose a room from the sidebar to start collaborating with others.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AppPage
