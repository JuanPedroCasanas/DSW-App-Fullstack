import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from './Login';
import { AuthProvider } from '@/common/utils/auth/AuthContext';

// hago una simulacion de api.ts para que no tire error con import.meta.env
jest.mock('@/lib/api', () => ({
  API_BASE: 'http://localhost:3000'
}));

// simulación de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


global.fetch = jest.fn() as any;

// componentes necesarios
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component - Test End-to-End', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render login form with all elements', () => {
    renderWithProviders(<Login />);
    
    // todos los elementos del forms
    expect(screen.getByText('Bienvenido a Narrativas')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /¿Primera vez\? Registrarse/i })).toBeInTheDocument();
  });

  it('should show error toast when submitting empty form', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);
    
    // chequea el msj de error
    await waitFor(() => {
      expect(screen.getByText(/por favor, ingrese su correo electrónico y contraseña/i)).toBeInTheDocument();
    });
  });

  it('should handle user input correctly', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
    
    // simular entrada de datos
    fireEvent.change(emailInput, { target: { value: 'test@narrativas.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // verificar que los valores se actualizaron
    expect(emailInput.value).toBe('test@narrativas.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should complete full login flow successfully', async () => {
    // rta exitosa
    const mockUser = {
      id: 1,
      mail: 'test@narrativas.com',
      role: 'patient',
      patient: {
        firstName: 'Juan',
        lastName: 'Pérez'
      }
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'fake-token-123',
        user: mockUser
      })
    });

    renderWithProviders(<Login />);
    
    // login
    // user ingresa credenciales 
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@narrativas.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // click en iniciar sesion
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);
    
    // que la peticion se realizó correctamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mail: 'test@narrativas.com',
            password: 'password123',
            isActive: true
          })
        })
      );
    });
    
    // verificar que redirige
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('should handle login error from server', async () => {
    // error de autenticacion (chequear)
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Credenciales inválidas' })
    });

    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);
    
    // verificar que NO se redirige cuando hay error
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('should toggle password visibility', () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;
    
    // inicialmente debe ser tipo "password"
    expect(passwordInput.type).toBe('password');
    
    // prueba el botón del ojito (para ver/ocultar contraseña)
    const toggleButtons = screen.getAllByRole('button');
    const togglePasswordButton = toggleButtons.find(btn => 
      btn !== screen.getByRole('button', { name: /iniciar sesión/i })
    );
    
    if (togglePasswordButton) {
      fireEvent.click(togglePasswordButton);
      // Después de hacer click, debería cambiar a "text"
      expect(passwordInput.type).toBe('text');
    }
  });
});
