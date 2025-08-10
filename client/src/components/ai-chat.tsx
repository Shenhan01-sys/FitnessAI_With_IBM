import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Halo! Saya FitAI, siap membantu perjalanan fitness Anda. Ada yang bisa saya bantu?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (input.includes('protein')) {
      return "Protein penting untuk membangun otot. Sumber baiknya adalah dada ayam, ikan, dan telur.";
    } else if (input.includes('pemanasan')) {
      return "Pemanasan wajib dilakukan 5-10 menit sebelum latihan inti untuk mencegah cedera.";
    } else if (input.includes('cardio')) {
      return "Cardio baik untuk kesehatan jantung. Lakukan 2-3 kali seminggu, bisa setelah latihan beban atau di hari terpisah.";
    } else if (input.includes('diet') || input.includes('makan')) {
      return "Diet seimbang sangat penting. Fokus pada protein, karbohidrat kompleks, dan lemak sehat. Jangan lupa minum air yang cukup!";
    } else if (input.includes('tidur') || input.includes('istirahat')) {
      return "Tidur 7-9 jam per malam sangat penting untuk recovery. Hindari gadget 1 jam sebelum tidur untuk kualitas tidur yang lebih baik.";
    } else {
      return "Maaf, saya belum mengerti pertanyaan itu. Coba tanyakan hal lain seputar dunia fitness.";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', text: newMessage };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show typing indicator
    const messageText = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response after 1 second
    setTimeout(() => {
      const aiResponse: Message = { role: 'ai', text: getAIResponse(messageText) };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 z-40 scale-in shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tanya FitAI</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="h-64 overflow-y-auto p-4 space-y-3 border-t border-b">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button type="submit" size="sm" disabled={isTyping || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-30"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
}
