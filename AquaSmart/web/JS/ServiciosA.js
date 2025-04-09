        AOS.init();
        
        // Año actual en el footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Función para mover el carrusel
        function moveCarousel(direction) {
            const carousel = document.getElementById('cardsCarousel');
            const slides = document.querySelectorAll('.carousel-slide');
            const slideWidth = slides[0].offsetWidth + 15; // +15 por el gap
            const scrollAmount = slideWidth * 3 * direction;
            
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Ocultar/mostrar botones según la posición del scroll
        document.getElementById('cardsCarousel').addEventListener('scroll', function() {
            const carousel = this;
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            
            prevBtn.style.display = carousel.scrollLeft <= 10 ? 'none' : 'flex';
            nextBtn.style.display = carousel.scrollWidth <= carousel.scrollLeft + carousel.clientWidth + 10 ? 'none' : 'flex';
        });
        
        // Ajustar el carrusel al cargar y redimensionar
        function adjustCarousel() {
            const carousel = document.getElementById('cardsCarousel');
            const slides = document.querySelectorAll('.carousel-slide');
            const containerWidth = document.querySelector('.carousel-container').offsetWidth;
            const visibleSlides = window.innerWidth < 768 ? (window.innerWidth < 576 ? 1 : 2) : 3;
            const slideWidth = (containerWidth - 60) / visibleSlides; // 60 = padding (30px cada lado)
            
            slides.forEach(slide => {
                slide.style.flex = `0 0 ${slideWidth}px`;
            });
            
            // Mostrar/ocultar botones según sea necesario
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            
            prevBtn.style.display = 'none'; // Ocultar al inicio
            nextBtn.style.display = carousel.scrollWidth > carousel.clientWidth ? 'flex' : 'none';
        }
        
        window.addEventListener('load', adjustCarousel);
        window.addEventListener('resize', adjustCarousel);
        
