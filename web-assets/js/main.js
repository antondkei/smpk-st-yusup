  function initSmpkSlider() {
    const heroWrapper = document.querySelector('#smpk-josh');
    if (!heroWrapper) return;

    const smpkSlides = heroWrapper.querySelectorAll('.smpk-hero-slide');
    const smpkIndicators = heroWrapper.querySelectorAll('.smpk-indicator');
    
    let smpkCurrentSlide = 0;
    let smpkSlideTimer = null;
    const smpkSlideDuration = 5000; // Durasi 5 detik

    function smpkChangeSlide(index) {
      smpkSlides.forEach(slide => slide.classList.remove('active'));
      smpkIndicators.forEach(dot => dot.classList.remove('active'));

      if (smpkSlides[index]) smpkSlides[index].classList.add('active');
      if (smpkIndicators[index]) smpkIndicators[index].classList.add('active');

      smpkCurrentSlide = index;
    }

    function smpkNextSlide() {
      let nextIndex = smpkCurrentSlide + 1;
      if (nextIndex >= smpkSlides.length) {
        nextIndex = 0;
      }
      smpkChangeSlide(nextIndex);
    }

    function smpkStartAutoPlay() {
      smpkStopAutoPlay();
      smpkSlideTimer = setInterval(smpkNextSlide, smpkSlideDuration);
    }

    function smpkStopAutoPlay() {
      if (smpkSlideTimer) {
        clearInterval(smpkSlideTimer);
      }
    }

    smpkIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (smpkCurrentSlide === index) return;
        smpkChangeSlide(index);
        smpkStartAutoPlay(); // Reset timer saat diklik user
      });
    });

    // Jalankan autoplay langsung
    smpkStartAutoPlay();
  }

  // Solusi Anti-Macet: Cek jika DOM sudah siap, jika sudah langsung eksekusi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmpkSlider);
  } else {
    initSmpkSlider();
  }

// Header Sticky Logic
   document.addEventListener('DOMContentLoaded', () => {
  const smpkHeader = document.getElementById('smpk-header');
  
  if (smpkHeader) {
    const handleScroll = () => {
      // Mengaktifkan efek sticky jika layar di-scroll lebih dari 40px
      if (window.scrollY > 40) {
        smpkHeader.classList.add('is-sticky');
      } else {
        smpkHeader.classList.remove('is-sticky');
      }
    };

    // Jalankan sekali saat halaman dimuat untuk memeriksa posisi scroll awal
    handleScroll();
    
    // Dengarkan event scroll user
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
});

// Blooger News
function smpkResizeImage(url, targetSize) {
  if (!url) return 'https://via.placeholder.com/800x600';
  if (url.includes('=')) {
    return url.split('=')[0] + '=' + targetSize;
  }
  let highResUrl = url.replace(/\/s\d+(-[a-zA-Z0-9-]+)?\//, `/${targetSize}/`);
  highResUrl = highResUrl.replace(/\/w\d+-h\d+[^/]*\//, `/${targetSize}/`);
  return highResUrl;
}

async function smpkLoadNews(){
  const container = document.getElementById('smpkNewsContainer');
  if(!container) return;

  try{
    const response = await fetch('/feeds/posts/default?alt=json&max-results=3');
    const data = await response.json();
    const posts = data.feed.entry || [];

    if(!posts.length){
      return;
    }

    let html = '';

    /* =====================================
       FEATURED POST (SISI KIRI - BESAR)
    ===================================== */
    const featured = posts[0];
    const featuredTitle = featured.title.$t;
    const featuredLink = featured.link.find(link => link.rel === 'alternate').href;
    
    // Meminta resolusi s1200 (lebar 1200px) untuk area besar
    const featuredThumb = featured.media$thumbnail 
      ? smpkResizeImage(featured.media$thumbnail.url, 's1200')
      : 'https://via.placeholder.com/1200x800';

    const featuredSummary = featured.summary
      ? featured.summary.$t.replace(/<[^>]+>/g,'').substring(0,160)
      : '';

    html += `
      <div class="smpk-news-featured">
        <article class="smpk-news-card">
          <a class="smpk-news-thumbnail" href="${featuredLink}">
            <img src="${featuredThumb}" alt="${featuredTitle}"/>
          </a>
          <div class="smpk-news-content">
            <div class="smpk-news-meta">
              <span>Berita Sekolah</span>
            </div>
            <h3>
              <a href="${featuredLink}">${featuredTitle}</a>
            </h3>
            <p>${featuredSummary}...</p>
            <a class="smpk-news-link" href="${featuredLink}">Baca Selengkapnya</a>
          </div>
        </article>
      </div>
    `;

    /* =====================================
       SIDEBAR POSTS (SISI KANAN - 2 KECIL)
    ===================================== */
    html += `<div class="smpk-news-sidebar">`;

    posts.slice(1).forEach(post => {
      const title = post.title.$t;
      const link = post.link.find(link => link.rel === 'alternate').href;
      
      // Meminta resolusi s800 (lebar 800px) untuk area sidebar
      const thumb = post.media$thumbnail
        ? smpkResizeImage(post.media$thumbnail.url, 's800')
        : 'https://via.placeholder.com/800x600';

      const summary = post.summary
        ? post.summary.$t.replace(/<[^>]+>/g,'').substring(0,90)
        : '';

      html += `
        <article class="smpk-news-card">
          <a class="smpk-news-thumbnail" href="${link}">
            <img src="${thumb}" alt="${title}"/>
          </a>
          <div class="smpk-news-content">
            <div class="smpk-news-meta">
              <span>Artikel</span>
            </div>
            <h3>
              <a href="${link}">${title}</a>
            </h3>
            <p>${summary}...</p>
            <a class="smpk-news-link" href="${link}">Baca Selengkapnya</a>
          </div>
        </article>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch(error) {
    console.error('Failed to load Blogger posts:', error);
  }
}

document.addEventListener('DOMContentLoaded', smpkLoadNews);


// Reveal Animations
  document.addEventListener("DOMContentLoaded", function() {
    // Pengaturan deteksi: elemen akan memicu animasi saat 15% bagiannya sudah terlihat di layar
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Tambahkan class is-visible untuk memicu CSS
          entry.target.classList.add("is-visible");
          
          // Hentikan observasi setelah animasi berjalan sekali agar tidak berulang-ulang mengganggu mata
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Cari semua elemen yang memiliki class reveal atau stagger-group
    const revealElements = document.querySelectorAll(".reveal, .stagger-group");
    revealElements.forEach(el => observer.observe(el));
  });

  // CInematic Reveal Animations
  document.addEventListener("DOMContentLoaded", function() {
    // Pengaturan deteksi: elemen akan memicu animasi saat 15% bagiannya sudah terlihat di layar
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Tambahkan class is-visible untuk memicu CSS
          entry.target.classList.add("is-visible");
          
          // Hentikan observasi setelah animasi berjalan sekali agar tidak berulang-ulang mengganggu mata
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Cari semua elemen yang memiliki class reveal atau stagger-group
    const revealElements = document.querySelectorAll(".cine-reveal, .cine-stagger-group");
    revealElements.forEach(el => observer.observe(el));
  });

// Mobile Menu & Dropdown Logic
document.addEventListener("DOMContentLoaded", function() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const headerNav = document.querySelector(".header-nav");
  const dropdownToggles = document.querySelectorAll(".nav-item.has-dropdown > a");

  // === FUNGSI BANTUAN: Menutup Menu & Reset Dropdown ===
  function closeMobileMenu() {
    if (mobileToggle) mobileToggle.classList.remove("is-active");
    if (headerNav) headerNav.classList.remove("is-active");
    
    // Kembalikan kemampuan scroll halaman
    document.body.style.overflow = ""; 

    // Reset/Tutup semua dropdown menu yang terbuka di mobile
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.style.maxHeight = null;
    });
    // Kembalikan putaran ikon panah ke semula
    document.querySelectorAll(".dropdown-icon").forEach(icon => {
      icon.style.transform = "rotate(0deg)";
    });
  }

  // 1. Fungsi Klik Tombol Hamburger
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener("click", function(e) {
      e.stopPropagation(); // Mencegah bentrok dengan fungsi klik area luar
      
      if (headerNav.classList.contains("is-active")) {
        // Jika menu sedang terbuka, tutup semuanya
        closeMobileMenu();
      } else {
        // Jika menu tertutup, buka menu
        this.classList.add("is-active");
        headerNav.classList.add("is-active");
        document.body.style.overflow = "hidden"; // Kunci scroll agar background tidak jalan
      }
    });
  }

  // 2. Fungsi Klik di Luar Area (Untuk Menutup Menu)
  document.addEventListener("click", function(e) {
    // Pastikan menu sedang terbuka sebelum menjalankan logika ini
    if (headerNav && headerNav.classList.contains("is-active")) {
      // Jika yang diklik BUKAN area menu dan BUKAN tombol hamburger
      if (!headerNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // 3. (Opsional & UX Cerdas) Tutup menu jika pengguna mengklik link biasa
  const regularLinks = document.querySelectorAll(".nav-item:not(.has-dropdown) > a");
  regularLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Hanya berjalan di versi mobile
      if (window.innerWidth <= 991) {
        closeMobileMenu();
      }
    });
  });

  // 4. Fungsi Klik Dropdown Mobile (Akordeon)
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", function(e) {
      // Hanya aktifkan logika akordeon ini di mode Mobile (lebar layar <= 991px)
      if (window.innerWidth <= 991) {
        e.preventDefault(); // Cegah klik link agar tidak pindah halaman
        
        const dropdownMenu = this.nextElementSibling;
        const icon = this.querySelector(".dropdown-icon");

        // Sistem Buka-Tutup Akordeon
        if (dropdownMenu.style.maxHeight) {
          // Jika terbuka, tutup dia
          dropdownMenu.style.maxHeight = null;
          if (icon) icon.style.transform = "rotate(0deg)";
        } else {
          // Jika tertutup, TUTUP DULU dropdown lain yang sedang terbuka
          document.querySelectorAll(".dropdown-menu").forEach(menu => menu.style.maxHeight = null);
          document.querySelectorAll(".dropdown-icon").forEach(ic => ic.style.transform = "rotate(0deg)");
          
          // Lalu BUKA dropdown yang sedang diklik
          dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
          if (icon) icon.style.transform = "rotate(180deg)";
        }
      }
    });
  });
});

// Tab Nav Profil SMPK
document.addEventListener('DOMContentLoaded',()=>{

  const tabs =
    document.querySelectorAll(
      '.smpk-tab-nav button'
    );

  const panels =
    document.querySelectorAll(
      '.smpk-tab-panel'
    );

  tabs.forEach(tab=>{

    tab.addEventListener('click',()=>{

      tabs.forEach(btn=>{
        btn.classList.remove('active');
      });

      panels.forEach(panel=>{
        panel.classList.remove('active');
      });

      tab.classList.add('active');

      document
        .getElementById(
          tab.dataset.tab
        )
        .classList.add('active');

    });

  });

});

// Nav Tab Profil Sekolah
    function switchTab(tabId, btn) {
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.remove('active'));

        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(b => b.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        btn.classList.add('active');
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));