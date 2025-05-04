import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RefObject } from 'react';
import { CommandInput } from '../components/command-input';

describe('CommandInput', () => {
    const mockSetInput = vi.fn();
    const mockHandleSubmit = vi.fn(e => e.preventDefault());

    const createInputRef = (): RefObject<HTMLInputElement> => {
        return {
            current: document.createElement('input')
        } as RefObject<HTMLInputElement>;
    };

    beforeEach(() => {
        mockSetInput.mockReset();
        mockHandleSubmit.mockReset();
        mockHandleSubmit.mockImplementation(e => e.preventDefault());
        vi.clearAllMocks();
    });

    it('renders properly with correct props', () => {
        const inputRef = createInputRef();
        render(
            <CommandInput
                input=""
                setInput={mockSetInput}
                inputRef={inputRef}
                handleSubmit={mockHandleSubmit}
            />
        );

        const inputElement = screen.getByPlaceholderText("Type a command (e.g. /help)");
        expect(inputElement).toBeInTheDocument();

        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeInTheDocument();
    });

    it('calls setInput when input value changes', () => {
        const inputRef = createInputRef();
        render(
            <CommandInput
                input=""
                setInput={mockSetInput}
                inputRef={inputRef}
                handleSubmit={mockHandleSubmit}
            />
        );

        const inputElement = screen.getByPlaceholderText("Type a command (e.g. /help)");

        fireEvent.change(inputElement, { target: { value: 'test command' } });

        expect(mockSetInput).toHaveBeenCalledWith('test command');
    });

    it('calls handleSubmit when form is submitted', async () => {
        const inputRef = createInputRef();
        const { container } = render(
            <CommandInput
                input="/help"
                setInput={mockSetInput}
                inputRef={inputRef}
                handleSubmit={mockHandleSubmit}
            />
        );

        const form = container.querySelector('form');
        if (!form) throw new Error('Form not found');

        fireEvent.submit(form);

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls handleSubmit when the send button is clicked', () => {
        const inputRef = createInputRef();
        const { container } = render(
            <CommandInput
                input="/help"
                setInput={mockSetInput}
                inputRef={inputRef}
                handleSubmit={mockHandleSubmit}
            />
        );

        const form = container.querySelector('form');
        if (!form) throw new Error('Form not found');

        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it('renders with the correct value in the input', () => {
        const inputRef = createInputRef();
        const testValue = '/test-command';

        render(
            <CommandInput
                input={testValue}
                setInput={mockSetInput}
                inputRef={inputRef}
                handleSubmit={mockHandleSubmit}
            />
        );

        const inputElement = screen.getByPlaceholderText("Type a command (e.g. /help)");
        expect(inputElement).toHaveValue(testValue);
    });
});