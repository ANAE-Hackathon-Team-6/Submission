import React, { useEffect, useState } from 'react';
import bot3 from '../../assets/images/bot3.svg';
import send from '../../assets/images/send.svg';
import Voice from '../../assets/images/mingcute_mic-fill.svg';
import botmini from '../../assets/images/botminimized.svg';
import QuestionCard from './QuestionCard';

import '../../index.css';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    text: string;
    type: 'bot' | 'user';
}

const questions: string[] = [
    'What is your name?',
    'Calculate expenses',
    'Analyse data',
    'summarize',
    'give me a report',
];

const API_URL = 'http://localhost:5000/chatbot';


const Chatbot: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            text: 'Hello, how can I help you?',
            type: 'bot',
        },
    ]);
    const [showInitialView, setShowInitialView] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const sendQueryToBackend = (query: string) => {
        setLoading(true);
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Query: query }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                // Assuming the backend returns a string response.
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
        setShowInitialView(false);
        sendQueryToBackend(userQuery);
    };

    const handleQuestionClick = (question: string) => {
        setMessages((prev) => [
            ...prev,
            { text: question, type: 'user' },
        ]);
        setShowInitialView(false);
        sendQueryToBackend(question);
    };

    useEffect(() => {
        // Scroll to the bottom of the chat after new messages or loading update
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages, loading]);

    return (
        <div className="flex flex-col items-center w-screen min-h-screen gap-8 py-8 bg-white">
            
            {/* Initial Bot Welcome */}
                { showInitialView && (
                    <div className="flex flex-col items-center p-4">
                        <img
                            src={bot3}
                            alt="Bot"
                            className="w-16 h-16 cursor-pointer md:w-32 md:h-32"
                        />
                        <h1 className="font-semibold text-[#262626] text-[24px] md:text-[36px] text-center">
                            How can I help you?
                        </h1>
                    </div>
                )}

            {/* Messages Display Area */}
            <div
                id="chat-container"
                className="w-[70%] px-4 mt-4 space-y-2 overflow-y-auto no-scrollbar"
                style={{ maxHeight: '70vh' }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} my-2`}
                    >
                        {msg.type === 'bot' && (
                            <img src={botmini} alt="bot" className="w-6 h-6 mr-2" />
                        )}
                        <div className="p-3 rounded-xl bg-[#262626] text-white text-[12px] md:text-[16px]">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>

                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start my-2">
                        <img src={botmini} alt="bot" className="w-6 h-6 mr-2" />
                        <div className="p-3 text-gray-800 bg-gray-200 rounded-lg text-[16px]">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Text Input + Voice Icon + Send Button */}
            <div className={`${showInitialView ? 'relative' : 'fixed bottom-0'} flex flex-row justify-between p-2 w-[70%] mt-4`}>
                <div className="flex items-center bg-[#262626E5] rounded-xl w-[90%]">
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        className="w-full px-4 py-2 text-white bg-transparent outline-none text-[16px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <img src={Voice} alt="Voice" className="w-8 h-8 ml-2 cursor-pointer" />
                </div>
                <div
                    className="bg-white rounded-lg cursor-pointer"
                    style={{
                        background: 'linear-gradient(228deg, #9747FF 40.05%, #715BF7 89.57%)',
                    }}
                    onClick={handleSendClick}
                >
                    <img src={send} alt="send" className="p-2" />
                </div>
            </div>

            {/* Chatbot Predefined Questions */}
            {showInitialView && (
                <div className="grid grid-cols-2 gap-2 space-x-1 md:grid-cols-4">
                    {questions.map((question, index) => (
                        <div
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            className="cursor-pointer"
                        >
                            <QuestionCard question={question} />
                        </div>
                    ))}
                </div>
            )}
            
        
        </div>
    );
};

export default Chatbot;
