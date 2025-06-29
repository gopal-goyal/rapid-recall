import React from 'react';

export default function WordList({ words = [], emptyText = 'No words yet', center = false }) {
  return (
    <div className={`flex flex-wrap gap-2 text-sm mb-4 ${center ? 'justify-center' : ''}`}>
      {words.length === 0 ? (
        <span className="text-gray-400">{emptyText}</span>
      ) : (
        words.map((w, idx) => {
          const wordObj = typeof w === 'string' ? { word: w, guessed: false } : w;
          const { word, guessed } = wordObj;

          return (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-md border text-sm font-medium
                ${guessed 
                  ? 'bg-green-100 text-green-800 border-green-300' 
                  : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
            >
              {word}
            </span>
          );
        })
      )}
    </div>
  );
}
