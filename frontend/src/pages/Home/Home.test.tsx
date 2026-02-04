import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from './Home';

// Mock completo del módulo @/components/ui para evitar problemas de dependencias
jest.mock('@/components/ui', () => ({
  Toast: ({ message, type, onClose }: any) => (
    <div role="alert">{message}</div>
  ),
  ActionGrid: ({ children }: any) => <div>{children}</div>,
  NavButton: ({ to, children, variant }: any) => (
    <a href={to} data-variant={variant}>{children}</a>
  ),
  SocialLink: ({ href, label }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  ),
}));

const renderWithRouter = (component: React.ReactElement, initialState?: any) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/', state: initialState }]}>
      {component}
    </MemoryRouter>
  );
};

describe('Home Component - Test End-to-End (flujo completo)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome section with title and subtitle', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByText('Selecciona el portal al que deseas acceder')).toBeInTheDocument();
  });

  it('should render all portal navigation buttons', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByRole('link', { name: /portal paciente/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /portal responsable legal/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /portal profesional/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /portal debug/i })).toBeInTheDocument();
  });

  it('should have correct navigation links for each portal', () => {
    renderWithRouter(<Home />);
    
    const patientLink = screen.getByRole('link', { name: /portal paciente/i });
    const guardianLink = screen.getByRole('link', { name: /portal responsable legal/i });
    const professionalLink = screen.getByRole('link', { name: /portal profesional/i });
    const debugLink = screen.getByRole('link', { name: /portal debug/i });
    
    expect(patientLink).toHaveAttribute('href', '/patient-portal');
    expect(guardianLink).toHaveAttribute('href', '/legal-guardian-portal');
    expect(professionalLink).toHaveAttribute('href', '/professional-portal');
    expect(debugLink).toHaveAttribute('href', '/debug-console');
  });

  it('should render "Sobre Narrativas" section with description', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Sobre Narrativas')).toBeInTheDocument();
    expect(screen.getByText(/somos un equipo interdisciplinario/i)).toBeInTheDocument();
    expect(screen.getByText(/nos proponemos favorecer el proceso/i)).toBeInTheDocument();
  });

  it('should render banner image', () => {
    renderWithRouter(<Home />);
    
    const banner = screen.getByAltText('Banner Narrativas');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute('src', 'NarrativasBanner.PNG');
  });

  it('should render Instagram social link', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/si querés conocer más/i)).toBeInTheDocument();
    
    const instagramLink = screen.getByText('narrativas_fisherton');
    expect(instagramLink).toBeInTheDocument();
  });

  it('should display toast message when provided via navigation state', () => {
    const toastMessage = {
      message: '¡Bienvenido!',
      type: 'success' as const
    };
    
    renderWithRouter(<Home />, { toastMessage });
    
    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument();
  });

  it('should not display toast when no message is provided', () => {
    renderWithRouter(<Home />);
    
    // Verificar que no hay toast
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render complete navigation flow structure', () => {
    renderWithRouter(<Home />);
    
    // Verificar la estructura completa de navegación
    const links = screen.getAllByRole('link');
    
    // Debe tener al menos 5 links: 4 portales + 1 instagram
    expect(links.length).toBeGreaterThanOrEqual(5);
    
    // Verificar que todos los portales están accesibles
    const portalLinks = links.filter(link => 
      link.getAttribute('href')?.includes('portal') || 
      link.getAttribute('href')?.includes('debug-console')
    );
    expect(portalLinks).toHaveLength(4);
  });

  it('should have proper page structure with sections', () => {
    const { container } = renderWithRouter(<Home />);
    
    // Verificar que el componente Page está presente
    expect(container.firstChild).toBeInTheDocument();
    
    // Verificar que hay contenido de texto descriptivo
    expect(screen.getByText(/experiencias singulares/i)).toBeInTheDocument();
    expect(screen.getByText(/construcción de pensamientos/i)).toBeInTheDocument();
  });
});
