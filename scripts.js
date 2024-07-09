let totalPrice = 0;
const braceletArea = document.getElementById('bracelet-area');
const stones = document.getElementById('stones');

document.getElementById('generate-bracelet').addEventListener('click', generateBracelet);

function generateBracelet() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const stoneSize = document.querySelector('input[name="stone-size"]:checked').value;
    const numStones = getNumStones(size, stoneSize);

    braceletArea.innerHTML = '';
    createPlaceHolders(numStones, stoneSize);
}

function getNumStones(size, stoneSize) {
    const stoneCounts = {
        '6': { 'S': 27, 'M': 30, 'L': 33 },
        '8': { 'S': 20, 'M': 23, 'L': 26 },
        '10': { 'S': 15, 'M': 18, 'L': 21 }
    };
    return stoneCounts[stoneSize][size];
}

function createPlaceHolders(numStones, stoneSize) {
    const radius = braceletArea.offsetWidth / 2 - 20;
    const angleStep = (2 * Math.PI) / numStones;

    for (let i = 0; i < numStones; i++) {
        const angle = angleStep * i;
        const x = radius * Math.cos(angle) + braceletArea.offsetWidth / 2 - 20;
        const y = radius * Math.sin(angle) + braceletArea.offsetHeight / 2 - 20;

        const placeHolder = document.createElement('div');
        placeHolder.className = 'place-holder';
        placeHolder.style.width = `${stoneSize}px`;
        placeHolder.style.height = `${stoneSize}px`;
        placeHolder.style.left = `${x}px`;
        placeHolder.style.top = `${y}px`;
        braceletArea.appendChild(placeHolder);
    }
}

document.querySelectorAll('.stone').forEach(stone => {
    stone.addEventListener('dragstart', dragStart);
    stone.addEventListener('dragend', dragEnd);
});

braceletArea.addEventListener('dragover', dragOver);
braceletArea.addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.src);
    e.dataTransfer.setData('price', e.target.dataset.price);
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
            draggingStone.remove();
        }
        draggingStone.classList.remove('dragging');
    }
}

function drop(e) {
    e.preventDefault();
    const src = e.dataTransfer.getData('text/plain');
    const price = parseFloat(e.dataTransfer.getData('price'));
    const img = document.createElement('img');
    img.src = src;
    img.className = 'stone';
    img.style.width = '50px';
    img.style.height = '50px';

    const closestPlaceHolder = getClosestPlaceHolder(e.clientX, e.clientY);
    if (closestPlaceHolder) {
        closestPlaceHolder.innerHTML = '';
        closestPlaceHolder.appendChild(img);
        updateTotalPrice(price);
    }
}

function getClosestPlaceHolder(x, y) {
    let minDistance = Infinity;
    let closest = null;
    braceletArea.querySelectorAll('.place-holder').forEach(placeHolder => {
        const rect = placeHolder.getBoundingClientRect();
        const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y);
        if (distance < minDistance) {
            minDistance = distance;
            closest = placeHolder;
        }
    });
    return closest;
}

function updateTotalPrice(price) {
    totalPrice += price;
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}
