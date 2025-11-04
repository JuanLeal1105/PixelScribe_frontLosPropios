import React, { useState, useMemo } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import "./login.css";

// Componente Principal de la Aplicación
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación
        console.log('Intento de Login:', { username, password });
        // Simulación de mensaje de éxito/error (en lugar de alert())
        const loginMessage = document.getElementById('login-message');
        if (loginMessage) {
             loginMessage.textContent = 'Intento de login. Usuario: ' + username;
             loginMessage.style.opacity = '1';
             setTimeout(() => loginMessage.style.opacity = '0', 3000);
        }
    };

    return (
            <div className="login-container">
                {/* ------------------- PANEL IZQUIERDO: FORMULARIO DE LOGIN ------------------- */}
                <div className="login-panel">
                    
                    {/* Sección de Logo simplificada */}
                    <div className="logo-top">
                        <div className="logo-icon"></div>
                        PixelScribe
                    </div>

                    {/* Formulario */}
                    <form className="auth-form" onSubmit={handleLogin}>
                        
                        {/* Icono de Perfil */}
                        <div className="profile-icon-placeholder">
                            <User size={60} strokeWidth={1} />
                        </div>

                        {/* Campo de Nombre de Usuario */}
                        <div className="input-group">
                            <Mail />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Ingresa tu Email por favor"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo de Contraseña */}
                        <div className="input-group">
                            <Lock />
                            <input
                                type="password"
                                className="input-field"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Botón de Login */}
                        <button type="submit" className="login-button">
                            LOGIN
                        </button>

                        {/* Enlaces Utilitarios */}
                        <div className="utility-links">
                            <label>
                                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                                Recordarme
                            </label>
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                    </form>
                </div>

                {/* ------------------- PANEL DERECHO: VISUAL Y BIENVENIDA ------------------- */}
                <div className="visual-panel">
                    {/* Efecto de fondo animado */}
                    <div className="neon-wave"></div>

                    <div className="welcome-text">
                        <h1>Bienvenido</h1>
                        <p>
                            Una herramienta para la carga de imágenes y generación de comentarios a través de Inteligencia  Articficial.
                        </p>
                    </div>

                    <div className="signup-link">
                        ¿No tienes cuenta? <a href="#">Regístrate aquí.</a>
                    </div>
                </div>
            </div>
    )
};

export default Login;