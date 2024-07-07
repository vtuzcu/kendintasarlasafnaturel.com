let totalPrice = 0;
const braceletArea = document.getElementById('bracelet-area');
const initialStoneArea = document.querySelector('.stones');

// Generate Bracelet Button Click Event
document.getElementById('generate-bracelet').addEventListener('click', generateBracelet);

function generateBracelet() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const stoneSize = document.querySelector('input[name="stone-size"]:checked').value;
    const numStones = getNumStones(size, stoneSize);

    braceletArea.innerHTML = ''; // Eski yerleştiricileri temizle
    createPlaceHolders(numStones, stoneSize);
}

function getNumStones(size, stoneSize) {
    const stoneCounts = {
        '6': { 'S': 27, 'M': 30, 'L': 33 },
        '8': { 'S': 20, 'M': 23, 'L': 26 }
    };
    return stoneCounts[stoneSize][size];
}

function createPlaceHolders(numStones, stoneSize) {
    const radius = braceletArea.offsetWidth / 2 - 20; // Beyaz taş boyutunu 40px olarak ayarladık
    const angleStep = (2 * Math.PI) / numStones;

    for (let i = 0; i < numStones; i++) {
        const angle = angleStep * i;
        const x = radius * Math.cos(angle) + braceletArea.offsetWidth / 2 - 20;
        const y = radius * Math.sin(angle) + braceletArea.offsetHeight / 2 - 20;

        const placeHolder = document.createElement('div');
        placeHolder.className = 'place-holder';
        placeHolder.style.width = '40px';
        placeHolder.style.height = '40px';
        placeHolder.style.position = 'absolute';
        placeHolder.style.left = `${x}px`;
        placeHolder.style.top = `${y}px`;
        placeHolder.style.backgroundColor = 'white'; // Beyaz taşlar için renk
        placeHolder.style.border = '1px solid #ccc'; // Beyaz taşlar için kenarlık
        placeHolder.style.borderRadius = '50%'; // Daire şeklinde
        braceletArea.appendChild(placeHolder);
    }
}

// Taşları sürükleme işlevselliği
document.querySelectorAll('.stone').forEach(stone => {
    stone.addEventListener('dragstart', dragStart);
    stone.addEventListener('dragend', dragEnd); // Sürükleme bittiğinde işlevi ekleyelim
});

document.getElementById('bracelet-area').addEventListener('dragover', dragOver);
document.getElementById('bracelet-area').addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.src);
    e.dataTransfer.setData('price', e.target.dataset.price);
    e.dataTransfer.setData('origin', 'initial'); // Taşın orijinal alanını belirtmek için
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnd(e) {
    const draggingStone = document.querySelector('.dragging');
    if (draggingStone) {
        const rect = braceletArea.getBoundingClientRect();
        const withinBraceletArea = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!withinBraceletArea) {
            const price = parseFloat(draggingStone.dataset.price);
            updateTotalPrice(-price);
            draggingStone.remove(); // Taşı tamamen kaldır
        }
        draggingStone.classList.remove('dragging');
    }
}

function drop(e) {
    e.preventDefault();
    const src = e.dataTransfer.getData('text/plain');
    const price = e.dataTransfer.getData('price');
    const stone = document.createElement('img');
    stone.src = src;
    stone.className = 'stone';
    stone.dataset.price = price;
    stone.draggable = true;
    stone.addEventListener('dragstart', dragStart);
    stone.addEventListener('dragend', dragEnd);

    placeStoneOnBracelet(stone, e.clientX, e.clientY);
    updateTotalPrice(price);
}

function placeStoneOnBracelet(stone, x, y) {
    const closestPlaceHolder = getClosestPlaceHolder(x, y);
    if (closestPlaceHolder) {
        const rect = braceletArea.getBoundingClientRect();
        const offsetX = closestPlaceHolder.offsetLeft + closestPlaceHolder.offsetWidth / 2 - 20;
        const offsetY = closestPlaceHolder.offsetTop + closestPlaceHolder.offsetHeight / 2 - 20;

        stone.style.width = closestPlaceHolder.style.width;
        stone.style.height = closestPlaceHolder.style.height;
        stone.style.position = 'absolute';
        stone.style.left = `${offsetX}px`;
        stone.style.top = `${offsetY}px`;
        braceletArea.appendChild(stone);
    } else {
        // Taş bileklik alanı dışında bırakıldığında taşı kaldır
        stone.remove();
    }
}

function getClosestPlaceHolder(x, y) {
    let closest = null;
    let minDistance = Infinity;
    const rect = braceletArea.getBoundingClientRect();

    braceletArea.querySelectorAll('.place-holder').forEach(placeHolder => {
        const offsetX = rect.left + placeHolder.offsetLeft + placeHolder.offsetWidth / 2;
        const offsetY = rect.top + placeHolder.offsetTop + placeHolder.offsetHeight / 2;
        const distance = Math.sqrt(Math.pow(x - offsetX, 2) + Math.pow(y - offsetY, 2));

        if (distance < minDistance) {
            minDistance = distance;
            closest = placeHolder;
        }
    });

    return closest;
}

function updateTotalPrice(price) {
    totalPrice
