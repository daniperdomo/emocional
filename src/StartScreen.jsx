import { useState } from 'react';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleStart = () => {
    if (name.trim() && age.trim()) {
      onStart({ name: name.trim(), age: age.trim() });
    } else {
      alert('Por favor completa ambos campos');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
        <div className="p-16">
          {/* Logo estilo Google */}
          <div className="flex justify-center mb-10">
            <div className="bg-purple-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold">E</div>
          </div>

          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">Bienvenido a EmocionApp</h1>
          
          {/* Formulario estilo Google */}
          <div className="space-y-8">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Edad</label>
              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
                placeholder="Tu edad"
              />
            </div>
            
            <button
              onClick={handleStart}
              className="w-full py-4 px-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-600"
            >
              Continuar
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

