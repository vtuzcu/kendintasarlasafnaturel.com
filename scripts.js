document.addEventListener('DOMContentLoaded', function () {
    const stones = document.querySelectorAll('.stone');
    const braceletArea = document.getElementById('bracelet-area');
    const totalPriceElement = document.getElementById('total-price');
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const stoneSizeInputs = document.querySelectorAll('input[name="stone-size"]');
    let totalPrice = 0;

    sizeInputs.forEach(input => {
        input.addEventListener('change', generateBraceletTemplate);
    });

    stoneSizeInputs.forEach(input => {
        input.addEventListener('change', generateBraceletTemplate);
    });

    document.getElementById('generate-bracelet').addEventListener('click', generateBraceletTemplate);

    stones.forEach(stone => {
        stone.addEventListener('dragstart', dragStart);
        stone.addEventListener('touchstart', touchStart, { passive: false });
    });

    braceletArea.addEventListener('dragover', dragOver);
    braceletArea.addEventListener('drop', drop);
    braceletArea.addEventListener('touchmove', touchMove, { passive: false });
    braceletArea.addEventListener('touchend', touchEnd, { passive: false });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const stone = document.querySelector(`.stone[data-id='${id}']`);
        addStoneToBracelet(stone);
    }

    function touchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const stone = e.target;
        stone.classList.add('dragging');
        stone.style.position = 'absolute';
        stone.style.left = `${touch.pageX - stone.offsetWidth / 2}px`;
        stone.style.top = `${touch.pageY - stone.offsetHeight / 2}px`;
        document.body.append(stone);

        stone.addEventListener('touchmove', touchMove);
        stone.addEventListener('touchend', touchEnd);
    }

    function touchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const stone = document.querySelector('.dragging');
        if (stone) {
            stone.style.left = `${touch.pageX - stone.offsetWidth / 2}px`;
            stone.style.top = `${touch.pageY - stone.offsetHeight / 2}px`;
        }
    }

    function touchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const stone = document.querySelector('.dragging');
        if (stone) {
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            if (dropTarget && dropTarget.id === 'bracelet-area') {
                addStoneToBracelet(stone);
            } else {
                stone.remove();
            }
            stone.classList.remove('dragging');
        }
    }

    function addStoneToBracelet(stone) {
        const placeholder = document.createElement('div');
        placeholder.className = 'place-holder';
        placeholder.style.left = `${stone.offsetLeft}px`;
        placeholder.style.top = `${stone.offsetTop}px`;
        braceletArea.appendChild(placeholder);

        const price = parseFloat(stone.dataset.price);
        totalPrice += price;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    function generateBraceletTemplate() {
        braceletArea.innerHTML = '';
        const size = document.querySelector('input[name="size"]:checked').value;
        const stoneSize = document.querySelector('input[name="stone-size"]:checked').value;
        const stoneCount = size === 'S' ? 16 : size === 'M' ? 18 : 20;
        const radius = braceletArea.offsetWidth / 2 - stoneSize;

        for (let i = 0; i < stoneCount; i++) {
            const angle = (i / stoneCount) * (2 * Math.PI);
            const x = radius * Math.cos(angle) + braceletArea.offsetWidth / 2;
            const y = radius * Math.sin(angle) + braceletArea.offsetHeight / 2;

            const placeholder = document.createElement('div');
            placeholder.className = 'place-holder';
            placeholder.style.width = `${stoneSize}px`;
            placeholder.style.height = `${stoneSize}px`;
            placeholder.style.left = `${x - stoneSize / 2}px`;
            placeholder.style.top = `${y - stoneSize / 2}px`;
            braceletArea.appendChild(placeholder);
        }
    }

    document.getElementById('add-to-cart').addEventListener('click', function () {
        alert(`Total price is $${totalPrice.toFixed(2)}`);
    });

    generateBraceletTemplate(); // Initialize the template on load
});
