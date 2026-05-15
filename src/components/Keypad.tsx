import React from 'react';
import Button from './Button';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onDelete }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onKeyPress(key)}
          className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-lg transition-colors"
        >
          {key}
        </button>
      ))}
      <button
        onClick={onDelete}
        className="col-span-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
      >
        ⌫
      </button>
    </div>
  );
};

export default Keypad;
