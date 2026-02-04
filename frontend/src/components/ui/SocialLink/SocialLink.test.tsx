import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import SocialLink from './SocialLink';

describe('SocialLink Component - Test Unitario', () => {
  it('should render link with correct href', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://instagram.com/narrativas');
  });

  it('should render label text', () => {
    render(
      <SocialLink
        href="https://instagram.com/test"
        label="@test_account"
      />
    );
    
    expect(screen.getByText('@test_account')).toBeInTheDocument();
  });

  it('should open in new tab', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should use default aria-label when not provided', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Ir al perfil: @narrativas');
  });

  it('should use custom aria-label when provided', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
        ariaLabel="Visitar Instagram de Narrativas"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'Visitar Instagram de Narrativas');
  });

  it('should render instagram icon by default', () => {
    const { container } = render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('should apply base CSS classes', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('inline-flex', 'items-center', 'gap-2', 'text-cyan-600', 'font-semibold', 'hover:underline');
  });

  it('should apply custom className when provided', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
        className="custom-class"
      />
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('should render with instagram icon explicitly', () => {
    const { container } = render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
        icon="instagram"
      />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should be accessible', () => {
    render(
      <SocialLink
        href="https://instagram.com/narrativas"
        label="@narrativas"
      />
    );
    
    const link = screen.getByRole('link', { name: /ir al perfil/i });
    expect(link).toBeInTheDocument();
  });
});
