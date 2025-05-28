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
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden flex">
        {/* Panel izquierdo con imagen fija mejorada para mostrar la imagen completa */}
        <div className="w-1/2 bg-purple-100 p-8 flex items-center justify-center">
          <div className="w-full h-full rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
            {/* Imagen centrada y completa sin recorte */}
            <img
              src="./wellness.jpg"
              alt="hola"
              className="object-contain max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>

        {/* Panel derecho para el formulario */}
        <div className="w-2/3 p-12">
          <div className="flex justify-center mb-8">
            <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold">G</div>
          </div>

          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">Bienvenido a GlowUp</h1>
          
          {/* Eslogan en cursiva */}
          <p className="text-center text-gray-600 italic mb-8">Porque el bienestar emocional, también es una transformación</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
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
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent transition text-lg"
                placeholder="Tu edad"
              />
            </div>
            
            <button
              onClick={handleStart}
              className="w-full py-3 px-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-600 mt-4"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
