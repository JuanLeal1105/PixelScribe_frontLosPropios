import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Image, X, Trash2, Loader2 } from 'lucide-react';
import "./dashboard.css";

interface StoredImage {
  id: string;
  name: string;
  url: string;
  uploadedAt: number;
}

const PLACEHOLDER_URL = (id: number) =>
  `https://placehold.co/400x300/1A0F44/D946EF?text=Pixel+${id}`;

const Dashboard: React.FC = () => {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);

  // 🔹 Inicialización simulada: usuario y galería
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Simula fetch de imágenes
    const dummyImages: StoredImage[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `img-${i}`,
      name: `Imagen ${i + 1}`,
      url: PLACEHOLDER_URL(i + 1),
      uploadedAt: Date.now() - i * 1000000,
    }));
    setImages(dummyImages);
    setIsLoading(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000)); // simulación
      const newImage: StoredImage = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        url: PLACEHOLDER_URL(Date.now()),
        uploadedAt: Date.now(),
      };
      setImages((prev) => [newImage, ...prev]);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImage(null);
  }, []);

  // 🔹 Mostrar loading
  if (isLoading) {
    return (
      <div
        className="dashboard-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="spinner"></div>
        <p
          style={{
            marginLeft: "1rem",
            color: "var(--color-primary-cyan)",
          }}
        >
          Cargando Panel de Control...
        </p>
      </div>
    );
  }

  // 🔹 Si no hay usuario en sesión
  if (!user) {
    return (
      <div
        className="dashboard-container"
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <X size={48} color="var(--color-primary-pink)" />
        <h1 style={{ marginTop: "1rem" }}>Acceso No Autorizado</h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          No se encontró un usuario en la sesión. Por favor, inicia sesión.
        </p>
      </div>
    );
  }

  // 🔹 Vista principal del dashboard
  return (
    <div className="dashboard-container">
      <div className="gallery-panel">
        <div className="gallery-header">
          <h2>{`Galería (${images.length})`}</h2>
        </div>
        <div className="gallery-list">
          {images.length === 0 ? (
            <p
              style={{
                color: "var(--color-text-muted)",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              Aún no tienes imágenes guardadas. ¡Sube una!
            </p>
          ) : (
            images.map((img) => (
              <div
                key={img.id}
                className="gallery-item"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="gallery-thumbnail"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_URL(0);
                  }}
                />
                <div className="item-info">
                  <div className="item-name">{img.name}</div>
                  <div className="item-date">
                    {new Date(img.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(img.id);
                  }}
                  title="Eliminar imagen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="upload-panel">
        <h1
          style={{
            color: "var(--color-text-light)",
            marginBottom: "2rem",
            fontSize: "2rem",
          }}
        >
          Carga de Nueva Imagen
        </h1>
        <form
          className={`upload-area ${selectedFile ? "has-file" : ""}`}
          onSubmit={handleUpload}
        >
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            <div className="upload-icon">
              <Upload size={48} strokeWidth={1.5} />
            </div>
            <p>
              {selectedFile
                ? `Archivo seleccionado: ${selectedFile.name}`
                : "Arrastra y suelta tu archivo aquí, o haz clic para buscar."}
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <button type="submit" disabled={!selectedFile || uploading}>
            {uploading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Loader2
                  size={20}
                  className="spinner"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Subiendo...
              </div>
            ) : (
              "SUBIR IMAGEN"
            )}
          </button>
          {selectedFile && !uploading && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              style={{
                marginTop: "0.5rem",
                background: "none",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-text-muted)",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
              }}
            >
              <X
                size={16}
                style={{
                  verticalAlign: "middle",
                  marginRight: "0.5rem",
                }}
              />{" "}
              Cancelar
            </button>
          )}
        </form>

        {previewUrl && (
          <div className="preview-box">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        {!previewUrl && (
          <div
            className="preview-box"
            style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <Image size={64} color="var(--color-text-muted)" strokeWidth={1} />
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal-btn"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </button>
            <h3
              style={{
                color: "var(--color-primary-cyan)",
                marginBottom: "0.5rem",
              }}
            >
              {selectedImage.name}
            </h3>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="modal-image"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_URL(0);
              }}
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
              }}
            >
              ID: {selectedImage.id} | Subido:{" "}
              {new Date(selectedImage.uploadedAt).toLocaleString()}
            </p>
            <button
              style={{
                background: "var(--color-primary-pink)",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "var(--border-radius-sm)",
                marginTop: "1rem",
                cursor: "pointer",
              }}
              onClick={() => handleDeleteImage(selectedImage.id)}
            >
              <Trash2
                size={16}
                style={{
                  verticalAlign: "middle",
                  marginRight: "0.5rem",
                }}
              />{" "}
              Eliminar Permanentemente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
