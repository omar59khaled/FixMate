import { useState } from 'react';
import Chatbot from './Chatbot';
import ChatbotToggle from './ChatbotToggle';

export default function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && <ChatbotToggle toggleChat={toggleChat} />}
      <Chatbot isOpen={isOpen} toggleChat={toggleChat} />
    </>
  );
}