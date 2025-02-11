import React, { useEffect, useRef, useState } from 'react'
import Avatar3 from '../../images/vecteezy_modern-male-avatar-with-black-hair-and-hoodie-illustration_48216761.png';
import Input from '../../Componants/Input/input';

// new add 
import {io} from 'socket.io-client';

const Dashboard = () => {
    
    const [user , setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [conversations , setConversation] = useState([]);
    const [messages , setMessages] = useState({});
    const [message , setMessage] = useState('');
    const [users , setUsers] = useState([]);
    const messageRef = useRef(null);
    // new io start

    const [socket, setSocket ] = useState(null);

    useEffect(() => {
            setSocket(io('http://localhost:3001'));
    }, []);

    useEffect(() => {
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users => {
            console.log('activeiusers :>>', users);
        });
        
        socket?.on('getMessage', data => {
          
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, {user: data.user, message: data.message}] 
            })
        )})
    }, [socket]);

    useEffect(() => {
        messageRef?.current?.scrollIntoView({behavior: 'smooth'})
    },[messages.messages]);
    // new io end

    useEffect(() => {
        const fetchusers = async () => {
            const res = await fetch(`http://localhost:3001/user/fetch/${user?.id}` , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/josn',
                }
            });
            const resData = await res.json();
            setUsers(resData);
        }
        fetchusers();

    }, []);

    useState(()=> {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:3001/conversations/fetch/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json();
            setConversation(resData);
        }
        fetchConversations();
        
    },[]);

    const fetchmessage = async (conversationId , receiver) => {
        const res = await fetch(`http://localhost:3001/message/fetch/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json();
        
        setMessages({messages: resData , receiver , conversationId});
    }

    const sendMessage = async () => {
        socket.emit('sentMessage', {
            senderId: user?.id,
            receiverId : messages?.receiver?.receiverId,
            message,
            conversationId: message?.receiver?.receiverId
        })
        const res = await fetch('http://localhost:3001/message/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId : messages?.receiver?.receiverId
            })
        })
        setMessage('');
    }
  return (
    <div className='w-screen flex'>
        <div className='w-[25%] h-screen border-black  bg-[#f1f3ff] px-14 py-10 overflow-scroll'>
            <div className='flex items-center mb-4 cursor-pointer' >
                <div className='bg-white p-2 border-2  border-primary rounded-full'><img src={Avatar3} width={55} height={55}></img> </div>
                <div className='ml-4'> 
                   <div className='font-serif text-sm'>{user.fullName}</div>    
                   <div className='font-serif text-sm'>My Account</div>    
                </div>
            </div>
            <hr className='font-extrabold'/>

            <div className='mt-8'> 
                <div className='font-bold text-primary'>Messages</div>
                <div className='mt-4'>
                    {
                        conversations.length > 0 ? 
                        conversations.map(({conversationId , user}) => {
                            return (<>
                            <div className='flex items-center my-4 border-b-2 pb-4 cursor-pointer' onClick={() => fetchmessage(conversationId , user)}>
                                <div>
                                    <img src={Avatar3} width={55} height={55}></img>
                                </div>
                                <div className='ml-2'>
                                    <div className='font-serif text-sm'>{user?.fullName}</div>
                                    <div>{user?.email}</div>
                                </div>
                            </div>
                            </>)
                        }) : <div className='font-bold text-center mt-24'>No Conversation</div>
                    }
                </div>
            </div>
        </div>

        <div className='w-[50%] h-screen bg-white  flex flex-col items-center'>
            {
                messages?.receiver?.fullName && 
            <div className='w-[75%] h-[65px] bg-[#f3f1ff] my-8 pb-4  rounded-full px-16 py-4 flex items-center cursor-pointer'>
                <div>
                    <img src={Avatar3} width={50} height={50}></img>
                </div>

                <div className='ml-2 mr-auto'>
                    <h3>{messages?.receiver?.fullName}</h3>
                    <p>{messages?.receiver?.email}</p>
                </div>

                <div className='cursor-pointer'>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-phone-incoming"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /><path d="M15 9l5 -5" /><path d="M15 5l0 4l4 0" /></svg>
                </div>
            </div>
            }

            <div className='h-[70%] w-full border overflow-scroll'>
                <div className=' py-12 px-8 '>
                    {/* <div className='bg-[#f3f1ff] max-w-[40%] mb-4 text-black  p-2 rounded-lg text-sm font-serif'>
                        lorem oefn sfiji sfi
                    </div>
                    <div className='bg-primary max-w-[40%] mb-4 text-white ml-auto p-2 rounded-lg text-sm font-serif'>
                        lorem oefn iv divh idsfh isf jsif sfiji sfi
                        lorem oefn iv divh idsfh isf jsif sfiji sfi
                        lorem oefn iv divh idsfh isf jsif sfiji sfi
                    </div> */}
                    {
                        messages?.messages?.length > 0 ? 
                        messages.messages.map(({message , user : {id} = {}}) => {
                            if(id === user?.id) {
                                return (
                                <>
                                    <div className='bg-primary max-w-[40%] mb-4 text-white ml-auto p-2 rounded-lg text-sm font-serif'>
                                    {message}
                                    </div> 
                                    <div ref={messageRef}></div>
                                </>
                                )
                            }
                            else {
                                return (
                                <div className='bg-[#f3f1ff] max-w-[40%] mb-4 text-black  p-2 rounded-lg text-sm font-serif'>
                        {message}
                    </div>
                                )
                            }
                        }) : <div className='text-center font-bold'> No Messages </div>
                    }
                </div>
            </div>
            {
                messages?.receiver?.fullName &&
            <div className='p-10 w-full flex items-center'>
                <Input placeholder='type a msg here...' value={message} onChange={(e) => setMessage(e.target.value)} inputclassName='w-[110%] outline-none border-none shadow-lg bg-[#f3f1ff] focus:ring-0 rounded-lg'/>

                <div className={`ml-14 cursor-pointer bg-[#f1f3ff] p-2 rounded-2xl ${!message && 'pointer-events-none'} `} onClick={() => sendMessage()}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-telegram"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" /></svg>
                </div>
                <div className ={`ml-14 cursor-pointer bg-[#f1f3ff] p-2 rounded-2xl ${!message && 'pointer-events-none'} `}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                </div>
            </div>
            }
        </div>
       
        <div className='w-[25%] h-screen bg-light px-8 py-14 overflow-scroll'>
            <div className='text-primary font-bold mx-14 my-14'>Peoples</div>
            <div className='mt-4'>
                    {
                        users.length > 0 ? 
                        users.map(({userId , user}) => {
                            return (<>
                            <div className='flex items-center my-4 border-b-2 pb-4 cursor-pointer' onClick={() => fetchmessage('new', user)}>
                                <div>
                                    <img src={Avatar3} width={55} height={55}></img>
                                </div>
                                <div className='ml-2'>
                                    <div className='font-serif text-sm'>{user?.fullName}</div>
                                    <div>{user?.email}</div>
                                </div>
                            </div>
                            </>)
                        }) : <div className='font-bold text-center mt-24'>No Conversation</div>
                    }
                </div>
        </div>
    </div>
  )
}

export default Dashboard
