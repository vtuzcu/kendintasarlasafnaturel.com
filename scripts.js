document.addEventListener('DOMContentLoaded', function () {
    const stones = document.querySelectorAll('.stone');
    const braceletArea = document.getElementById('bracelet-area');
    const totalPriceElement = document.getElementById('total-price');
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const stoneSizeInputs = document.querySelectorAll('input[name="stone-size"]');
    let totalPrice = 0;

    sizeInputs.forEach(input => {
        input.addEventListener('change', updateBraceletSize);
    });

    stoneSizeInputs.forEach(input => {
        input.addEventListener('change', updateStoneSize);
    });

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

    function updateBraceletSize() {
        const size = document.querySelector('input[name="size"]:checked').value;
        let newSize;
        if (size === 'S') newSize = '200px';
        else if (size === 'M') newSize = '250px';
        else if (size === 'L') newSize = '300px';
        braceletArea.style.width = newSize;
        braceletArea.style.height = newSize;
    }

    function updateStoneSize() {
        const stoneSize = document.querySelector('input[name="stone-size"]:checked').value;
        let newSize;
        if (stoneSize === '6') newSize = '10px';
        else if (stoneSize === '8') newSize = '15px';
        else if (stoneSize === '10') newSize = '20px';
        const placeholders = braceletArea.querySelectorAll('.place-holder');
        placeholders.forEach(placeholder => {
            placeholder.style.width = newSize;
            placeholder.style.height = newSize;
        });
    }

    document.getElementById('add-to-cart').addEventListener('click', function () {
        alert(`Total price is $${totalPrice.toFixed(2)}`);
    });

    // Initialize sizes on load
    updateBraceletSize();
    updateStoneSize();
});
