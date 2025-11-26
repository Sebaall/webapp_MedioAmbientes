/* ======= CONFIGURACIÓN ======= */
const MAX_RADIUS_KM = 5000; // ¡AUMENTADO A 5000KM PARA QUE VEAS TODO!

// TUS PUNTOS DE RECICLAJE
const allRecyclePoints = [
    { name: "Punto Verde - Valparaíso", type: "vidrio", lat: -33.0458, lng: -71.6197 }, 
    { name: "Recicla Plástico Sur", type: "plastico", lat: -33.0500, lng: -71.6250 },
    { name: "Punto Limpio Los Ángeles", type: "mixto", lat: -37.4697, lng: -72.3537 }, 
    { name: "Punto Santiago Centro", type: "papel", lat: -33.4489, lng: -70.6693 } 
];

let map = null;

// Navegación
function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'map') initMap();
}

function initMap() {
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
        return;
    }

    // Verificar si el navegador soporta GPS
    if (!navigator.geolocation) {
        alert("Tu dispositivo no tiene GPS activo.");
        // Cargar mapa por defecto en Chile si falla el GPS
        loadDefaultMap(-33.4489, -70.6693); 
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            // ÉXITO: Tenemos ubicación real
            console.log("Ubicación detectada:", pos.coords.latitude, pos.coords.longitude);
            loadMapLayers(pos.coords.latitude, pos.coords.longitude);
        }, 
        (err) => {
            // ERROR: El usuario denegó permiso o falló
            console.error(err);
            alert("No pudimos detectar tu ubicación. Cargando mapa general.");
            loadMapLayers(-33.4489, -70.6693); // Carga en Santiago por defecto
        },
        { enableHighAccuracy: true } // Pedir máxima precisión
    );
}

function loadMapLayers(lat, lng) {
    // 1. Crear Mapa
    map = L.map('mapView', { zoomControl: false }).setView([lat, lng], 10); // Zoom más alejado (10) para ver más mapa

    // 2. Capa Oscura
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19
    }).addTo(map);

    // 3. Marcador del Usuario (Solo si tenemos GPS real)
    const userIcon = L.divIcon({
        className: 'user-pin',
        html: '<div style="background-color:#2979FF; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 15px #2979FF;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    L.marker([lat, lng], {icon: userIcon}).addTo(map).bindPopup("<b>Tú estás aquí</b>").openPopup();

    // 4. Cargar Puntos
    filterAndShowPoints(lat, lng);
}

function filterAndShowPoints(userLat, userLng) {
    // FILTRO DESACTIVADO: Mostramos TODOS los puntos para probar
    // Si quieres activar el filtro después, cambia true por la condición de distancia
    const nearbyPoints = allRecyclePoints; 

    if(nearbyPoints.length === 0) {
        alert("No se encontraron puntos en la base de datos.");
    }

    nearbyPoints.forEach(p => {
        // Calcular distancia solo para mostrarla en el popup
        const dist = getDistanceFromLatLonInKm(userLat, userLng, p.lat, p.lng).toFixed(1);

        // Color según tipo
        let color = '#00E676'; // Verde default
        if(p.type === 'vidrio') color = '#2979FF'; // Azul
        if(p.type === 'papel') color = '#FFD600'; // Amarillo

        // HTML del marcador (Punto brillante)
        const markerHtml = `
            <div style="
                background-color: ${color};
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 2px solid #fff;
                box-shadow: 0 0 10px ${color};
            "></div>`;

        const icon = L.divIcon({
            className: 'custom-pin',
            html: markerHtml,
            iconSize: [18, 18],
            iconAnchor: [9, 9] // Centrar el punto
        });

        const marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);

        // Popup mejorado
        marker.bindPopup(`
            <div style="text-align:center; color:#333; font-family:sans-serif;">
                <h3 style="margin:0 0 5px 0; font-size:16px;">${p.name}</h3>
                <span style="font-size:11px; background:#eee; padding:2px 6px; border-radius:4px;">
                    ${p.type.toUpperCase()} • A ${dist} km
                </span>
                <br>
                <button onclick="openRoute(${p.lat}, ${p.lng})" 
                    style="margin-top:10px; background:#111; color:#fff; border:none; padding:8px 16px; border-radius:20px; cursor:pointer; font-weight:bold; font-size:12px;">
                    📍 Ir con GPS
                </button>
            </div>
        `);
    });
}

function openRoute(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
}

// Matemáticas GPS
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
}
function deg2rad(deg) { return deg * (Math.PI/180); }