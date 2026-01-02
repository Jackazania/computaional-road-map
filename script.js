// My Roadmap JavaScript - Makes everything interactive!

document.addEventListener('DOMContentLoaded', function() {
    // ===== MAKE NAVIGATION WORK =====
    const navItems = document.querySelectorAll('.nav-item, .timeline-nav li');
    const contentSections = document.querySelectorAll('.content-area > section');
    const progressBar = document.getElementById('overall-progress');
    
    // Start with "My Starting Point" section
    setActiveSection('starting-point');
    
    // When I click a navigation item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            setActiveSection(sectionId);
        });
    });
    
    function setActiveSection(sectionId) {
        // Remove active from all
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active to clicked one
        navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
        
        // Hide all sections
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show clicked section
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
        
        // Update progress bar
        updateProgressBar(sectionId);
    }
    
    function updateProgressBar(sectionId) {
        // How far along am I?
        const progressMap = {
            'starting-point': 10,
            'january': 20,
            'february': 30,
            'march': 40,
            'april': 50,
            'may': 60
        };
        
        const progress = progressMap[sectionId] || 10;
        progressBar.style.width = `${progress}%`;
    }
    
    // ===== MAKE CHECKBOXES SAVE =====
    const checkboxes = document.querySelectorAll('.task-checkbox input');
    
    checkboxes.forEach(checkbox => {
        // Load saved state
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
            updateTaskStyle(checkbox);
        }
        
        // Save when changed
        checkbox.addEventListener('change', function() {
            updateTaskStyle(this);
            localStorage.setItem(this.id, this.checked);
            updateSkillBars();
        });
    });
    
    function updateTaskStyle(checkbox) {
        const taskCard = checkbox.closest('.task-card');
        if (checkbox.checked) {
            taskCard.style.opacity = '0.7';
            taskCard.style.backgroundColor = '#f0fdf4';
        } else {
            taskCard.style.opacity = '1';
            taskCard.style.backgroundColor = '';
        }
    }
    
    // ===== UPDATE SKILL BARS =====
    function updateSkillBars() {
        const completedTasks = document.querySelectorAll('.task-checkbox input:checked').length;
        const totalTasks = document.querySelectorAll('.task-checkbox input').length;
        
        if (totalTasks > 0) {
            const completionRate = (completedTasks / totalTasks) * 30; // Max 30% boost
            
            // Update each skill
            const skillBars = document.querySelectorAll('.skill-level');
            const baseValues = [75, 25, 10];
            
            skillBars.forEach((bar, index) => {
                const newWidth = Math.min(100, baseValues[index] + completionRate);
                bar.style.width = `${newWidth}%`;
                
                // Update percentage text
                const percentageSpan = bar.parentElement.previousElementSibling.querySelector('span:last-child');
                if (percentageSpan) {
                    percentageSpan.textContent = `${Math.round(newWidth)}%`;
                }
            });
        }
    }
    
    // Initialize skill bars
    updateSkillBars();
    
    // ===== PRINT BUTTON =====
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Right arrow or N = Next section
        if (e.key === 'ArrowRight' || e.key === 'n') {
            const currentActive = document.querySelector('.nav-item.active');
            const nextItem = currentActive.nextElementSibling;
            if (nextItem && nextItem.classList.contains('nav-item')) {
                nextItem.click();
            }
        }
        
        // Left arrow or P = Previous section
        if (e.key === 'ArrowLeft' || e.key === 'p') {
            const currentActive = document.querySelector('.nav-item.active');
            const prevItem = currentActive.previousElementSibling;
            if (prevItem && prevItem.classList.contains('nav-item')) {
                prevItem.click();
            }
        }
        
        // H = Home
        if (e.key === 'h') {
            setActiveSection('starting-point');
        }
        
        // ? = Help
        if (e.key === '?') {
            alert('Keyboard Shortcuts:\n→ or N = Next section\n← or P = Previous section\nH = Home\n? = This help');
        }
    });
    
    // ===== ANIMATIONS =====
    setTimeout(() => {
        const cards = document.querySelectorAll('.task-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
});