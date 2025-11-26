/* ======= CONFIGURACIÓN ======= */
const MAX_RADIUS_KM = 5000;

const allRecyclePoints = [
    { name: "Punto Verde - Valparaíso", type: "vidrio", lat: -33.0458, lng: -71.6197 }, 
    { name: "Recicla Plástico Sur", type: "plastico", lat: -33.0500, lng: -71.6250 },
    { name: "Punto Limpio Los Ángeles", type: "mixto", lat: -37.4697, lng: -72.3537 }, 
    { name: "Punto Santiago Centro", type: "papel", lat: -33.4489, lng: -70.6693 } 
];

let map = null;

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

    if (!navigator.geolocation) {
        alert("Tu dispositivo no tiene GPS activo.");
        loadMapLayers(-33.4489, -70.6693);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => loadMapLayers(pos.coords.latitude, pos.coords.longitude),
        () => {
            alert("No se pudo obtener ubicación. Cargando mapa general.");
            loadMapLayers(-33.4489, -70.6693);
        },
        { enableHighAccuracy: true }
    );
}

function loadMapLayers(lat, lng) {
    map = L.map('mapView', { zoomControl: false }).setView([lat, lng], 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    const userIcon = L.divIcon({
        className: 'user-pin',
        html: '<div style="background:#2979FF; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 15px #2979FF;"></div>',
        iconSize: [20,20],
        iconAnchor: [10,10]
    });

    L.marker([lat, lng], {icon: userIcon})
        .addTo(map)
        .bindPopup("<b>Tú estás aquí</b>")
        .openPopup();

    filterAndShowPoints(lat, lng);
}

function filterAndShowPoints(userLat, userLng) {
    const points = allRecyclePoints;

    points.forEach(p => {
        const dist = getDistanceFromLatLonInKm(userLat,userLng,p.lat,p.lng).toFixed(1);

        let color = '#00E676';
        if(p.type === 'vidrio') color = '#2979FF';
        if(p.type === 'papel') color = '#FFD600';

        const marker = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: 'custom-pin',
                html: `<div style="background:${color}; width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 10px ${color};"></div>`,
                iconSize: [18,18],
                iconAnchor: [9,9]
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="text-align:center;">
                <h3 style="margin:0 0 5px;">${p.name}</h3>
                <span style="font-size:11px;background:#eee;padding:2px 6px;border-radius:4px;">
                    ${p.type.toUpperCase()} • ${dist} km
                </span>
                <br>
                <button onclick="openRoute(${p.lat},${p.lng})"
                    style="margin-top:10px;background:#111;color:#fff;border:none;padding:8px 16px;border-radius:20px;">
                    📍 Ir con GPS
                </button>
            </div>
        `);
    });
}

function openRoute(lat, lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, "_blank");
}

function getDistanceFromLatLonInKm(a,b,c,d) {
    const R = 6371;
    const dLat = deg2rad(c-a);
    const dLon = deg2rad(d-b);
    const A = Math.sin(dLat/2)**2 +
              Math.cos(deg2rad(a))*Math.cos(deg2rad(c))*
              Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));
}
function deg2rad(d) { return d * (Math.PI/180); }
