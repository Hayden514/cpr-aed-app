
let aedMap;
let aedMarkers;

function initializeMap() {
    const mapElement = document.getElementById("aed-map");
    const statusElement = document.getElementById("aed-status");

    if (typeof L === "undefined") {
        statusElement.textContent =
            "The map library could not load. Check your internet connection.";
        return false;
    }

    aedMap = L.map(mapElement).setView([35.5951, -82.5515], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(aedMap);

    aedMarkers = L.layerGroup().addTo(aedMap);

    return true;
}

async function loadAeds() {
    const statusElement = document.getElementById("aed-status");
    const listElement = document.getElementById("aed-list");

    try {
        const response = await fetch("/api/aeds");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const aeds = data.aeds;

        listElement.replaceChildren();
        aedMarkers.clearLayers();

        if (!Array.isArray(aeds) || aeds.length === 0) {
            statusElement.textContent =
                "No AED location records are currently available.";
            return;
        }

        let mappedCount = 0;

        for (const aed of aeds) {
            const item = document.createElement("li");
            const name = document.createElement("h3");
            const address = document.createElement("p");
            const notes = document.createElement("p");

            name.textContent = aed.name;
            address.textContent = `Address: ${aed.address}`;
            notes.textContent = aed.notes || "";

            item.append(name, address, notes);
            listElement.appendChild(item);

            const hasCoordinates =
                Number.isFinite(aed.latitude) &&
                Number.isFinite(aed.longitude) &&
                aed.latitude >= -90 &&
                aed.latitude <= 90 &&
                aed.longitude >= -180 &&
                aed.longitude <= 180;

            if (hasCoordinates) {
                const marker = L.marker([
                    aed.latitude,
                    aed.longitude
                ]).addTo(aedMarkers);

                marker.bindPopup(
                    `<strong>${escapeHtml(aed.name)}</strong><br>` +
                    `${escapeHtml(aed.address)}`
                );

                mappedCount++;
            }
        }

        if (mappedCount > 0) {
            const bounds = aedMarkers.getBounds();

            aedMap.fitBounds(bounds, {
                padding: [30, 30],
                maxZoom: 16
            });

            statusElement.textContent =
                `Loaded ${aeds.length} AED record(s); ` +
                `${mappedCount} with valid map coordinates.`;
        } else {
            statusElement.textContent =
                `Loaded ${aeds.length} AED record(s), ` +
                "but none has valid map coordinates.";
        }
    } catch (error) {
        console.error("Unable to load AED records:", error);

        statusElement.textContent =
            "Unable to load AED information. Please try again later.";
    }
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const mapReady = initializeMap();

    if (mapReady) {
        await loadAeds();
    }
});
