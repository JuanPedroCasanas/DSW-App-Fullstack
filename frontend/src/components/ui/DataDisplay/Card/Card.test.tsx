import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { Card } from './Card';

describe('Card Component - Test Unitario', () => {
  it('should render Card component', () => {
    render(
      <Card>
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children inside Card', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
      </Card>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>
    );
    
    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('bg-white', 'rounded-xl', 'shadow-md', 'border');
  });

  it('should render multiple elements as children', () => {
    render(
      <Card>
        <button>Click me</button>
        <input type="text" placeholder="Enter text" />
        <span>Footer text</span>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });
});
