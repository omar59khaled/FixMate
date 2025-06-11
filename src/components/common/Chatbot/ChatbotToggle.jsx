import { MessageCircle } from 'lucide-react';

export default function ChatbotToggle({ toggleChat }) {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      aria-label="Toggle chat"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}