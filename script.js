const getLocationBtn = document.getElementById('getLocationBtn');
const puzzleBtn = document.getElementById('puzzleBtn');
const placeholder1 = document.getElementById('placeholder1').querySelector('.content');
const placeholder2 = document.getElementById('placeholder2').querySelector('.content');
const placeholder3 = document.getElementById('placeholder3').querySelector('.content');
const placeholder4 = document.getElementById('placeholder4').querySelector('.content');
const mapImageContainer = document.getElementById('mapImageContainer');


if ('Notification' in window) {
    Notification.requestPermission();
}


let map;
let userLatitude = null;
let userLongitude = null;
let mapLoaded = false;


function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false 
    }).setView([51.505, -0.09], 18);

    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        crossOrigin: 'Anonymous',
        maxZoom: 19
    }).addTo(map);

    tileLayer.on('tileloadstart', function() {
        mapLoaded = false;
    });

    tileLayer.on('tileload', function() {
        mapLoaded = true;
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    }
}

function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    map.setView([userLatitude, userLongitude], 18);
}

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

getLocationBtn.addEventListener('click', function() {
    getLocation();
});

puzzleBtn.addEventListener('click', function() {
    if (userLatitude && userLongitude) {
        waitForTilesLoaded().then(() => {
            leafletImage(map, function(err, canvas) {
                if (err) {
                    console.error(err);
                    alert("Wystąpił błąd podczas generowania obrazu mapy.");
                    return;
                }

                const imgData = canvas.toDataURL();
                mapImageContainer.innerHTML = `<img src="${imgData}" alt="Mapa" style="width:100%; height:100%;">`;

                
                createPuzzlePieces(imgData);
            });
        });
    } else {
        alert("Najpierw pobierz swoją lokalizację.");
    }
});

function createPuzzlePieces(imgData) {
    placeholder3.innerHTML = '';
    placeholder4.innerHTML = '';

    const numPieces = 16;
    const pieces = [];

    const img = new Image();
    img.crossOrigin = 'Anonymous'; 
    img.src = imgData;
    img.onload = function() {
        const pieceWidth = img.width / 4;
        const pieceHeight = img.height / 4;

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

        pieces.sort(() => Math.random() - 0.5);

        pieces.forEach(piece => {
            piece.draggable = true;
            piece.addEventListener('dragstart', dragStart);
            placeholder3.appendChild(piece);
        });

        for (let i = 0; i < 16; i++) {
            const dropZone = document.createElement('div');
            dropZone.classList.add('drop-zone');
            dropZone.addEventListener('dragover', dragOver);
            dropZone.addEventListener('drop', drop);
            placeholder4.appendChild(dropZone);
        }
    };
}

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
        draggedPiece.style.width = '100%';
        draggedPiece.style.height = '100%';
        draggedPiece.style.position = 'absolute';
        draggedPiece.style.top = '0';
        draggedPiece.style.left = '0';
        checkPuzzleCompletion();
    } else if (e.target.classList.contains('content')) {
        e.target.appendChild(draggedPiece);
        draggedPiece.style.width = '25%';
        draggedPiece.style.height = '25%';
        draggedPiece.style.position = '';
        draggedPiece.style.top = '';
        draggedPiece.style.left = '';
    }
}

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
        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', { body: 'Ułożyłeś puzzle poprawnie.' });
            console.log("Gratulacje!");
        } else {
            alert('Gratulacje! Ułożyłeś puzzle poprawnie.');
        }
    }
}


window.onload = function() {
    initMap();
};
