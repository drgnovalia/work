// 1. Inisialisasi Array & State Paginasi
let appLinks = [];
let currentPage = 1;
const itemsPerPage = 6; // Jumlah aplikasi maksimal yang tampil per halaman

// 2. DOM Elements
const linkGrid = document.getElementById('linkGrid');
const searchInput = document.getElementById('searchInput');
const categoryNav = document.getElementById('categoryNav');
const paginationNav = document.getElementById('paginationNav');
const noResults = document.getElementById('noResults');

// 3. State Variabel Filter Aktif
let currentCategory = 'all';
let searchQuery = '';

// 4. Fungsi Ambil Data dari File apps.json
async function fetchAppsData() {
    try {
        const response = await fetch('apps.json');
        if (!response.ok) throw new Error(`Gagal memuat JSON: ${response.status}`);
        appLinks = await response.json();
        renderLinks();
    } catch (error) {
        console.error('Error:', error);
        linkGrid.innerHTML = `<div class="no-results">Gagal memuat daftar aplikasi.</div>`;
    }
}

// 5. Fungsi Utama untuk Menampilkan Data Link & Paginasi
function renderLinks() {
    linkGrid.innerHTML = '';
    
    // Tahap 1: Filter data mentah berdasarkan Kategori & Pencarian
    const filteredApps = appLinks.filter(app => {
        const matchesCategory = (currentCategory === 'all' || app.category === currentCategory);
        const matchesSearch = app.name.toLowerCase().includes(searchQuery) || 
                              app.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // Tahap 2: Hitung total halaman berdasarkan data yang sudah difilter
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    
    // Antisipasi jika halaman aktif di luar jangkauan setelah filter diperketat
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = 1;
    }

    // Tampilkan pesan kosong jika tidak ada data
    if (filteredApps.length === 0) {
        noResults.classList.remove('hidden');
        paginationNav.innerHTML = ''; // Sembunyikan nomor halaman
        return;
    } else {
        noResults.classList.add('hidden');
    }

    // Tahap 3: Potong (Slice) data agar hanya tampil sesuai halaman aktif
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApps = filteredApps.slice(startIndex, endIndex);

    // Tahap 4: Gambar Kartu Aplikasi ke Layar
    paginatedApps.forEach(app => {
        const card = document.createElement('div');
        card.className = `card ${app.category}`;
        card.innerHTML = `
            <div>
                <div class="card-tags">
                    <span class="tag">${app.tag}</span>
                </div>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
            </div>
            <a href="${app.url}" target="_blank" rel="noopener noreferrer" class="card-link">Buka Link</a>
        `;
        linkGrid.appendChild(card);
    });

    // Tahap 5: Gambar Tombol Nomor Halaman
    renderPaginationControls(totalPages);
}

// 6. Fungsi untuk Membuat Tombol Nomor Halaman secara Dinamis
function renderPaginationControls(totalPages) {
    paginationNav.innerHTML = '';

    // Jika total halaman hanya 1, tidak perlu menampilkan navigasi angka
    if (totalPages <= 1) return;

    // Tombol Halaman "Sebelumnya (Prev)"
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '«';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        currentPage--;
        renderLinks();
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Otomatis gulung ke atas
    });
    paginationNav.appendChild(prevBtn);

    // Loop untuk membuat tombol angka (1, 2, 3, dst)
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderLinks();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationNav.appendChild(pageBtn);
    }

    // Tombol Halaman "Selanjutnya (Next)"
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '»';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        currentPage++;
        renderLinks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationNav.appendChild(nextBtn);
}

// 7. Event Listener Pencarian (Reset ke halaman 1 setiap mengetik)
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    currentPage = 1; 
    renderLinks();
});

// 8. Event Listener Kategori (Reset ke halaman 1 setiap ganti filter)
categoryNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        currentCategory = e.target.getAttribute('data-category');
        currentPage = 1; 
        renderLinks();
    }
});

// 9. Jalankan Aplikasi
document.addEventListener('DOMContentLoaded', fetchAppsData);
