import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { FormField } from './FormField';

describe('FormField Component - Test Unitario', () => {
  it('should render label with correct text', () => {
    render(
      <FormField label="Email" htmlFor="email">
        <input id="email" type="email" />
      </FormField>
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should associate label with input using htmlFor', () => {
    render(
      <FormField label="Password" htmlFor="password">
        <input id="password" type="password" />
      </FormField>
    );
    
    const label = screen.getByText('Password');
    expect(label).toHaveAttribute('for', 'password');
  });

  it('should render children correctly', () => {
    render(
      <FormField label="Username" htmlFor="username">
        <input id="username" type="text" placeholder="Enter username" />
      </FormField>
    );
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render multiple children elements', () => {
    render(
      <FormField label="Bio" htmlFor="bio">
        <textarea id="bio" placeholder="Tell us about yourself" />
        <span>Maximum 500 characters</span>
      </FormField>
    );
    
    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('should apply correct CSS classes to container', () => {
    const { container } = render(
      <FormField label="Test" htmlFor="test">
        <input id="test" />
      </FormField>
    );
    
    const formFieldContainer = container.firstChild as HTMLElement;
    expect(formFieldContainer).toHaveClass('grid', 'gap-2');
  });

  it('should apply correct CSS classes to label', () => {
    render(
      <FormField label="Name" htmlFor="name">
        <input id="name" />
      </FormField>
    );
    
    const label = screen.getByText('Name');
    expect(label).toHaveClass('text-sm', 'text-black/90');
  });

  it('should work with complex children like buttons', () => {
    render(
      <FormField label="Actions" htmlFor="actions">
        <button type="button">Submit</button>
        <button type="button">Cancel</button>
      </FormField>
    );
    
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});
