/* =========================================================================
   🔵 1) DATOS FALLBACK (SI EL SCRAPER FALLA)
   ========================================================================= */
const fallbackData = [
    {
        title: "Los Ángeles la ciudad más parrillera de Chile",
        date: "21 Nov",
        img: "https://www.losangeles.cl/wp-content/uploads/2025/11/2-hyhx93.jpg",
        link: "https://www.losangeles.cl/los-angeles-la-ciudad-mas-parrillera-de-chile/"
    },
    {
        title: "Ruta Q-148 de Chacaico entra en tierra derecha",
        date: "21 Nov",
        img: "https://www.losangeles.cl/wp-content/uploads/2025/11/captura-de-pantalla-2025-11-21-152753-400x250.png",
        link: "https://www.losangeles.cl/ruta-q-148-de-chacaico-entra-en-tierra-derecha-para-su-pavimentacion/"
    },
    {
        title: "Alumno angelino en Olimpiadas de Química",
        date: "21 Nov",
        img: "https://www.losangeles.cl/wp-content/uploads/2025/11/matias-cid-400x250.jpg",
        link: "https://www.losangeles.cl/alumno-angelino-representara-a-la-comuna-en-olimpiadas-nacionales-de-quimica/"
    },
    {
        title: "CESFAM llama a buen uso de antimicrobianos",
        date: "20 Nov",
        img: "https://www.losangeles.cl/wp-content/uploads/2025/11/semana-antimicrobianos-cesfam-sur-3-400x250.jpg",
        link: "https://www.losangeles.cl/cesfam-de-los-angeles-llaman-a-hacer-un-buen-uso-de-los-antimicrobianos/"
    }
];

/* =========================================================================
   🔵 2) SCRAPER DE NOTICIAS
   ========================================================================= */
const URL_OBJETIVO = "https://www.losangeles.cl/noticias/";
const PROXY_URL = "https://api.allorigins.win/get?url=";

async function cargarNoticias() {
    try {
        console.log("Iniciando Scraper de Noticias...");

        // 1) Obtener HTML por proxy
        const response = await fetch(PROXY_URL + encodeURIComponent(URL_OBJETIVO));
        const data = await response.json();

        if (!data.contents) throw new Error("No se pudo obtener el HTML");

        // 2) Parsear HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");

        // 3) Buscar noticias
        const articulos = doc.querySelectorAll("article, .post, .type-post");
        const noticias = [];

        articulos.forEach((articulo, index) => {
            if (index > 8) return;

            const tituloEl = articulo.querySelector("h2, h3, .entry-title a, .post-title a");
            const imgEl = articulo.querySelector("img");
            const dateEl = articulo.querySelector("time, .date, .posted-on, .entry-date");
            const linkEl = articulo.querySelector("a");

            if (tituloEl && linkEl) {
                let imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute("data-src")) : "";
                if (!imgSrc) imgSrc = "https://via.placeholder.com/400x250?text=Noticia+LA";

                let link = linkEl.getAttribute("href");
                if (link.startsWith("/")) link = "https://losangeles.cl" + link;

                noticias.push({
                    title: tituloEl.innerText.trim(),
                    link,
                    img: imgSrc,
                    date: dateEl ? dateEl.innerText.trim() : "Reciente"
                });
            }
        });

        if (noticias.length === 0) throw new Error("Nada parseado");

        renderizarNoticias(noticias);

    } catch (e) {
        console.warn("SCRAPER FALLÓ → usando fallback", e);
        renderizarNoticias(fallbackData);
    }
}

/* =========================================================================
   🔵 3) RENDERIZAR NOTICIAS EN HOME + GRID
   ========================================================================= */
function renderizarNoticias(items) {
    const home = document.getElementById("home-news-container");
    const list = document.getElementById("news-list");

    home.innerHTML = "";
    list.innerHTML = "";

    items.forEach((item, index) => {

        // HOME → Solo primera noticia
        if (index === 0) {
            home.innerHTML = `
                <div class="news-card-home" onclick="window.open('${item.link}', '_blank')">
                    <img src="${item.img}" alt="Portada" onerror="this.src='https://via.placeholder.com/90'">
                    <div class="news-card-home-content">
                        <div class="news-card-home-title">${item.title}</div>
                        <div class="news-card-home-date">📅 ${item.date}</div>
                    </div>
                </div>`;
        }

        // GRID COMPLETO
        list.innerHTML += `
            <div class="full-news-card" onclick="window.open('${item.link}', '_blank')">
                <img src="${item.img}" class="full-news-img" onerror="this.src='https://via.placeholder.com/400x200'">
                <div class="full-news-body">
                    <span class="full-news-date">📅 ${item.date}</span>
                    <div class="full-news-title">${item.title}</div>
                    <div class="full-news-link">Leer nota completa →</div>
                </div>
            </div>`;
    });
}

document.addEventListener("DOMContentLoaded", cargarNoticias);

/* =========================================================================
   🔵 4) NAVEGACIÓN ENTRE SECCIONES
   ========================================================================= */
function openScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "map") {
        setTimeout(iniciarRastreo, 200);
    }
}

/* =========================================================================
   🔵 5) MAPA – CONFIGURACIÓN BASE
   ========================================================================= */
const RADIO_KM = 60;

let map = null;
let routingControl = null;
let myPosition = null;
let userMarker = null;
let watchId = null;
let isNavigating = false;

/* =========================================================================
   🔵 6) INICIAR GPS + MAPA
   ========================================================================= */
function iniciarRastreo() {
    if (map) {
        map.invalidateSize();
        return;
    }

    const defaultLat = -37.4697;
    const defaultLng = -72.3537;

    map = L.map("mapView", { zoomControl: false }).setView([defaultLat, defaultLng], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19
    }).addTo(map);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            pos => actualizarPosicion(pos.coords.latitude, pos.coords.longitude),
            () => actualizarPosicion(defaultLat, defaultLng),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        actualizarPosicion(defaultLat, defaultLng);
    }
}

/* =========================================================================
   🔵 7) ACTUALIZAR UBICACIÓN EN TIEMPO REAL
   ========================================================================= */
function actualizarPosicion(lat, lng) {
    myPosition = { lat, lng };

    if (!userMarker) {
        const userIcon = L.divIcon({
            className: "user-pulse",
            html: `<div style="width:16px;height:16px;background:#2ECC71;border:2px solid white;border-radius:50%;box-shadow:0 0 10px #2ECC71;"></div>`
        });

        userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        map.setView([lat, lng], 15);
        procesarPuntos(lat, lng);

    } else {
        userMarker.setLatLng([lat, lng]);
    }

    if (isNavigating && routingControl) {
        map.panTo([lat, lng]);
        const destino = routingControl.getWaypoints().slice(-1)[0].latLng;
        routingControl.setWaypoints([L.latLng(lat, lng), destino]);
    }
}

/* =========================================================================
   🔵 8) MARCADORES DE PUNTOS DE RECICLAJE
   ========================================================================= */
function procesarPuntos(lat, lng) {
    puntosReciclaje.forEach(p => {
        const dist = calcularDistancia(lat, lng, p.lat, p.lng);
        if (dist <= RADIO_KM) crearMarcador(p, dist);
    });
}

function crearMarcador(p, dist) {
    let pinColor = "#2ECC71";

    if (p.type === "vidrio") pinColor = "#3498DB";
    if (p.type === "plastico") pinColor = "#E67E22";
    if (p.type === "papel") pinColor = "#F1C40F";

    const icon = L.divIcon({
        html: `
        <div style="position:relative;width:24px;height:34px;">
            <div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${pinColor};
                 position:absolute;transform:rotate(-45deg);left:0;top:0;
                 box-shadow:0 2px 5px rgba(0,0,0,0.5);"></div>
            <div style="width:14px;height:14px;background:white;border-radius:50%;
                 position:absolute;top:2px;left:5px;"></div>
        </div>`,
        iconSize: [24, 34],
        iconAnchor: [12, 34]
    });

    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);

    m.bindPopup(`
        <div style="text-align:center;">
            <strong style="font-size:16px;">${p.name}</strong><br>
            <span style="color:#aaa;font-size:12px;">${p.desc}</span><br>
            <span style="display:inline-block;background:rgba(255,255,255,0.1);
                          padding:2px 8px;border-radius:10px;font-size:11px;margin:5px 0;">
                📍 A ${dist.toFixed(1)} km
            </span>
            <button class="btn-navigate" onclick="calcularRuta(${p.lat}, ${p.lng})">🚀 IR AHORA</button>
        </div>
    `);
}

/* =========================================================================
   🔵 9) NAVEGACIÓN GPS (RUTA)
   ========================================================================= */
function calcularRuta(destLat, destLng) {
    if (!myPosition) return alert("Esperando señal GPS...");

    limpiarRuta(false);
    map.closePopup();
    isNavigating = true;

    document.getElementById("navPanel").style.display = "block";
    document.getElementById("closeRouteBtn").style.display = "block";

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(myPosition.lat, myPosition.lng),
            L.latLng(destLat, destLng)
        ],
        routeWhileDragging: false,
        language: "es",
        show: false,
        lineOptions: {
            styles: [{ color: "#2ECC71", opacity: 0.8, weight: 7 }]
        },
        createMarker: () => null,
        addWaypoints: false
    }).addTo(map);

    routingControl.on("routesfound", e => {
        const r = e.routes[0];
        const s = r.summary;

        const dist = s.totalDistance < 1000
            ? `${Math.round(s.totalDistance)} m`
            : `${(s.totalDistance / 1000).toFixed(1)} km`;

        const time = `${Math.round(s.totalTime / 60)} min`;

        document.getElementById("navDistance").innerText = dist;
        document.getElementById("navTime").innerText = time;

        const step = r.instructions[0];
        document.getElementById("navDirection").innerHTML = getIcon(step.type) + " " + step.text;
    });
}

function getIcon(type) {
    if (type === "Left") return "⬅️";
    if (type === "Right") return "➡️";
    if (type === "Straight") return "⬆️";
    if (type === "Roundabout") return "🔄";
    return "📍";
}

/* =========================================================================
   🔵 10) LIMPIAR RUTA
   ========================================================================= */
function limpiarRuta(centrar = true) {
    if (routingControl) map.removeControl(routingControl);

    document.getElementById("navPanel").style.display = "none";
    document.getElementById("closeRouteBtn").style.display = "none";

    routingControl = null;
    isNavigating = false;

    if (centrar && myPosition) {
        map.flyTo([myPosition.lat, myPosition.lng], 15, { duration: 1.5 });
    }
}

/* =========================================================================
   🔵 11) HERRAMIENTAS GPS
   ========================================================================= */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2)**2 +
        Math.cos(lat1 * Math.PI/180) *
        Math.cos(lat2 * Math.PI/180) *
        Math.sin(dLon/2)**2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}
