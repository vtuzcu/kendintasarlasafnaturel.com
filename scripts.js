const braceletTemplate = document.getElementById('braceletTemplate');
        const gemContainer = document.getElementById('gemContainer');
        const gemSizeSelect = document.getElementById('gemSize');
        const braceletSizeSelect = document.getElementById('braceletSize');
        const priceDisplay = document.getElementById('price');
        const addToCartButton = document.getElementById('addToCart');
        const generateBraceletButton = document.getElementById('generateBracelet');

        let totalPrice = 0;
        let selectedGems = [];
        let currentGemSize = 6;
        let draggedGem = null;
\\color: '#E0115F'\\
        const gemTypes = [
            { name: 'Ruby', price: 100, akik_karnelyan.png, localName: 'Yakut' },
            { name: 'Sapphire', price: 120, color: '#0F52BA', localName: 'Gök Yakut' },
            { name: 'Emerald', price: 150, color: '#50C878', localName: 'Zümrüt' },
            { name: 'Diamond', price: 200, color: '#B9F2FF', localName: 'Elmas' },
            { name: 'Amethyst', price: 80, color: '#9966CC', localName: 'Ametist' },
            { name: 'Topaz', price: 90, color: '#FFC87C', localName: 'Sarı Yakut' },
            { name: 'Opal', price: 110, color: '#A8C3BC', localName: 'Opal' },
            { name: 'Garnet', price: 95, color: '#C41E3A', localName: 'Kırmızı Yakut' },
            { name: 'Peridot', price: 85, color: '#AAFF00', localName: 'Zeberced' },
            { name: 'Aquamarine', price: 105, color: '#7FFFD4', localName: 'Akuamarin' },
            { name: 'Citrine', price: 88, color: '#FFB90F', localName: 'Sitrin' },
            { name: 'Tanzanite', price: 130, color: '#4D5D94', localName: 'Tanzanit' },
            { name: 'Morganite', price: 115, color: '#FFAEB9', localName: 'Morganit' },
            { name: 'Alexandrite', price: 180, color: '#008080', localName: 'Aleksandrit' },
            { name: 'Tourmaline', price: 98, color: '#86608E', localName: 'Turmalin' },
            { name: 'Moonstone', price: 92, color: '#E6E6FA', localName: 'Ay Taşı' },
            { name: 'Onyx', price: 82, color: '#353839', localName: 'Oniks' },
            { name: 'Pearl', price: 108, color: '#FDEEF4', localName: 'İnci' },
            { name: 'Turquoise', price: 86, color: '#40E0D0', localName: 'Turkuaz' },
            { name: 'Lapis Lazuli', price: 94, color: '#191970', localName: 'Lapis Lazuli' }
        ];

        function generateGems() {
            gemContainer.innerHTML = '';
            currentGemSize = parseInt(gemSizeSelect.value);
            const gemSize = currentGemSize * 5 + 'px';
            gemTypes.forEach(gemType => {
                const gemWrapper = document.createElement('div');
                gemWrapper.className = 'gem-wrapper';

                const gem = document.createElement('div');
                gem.className = 'gem';
                gem.style.width = gemSize;
                gem.style.height = gemSize;
                gem.style.backgroundColor = gemType.color;
                gem.dataset.name = gemType.name;
                gem.dataset.price = gemType.price;
                gem.addEventListener('mousedown', dragStart);
                gem.addEventListener('touchstart', dragStart, { passive: false });

                const gemName = document.createElement('div');
                gemName.className = 'gem-name';
                gemName.textContent = gemType.localName;

                gemWrapper.appendChild(gem);
                gemWrapper.appendChild(gemName);
                gemContainer.appendChild(gemWrapper);
            });
        }

        function updateBraceletTemplate() {
            braceletTemplate.innerHTML = '';
            const braceletSize = parseInt(braceletSizeSelect.value);
            const gemSize = currentGemSize;
            const centerX = braceletTemplate.clientWidth / 2;
            const centerY = braceletTemplate.clientHeight / 2;
            
            let gemCount, radius;
            if (gemSize === 6) {
                gemCount = braceletSize === 16 ? 27 : braceletSize === 18 ? 30 : 33;
            } else { // 8mm
                gemCount = braceletSize === 16 ? 20 : braceletSize === 18 ? 23 : 26;
            }

            const gemSizePixels = gemSize * 3;
            radius = Math.min(centerX, centerY) - gemSizePixels / 2 - 15; // Increased radius

            const angleStep = (2 * Math.PI) / gemCount;

            for (let i = 0; i < gemCount; i++) {
                const angle = i * angleStep;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                const gemSlot = document.createElement('div');
                gemSlot.className = 'gem-slot';
                gemSlot.style.left = `${x - gemSizePixels/2}px`;
                gemSlot.style.top = `${y - gemSizePixels/2}px`;
                gemSlot.style.width = `${gemSizePixels}px`;
                gemSlot.style.height = `${gemSizePixels}px`;
                braceletTemplate.appendChild(gemSlot);
            }
        }

        function dragStart(e) {
            if (e.type === 'mousedown') {
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', dragEnd);
            } else if (e.type === 'touchstart') {
                document.addEventListener('touchmove', drag, { passive: false });
                document.addEventListener('touchend', dragEnd);
            }

            draggedGem = this.cloneNode(true);
            draggedGem.style.position = 'absolute';
            draggedGem.style.zIndex = 1000;
            document.body.appendChild(draggedGem);

            const event = e.type === 'mousedown' ? e : e.touches[0];
            updateDraggedPosition(event.clientX, event.clientY);

            e.preventDefault();
        }

        function drag(e) {
            if (draggedGem) {
                const event = e.type === 'mousemove' ? e : e.touches[0];
                updateDraggedPosition(event.clientX, event.clientY);
                
                const closestSlot = findClosestSlot(event.clientX, event.clientY);
                if (closestSlot) {
                    resizeGemToFitSlot(draggedGem, closestSlot);
                }
            }
            e.preventDefault();
        }

        function dragEnd(e) {
            if (draggedGem) {
                const event = e.type === 'mouseup' ? e : e.changedTouches[0];
                const closestSlot = findClosestSlot(event.clientX, event.clientY);

                if (closestSlot) {
                    if (closestSlot.hasChildNodes()) {
                        const oldGem = closestSlot.firstChild;
                        updatePrice(oldGem.dataset.price, 'subtract');
                        closestSlot.removeChild(oldGem);
                    }

                    const newGem = draggedGem.cloneNode(true);
                    newGem.style.position = '';
                    newGem.style.zIndex = '';
                    resizeGemToFitSlot(newGem, closestSlot);
                    closestSlot.appendChild(newGem);
                    updatePrice(draggedGem.dataset.price, 'add');
                    newGem.addEventListener('dblclick', removeGem);
                }

                document.body.removeChild(draggedGem);
                draggedGem = null;
            }

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', dragEnd);
        }

        function updateDraggedPosition(x, y) {
            draggedGem.style.left = x - draggedGem.offsetWidth / 2 + 'px';
            draggedGem.style.top = y - draggedGem.offsetHeight / 2 + 'px';
        }

        function findClosestSlot(x, y) {
            const gemSlots = document.querySelectorAll('.gem-slot');
            let closestSlot = null;
            let minDistance = Infinity;

            gemSlots.forEach(slot => {
                const rect = slot.getBoundingClientRect();
                const distance = Math.hypot(
                    x - (rect.left + rect.width / 2),
                    y - (rect.top + rect.height / 2)
                );

                if (distance < minDistance && distance < slot.offsetWidth * 1.5) {
                    closestSlot = slot;
                    minDistance = distance;
                }
            });

            return closestSlot;
        }

        function resizeGemToFitSlot(gem, slot) {
            gem.style.width = slot.style.width;
            gem.style.height = slot.style.height;
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
            priceDisplay.textContent = `Toplam Fiyat: ${totalPrice} TL`;
        }

        generateBraceletButton.addEventListener('click', () => {
            updateBraceletTemplate();
            generateGems();
            totalPrice = 0;
""
            priceDisplay.textContent = `Toplam Fiyat: ${totalPrice} TL`;
        });

        addToCartButton.addEventListener('click', () => {
            alert(`Bilekliğiniz sepete eklendi: ${totalPrice} TL`);
        });

        gemSizeSelect.addEventListener('change', () => {
            generateGems();
            updateBraceletTemplate();
        });
        braceletSizeSelect.addEventListener('change', updateBraceletTemplate);

        generateGems();
        updateBraceletTemplate();

        window.addEventListener('resize', () => {
            updateBraceletTemplate();
        });
