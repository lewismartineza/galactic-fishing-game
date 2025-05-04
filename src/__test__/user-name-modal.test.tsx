import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UserNameModal from '../components/user-name-modal'

describe('UserNameModal', () => {
    it('renders the modal with input and button', () => {
        render(<UserNameModal onConfirm={vi.fn()} />)
        expect(screen.getByText(/Enter your user name/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Your Name.../i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument()
    })

    it('enables the button when the username is not empty', () => {
        render(<UserNameModal onConfirm={vi.fn()} />)
        const input = screen.getByPlaceholderText(/Your Name.../i)
        fireEvent.change(input, { target: { value: 'TestUser' } })
        const button = screen.getByRole('button', { name: /Play/i })
        expect(button).not.toBeDisabled()
    })

    it('disables the button when the username is empty', () => {
        render(<UserNameModal onConfirm={vi.fn()} />)
        const input = screen.getByPlaceholderText(/Your Name.../i)
        fireEvent.change(input, { target: { value: '' } })
        const button = screen.getByRole('button', { name: /Play/i })
        expect(button).toBeDisabled()
    })

    it('calls onConfirm with the username when the button is clicked', async () => {
        const onConfirm = vi.fn()
        render(<UserNameModal onConfirm={onConfirm} />)
        const input = screen.getByPlaceholderText(/Your Name.../i)
        fireEvent.change(input, { target: { value: 'TestUser' } })
        const button = screen.getByRole('button', { name: /Play/i })
        fireEvent.click(button)
        await waitFor(() => {
            expect(onConfirm).toHaveBeenCalledWith('TestUser')
        })
    })

    it('stores the username in localStorage when the button is clicked', async () => {
        const onConfirm = vi.fn()
        render(<UserNameModal onConfirm={onConfirm} />)
        const input = screen.getByPlaceholderText(/Your Name.../i)
        fireEvent.change(input, { target: { value: 'TestUser' } })
        const button = screen.getByRole('button', { name: /Play/i })
        fireEvent.click(button)
        expect(localStorage.getItem('username')).toBe('TestUser')
    })
})
