import React, { useState } from 'react';
import BotIcon from '../../assets/images/botminimized.svg'
import send from '../../assets/images/send.svg'
import Voice from '../../assets/images/mingcute_mic-fill.svg'
import Message from './Message';
import { Expand } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../../index.css'





interface ChatbotMiniProps {
    onClose: () => void;
}

interface MessageProps {
    text: string;
    type: 'bot' | 'user';
}

const API_URL = 'http://localhost:5000/chatbot';

function ChatbotMini({ onClose }: ChatbotMiniProps) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<MessageProps[]>([
        {
            text: 'Hello, how can I help you?',
            type: 'bot'
        },
    ]);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    
    const handleExpand = () => {
        navigate('/chatbot');
    };

    const sendQueryToBackend = (query: string) => {
        setLoading(true);
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Query: query }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: data, type: 'bot' },
                ]);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Error: Could not retrieve response.', type: 'bot' },
                ]);
                setLoading(false);
            });
    };

    const handleSendClick = () => {
        if (message.trim() === '') return;
        const userQuery = message;
        setMessages((prev) => [
            ...prev,
            { text: userQuery, type: 'user' },
        ]);
        setMessage('');
        sendQueryToBackend(userQuery);
    };


  return (
      <div className=" relative w-[350px] md:w-[500px] h-[400px] rounded-lg bg-[#303030]">
      {/* Header with logo and close button */}
      <div className="flex items-center justify-between p-2">
        {/* add a button to extend to chatbot screen */} 
              <button onClick={handleExpand} className="p-2 rounded-full hover:bg-gray-200 ">
                  <Expand className="w-6 h-6 text-white hover:text-gray-600"  />
              </button>
           
                <img src={BotIcon} alt="Bot" className="w-10 h-10" />
                <button
                    onClick={onClose}
                  className="px-3 py-1 text-lg font-semibold text-white rounded-full hover:bg-white hover:text-gray-600"
                >
                    X
                </button>
            </div>
            {/* Chatbot messages */}
          <div className="flex flex-col p-4 space-y-4 overflow-y-auto text-gray-800 custom-scrollbar" style={{ maxHeight: 'calc(100% - 120px)', paddingBottom: '80px' }}
>

              {messages.map(msg => (
                  <Message {...msg} />
              ))}

              {loading && (
                  <div className="flex justify-start my-2">
                      <img src={BotIcon} alt="bot" className="w-6 h-6 mr-2" />
                      <div className="p-3 text-gray-800 bg-gray-200 rounded-lg text-[12px]">Typing...</div>
                  </div>
              )}

          </div>
        
        <div className="p-4">
            
            </div>
            
            {/* text input + voice over icon + send button */}
          <div className="absolute flex flex-row w-full p-2 bottom-1">
              <div className="flex items-center bg-[#131313] rounded-xl w-[90%]">
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="w-full px-4 py-2 text-white bg-transparent outline-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)} 
                    />
                    <img src={Voice} alt="Voice" className="w-8 h-8 ml-2 cursor-pointer " />
                    
                </div>
              <div className="bg-white rounded-lg cursor-pointer"
                  style={{
                      background: 'linear-gradient(228deg, #027A48 40.05%, #054F31 89.57%)',
                  }}
                  onClick={handleSendClick}
                  >
                    
                  
                    <img src={send} alt="send" className='p-2 '/>
                </div>
                
            </div>
          </div>
      
  )
}

export default ChatbotMini
