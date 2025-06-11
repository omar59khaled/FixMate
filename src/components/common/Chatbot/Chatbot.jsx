import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to the chat
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to your webhook
      const response = await fetch('https://graduation-peach.vercel.app/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      // Check if data exists and has an assistant_message property
      if (data && data.assistant_message) {
        // Add bot response to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.assistant_message, sender: 'bot' }
        ]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, there was an error processing your request.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96 max-w-md mx-auto border rounded-lg shadow-md bg-gray-50">
      {/* Chat header */}
      <div className="p-3 bg-green-600 text-white font-medium rounded-t-lg">
        <h2 className="text-lg">FixMate Assistant</h2>
      </div>
      
      {/* Messages container - Support RTL text */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Ask about maintenance and bookings
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                  message.sender === 'user' 
                    ? 'bg-green-500 text-white rounded-br-none' 
                    : 'bg-green-100 text-gray-800 rounded-bl-none'
                }`}
                dir="auto" // Automatically detect text direction (RTL for Arabic)
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-green-100 text-gray-800 rounded-bl-none">
              <Loader2 className="animate-spin h-5 w-5 text-green-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area with direction support */}
      <div className="p-3 border-t border-gray-200 flex">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
          dir="auto" // Auto-detect text direction
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-400"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}