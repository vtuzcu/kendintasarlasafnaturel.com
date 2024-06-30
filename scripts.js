let totalPrice = 0;
const braceletArea = document.getElementById('bracelet-area');
const initialStoneArea = document.querySelector('.stones');

// Generate Bracelet Button Click Event
document.getElementById('generate-bracelet').addEventListener('click', generateBracelet);
document.getElementById('add-to-cart').addEventListener('click', addToCart);

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
        '8': { 'S': 20, 'M': 23, 'L': 26 }
    };
    return stoneCounts[stoneSize][size];
}

function createPlaceHolders(numStones, stoneSize) {
    const radius = braceletArea.offsetWidth / 2 - 20; // Set white stone size to 40px
    const angleStep = (2 * Math.PI) / numStones;

    for (let i = 0; i < numStones; i++) {
        const angle = angleStep * i;
        const x = radius * Math.cos(angle) + braceletArea.offsetWidth / 2 - 20;
        const y = radius * Math.sin(angle) + braceletArea.offsetHeight / 2 - 20;

        const placeHolder = document.createElement('div');
        placeHolder.className = 'place-holder';
        placeHolder.style.left = `${x}px`;
        placeHolder.style.top = `${y}px`;
        braceletArea.appendChild(placeHolder);
    }
}

// Drag and Drop functionality for stones
document.querySelectorAll('.stone').forEach(stone => {
    stone.addEventListener('dragstart', dragStart);
});

document.getElementById('bracelet-area').addEventListener('dragover', dragOver);
document.getElementById('bracelet-area').addEventListener('drop', drop);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.src);
    e.dataTransfer.setData('price', e.target.dataset.price);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const src = e.dataTransfer.getData('text/plain');
    const price = e.dataTransfer.getData('price');

    const stone = document.createElement('img');
    stone.src = src;
    stone.className = 'stone placed-stone';
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
    }
}

function dragEnd(e) {
    const rect = braceletArea.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        e.target.remove();
        const price = parseFloat(e.target.dataset.price);
        updateTotalPrice(-price);
    }
    e.target.classList.remove('dragging');
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
    totalPrice += parseFloat(price);
    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function addToCart() {
    const braceletDesign = [];
    document.querySelectorAll('.placed-stone').forEach(stone => {
        braceletDesign.push({
            src: stone.src,
            price: stone.dataset.price,
            position: {
                left: stone.style.left,
                top: stone.style.top,
                width: stone.style.width,
                height: stone.style.height
            }
        });
    });

    const designData = {
        totalPrice: totalPrice.toFixed(2),
        design: braceletDesign
    };

    console.log('Adding to cart:', designData);

    // Send designData to Shopify (requires Shopify setup)
    // Here you would need to integrate with the Shopify API
    // This can be done using Shopify's Storefront API or other methods
}
