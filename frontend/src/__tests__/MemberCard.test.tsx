import { render, screen, fireEvent } from '@testing-library/react';
import { MemberCard } from '../components/MemberCard/MemberCard';

const mockOnChange = jest.fn();

describe('MemberCard', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render member card input', () => {
    render(<MemberCard value="" onChange={mockOnChange} />);
    expect(screen.getByTestId('member-card-input')).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(<MemberCard value="MEMBER001" onChange={mockOnChange} />);
    expect(screen.getByTestId('member-card-input')).toHaveValue('MEMBER001');
  });

  it('should call onChange when typing', () => {
    render(<MemberCard value="" onChange={mockOnChange} />);
    fireEvent.change(screen.getByTestId('member-card-input'), {
      target: { value: 'VIP123' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('VIP123');
  });

  it('should call onChange with empty string when cleared', () => {
    render(<MemberCard value="MEMBER001" onChange={mockOnChange} />);
    fireEvent.change(screen.getByTestId('member-card-input'), {
      target: { value: '' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should show discount info label', () => {
    render(<MemberCard value="" onChange={mockOnChange} />);
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it('should show active state when member card entered', () => {
    render(<MemberCard value="M001" onChange={mockOnChange} />);
    expect(screen.getByTestId('member-card-active')).toBeInTheDocument();
  });

  it('should NOT show active state when empty', () => {
    render(<MemberCard value="" onChange={mockOnChange} />);
    expect(screen.queryByTestId('member-card-active')).not.toBeInTheDocument();
  });
});
