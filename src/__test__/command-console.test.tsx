import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandConsole } from '../components/command-console'
import React from 'react'
import { useCommandConsole } from '../hooks/useCommandConsole'

vi.mock('../components/command-log', () => ({
    CommandLog: vi.fn(({ entries }) => (
        <div data-testid="command-log">
            {entries.length} entries
        </div>
    ))
}))

vi.mock('@heroui/react', () => ({
    Input: vi.fn(({ value, onChange, placeholder, className }) => (
        <input
            data-testid="command-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
        />
    )),
    Button: vi.fn(({ children, type, onPress, className }) => (
        <button
            data-testid="button"
            type={type}
            onClick={onPress}
            className={className}
        >
            {children}
        </button>
    ))
}))

vi.mock('../hooks/useCommandConsole', () => ({
    useCommandConsole: vi.fn()
}))

describe('CommandConsole', () => {
    const mockScrollAreaRef = { current: null };
    let mockSetInput: ReturnType<typeof vi.fn>;
    let mockHandleSubmit: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSetInput = vi.fn();
        mockHandleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

        vi.mocked(useCommandConsole).mockReturnValue({
            input: 'test command',
            setInput: mockSetInput,
            handleSubmit: mockHandleSubmit,
            commandHistory: [
                { command: 'test', response: 'response', timestamp: new Date().toISOString() },
                { command: 'help', response: 'help info', timestamp: new Date().toISOString() }
            ],
            fishingCooldown: 0,
            scrollAreaRef: mockScrollAreaRef
        });
    });

    it('renders correctly', () => {
        render(<CommandConsole />);

        expect(screen.getByText('Command Console')).toBeInTheDocument();
        expect(screen.getByTestId('command-input')).toBeInTheDocument();
        expect(screen.getByTestId('command-log')).toBeInTheDocument();
        expect(screen.getByTestId('command-log')).toHaveTextContent('2 entries');
        expect(screen.getAllByTestId('button')).toHaveLength(8);
    });

    it('shows fishing cooldown when active', () => {
        vi.mocked(useCommandConsole).mockReturnValue({
            input: '',
            setInput: mockSetInput,
            handleSubmit: mockHandleSubmit,
            commandHistory: [],
            fishingCooldown: 15,
            scrollAreaRef: mockScrollAreaRef
        });

        render(<CommandConsole />);

        expect(screen.getByText('Fishing cooldown: 15s remaining')).toBeInTheDocument();
    });

    it('submits the form correctly', async () => {
        render(<CommandConsole />);

        const form = screen.getByTestId('command-input').closest('form');
        if (form) {
            fireEvent.submit(form);
        }

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('updates input when typing', async () => {
        const user = userEvent.setup();
        render(<CommandConsole />);

        const input = screen.getByTestId('command-input');
        await user.type(input, 'new command');

        expect(mockSetInput).toHaveBeenCalled();
    });

    it('sets input when clicking command buttons', async () => {
        const user = userEvent.setup();
        render(<CommandConsole />);

        const buttons = screen.getAllByTestId('button');

        const fishButton = Array.from(buttons).find(
            button => button.textContent?.includes('Fish') && !button.textContent?.includes('Sell Fish')
        );

        if (fishButton) {
            await user.click(fishButton);
            expect(mockSetInput).toHaveBeenCalledWith('/fish');
        } else {
            throw new Error('Fish button not found');
        }
    });
});