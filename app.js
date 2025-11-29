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

const URL_OBJETIVO = "https://www.losangeles.cl/noticias/";
const PROXY_URL = "https://api.allorigins.win/get?url=";

async function cargarNoticias() {
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(URL_OBJETIVO));
        const data = await response.json();
        if (!data.contents) throw new Error("No HTML");

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");

        const articulos = doc.querySelectorAll("article, .post, .type-post");
        const noticiasScrapeadas = [];

        articulos.forEach((articulo, index) => {
            if (index > 8) return;

            const tituloEl = articulo.querySelector("h2, h3, .entry-title a, .post-title a");
            const imgEl = articulo.querySelector("img");
            const dateEl = articulo.querySelector("time, .date, .posted-on, .entry-date");
            const linkEl = articulo.querySelector("a");

            if (tituloEl && linkEl) {
                let imagenSrc = imgEl ? (imgEl.getAttribute("src") || imgEl.getAttribute("data-src")) : "";
                if (!imagenSrc) imagenSrc = "https://via.placeholder.com/400x250?text=Noticia+LA";

                let fullLink = linkEl.getAttribute("href");
                if (fullLink && fullLink.startsWith('/')) {
                    fullLink = "https://www.losangeles.cl" + fullLink;
                }

                noticiasScrapeadas.push({
                    title: tituloEl.innerText.trim(),
                    link: fullLink || "#",
                    img: imagenSrc,
                    date: dateEl ? dateEl.innerText.trim() : "Reciente"
                });
            }
        });

        if (noticiasScrapeadas.length > 0) {
            renderizarNoticias(noticiasScrapeadas);
        } else {
            throw new Error();
        }

    } catch (error) {
        renderizarNoticias(fallbackData);
    }
}

function renderizarNoticias(items) {
    const homeContainer = document.getElementById('home-news-container');
    const listContainer = document.getElementById('news-list');

    if (homeContainer) homeContainer.innerHTML = '';
    if (listContainer) listContainer.innerHTML = '';

    items.forEach((item, index) => {
        if (index === 0 && homeContainer) {
            homeContainer.innerHTML = `
                <div class="news-card-home" onclick="window.open('${item.link}', '_blank')">
                    <img src="${item.img}" onerror="this.src='https://via.placeholder.com/90?text=IMG'">
                    <div class="news-card-home-content">
                        <div class="news-card-home-title">${item.title}</div>
                        <div class="news-card-home-date">📅 ${item.date}</div>
                    </div>
                </div>
            `;
        }

        if (listContainer) {
            listContainer.innerHTML += `
                <div class="full-news-card" onclick="window.open('${item.link}', '_blank')">
                    <img src="${item.img}" class="full-news-img" onerror="this.src='https://via.placeholder.com/400x200?text=Noticia'">
                    <div class="full-news-body">
                        <span class="full-news-date">📅 ${item.date}</span>
                        <div class="full-news-title">${item.title}</div>
                        <div class="full-news-link">Leer nota completa →</div>
                    </div>
                </div>
            `;
        }
    });
}

document.addEventListener('DOMContentLoaded', cargarNoticias);

const RADIO_KM = 60;
let todosLosMarcadores = [];

const puntosReciclaje = [
    { name: "Unimarc Marconi (Vidrio/PET)", type: "mixto", lat: -37.4632, lng: -72.3592, desc: "Marconi / Almte Latorre" },
    { name: "Terminal de Buses", type: "vidrio", lat: -37.4585, lng: -72.3452, desc: "Luxemburgo / Av. Oriente" },
    { name: "Plaza Villa Grecia", type: "mixto", lat: -37.4602, lng: -72.3422, desc: "Delfos / Macedonia" },
    { name: "Parque Sorvicenta 2", type: "vidrio", lat: -37.4510, lng: -72.3530, desc: "Almte Latorre / Da Vinci" },
    { name: "CESFAM Nororiente", type: "mixto", lat: -37.4550, lng: -72.3350, desc: "Samuel Morse / Bell" },
    { name: "Pob. Galvarino", type: "vidrio", lat: -37.4450, lng: -72.3550, desc: "Estados Unidos / Rusia" },
    { name: "Villa Italia", type: "vidrio", lat: -37.4580, lng: -72.3500, desc: "Roma / Florencia" },
    { name: "Villa Tres Vientos", type: "vidrio", lat: -37.4480, lng: -72.3400, desc: "Calle Local / Av. Tres Vientos" },
    { name: "Villa Obispo", type: "vidrio", lat: -37.4530, lng: -72.3600, desc: "Orompello / Los Mapuches" },
    { name: "Villa Cataluña", type: "mixto", lat: -37.4622, lng: -72.3482, desc: "G. Mistral / Cordillera" },
    { name: "U. de Concepción", type: "mixto", lat: -37.4682, lng: -72.3552, desc: "Ricardo Vicuña / Catirai" },
    { name: "Bajo Montecea", type: "vidrio", lat: -37.4750, lng: -72.3400, desc: "Montecea / Colo-Colo" },
    { name: "Parque Nativo", type: "mixto", lat: -37.4500, lng: -72.3450, desc: "M. Auxiliadora / J. Santos Ossa" },
    { name: "Hogar Luis Orione", type: "vidrio", lat: -37.4650, lng: -72.3350, desc: "Néstor del Río / Chorrillos" },
    { name: "Condominio El Roble", type: "vidrio", lat: -37.4520, lng: -72.3480, desc: "Costanera Quilque / Arrayán" },
    { name: "Colegio San Gabriel", type: "vidrio", lat: -37.4590, lng: -72.3380, desc: "Laguna Verde / Dr. Rioseco" },
    { name: "Jardines de Luxemburgo", type: "vidrio", lat: -37.4505, lng: -72.3520, desc: "Av. Nieves Vásquez" },
    { name: "Parques Nacionales", type: "vidrio", lat: -37.4525, lng: -72.3475, desc: "Costanera Quilque Norte / Nahuelbuta" },
    { name: "Villa Puerto Alegre", type: "vidrio", lat: -37.4880, lng: -72.3450, desc: "Río Cali / Buenos Aires" },
    { name: "Parque Lauquen", type: "vidrio", lat: -37.4920, lng: -72.3520, desc: "5 Norte / 7 Oriente" },
    { name: "Villa Montreal", type: "mixto", lat: -37.4900, lng: -72.3480, desc: "Montreal / Ottawa" },
    { name: "Deptos Rodrigo de Quiroga", type: "vidrio", lat: -37.4890, lng: -72.3410, desc: "Balbino Sanhueza / Tte. Merino" },
    { name: "Villa Filadelfia", type: "vidrio", lat: -37.4860, lng: -72.3360, desc: "Nueva Esperanza / Block 1-4" },
    { name: "Villa Todos Los Santos", type: "vidrio", lat: -37.4950, lng: -72.3550, desc: "San Pedro / San Agustín" },
    { name: "Portal Manso de Velasco", type: "mixto", lat: -37.4940, lng: -72.3440, desc: "Calle Carter / Ontario" },
    { name: "Parque Sevilla", type: "vidrio", lat: -37.4960, lng: -72.3500, desc: "La Llanura / El Salto" },
    { name: "Villa Los Normandos", type: "vidrio", lat: -37.4970, lng: -72.3480, desc: "La Cumbre / La Llanura" },
    { name: "Pob. 21 de Mayo", type: "vidrio", lat: -37.4980, lng: -72.3550, desc: "Río Cholguahue" },
    { name: "Villa Las Américas", type: "mixto", lat: -37.4890, lng: -72.3380, desc: "Los Apaches / Los Mitimaes" },
    { name: "SML Av. Industrias", type: "vidrio", lat: -37.4850, lng: -72.3300, desc: "Las Industrias / G. Mistral" },
    { name: "CESFAM Sur", type: "mixto", lat: -37.4915, lng: -72.3425, desc: "Juan Guzmán 430" },
    { name: "Villa Tolpan", type: "vidrio", lat: -37.5000, lng: -72.3400, desc: "Río Yaqui / Río Magdalena" },
    { name: "Polideportivo", type: "mixto", lat: -37.4610, lng: -72.3585, desc: "G. Mistral / Marconi" },
    { name: "Villa Saltos del Petrohué", type: "mixto", lat: -37.4850, lng: -72.3250, desc: "La Frontera 2 / Petrohué 4" },
    { name: "Martabid", type: "plastico", lat: -37.4980, lng: -72.3400, desc: "Monteaguila Oriente" },
    { name: "Villa Doña Marta", type: "vidrio", lat: -37.4810, lng: -72.3650, desc: "P. Hurtado / Baquedano" },
    { name: "Plaza Feria", type: "vidrio", lat: -37.4750, lng: -72.3550, desc: "Ricardo Vicuña / Alcázar" },
    { name: "Altos del Retiro (Galilea)", type: "mixto", lat: -37.4800, lng: -72.3720, desc: "Sacramento / Misioneros" },
    { name: "Villa Altos del Retiro", type: "vidrio", lat: -37.4820, lng: -72.3700, desc: "Valle del Monasterio" },
    { name: "Plaza Pinto", type: "mixto", lat: -37.4720, lng: -72.3600, desc: "Lynch / O’Higgins" },
    { name: "Villa Galilea", type: "vidrio", lat: -37.4790, lng: -72.3780, desc: "Baquedano / Verbo Divino" },
    { name: "Villa Retiro Sur", type: "vidrio", lat: -37.4840, lng: -72.3680, desc: "Velo de la Novia" },
    { name: "El Tranvía", type: "vidrio", lat: -37.4770, lng: -72.3800, desc: "Tranvía / Av. Poniente" },
    { name: "Escuela Alemania", type: "vidrio", lat: -37.4740, lng: -72.3650, desc: "Cochrane / 5 de Abril" },
    { name: "Parque Estero Quilque", type: "mixto", lat: -37.4765, lng: -72.3585, desc: "Costanera Quilque Sur" },
    { name: "Pob. 2 de Septiembre", type: "vidrio", lat: -37.4730, lng: -72.3680, desc: "Lynch / Pedro Luna" },
    { name: "Estadio Municipal", type: "mixto", lat: -37.4802, lng: -72.3502, desc: "Av. Los Ángeles / Los Robles" },
    { name: "Pob. Real Victoria", type: "vidrio", lat: -37.4850, lng: -72.3550, desc: "Jaime de la Vega" },
    { name: "Laguna Esmeralda", type: "mixto", lat: -37.4782, lng: -72.3552, desc: "Colo Colo / Urenda" },
    { name: "Pob. Santiago Bueras", type: "vidrio", lat: -37.4650, lng: -72.3680, desc: "Chacabuco / Cerro Manquehue" },
    { name: "Pob. Orompello", type: "vidrio", lat: -37.4600, lng: -72.3650, desc: "Rosendo Matus / Manuel Gavilán" },
    { name: "Villa Santa Fe", type: "vidrio", lat: -37.4580, lng: -72.3720, desc: "Los Raulíes / Orompello" },
    { name: "Villa Génesis", type: "vidrio", lat: -37.4500, lng: -72.3800, desc: "Chile Lindo / Media Luna" },
    { name: "Pob. Lagos de Chile", type: "vidrio", lat: -37.4550, lng: -72.3650, desc: "Lago Neltume / P. Hurtado" },
    { name: "Villa Los Profesores", type: "mixto", lat: -37.4480, lng: -72.3650, desc: "Las Torcazas / Aguas Calientes" },
    { name: "Ercilla / Orompello", type: "vidrio", lat: -37.4610, lng: -72.3620, desc: "Ercilla / Orompello" },
    { name: "Pob. O'Higgins", type: "vidrio", lat: -37.4620, lng: -72.3700, desc: "Las Azucenas" },
    { name: "Villa Las Tranqueras", type: "mixto", lat: -37.4550, lng: -72.3700, desc: "El Labriego / Las Tranqueras" },
    { name: "Lomas de Curamavida", type: "vidrio", lat: -37.4420, lng: -72.3750, desc: "Sector Curamavida" },
    { name: "Villa San Luis", type: "vidrio", lat: -37.4450, lng: -72.3600, desc: "Nevados del Salado" },
    { name: "Villa Curamonte", type: "vidrio", lat: -37.4400, lng: -72.3550, desc: "Rotonda Curamonte" },
    { name: "Camino a Nacimiento", type: "vidrio", lat: -37.5000, lng: -72.4000, desc: "Country Santa Eliana (Km 5)" },
    { name: "Delegación Santa Fe", type: "mixto", lat: -37.4589, lng: -72.5843, desc: "O'Higgins S/N" },
    { name: "San Carlos Purén (Plaza)", type: "mixto", lat: -37.5450, lng: -72.2600, desc: "Lautaro / Millarrahue" },
    { name: "San Carlos Purén (Av BioBio)", type: "vidrio", lat: -37.5420, lng: -72.2620, desc: "Av. Biobío / Caupolicán" },
    { name: "Delegación Saltos del Laja", type: "mixto", lat: -37.2180, lng: -72.3850, desc: "Av. El Salto 476" },
    { name: "Multicancha El Peral", type: "mixto", lat: -37.5100, lng: -72.2800, desc: "Av. El Peral / La Reserva" },
    { name: "Delegación Chacayal", type: "mixto", lat: -37.3800, lng: -72.2500, desc: "Arturo Prat 430" },
    { name: "Villa El Esfuerzo (Rarinco)", type: "vidrio", lat: -37.4000, lng: -72.3000, desc: "San Alfonso / Manuel Badilla" },
    { name: "Villa Miraflores (El Peral)", type: "vidrio", lat: -37.5120, lng: -72.2820, desc: "Los Jazmines / Los Clarines" },
    { name: "Punto Verde Polideportivo", type: "mixto", lat: -37.4610, lng: -72.3585, desc: "Av. Gabriela Mistral / Marconi" },
    { name: "Punto Limpio Quilque Norte", type: "mixto", lat: -37.4520, lng: -72.3480, desc: "Av. Costanera Quilque Norte / Nahuelbuta" },
    { name: "Punto Parque Sorvicenta", type: "mixto", lat: -37.4505, lng: -72.3520, desc: "Av. Nieves Vásquez / Jardines Luxemburgo" },
    { name: "Punto Villa Filadelfia", type: "mixto", lat: -37.4850, lng: -72.3350, desc: "Nueva Esperanza, Block 1-4" },
    { name: "Punto Villa Las Tranqueras", type: "mixto", lat: -37.4550, lng: -72.3700, desc: "El Labriego / Las Tranqueras 5" },
    { name: "JJVV Villa Galilea", type: "mixto", lat: -37.4780, lng: -72.3750, desc: "Baquedano / Agustinos" },
    { name: "Altos del Retiro (Galilea)", type: "mixto", lat: -37.4800, lng: -72.3720, desc: "Sacramento / Misioneros" },
    { name: "CESFAM Nuevo Horizonte", type: "mixto", lat: -37.4480, lng: -72.3650, desc: "Las Torcazas / Aguas Calientes" },
    { name: "Portal Manso de Velasco", type: "mixto", lat: -37.4950, lng: -72.3450, desc: "Costanera Paillihue / Av. Oriente" }
];

let map = null;
let routingControl = null;
let myPosition = null;
let userMarker = null;
let watchId = null;
let isNavigating = false;

function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'map') setTimeout(iniciarRastreo, 200);
}

function iniciarRastreo() {
    if (map) {
        map.invalidateSize();
        return;
    }

    const laLat = -37.4697;
    const laLng = -72.3537;

    map = L.map('mapView', { zoomControl: false }).setView([laLat, laLng], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            pos => actualizarPosicion(pos.coords.latitude, pos.coords.longitude),
            err => actualizarPosicion(laLat, laLng),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        actualizarPosicion(laLat, laLng);
    }
}

function actualizarPosicion(lat, lng) {
    myPosition = { lat, lng };

    if (!userMarker) {
        const userIcon = L.divIcon({
            className: 'user-pulse',
            html: '<div style="width:16px;height:16px;background:#2ECC71;border:2px solid white;border-radius:50%;box-shadow:0 0 10px #2ECC71;"></div>',
            iconSize: [20, 20]
        });
        userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        map.setView([lat, lng], 15);
        procesarPuntos(lat, lng);
    } else {
        userMarker.setLatLng([lat, lng]);
    }

    if (isNavigating) {
        map.panTo([lat, lng]);
        if (routingControl) {
            const waypoints = routingControl.getWaypoints();
            const destino = waypoints[waypoints.length - 1].latLng;
            routingControl.setWaypoints([L.latLng(lat, lng), destino]);
        }
    }
}

function procesarPuntos(userLat, userLng) {
    puntosReciclaje.forEach(p => {
        const distancia = calcularDistancia(userLat, userLng, p.lat, p.lng);
        if (distancia <= RADIO_KM) crearMarcador(p, distancia);
    });
}

function crearMarcador(p, dist) {
    let pinColor = "#2ECC71";
    let iconEmoji = "♻️";

    if (p.type === "vidrio") {
        pinColor = "#3498DB";
        iconEmoji = "🍾";
    }
    if (p.type === "plastico") {
        pinColor = "#E67E22";
        iconEmoji = "🥤";
    }
    if (p.type === "papel") {
        pinColor = "#F1C40F";
        iconEmoji = "📦";
    }

    const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
            <div style="position:relative; width:32px; height:42px;">
                <div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:${pinColor};position:absolute;transform:rotate(-45deg);left:0;top:0;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>
                <div style="font-size:18px;position:absolute;top:3px;left:6px;transform:rotate(45deg);">${iconEmoji}</div>
            </div>
        `,
        iconSize: [32, 42],
        iconAnchor: [16, 42]
    });

    const marker = L.marker([p.lat, p.lng], { icon: customIcon }).addTo(map);
    todosLosMarcadores.push(marker);

    marker.bindPopup(`
        <div style="text-align:center;">
            <strong style="font-size:16px;">${p.name}</strong><br>
            <span style="color:#aaa; font-size:12px;">${p.desc}</span><br>
            <span style="display:inline-block; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:10px; font-size:11px; margin:5px 0;">
                📍 A ${dist.toFixed(1)} km
            </span>
            <button class="btn-navigate" onclick="calcularRuta(${p.lat}, ${p.lng})">🚀 IR AHORA</button>
        </div>
    `);
}

function calcularRuta(destLat, destLng) {
    if (!myPosition) {
        alert("Esperando señal GPS...");
        return;
    }

    limpiarRuta(false);
    map.closePopup();
    isNavigating = true;

    todosLosMarcadores.forEach(m => {
        const p = m.getLatLng();
        if (p.lat !== destLat || p.lng !== destLng) {
            map.removeLayer(m);
        }
    });

    document.getElementById('navPanel').style.display = 'block';
    document.getElementById('closeRouteBtn').style.display = 'block';

    routingControl = L.Routing.control({
        waypoints: [L.latLng(myPosition.lat, myPosition.lng), L.latLng(destLat, destLng)],
        routeWhileDragging: false,
        language: 'es',
        show: false,
        lineOptions: { styles: [{ color: '#2ECC71', opacity: 0.8, weight: 7 }] },
        createMarker: function () { return null; },
        addWaypoints: false
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
        const summary = e.routes[0].summary;
        const dist = summary.totalDistance < 1000 ? Math.round(summary.totalDistance) + ' m' : (summary.totalDistance / 1000).toFixed(1) + ' km';
        const time = Math.round(summary.totalTime / 60) + ' min';

        const nextStep = e.routes[0].instructions[0];
        document.getElementById('navDirection').innerHTML = getIconForStep(nextStep.type) + ' ' + nextStep.text;

        document.getElementById('navDistance').innerText = dist;
        document.getElementById('navTime').innerText = time;
    });
}

function getIconForStep(type) {
    if (type === 'Left') return '⬅️';
    if (type === 'Right') return '➡️';
    if (type === 'Straight') return '⬆️';
    if (type === 'Roundabout') return '🔄';
    return '📍';
}

function limpiarRuta(centrar = true) {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    document.getElementById('navPanel').style.display = 'none';
    document.getElementById('closeRouteBtn').style.display = 'none';
    isNavigating = false;

    todosLosMarcadores.forEach(m => {
        if (!map.hasLayer(m)) map.addLayer(m);
    });

    if (centrar && myPosition && map) {
        map.flyTo([myPosition.lat, myPosition.lng], 15, { duration: 1.5 });
    }
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
