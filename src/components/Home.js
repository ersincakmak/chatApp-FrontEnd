import React from 'react'
import Chat from './Chat'
import SideBar from './SideBar'

const Home = (props) => {
  const {
    username,
    onlineusers,
    rooms,
    addNewRoom,
    toggleCurrentReciever,
    currentReciever,
    messages,
    currentmessage,
    sendMessage,
    setcurrentmessage,
    allusers,
  } = props
  return (
    <div className="overflow-x-auto flex flex-row">
      <SideBar
        username={username}
        onlineusers={onlineusers}
        rooms={rooms}
        addNewRoom={addNewRoom}
        toggleCurrentReciever={toggleCurrentReciever}
        currentReciever={currentReciever}
        allusers={allusers}
      />
      <Chat
        currentReciever={currentReciever}
        messages={messages}
        username={username}
        currentmessage={currentmessage}
        sendMessage={sendMessage}
        setcurrentmessage={setcurrentmessage}
      />
    </div>
  )
}

export default Home
