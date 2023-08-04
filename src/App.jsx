import React from 'react'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_WS_URL)

function App() {
  const [user, setUser] = React.useState(null)
  const [messages, setMessages] = React.useState([])

  React.useEffect(()=>{
    socket.on("sendMessage", (message)=>{
      setMessages([...messages, message])
    })
  },[messages])

  const sendMessage = (e)=>{
    e.preventDefault();
    if(!user){
      window.login_modal.showModal()
    }else{
      socket.emit('message', {user, message: e.target.message.value })
    }
  }

  const setLocalUsername = (e)=>{
    e.preventDefault();
    setUser(e.target.user.value)
    window.login_modal.close()
  }

  return (
    <>
    <div className='h-screen flex flex-col'>
      <div className='flex flex-col gap-5 p-10 flex-1 h-[calc(100vh-88px)] overflow-y-scroll'>
        {messages.map((item, idx)=>(
          <div className={item.user === user ? 'self-end': 'self-start'} key={String(idx)}>
            <div>{item.user}</div>
            <div className={`p-8 px-14 rounded-full inline-block max-w-[600px] ${item.user === user ? 'bg-blue-200': 'bg-green-200'}`}>{item.message}</div>
          </div>
        ))}
      </div>
      <div className='p-5'>
        <form className='flex gap-5' onSubmit={sendMessage}>
          <input className='border border-gray-600 focus:outline-none flex-1 h-12 rounded-xl px-5' type="text" name="message" />
          <button className='w-[100px] bg-black text-white rounded-xl' type="submit">Send</button>
        </form>
      </div>
    </div>
    <dialog id="login_modal" className="modal">
    <form onSubmit={setLocalUsername} method="dialog" className="modal-box">
      <h3 className="font-bold text-lg mb-10">Set your name!</h3>
      <div>
        <input placeholder='Enter your name' className='input input-bordered w-full' type="text" name="user" />
        
        <div className='modal-action'>
          <button className='btn btn-primary' type="submit">Submit</button>
        </div>
      </div>
      {/* <div className="modal-action">
        <button className="btn">Close</button>
      </div> */}
    </form>
  </dialog>
  </>
  )
}

export default App