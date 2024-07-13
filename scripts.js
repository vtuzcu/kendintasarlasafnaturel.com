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

const gemTypes = [
    { name: 'Ruby', price: 100, color: '#E0115F', localName: 'Yakut' },
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
        gemName.textContent = gemType
