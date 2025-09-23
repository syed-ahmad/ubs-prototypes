import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimpleTable } from './SimpleTable'
import type { TableColumn } from '../../types/table'

// Mock data for testing
interface TestUser {
  id: number
  name: string
  email: string
  department: string
  status: string
}

const mockUsers: TestUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Design',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    department: 'Marketing',
    status: 'Inactive'
  }
]

const mockColumns: TableColumn<TestUser>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    width: 150
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    width: 200
  },
  {
    id: 'department',
    header: 'Department',
    accessor: 'department',
    width: 120
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    width: 100
  }
]

const mockColumnsWithFunction: TableColumn<TestUser>[] = [
  ...mockColumns,
  {
    id: 'displayName',
    header: 'Display Name',
    accessor: (row: TestUser) => `${row.name} (${row.department})`,
    width: 200
  }
]

describe('SimpleTable', () => {
  const mockOnRowSelect = vi.fn()
  
  beforeEach(() => {
    mockOnRowSelect.mockClear()
  })

  describe('Basic Rendering', () => {
    it('renders table with data and columns', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      // Check headers are rendered
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Department')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()

      // Check data rows are rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('Marketing')).toBeInTheDocument()
    })

    it('renders with custom dimensions', () => {
      const { container } = render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          height={500}
          width={800}
        />
      )

      const tableContainer = container.querySelector('.tableContainer')
      expect(tableContainer).toHaveStyle({ height: '500px', width: '800px' })
    })

    it('applies column width styles correctly', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const nameHeader = screen.getByText('Name').closest('th')
      expect(nameHeader).toHaveStyle({ width: '150px', minWidth: '120px' })
    })
  })

  describe('Empty States', () => {
    it('shows no data message when data array is empty', () => {
      render(
        <SimpleTable
          data={[]}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('shows no matching results when search query returns no results', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery="nonexistent"
        />
      )

      expect(screen.getByText('No matching results found')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('filters data based on search query', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery="john"
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
    })

    it('searches across all columns', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery="design"
        />
      )

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })

    it('search is case insensitive', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery="ENGINEERING"
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  describe('Row Selection', () => {
    it('calls onRowSelect when row is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      await user.click(johnRow)

      expect(mockOnRowSelect).toHaveBeenCalledWith(
        mockUsers[0],
        ['John Doe', 'john@example.com', 'Engineering', 'Active']
      )
    })

    it('highlights selected row', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      await user.click(johnRow)

      expect(johnRow).toHaveAttribute('aria-selected', 'true')
    })

    it('works with function-based column accessors', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumnsWithFunction}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      await user.click(johnRow)

      expect(mockOnRowSelect).toHaveBeenCalledWith(
        mockUsers[0],
        ['John Doe', 'john@example.com', 'Engineering', 'Active', 'John Doe (Engineering)']
      )
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates down with ArrowDown key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const secondRow = screen.getByText('Jane Smith').closest('tr')!

      firstRow.focus()
      await user.keyboard('{ArrowDown}')

      expect(secondRow).toHaveFocus()
    })

    it('navigates up with ArrowUp key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const secondRow = screen.getByText('Jane Smith').closest('tr')!

      secondRow.focus()
      await user.keyboard('{ArrowUp}')

      expect(firstRow).toHaveFocus()
    })

    it('wraps to first row when pressing ArrowDown on last row', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const lastRow = screen.getByText('Bob Johnson').closest('tr')!

      lastRow.focus()
      await user.keyboard('{ArrowDown}')

      expect(firstRow).toHaveFocus()
    })

    it('wraps to last row when pressing ArrowUp on first row', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const lastRow = screen.getByText('Bob Johnson').closest('tr')!

      firstRow.focus()
      await user.keyboard('{ArrowUp}')

      expect(lastRow).toHaveFocus()
    })

    it('selects row with Enter key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      johnRow.focus()
      await user.keyboard('{Enter}')

      expect(mockOnRowSelect).toHaveBeenCalledWith(
        mockUsers[0],
        ['John Doe', 'john@example.com', 'Engineering', 'Active']
      )
    })

    it('selects row with Space key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      johnRow.focus()
      await user.keyboard(' ')

      expect(mockOnRowSelect).toHaveBeenCalledWith(
        mockUsers[0],
        ['John Doe', 'john@example.com', 'Engineering', 'Active']
      )
    })

    it('navigates to first row with Home key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const lastRow = screen.getByText('Bob Johnson').closest('tr')!

      lastRow.focus()
      await user.keyboard('{Home}')

      expect(firstRow).toHaveFocus()
    })

    it('navigates to last row with End key', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const firstRow = screen.getByText('John Doe').closest('tr')!
      const lastRow = screen.getByText('Bob Johnson').closest('tr')!

      firstRow.focus()
      await user.keyboard('{End}')

      expect(lastRow).toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const table = screen.getByRole('grid')
      expect(table).toHaveAttribute('aria-label', 'Data table')

      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(4)

      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(4) // 1 header + 3 data rows

      const cells = screen.getAllByRole('gridcell')
      expect(cells).toHaveLength(12) // 3 rows × 4 columns
    })

    it('sets tabIndex correctly on rows', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const dataRows = screen.getAllByRole('row').slice(1) // Skip header row
      dataRows.forEach(row => {
        expect(row).toHaveAttribute('tabIndex', '0')
      })
    })

    it('sets aria-selected correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      const janeRow = screen.getByText('Jane Smith').closest('tr')!

      // Initially no row should be selected
      expect(johnRow).toHaveAttribute('aria-selected', 'false')
      expect(janeRow).toHaveAttribute('aria-selected', 'false')

      // After clicking, row should be selected
      await user.click(johnRow)
      expect(johnRow).toHaveAttribute('aria-selected', 'true')
      expect(janeRow).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('Cell Content', () => {
    it('displays cell content with title attribute for overflow', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      const johnCell = screen.getByText('John Doe')
      expect(johnCell).toHaveAttribute('title', 'John Doe')
    })

    it('handles function-based accessors correctly', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumnsWithFunction}
          onRowSelect={mockOnRowSelect}
        />
      )

      expect(screen.getByText('John Doe (Engineering)')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith (Design)')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty search query correctly', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery=""
        />
      )

      // All rows should be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('handles whitespace-only search query', () => {
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
          searchQuery="   "
        />
      )

      // All rows should be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('handles keyboard navigation with no data', () => {
      render(
        <SimpleTable
          data={[]}
          columns={mockColumns}
          onRowSelect={mockOnRowSelect}
        />
      )

      // Should not throw errors when trying to navigate
      fireEvent.keyDown(document, { key: 'ArrowDown' })
      fireEvent.keyDown(document, { key: 'Enter' })
      
      expect(mockOnRowSelect).not.toHaveBeenCalled()
    })

    it('does not call onRowSelect when onRowSelect is not provided', async () => {
      const user = userEvent.setup()
      
      render(
        <SimpleTable
          data={mockUsers}
          columns={mockColumns}
        />
      )

      const johnRow = screen.getByText('John Doe').closest('tr')!
      await user.click(johnRow)

      // Should not throw error
      expect(johnRow).toHaveAttribute('aria-selected', 'true')
    })
  })
})