// EmailJS Configuration
// INSTRUCTIONS: Replace these placeholder values with your actual EmailJS credentials
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create a service (e.g., Gmail, Outlook) and get the service ID
// 3. Create an email template with template ID "contato"
// 4. Get your public key from the EmailJS dashboard
// 5. Replace the values below:

const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
    serviceId: 'default_service', // Replace with your EmailJS service ID
    templateId: 'contato' // Replace with your EmailJS template ID
};

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const ctaButton = document.querySelector('.cta-button');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    // Mobile Navigation Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA Button smooth scroll to contact - FIXED
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contato');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Form validation and submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validate form fields
        if (!name || !email || !message) {
            showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Por favor, insira um email válido.', 'error');
            return;
        }
        
        // Disable submit button during sending
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_name: 'Energia Viva', // This will be used in your email template
            };
            
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );
            
            // Success
            showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
            // Reset floating labels
            const formGroups = contactForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                const label = group.querySelector('label');
                if (input && label) {
                    input.classList.remove('has-value', 'focused');
                }
            });
            
        } catch (error) {
            console.error('Error sending email:', error);
            showToast('Erro ao enviar mensagem. Verifique as configurações do EmailJS.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Toast notification function
    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        // Auto-hide toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Floating labels functionality
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        // Check if input has value on page load
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Add event listeners for focus and blur
        input.addEventListener('focus', () => {
            input.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.classList.remove('focused');
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
        
        // Add event listener for input changes
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });

    // Portfolio hover effects - ENHANCED
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const img = item.querySelector('img');
        
        if (overlay && img) {
            // Ensure images are loaded and displayed
            img.addEventListener('load', () => {
                item.style.display = 'block';
            });
            
            // If image is already loaded
            if (img.complete) {
                item.style.display = 'block';
            }
            
            item.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                img.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                img.style.transform = 'scale(1)';
            });
        }
    });

    // Ensure portfolio images are visible - ADDED
    setTimeout(() => {
        const portfolioSection = document.querySelector('#portfolio');
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const portfolioImages = document.querySelectorAll('.portfolio-item img');
        
        if (portfolioSection && portfolioGrid) {
            portfolioGrid.style.display = 'block';
            portfolioSection.style.display = 'block';
        }
        
        portfolioImages.forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }, 100);

    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .about-content, .contact-content'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Console message for developers
    console.log('%c🔌 Energia Viva - Desenvolvido com ⚡', 'color: #ffbf00; font-size: 16px; font-weight: bold;');
    console.log('%cPara configurar o EmailJS:', 'color: #0d1b2a; font-size: 14px;');
    console.log('%c1. Crie uma conta em https://www.emailjs.com/', 'color: #415a77; font-size: 12px;');
    console.log('%c2. Configure seu serviço de email', 'color: #415a77; font-size: 12px;');
    console.log('%c3. Crie um template com ID "contato"', 'color: #415a77; font-size: 12px;');
    console.log('%c4. Substitua as chaves no arquivo app.js', 'color: #415a77; font-size: 12px;');
});

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.cta-button, .submit-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cta-button, .submit-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);