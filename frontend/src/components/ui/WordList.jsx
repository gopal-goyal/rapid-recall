import React from 'react';

export default function WordList({ words = [], emptyText = 'No words yet', center = false }) {
  return (
    <div className={`flex flex-wrap gap-2 text-sm mb-4 ${center ? 'justify-center' : ''}`}>
      {words.length === 0 ? (
        <span className="text-gray-400">{emptyText}</span>
      ) : (
        words.map((w, idx) => (
          <span
            key={idx}
            className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-md text-gray-700"
          >
            {typeof w === 'string' ? w : w.word}
          </span>
        ))
      )}
    </div>
  );
}
