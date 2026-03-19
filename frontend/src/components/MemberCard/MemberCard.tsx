import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const MemberCard: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div data-testid="member-card-container">
      <label>
        Member Card <span>10% discount</span>
      </label>

      <input
        data-testid="member-card-input"
        type="text"
        value={value}
        placeholder="Enter member card number"
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <span data-testid="member-card-active">✓ Member discount applied</span>
      )}
    </div>
  );
};
