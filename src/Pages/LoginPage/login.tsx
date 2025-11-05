import React, { useState, useMemo } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import "./login.css";
import { useNavigate } from "react-router-dom";
import Popup from "../../Components/Popup/popup"
import axios from "axios";

// Componente Principal de la Aplicación
const Login: React.FC = () => {
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [popup, setPopup] = useState<{ title: string; message: string } | null>(
        null
    );

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", {
                email,
                password,
            });
    
            console.log("Response completo:", response.data);
    
            // ✅ Validar estructura de respuesta del backend actual
            if (!response.data || !response.data.userId || !response.data.email) {
                console.error("Respuesta inválida del servidor:", response.data);
                setPopup({
                    title: "Error de respuesta del servidor",
                    message: "No se recibió la información esperada del usuario.",
                });
                return;
            }
    
            // ✅ Guardar usuario en sessionStorage
            sessionStorage.setItem("user", JSON.stringify(response.data));
    
            // 🔹 Token simulado (para que el frontend no bloquee el acceso)
            sessionStorage.setItem("token", "fake-jwt-token-dev");
    
            // ✅ Redirigir al dashboard (o donde necesites)
            navigate("/dashboard");
    
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                const status = error.response.status;
                const message =
                    error.response.data?.message || "Ocurrió un error al iniciar sesión.";
    
                if (status === 404) {
                    setPopup({
                        title: "Usuario no encontrado",
                        message,
                    });
                } else if (status === 401) {
                    setPopup({
                        title: "Credenciales inválidas",
                        message: "Correo o contraseña incorrectos.",
                    });
                } else {
                    setPopup({
                        title: "Error del servidor",
                        message: "Intenta de nuevo más tarde.",
                    });
                }
            } else {
                setPopup({
                    title: "Error de conexión",
                    message: "No se pudo conectar con el servidor.",
                });
            }
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
                                value={email}
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
                {popup && (
                    <Popup
                    title={popup.title}
                    message={popup.message}
                    onClose={() => setPopup(null)}
                    />
                )}
            </div>
    )
};

export default Login;