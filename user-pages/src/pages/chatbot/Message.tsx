import React from 'react';
import ReactMarkdown from 'react-markdown';
import BotIcon from '../../assets/images/botminimized.svg';
import '../../index.css';

interface MessageProps {
    text: string;
    type: 'bot' | 'user';
}

const Message: React.FC<MessageProps> = ({ text, type }) => {
    return (
        <div className={`flex items-start ${type === 'bot' ? 'justify-start' : 'justify-end'}`}>
            {type === 'bot' && <img src={BotIcon} className="w-8 mr-2" alt="Bot Icon" />}
            <div className={`px-4 py-2 rounded-lg ${type === 'bot' ? 'bg-gray-200' : 'bg-green-700 text-white'}`}>
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </div>
    );
};

export default Message;
