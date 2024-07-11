<script>
        const braceletTemplate = document.getElementById('braceletTemplate');
        const gemContainer = document.getElementById('gemContainer');
        const gemSizeSelect = document.getElementById('gemSize');
        const braceletSizeSelect = document.getElementById('braceletSize');
        const priceDisplay = document.getElementById('price');
        const addToCartButton = document.getElementById('addToCart');
        const generateBraceletButton = document.getElementById('generateBracelet');

        let totalPrice = 0;
        let selectedGems = [];

        const gemTypes = [
            { name: 'Ruby', price: 100, color: '#E0115F' },
            { name: 'Sapphire', price: 120, color: '#0F52BA' },
            { name: 'Emerald', price: 150, color: '#50C878' },
            { name: 'Diamond', price: 200, color: '#B9F2FF' },
            { name: 'Amethyst', price: 80, color: '#9966CC' },
            { name: 'Topaz', price: 90, color: '#FFC87C' }
        ];

        function generateGems() {
            gemContainer.innerHTML = '';
            const gemSize = gemSizeSelect.value + 'px';
            gemTypes.forEach(gemType => {
                const gem = document.createElement('div');
                gem.className = 'gem';
                gem.style.width = gemSize;
                gem.style.height = gemSize;
                gem.style.backgroundColor = gemType.color;
                gem.draggable = true;
                gem.dataset.name = gemType.name;
                gem.dataset.price = gemType.price;
                gem.addEventListener('dragstart', drag);
                gemContainer.appendChild(gem);
            });
        }

        function updateBraceletTemplate() {
            braceletTemplate.innerHTML = '';
            const braceletSize = parseInt(braceletSizeSelect.value);
            const gemSize = parseInt(gemSizeSelect.value);
            const radius = 130; // Radius of the circular bracelet
            const centerX = 150;
            const centerY = 150;
            const gemCount = Math.floor(braceletSize / 2);
            const angleStep = (2 * Math.PI) / gemCount;

            for (let i = 0; i < gemCount; i++) {
                const angle = i * angleStep;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                const gemSlot = document.createElement('div');
                gemSlot.className = 'gem-slot';
                gemSlot.style.left = `${x - gemSize/2}px`;
                gemSlot.style.top = `${y - gemSize/2}px`;
                gemSlot.style.width = `${gemSize}px`;
                gemSlot.style.height = `${gemSize}px`;
                gemSlot.addEventListener('dragover', allowDrop);
                gemSlot.addEventListener('drop', drop);
                braceletTemplate.appendChild(gemSlot);
            }
        }

        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.outerHTML);
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const gemElement = new DOMParser().parseFromString(data, 'text/html').body.firstChild;
            
            if (ev.target.classList.contains('gem-slot') && !ev.target.hasChildNodes()) {
                ev.target.appendChild(gemElement);
                updatePrice(gemElement.dataset.price, 'add');
            } else if (ev.target.classList.contains('gem-slot') && ev.target.hasChildNodes()) {
                updatePrice(ev.target.firstChild.dataset.price, 'subtract');
                ev.target.innerHTML = '';
                ev.target.appendChild(gemElement);
                updatePrice(gemElement.dataset.price, 'add');
            }

            gemElement.addEventListener('dblclick', removeGem);
        }

        function removeGem(ev) {
            const gemSlot = ev.target.parentNode;
            updatePrice(ev.target.dataset.price, 'subtract');
            gemSlot.innerHTML = '';
        }

        function updatePrice(price, operation) {
            if (operation === 'add') {
                totalPrice += parseInt(price);
            } else if (operation === 'subtract') {
                totalPrice -= parseInt(price);
            }
            priceDisplay.textContent = `Total Price: $${totalPrice}`;
        }

        generateBraceletButton.addEventListener('click', () => {
            updateBraceletTemplate();
            generateGems();
        });

        addToCartButton.addEventListener('click', () => {
            alert(`Bracelet added to cart! Total price: $${totalPrice}`);
        });

        gemSizeSelect.addEventListener('change', generateGems);

        // Initial setup
        generateGems();
        updateBraceletTemplate();
    </script>
</body></html>
