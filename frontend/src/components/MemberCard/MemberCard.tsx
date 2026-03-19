import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const MemberCard: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div data-testid="member-card-container" className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        Member Card
        <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
          10% discount
        </span>
      </label>

      <input
        data-testid="member-card-input"
        type="text"
        value={value}
        placeholder="Enter member card number"
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
      />

      {value && (
        <p data-testid="member-card-active" className="mt-2 text-sm text-green-600 font-medium">
          ✓ Member discount applied
        </p>
      )}
    </div>
  );
};
