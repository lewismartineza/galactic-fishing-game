import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CommandLog } from '../components/command-log'
import { CommandType } from '../types/console'

describe('CommandLog', () => {
    it('renders command and response entries', () => {
        const mockEntries: CommandType[] = [
            {
                command: '/fish',
                response: 'You caught a salmon!',
                timestamp: new Date().toISOString()
            },
            {
                command: '/inventory',
                response: 'Inventory: salmon x1',
                timestamp: new Date().toISOString()
            }
        ]

        render(<CommandLog entries={mockEntries} />)

        expect(screen.getByText('/fish')).toBeInTheDocument()
        expect(screen.getByText('You caught a salmon!')).toBeInTheDocument()
        expect(screen.getByText('/inventory')).toBeInTheDocument()
        expect(screen.getByText('Inventory: salmon x1')).toBeInTheDocument()
    })
})
