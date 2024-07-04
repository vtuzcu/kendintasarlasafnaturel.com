document.addEventListener('DOMContentLoaded', function () {
    const stones = document.querySelectorAll('.stone');
    const braceletArea = document.getElementById('bracelet-area');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;

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
        const stone = e.target;
        stone.style.left = `${touch.pageX - stone.offsetWidth / 2}px`;
        stone.style.top = `${touch.pageY - stone.offsetHeight / 2}px`;
    }

    function touchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const stone = e.target;
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (dropTarget && dropTarget.id === 'bracelet-area') {
            addStoneToBracelet(stone);
        } else {
            stone.remove();
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

    document.getElementById('add-to-cart').addEventListener('click', function () {
        alert(`Total price is $${totalPrice.toFixed(2)}`);
    });
});
