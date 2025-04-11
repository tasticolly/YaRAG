document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideCounter = document.getElementById('slide-counter');

    // Variables
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Initialize counter
    updateSlideCounter();

    // Event Listeners
    prevBtn.addEventListener('click', showPreviousSlide);
    nextBtn.addEventListener('click', showNextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            showNextSlide();
        } else if (e.key === 'ArrowLeft') {
            showPreviousSlide();
        }
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swipe left
            showNextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            // Swipe right
            showPreviousSlide();
        }
    }

    // Functions
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Add active class to the current slide
        slides[index].classList.add('active');

        // Update slide counter
        updateSlideCounter();

        // Initialize animations for the current slide
        initSlideAnimations(index);
    }

    function showNextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        showSlide(currentSlideIndex);
    }

    function showPreviousSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentSlideIndex);
    }

    function updateSlideCounter() {
        slideCounter.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
    }

    function initSlideAnimations(index) {
        const currentSlide = slides[index];

        // Animate progress bars if they exist in the current slide
        const progressBars = currentSlide.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });

        // Animate chart bars if they exist in the current slide
        const chartBars = currentSlide.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            const height = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
            }, 100);
        });
    }

    // Print functionality for PowerPoint conversion
    document.addEventListener('keydown', function (e) {
        // Ctrl+P or Command+P
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            preparePrint();
        }
    });

    function preparePrint() {
        // Make all slides visible for print
        slides.forEach(slide => {
            slide.classList.add('print-visible');
        });

        // Print and then restore normal view
        window.print();

        // After printing, remove the print class and restore the current slide
        setTimeout(() => {
            slides.forEach(slide => {
                slide.classList.remove('print-visible');
            });
            showSlide(currentSlideIndex);
        }, 1000);
    }

    // Export button (if needed)
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '<i class="fas fa-download"></i>';
    exportBtn.id = 'export-btn';
    exportBtn.title = 'Export as PDF (can be imported to PowerPoint)';
    exportBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        color: #4b6cb7;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s ease;
    `;

    exportBtn.addEventListener('mouseover', function () {
        this.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    });

    exportBtn.addEventListener('mouseout', function () {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    });

    exportBtn.addEventListener('click', preparePrint);

    document.body.appendChild(exportBtn);

    // Initialize first slide animations
    initSlideAnimations(currentSlideIndex);
}); 