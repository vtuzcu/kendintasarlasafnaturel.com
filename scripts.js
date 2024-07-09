/* scripts.js */

let totalPrice = 0;
const braceletArea = document.querySelector('#bracelet-area');
const initialStoneArea = document.querySelector('.stones');
const totalPriceElement = document.querySelector('#total-price');

// Generate Bracelet Button Click Event
document.getElementById('generate-bracelet').addEventListener('click', generateBracelet);

function generateBracelet() {
    const size = document.querySelector('input[name="size"]:checked').value;
    const stoneSize = document.querySelector('input[name="stone-size"]:checked').value;
    const numStones = getNumStones(size, stoneSize);

    braceletArea.innerHTML = ''; // Clear existing placeholders
    createPlaceHolders(numStones, stoneSize);
}

function getNumStones(size, stoneSize) {
    const stoneCounts = {
        '6': { 'S': 27, 'M': 30, 'L': 33 },
        '8': { 'S': 20, 'M': 23, 'L': 26 },
        '10': { 'S': 16, 'M': 18, 'L': 20 }
    };
    return stoneCounts[stoneSize][size];
}

function createPlaceHolders(numStones, stoneSize) {
    const radius = braceletArea.offsetWidth / 2 - 20; // Adjust size accordingly
    const angleStep = (2 * Math.PI) / numStones;

    for (let i = 0; i < numStones; i++) {
        const angle = angleStep * i;
        const x = radius * Math.cos(angle) + braceletArea.offsetWidth / 2 - 20;
        const y = radius * Math.sin(angle) + braceletArea.offsetHeight / 2 - 20;

        const placeHolder = document.createElement('div');
        placeHolder.className = 'place-holder';
        placeHolder.style.width = '40px';
        placeHolder.style.height = '40px';
        placeHolder.style.left = `${x}px`;
        placeHolder.style.top = `${y}px`;
        braceletArea.appendChild(placeHolder);
    }
}

// Drag and drop functionality
document.querySelectorAll('.stone').forEach(stone => {
    stone.addEventListener('dragstart', dragStart);
    stone.addEventListener('dragend', dragEnd); // Add functionality to drag end
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

    const newStone = document.createElement('img');
    newStone.src = src;
    newStone.className = 'stone';
    newStone.style.position = 'absolute';
    newStone.style.width = '40px';
    newStone.style.height = '40px';
    newStone.style.left = `${e.clientX - braceletArea.offsetLeft - 20}px`;
    newStone.style.top = `${e.clientY - braceletArea.offsetTop - 20}px`;

    braceletArea.appendChild(newStone);
    updateTotalPrice(price);

    newStone.addEventListener('dragstart', dragStart);
    newStone.addEventListener('dragend', dragEnd);
}

function updateTotalPrice(price) {
    totalPrice += price;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}
