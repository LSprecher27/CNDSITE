const products = [
    { id: 'FLJCKT', tags: ['new', 'mens'], type: 'png' },
    { id: '3DPRNTBT', tags: ['new', 'mens', 'womens'], type: 'png' }, 
    { id: 'DTHT', tags: ['new', 'mens'], type: 'png' },
    { id: 'WSPT', tags: ['new', 'mens'], type: 'png' },

];

const gridContainer = document.getElementById('product-grid');
const galleryContainer = document.getElementById('vertical-gallery');
const toggleBtn = document.getElementById('gallery-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');

let autoScrollInterval;

function init() {
    gridContainer.innerHTML = '';
    galleryContainer.innerHTML = '';

    products.forEach((p) => {
        const fileExt = p.type || 'png'; 
        const imagePath = `products/${p.id}.${fileExt}`;

        const gridItem = document.createElement('div');
        gridItem.className = 'item';
        gridItem.dataset.tags = JSON.stringify(p.tags);
        gridItem.innerHTML = `
            <img src="${imagePath}" alt="${p.id}">
            <div class="id-number" data-id-label="${p.id}"></div>
        `;
        gridContainer.appendChild(gridItem);

        const snapItem = document.createElement('div');
        snapItem.className = 'snap-item';
        snapItem.dataset.tags = JSON.stringify(p.tags);
        snapItem.innerHTML = `
            <img src="${imagePath}" alt="${p.id}">
            <div class="snap-label" style="margin-top:30px; letter-spacing:5px;"></div>
        `;
        galleryContainer.appendChild(snapItem);
    });
    updateNumbers();
}

function updateNumbers() {
    const visibleGridItems = Array.from(document.querySelectorAll('.item')).filter(el => el.style.display !== 'none');
    visibleGridItems.forEach((item, index) => {
        const labelDiv = item.querySelector('.id-number');
        const productId = labelDiv.getAttribute('data-id-label');
        labelDiv.innerText = `0${index + 1} — ${productId}`;
    });

    const visibleSnapItems = Array.from(document.querySelectorAll('.snap-item')).filter(el => el.style.display !== 'none');
    visibleSnapItems.forEach((item, index) => {
        const labelDiv = item.querySelector('.snap-label');
        const productId = item.querySelector('img').alt;
        labelDiv.innerText = `0${index + 1} / ${productId}`;
    });
}

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        const visibleItems = Array.from(galleryContainer.querySelectorAll('.snap-item')).filter(el => el.style.display !== 'none');
        if (visibleItems.length <= 1) return;

        const currentScroll = galleryContainer.scrollTop;
        const itemHeight = visibleItems[0].offsetHeight;
        let nextScroll = currentScroll + itemHeight;

        if (nextScroll >= galleryContainer.scrollHeight - 10) {
            nextScroll = 0;
        }

        galleryContainer.scrollTo({ top: nextScroll, behavior: 'smooth' });
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

toggleBtn.addEventListener('click', () => {
    const isGridActive = galleryContainer.classList.contains('hidden');
    if (isGridActive) {
        galleryContainer.classList.remove('hidden');
        gridContainer.classList.add('hidden');
        toggleBtn.innerText = "MODE: SCROLL";
        document.body.style.overflow = "hidden"; 
        startAutoScroll();
    } else {
        galleryContainer.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        toggleBtn.innerText = "MODE: GRID";
        document.body.style.overflow = "auto";
        stopAutoScroll();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const allItems = document.querySelectorAll('.item, .snap-item');
        allItems.forEach(item => {
            const tags = JSON.parse(item.dataset.tags);
            if (filter === 'all' || tags.includes(filter)) {
                item.style.display = 'flex';
                // RE-TRIGGER FADE: This makes items fade in when filtered
                item.style.animation = 'none';
                item.offsetHeight; // trigger reflow
                item.style.animation = 'fadeIn 0.6s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
        
        galleryContainer.scrollTop = 0;
        updateNumbers();
    });
});

init();