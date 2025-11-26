# ♻️ WebApp MedioAmbiente – Municipalidad de Los Ángeles  
Aplicación web móvil para visualizar puntos de reciclaje, categorías de residuos y noticias ambientales de Los Ángeles (Chile).  
Diseñada para funcionar como una PWA ligera, rápida y usable desde cualquier celular.

---

## 🚀 Funcionalidades Principales

### 🌎 1. Mapa interactivo con GPS
- Detecta la ubicación del usuario en tiempo real.
- Muestra los puntos de reciclaje más cercanos.
- Incluye:
  - Puntos limpios
  - Campanas de vidrio
  - Rejillas PET
  - Contenedores de papel/cartón
- Cada punto muestra distancia y botón **"Ir ahora"**, abriendo la ruta en Google Maps.

### 📰 2. Noticias ambientales (Scraper automático)
- Obtiene noticias actuales desde el sitio oficial de Los Ángeles.
- Si el scraper falla, usa datos locales fallback.
- Carga:
  - Imagen
  - Fecha
  - Título
  - Enlace a la noticia completa
- Se muestra una noticia destacada en el Home y un Grid completo en la sección “Noticias”.

### 🗂️ 3. Categorías de reciclaje
UI atractiva con tarjetas verticales que muestran:
- Tipo de residuo
- Ícono ilustrativo
- Descripción y color por categoría

### 📱 4. PWA Lista (Offline básico)
La web está preparada para usarse como app:
- `manifest.json`
- `service-worker.js`
- Íconos base
- Instalación en Android/iOS
- Modo pantalla completa

### 🎨 5. Diseño UI/UX
- Mobile-first
- Interfaz moderna, colores sostenibles y animaciones suaves
- Modo oscuro integrado
- Tarjetas, nubes, ilustraciones y componentes personalizados
- Estilos organizados en `css/styles.css`

---

## 🏗️ Estructura del Proyecto

webapp_medioambiente/
│
├── css/
│ └── styles.css # Estilos completos
│
├── js/
│ ├── app.js # Scraper, navegación, noticias
│ └── mapas-extra.js # Lógica del mapa y GPS
│
├── firebase.json # Configuración Firebase Hosting
├── .firebaserc # Proyecto asignado
├── 404.html
├── index.html # Página principal
├── manifest.json # Datos de la PWA
└── service-worker.js # Cache inicial

---

## 🔧 Tecnologías Utilizadas

- **HTML5 / CSS3 / JavaScript**
- **Leaflet.js** (mapas)
- **Leaflet Routing Machine** (navegación)
- **AllOrigins** (proxy scraper)
- **Firebase Hosting**
- **PWA (Service Worker + Manifest)**
- Diseño UI propio, no frameworks

👤 Autor
Sebastián León
Desarrollado con enfoque educativo y comunitario para fomentar el reciclaje en Los Ángeles, Chile.
