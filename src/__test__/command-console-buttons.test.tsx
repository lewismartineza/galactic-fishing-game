import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandConsole } from '../components/command-console'
import React from 'react'

vi.mock('../hooks/useCommandConsole', () => ({
    useCommandConsole: vi.fn()
}));

vi.mock('./command-log', () => ({
    CommandLog: vi.fn(({ entries }) => (
        <div data-testid="command-log">
            {entries.length} entries
        </div>
    ))
}));

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
}));

import { useCommandConsole } from '../hooks/useCommandConsole'

describe('CommandConsole Button Interactions', () => {
    const mockScrollAreaRef = { current: null };
    let mockSetInput: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSetInput = vi.fn();

        vi.mocked(useCommandConsole).mockReturnValue({
            input: '',
            setInput: mockSetInput,
            handleSubmit: vi.fn((e: React.FormEvent) => e.preventDefault()),
            commandHistory: [],
            fishingCooldown: 0,
            scrollAreaRef: mockScrollAreaRef
        });
    });

    const testCommandButton = async (buttonText: string, expectedCommand: string) => {
        const user = userEvent.setup();
        render(<CommandConsole />);

        const buttons = screen.getAllByTestId('button');
        const targetButton = Array.from(buttons).find(
            button => button.textContent?.includes(buttonText)
        );

        if (targetButton) {
            await user.click(targetButton);

            expect(mockSetInput).toHaveBeenCalledWith(expectedCommand);
        } else {
            throw new Error(`Button with text containing "${buttonText}" not found`);
        }
    };

    it('sets "/fish" command when clicking Fish button', async () => {
        await testCommandButton('Fish', '/fish');
    });

    it('sets "/inventory" command when clicking Inventory button', async () => {
        await testCommandButton('Inventory', '/inventory');
    });

    it('sets "/sell all" command when clicking Sell All button', async () => {
        await testCommandButton('Sell All', '/sell all');
    });

    it('sets "/sell <number of fish>" command when clicking Sell Fish button', async () => {
        await testCommandButton('Sell Fish', '/sell <number of fish>');
    });

    it('sets "/eat <number of fish>" command when clicking Eat button', async () => {
        await testCommandButton('Eat', '/eat <number of fish>');
    });

    it('sets "/message <text>" command when clicking Message button', async () => {
        await testCommandButton('Message', '/message <text>');
    });

    it('sets "/send-money <amount> <user>" command when clicking Send Money button', async () => {
        await testCommandButton('Send Money', '/send-money <amount> <user>');
    });
});