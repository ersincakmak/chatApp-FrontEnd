import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import Home from "./components/Home"
import db from "./db"

const firestore = db.firestore()

const users = []

firestore
  .collection("users")
  .get()
  .then((data) => {
    data.forEach((snapshot) => {
      users.push(snapshot.data().name)
    })
  })

const socket = io("https://ckmrsn-first-chatapi.herokuapp.com/", {
  transports: ["websocket", "polling", "flashsocket"],
})

function App() {
  const [connected, setconnected] = useState(false)
  const [usernam, setusernam] = useState("")
  const [onlineusers, setonlineusers] = useState([])
  const [rooms, setrooms] = useState([])
  const [currentReciever, setcurrentReciever] = useState({
    name: "Genel",
    isChannel: true,
  })
  const [lastReciever, setlastReciever] = useState({
    name: "Genel",
    isChannel: true,
  })
  const [messages, setmessages] = useState([])
  const [currentmessage, setcurrentmessage] = useState("")
  const [allusers, setallusers] = useState([])

  useEffect(() => {
    socket.on("user_connected", (users) => {
      setonlineusers(users)
      getAllUser()
    })

    getAllUser()
    getAllRooms()

    socket.on("create_room", (room) => {
      getAllRooms()
    })

    socket.on("new_message", (props) => {
      setmessages((messages) => [
        ...messages,
        {
          date: props.date,
          from: props.from,
          message: props.message,
        },
      ])
    })
  }, [])

  useEffect(() => {
    handleCollectionCheck(currentReciever.name).then((item) => {
      setmessages([])
      if (item === true) {
        firestore
          .collection(currentReciever.name)
          .orderBy("date")
          .get()
          .then((item) => {
            item.forEach((snapshot) => {
              setmessages((messages) => [
                ...messages,
                {
                  from: snapshot.data().from,
                  date: snapshot.data().date,
                  message: snapshot.data().message,
                },
              ])
            })
          })
      } else {
        firestore
          .collection("messages")
          .orderBy("date")
          .get()
          .then((item) => {
            item.forEach((snapshot) => {
              if (
                (snapshot.data().to === usernam &&
                  snapshot.data().from === currentReciever.name) ||
                (snapshot.data().from === usernam &&
                  snapshot.data().to === currentReciever.name)
              ) {
                setmessages((messages) => [
                  ...messages,
                  {
                    from: snapshot.data().from,
                    message: snapshot.data().message,
                    date: snapshot.data().date,
                  },
                ])
              }
            })
          })
      }
    })
    if (currentReciever.isChannel === true) {
      socket.emit("join_room", currentReciever.name)
    } else {
      if (lastReciever.isChannel === true) {
        socket.emit("leave_room", lastReciever.name)
      }
    }
  }, [currentReciever, lastReciever.isChannel, lastReciever.name, usernam])

  const getAllUser = async () => {
    let users = []
    await firestore
      .collection("users")
      .orderBy("name")
      .get()
      .then((item) => {
        item.forEach((snapshot) => {
          users.push(snapshot.data().name)
        })
      })
    setallusers(users)
  }

  const sendMessage = (props) => {
    const { from, to, date, message } = props
    handleCollectionCheck(to).then((item) => {
      if (item === true) {
        firestore.collection(to).doc().set({
          from: from,
          date: date,
          message: message,
        })
      } else {
        firestore.collection("messages").doc().set({
          from: from,
          date: date,
          message: message,
          to: to,
        })
      }
    })

    socket.emit("send_message", { from, to, date, message })

    if (currentReciever.isChannel === false) {
      setmessages((messages) => [
        ...messages,
        {
          from: from,
          date: date,
          message: message,
        },
      ])
    }
  }

  const handleCollectionCheck = async (roomname) => {
    let checker = false
    await firestore
      .collection(roomname)
      .get()
      .then((item) => {
        item.forEach((snapshot) =>
          snapshot.exists === true ? (checker = true) : ""
        )
      })
    return checker
  }

  const toggleCurrentReciever = (reciever) => {
    setlastReciever(currentReciever)
    setcurrentReciever(reciever)
  }

  const getAllRooms = async () => {
    const rooms = []
    await firestore
      .collection("rooms")
      .orderBy("name")
      .get()
      .then((item) => {
        item.forEach((snapshot) => {
          rooms.push(snapshot.data().name)
        })
      })
    setrooms(rooms)
  }

  const addNewRoom = (roomname, date) => {
    socket.emit("create_room", { roomname, date })
  }

  const connect = async () => {
    if (usernam === "" || usernam === " ") {
    } else {
      setconnected(true)
      const data = users.find((item) => item === usernam.trim())
      if (!data) {
        await firestore.collection("users").doc().set({ name: usernam.trim() })
        socket.emit("user_connected", usernam.trim())
      } else {
        socket.emit("user_connected", usernam.trim())
      }
    }
  }

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {connected === false ? (
        <div className="bg-gray-600 p-10 w-max rounded-3xl h-auto flex flex-col self-center my-auto">
          <input
            type="text"
            className="mt-5 cursorpoi bg-gray-600 border-2 text-white border-purple-500 rounded-2xl p-3 outline-none focus:outline-none"
            placeholder="Adınızı giriniz..."
            value={usernam}
            onChange={(e) => setusernam(e.target.value.toLowerCase())}
          />
          <button
            onClick={connect}
            className="text-white mt-5 bg-purple-500 p-3 rounded-2xl border-4 border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none "
          >
            Muhabbete katıl
          </button>
        </div>
      ) : (
        <Home
          username={usernam}
          onlineusers={onlineusers}
          rooms={rooms}
          addNewRoom={addNewRoom}
          toggleCurrentReciever={toggleCurrentReciever}
          currentReciever={currentReciever}
          messages={messages}
          currentmessage={currentmessage}
          sendMessage={sendMessage}
          setcurrentmessage={setcurrentmessage}
          allusers={allusers}
        />
      )}
    </div>
  )
}

export default App
