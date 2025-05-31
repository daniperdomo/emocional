import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import StartScreen from './StartScreen';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const newUserMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const prompt = `Eres un psicólogo experto llamado GlowUp. El usuario se ha sentido así: "${newUserMessage.text}". 
      Responde de manera profesional y empática. Máximo 130 palabras.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      const botMessage = {
        sender: 'bot',
        text: text.trim()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error con Gemini:", error);
      const errorMessage = {
        sender: 'bot',
        text: "Disculpa, estoy teniendo dificultades. ¿Podrías reformular tu pregunta?"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = (userData) => {
    setUserInfo(userData);
    const greetingMessage = {
      sender: 'bot',
      text: `Hola ${userData.name}, ¿cómo te has sentido últimamente?`
    };
    setMessages(prev => [...prev, greetingMessage]);
  };

  const handleEndConversation = async () => {
    setLoading(true);

    const videoRecommendations = [
      "Recupera tu motivación - https://www.youtube.com/watch?v=ZXsQAXx_ao0",
      "Cómo cambiar tu vida - https://www.youtube.com/watch?v=LOWDFWI7BSw",
      "No te rindas: mensaje para ti - https://www.youtube.com/watch?v=F5UUxJYcx8U",
      "El poder de la mente - https://www.youtube.com/watch?v=nxl9_7n23Ts"
    ];

    const videosText = `Gracias por la conversación. Aquí tienes algunos videos que pueden ayudarte:\n\n` +
      videoRecommendations.map((video, i) => `${i + 1}. ${video}`).join('\n');

    const endMessage = {
      sender: 'bot',
      text: videosText
    };

    setMessages(prev => [...prev, endMessage]);
    setLoading(false);
  };

  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const match = line.match(/^(.*) - (https?:\/\/[^\s]+)$/);
      if (match) {
        const [, title, url] = match;
        const videoId = url.split('v=')[1];
        return (
          <div key={i} className="mb-4">
            <p className="font-semibold">{title}</p>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>
        );
      } else {
        return <p key={i}>{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {!userInfo ? (
        <div className="flex items-center justify-center min-h-screen">
          <StartScreen onStart={handleStart} />
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-purple-700 p-2 text-white shadow-md">
            <div className="container mx-auto">
              <h1 className="text-xl font-bold text-center">GlowUp</h1>
            </div>
          </header>


          {/* Chat Area - Ocupa todo el espacio disponible */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="container mx-auto max-w-4xl flex flex-col gap-4 whitespace-pre-line">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-lg relative shadow-lg animate-fadeIn ${msg.sender === 'user' 
                    ? 'bg-purple-600 text-white self-end rounded-br-2xl max-w-[80%]' 
                    : 'bg-white text-gray-900 self-start border border-gray-300 rounded-bl-2xl max-w-[80%]'}`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              ))}
              {loading && (
                <div className="p-6 bg-white text-gray-800 self-start rounded-lg shadow max-w-[80%]">
                  Pensando...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-300 p-4">
  <div className="container mx-auto max-w-4xl">
    <div className="flex gap-4 items-start flex-wrap">
      
      {/* Botón terminar conversación */}
      <button
        onClick={handleEndConversation}
        disabled={loading}
        className="px-4 py-3 bg-red-600 text-white rounded-2xl font-semibold transition duration-300 ease-in-out hover:bg-red-700 whitespace-nowrap"
      >
        Terminar conversación
      </button>

      {/* Input + Enviar */}
      <div className="flex flex-grow gap-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
          className="flex-grow p-4 border border-gray-300 rounded-2xl text-lg transition duration-300 ease-in-out focus:outline-none focus:border-purple-600 focus:ring focus:ring-purple-200"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className={`px-6 py-4 bg-purple-600 text-white rounded-2xl font-semibold transition duration-300 ease-in-out ${loading ? 'bg-purple-400 cursor-not-allowed' : 'hover:bg-purple-700'}`}
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
      
    </div>
  </div>
</div>

        </div>
      )}
    </div>
  );
}

export default App;