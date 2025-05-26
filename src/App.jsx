import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import StartScreen from './StartScreen'; // Importar el nuevo componente
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Estado para almacenar la información del usuario
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
      const prompt = `Eres un psicólogo experto llamado Emocion. El usuario se ha sentido así: "${userInput}". 
      Responde de manera profesional y empática. Máximo 120 palabras.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = {
        sender: 'bot',
        text: text
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
    setUserInfo(userData); // Guardar la información del usuario
    const greetingMessage = {
      sender: 'bot',
      text: `Hola ${userData.name}, ¿cómo te has sentido en estos días?`
    };
    setMessages(prev => [...prev, greetingMessage]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {!userInfo ? (
        <StartScreen onStart={handleStart} /> // Mostrar la pantalla de inicio
      ) : (
        <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
          <header className="flex items-center justify-between bg-purple-700 p-4 text-white">
            <h1 className="text-2xl font-bold text-center flex-grow">EmocionApp</h1>
          </header>
          
          <main className="flex-grow overflow-y-auto p-8 bg-gray-100 flex flex-col gap-6">
            {messages.map((msg, index) => (
              <div key={index} className={`p-6 rounded-lg max-w-[80%] relative shadow-lg animate-fadeIn ${msg.sender === 'user' ? 'bg-purple-600 text-white self-end rounded-br-2xl' : 'bg-white text-gray-900 self-start border border-gray-300 rounded-bl-2xl'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="p-6 bg-white text-gray-800 self-start rounded-lg shadow">Pensando...</div>}
            <div ref={messagesEndRef} />
          </main>

          <div className="flex gap-6 p-6 bg-white border-t border-gray-300 flex-shrink-0">
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
              aria-label="Enviar mensaje"
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
