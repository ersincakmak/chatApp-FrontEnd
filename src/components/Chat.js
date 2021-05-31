import React, { useEffect, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'

const Chat = (props) => {
  const [connected, setconnected] = useState()
  const {
    currentReciever,
    messages,
    username,
    currentmessage,
    sendMessage,
    setcurrentmessage,
  } = props

  useEffect(() => {
    if (
      currentReciever.name === 'Genel' ||
      currentReciever.isChannel === false
    ) {
      setconnected(true)
    } else {
      setconnected(false)
    }
  }, [currentReciever])

  return (
    <div className="w-9/12 flex flex-col h-screen">
      <div className="w-full p-5 text-center text-3xl border-b-2 border-black mb-4">
        {currentReciever.name}
      </div>
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 h-full space-y-4 px-5">
        {connected === true ? (
          <ScrollableFeed className="overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 h-full space-y-4 px-5">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl p-5  border-2 ${
                  item.from === 'server'
                    ? 'mx-auto w-6/12 border-black border-4'
                    : item.from === username
                    ? 'ml-auto max-w-lg w-max border-purple-600'
                    : 'mr-auto max-w-lg w-max border-purple-600'
                } `}
              >
                <p
                  className={`max-w-lg w-max font-semibold ${
                    item.from === username ? 'ml-auto' : 'mr-auto'
                  } `}
                >
                  {item.from === 'server' ? '' : item.from}
                </p>
                <p
                  className={`${
                    item.from === 'server' ? 'font-extrabold text-center' : ''
                  }`}
                >
                  {item.message}
                </p>
                <p
                  className={`w-max ${
                    item.from === 'server'
                      ? 'text-center min-w-full'
                      : item.from === username
                      ? 'ml-auto'
                      : 'mr-auto'
                  } `}
                >
                  {new Date(item.date).toLocaleTimeString('tr-TR')}
                </p>
              </div>
            ))}
          </ScrollableFeed>
        ) : (
          <button
            className="w-max p-4 bg-purple-600 border-4 border-white focus:ring-2 focus:ring-purple-600 focus:outline-none rounded-2xl mx-auto block mt-2 text-white font-semibold"
            onClick={() => setconnected(true)}
          >
            Kanala Katıl
          </button>
        )}
      </div>
      <div className="flex flex-row border-t-2 border-black">
        <input
          type="text"
          value={currentmessage}
          onChange={(e) => setcurrentmessage(e.target.value)}
          placeholder="Mesajınız..."
          className="flex-grow p-3 box-content focus:outline-none focus:ring-inset focus:ring-2 focus:ring-black "
        />
        <button
          onClick={() => {
            if (currentmessage !== '' && currentmessage !== ' ') {
              console.log('Mesaj geçerli')
              sendMessage({
                from: username,
                to: currentReciever.name,
                date: new Date(Date.now()).toJSON(),
                message: currentmessage,
              })
              setcurrentmessage('')
            }
          }}
          className="inline-block bg-black p-5 text-white focus:outline-none focus:bg-gray-900 focus:animate-pulse"
        >
          Gönder
        </button>
      </div>
    </div>
  )
}

export default Chat
