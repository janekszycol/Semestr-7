// Pobranie elementów DOM
const getLocationBtn = document.getElementById('getLocationBtn');
const puzzleBtn = document.getElementById('puzzleBtn');
const placeholder1 = document.getElementById('placeholder1').querySelector('.content');
const placeholder2 = document.getElementById('placeholder2').querySelector('.content');
const placeholder3 = document.getElementById('placeholder3').querySelector('.content');
const placeholder4 = document.getElementById('placeholder4').querySelector('.content');
const mapImageContainer = document.getElementById('mapImageContainer');

// Prośba o zgodę na wyświetlanie powiadomień
if ('Notification' in window) {
    Notification.requestPermission();
}

// Zmienne globalne
let map;
let userLatitude = null;
let userLongitude = null;
let mapLoaded = false;

// Funkcja inicjalizująca mapę
function initMap() {
    map = L.map('map', {
        zoomControl: false, // Opcjonalnie ukrycie przycisków zoomu
    }).setView([51.505, -0.09], 18); // Ustawienie początkowego przybliżenia na 18

    // Użycie warstwy bazowej Esri (mapa satelitarna)
    let esriLayer = L.esri.basemapLayer('Imagery').addTo(map);

    // Nasłuchiwanie zdarzeń ładowania kafelków
    esriLayer.on('loading', function() {
        mapLoaded = false;
    });

    esriLayer.on('load', function() {
        mapLoaded = true;
    });
}

// Funkcja pobierania lokalizacji
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    }
}

// Wyświetlanie mapy na podstawie pozycji
function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    // Aktualizacja mapy z przybliżeniem 18
    map.setView([userLatitude, userLongitude], 18);

    // Usunięcie znacznika z mapy (usunięto kod dodający znacznik)
    // L.marker([userLatitude, userLongitude]).addTo(map)
    //     .bindPopup("Twoja lokalizacja").openPopup();
}

// Obsługa błędów geolokalizacji
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Prośba o geolokalizację została odrzucona.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informacje o lokalizacji są niedostępne.");
            break;
        case error.TIMEOUT:
            alert("Przekroczono czas oczekiwania na lokalizację.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Nieznany błąd.");
            break;
    }
}

// Funkcja czekająca na załadowanie wszystkich kafelków
function waitForTilesLoaded() {
    return new Promise((resolve) => {
        if (mapLoaded) {
            resolve();
        } else {
            const checkLoaded = setInterval(() => {
                if (mapLoaded) {
                    clearInterval(checkLoaded);
                    resolve();
                }
            }, 100);
        }
    });
}

// Event listener dla przycisku "Moja lokalizacja"
getLocationBtn.addEventListener('click', function() {
    getLocation();
});

// Event listener dla przycisku "Puzzle"
puzzleBtn.addEventListener('click', function() {
    if (userLatitude && userLongitude) {
        waitForTilesLoaded().then(() => {
            // Eksport mapy jako obraz rastrowy
            leafletImage(map, function(err, canvas) {
                if (err) {
                    console.error(err);
                    alert("Wystąpił błąd podczas generowania obrazu mapy.");
                    return;
                }

                // Wyświetlenie obrazu w placeholderze 2
                const imgData = canvas.toDataURL();
                mapImageContainer.innerHTML = `<img src="${imgData}" alt="Mapa" style="width:100%; height:100%;">`;

                // Podzielenie obrazu na puzzle
                createPuzzlePieces(imgData);
            });
        });
    } else {
        alert("Najpierw pobierz swoją lokalizację.");
    }
});

// Funkcja tworzenia puzzli
function createPuzzlePieces(imgData) {
    placeholder3.innerHTML = '';
    placeholder4.innerHTML = '';

    const numPieces = 16;
    const pieces = [];

    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Ważne dla uniknięcia problemów z CORS
    img.src = imgData;
    img.onload = function() {
        const pieceWidth = img.width / 4;
        const pieceHeight = img.height / 4;

        // Tworzenie kawałków puzzli
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                const context = canvas.getContext('2d');
                context.drawImage(img, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                canvas.classList.add('puzzle-piece');
                canvas.setAttribute('data-index', `${x}-${y}`);
                pieces.push(canvas);
            }
        }

        // Mieszanie puzzli
        pieces.sort(() => Math.random() - 0.5);

        // Dodanie eventów drag & drop
        pieces.forEach(piece => {
            piece.draggable = true;
            piece.addEventListener('dragstart', dragStart);
            placeholder3.appendChild(piece);
        });

        // Przygotowanie placeholdera 4 do przyjmowania puzzli
        // Tworzenie pustych miejsc dla puzzli w placeholderze 4
        for (let i = 0; i < 16; i++) {
            const dropZone = document.createElement('div');
            dropZone.classList.add('drop-zone');
            dropZone.addEventListener('dragover', dragOver);
            dropZone.addEventListener('drop', drop);
            placeholder4.appendChild(dropZone);
        }
    };
}

// Funkcje drag & drop
let draggedPiece = null;

function dragStart(e) {
    draggedPiece = e.target;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone') && e.target.childNodes.length === 0) {
        e.target.appendChild(draggedPiece);
        checkPuzzleCompletion();
    }
}

// Weryfikacja poprawności ułożenia puzzli
function checkPuzzleCompletion() {
    const dropZones = placeholder4.querySelectorAll('.drop-zone');
    let correct = true;
    for (let i = 0; i < dropZones.length; i++) {
        const dropZone = dropZones[i];
        const piece = dropZone.firstChild;
        if (piece) {
            const expectedIndex = `${i % 4}-${Math.floor(i / 4)}`;
            const actualIndex = piece.getAttribute('data-index');
            if (expectedIndex !== actualIndex) {
                correct = false;
                break;
            }
        } else {
            correct = false;
            break;
        }
    }

    if (correct) {
        // Wyświetlenie notyfikacji
        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', { body: 'Ułożyłeś puzzle poprawnie.' });
        } else {
            alert('Gratulacje! Ułożyłeś puzzle poprawnie.');
        }
    }
}

// Inicjalizacja mapy po załadowaniu strony
window.onload = function() {
    initMap();
};
