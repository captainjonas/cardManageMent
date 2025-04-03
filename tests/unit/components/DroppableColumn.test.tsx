import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import DroppableColumn from '../DroppableColumn'

describe('DroppableColumn', () => {
  const mockItems = [
    { id: '1', content: 'Task 1' },
    { id: '2', content: 'Task 2' },
  ]
  
  const mockGetTaskBackground = jest.fn().mockReturnValue('bg-blue-100')

  const renderDroppableColumn = (props = {}) => {
    return render(
      <DndContext>
        <DroppableColumn
          id="column-1"
          title="To Do"
          items={mockItems}
          getTaskBackground={mockGetTaskBackground}
          {...props}
        />
      </DndContext>
    )
  }

  it('renders column title correctly', () => {
    renderDroppableColumn()
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders all items in the column', () => {
    renderDroppableColumn()
    mockItems.forEach(item => {
      expect(screen.getByText(item.content)).toBeInTheDocument()
    })
  })

  it('applies background color to items using getTaskBackground function', () => {
    renderDroppableColumn()
    const cards = screen.getAllByRole('article')
    cards.forEach(card => {
      expect(card).toHaveClass('bg-blue-100')
    })
  })

  it('renders empty state when no items', () => {
    renderDroppableColumn({ items: [] })
    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })
}) 