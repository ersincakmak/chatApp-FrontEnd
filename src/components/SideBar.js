import React, { useState } from 'react'

const SideBar = (props) => {
  const [roomname, setroomname] = useState('')

  const {
    username,
    onlineusers,
    rooms,
    addNewRoom,
    toggleCurrentReciever,
    currentReciever,
    allusers,
  } = props

  return (
    <div className="h-screen w-3/12 border-r-2 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
        <div className="p-2 text-lg text-center underline font-semibold sticky top-0 bg-white">
          Mesaj Odaları
        </div>
        {rooms.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              toggleCurrentReciever({ name: item, isChannel: true })
            }
            className={`text-center text-lg p-2 hover:bg-gray-200 cursor-pointer ${
              item === currentReciever.name
                ? 'text-red-500 pointer-events-none'
                : ''
            }`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-b-2 border-gray-500 p-2 flex-grow-0">
        <div className="text-center w-full">Grup Ekle</div>
        <input
          className="w-full border-2 border-black p-3 my-2 rounded-3xl focus:outline-none"
          type="text"
          placeholder="Grup Adı..."
          value={roomname}
          onChange={(e) => setroomname(e.target.value)}
        />
        <button
          onClick={() => {
            if (
              !rooms.find((item) => item === roomname) &&
              roomname !== '' &&
              roomname !== ' ' &&
              roomname !== undefined
            ) {
              console.log('Geçerli')
              addNewRoom(roomname, new Date(Date.now()))
              setroomname('')
            }
          }}
          className="w-max text-white bg-black p-3 mx-auto block rounded-3xl border-4 focus:outline-none border-white focus:ring-2 focus:ring-black"
        >
          Yeni Grup Ekle
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
        <div className="p-2 text-lg text-center underline font-semibold sticky top-0 w-full bg-white">
          Online Kullanıcılar
        </div>
        {onlineusers.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              toggleCurrentReciever({ name: item.name, isChannel: false })
            }
            className={`${
              item.name === username.trim()
                ? 'text-red-500 pointer-events-none'
                : ''
            } hover:bg-gray-200 p-2 text-lg text-center cursor-pointer`}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200">
        <div className="p-2 text-lg text-center underline font-semibold sticky top-0 w-full bg-white">
          Tüm Kullanıcılar
        </div>
        {allusers.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              toggleCurrentReciever({ name: item, isChannel: false })
            }
            className={`${
              item === username.trim() ? 'text-red-500 pointer-events-none' : ''
            } hover:bg-gray-200 p-2 text-lg text-center cursor-pointer`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
