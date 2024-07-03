document.addEventListener('DOMContentLoaded', function () {
    const stones = document.querySelectorAll('.stone');
    const braceletArea = document.getElementById('bracelet-area');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;

    stones.forEach(stone => {
        stone.addEventListener('dragstart', dragStart);
    });

    braceletArea.addEventListener('dragover', dragOver);
    braceletArea.addEventListener('drop', drop);

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
