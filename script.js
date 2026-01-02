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
        // ===== SKILL TREE AND QUEST SYSTEM =====

    let playerStats = {
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        questsCompleted: 0,
        skillsUnlocked: 1, // Revit Basics starts unlocked
        resourcesCompleted: 0
    };

    // Load saved stats from localStorage
    function loadPlayerStats() {
        const savedStats = localStorage.getItem('roadmapPlayerStats');
        if (savedStats) {
            playerStats = JSON.parse(savedStats);
            updateStatsDisplay();
        }
    }

    // Save stats to localStorage
    function savePlayerStats() {
        localStorage.setItem('roadmapPlayerStats', JSON.stringify(playerStats));
        updateStatsDisplay();
    }

    // Update display of all stats
    function updateStatsDisplay() {
        // Update level display
        const levelElement = document.getElementById('player-level');
        if (levelElement) levelElement.textContent = playerStats.level;
        
        // Update quests completed
        const questsElement = document.getElementById('quests-completed');
        if (questsElement) questsElement.textContent = playerStats.questsCompleted;
        
        // Update resource count
        const resourceElement = document.getElementById('resource-count');
        if (resourceElement) resourceElement.textContent = playerStats.resourcesCompleted + 25;
        
        // Update skill nodes based on unlocked skills
        updateSkillNodes();
    }

    // Update skill node visuals
    function updateSkillNodes() {
        const skillNodes = document.querySelectorAll('.skill-node');
        skillNodes.forEach(node => {
            const skillId = node.getAttribute('data-skill');
            const isUnlocked = checkSkillUnlocked(skillId);
            
            if (isUnlocked) {
                node.classList.remove('locked');
                node.classList.add('unlocked');
                const status = node.querySelector('.node-status');
                if (status) status.textContent = '✅ COMPLETED';
                node.style.cursor = 'default';
            } else {
                node.classList.remove('unlocked');
                node.classList.add('locked');
                const status = node.querySelector('.node-status');
                if (status) status.textContent = '🔒 LOCKED';
                node.style.cursor = 'not-allowed';
            }
        });
    }

    // Check if a skill is unlocked
    function checkSkillUnlocked(skillId) {
        // Define skill requirements
        const skillRequirements = {
            'revit-basics': { requires: [], available: true },
            'revit-families': { requires: ['revit-basics'], available: true },
            'dynamo-basics': { requires: ['revit-families'], available: true },
            'python-basics': { requires: [], available: false }, // Unlocks Feb 2026
            'karamba-basics': { requires: [], available: false } // Unlocks April 2026
        };
        
        const skill = skillRequirements[skillId];
        if (!skill) return false;
        
        // Check if all requirements are met
        if (skill.requires.length > 0) {
            return skill.requires.every(req => 
                localStorage.getItem(`skill_${req}_completed`) === 'true'
            );
        }
        
        return skill.available;
    }

    // Complete a quest
    function completeQuest(questId) {
        // Mark quest as completed
        localStorage.setItem(`quest_${questId}_completed`, 'true');
        
        // Add XP
        playerStats.xp += getQuestXP(questId);
        playerStats.questsCompleted++;
        
        // Check for level up
        while (playerStats.xp >= playerStats.xpToNextLevel) {
            playerStats.xp -= playerStats.xpToNextLevel;
            playerStats.level++;
            playerStats.xpToNextLevel = Math.floor(playerStats.xpToNextLevel * 1.5);
            showLevelUpMessage();
        }
        
        // Check if this completes a skill
        if (questId.includes('learn') || questId.includes('practice')) {
            const skillId = questId.split('-').slice(0, -1).join('-');
            checkSkillCompletion(skillId);
        }
        
        // Save and update
        savePlayerStats();
        
        // Update quest button
        const questButton = document.querySelector(`[data-quest="${questId}"] .complete-btn`);
        if (questButton) {
            questButton.innerHTML = '<i class="fas fa-check"></i> COMPLETED';
            questButton.style.background = '#10b981';
            questButton.disabled = true;
        }
        
        // Check boss quest availability
        checkBossQuests();
        
        return false; // Prevent form submission
    }

    // Get XP reward for quest
    function getQuestXP(questId) {
        if (questId.includes('learn')) return 100;
        if (questId.includes('practice')) return 200;
        if (questId.includes('boss')) return 500;
        return 50;
    }

    // Check if a skill is completed
    function checkSkillCompletion(skillId) {
        const learnCompleted = localStorage.getItem(`quest_${skillId}-learn_completed`) === 'true';
        const practiceCompleted = localStorage.getItem(`quest_${skillId}-practice_completed`) === 'true';
        
        if (learnCompleted && practiceCompleted) {
            localStorage.setItem(`skill_${skillId}_completed`, 'true');
            playerStats.skillsUnlocked++;
            showSkillUnlockedMessage(skillId);
        }
    }

    // Show level up message
    function showLevelUpMessage() {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>🎉 LEVEL UP!</h3>
                <p>You are now Level ${playerStats.level}!</p>
                <p>New skills and quests available!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Show skill unlocked message
    function showSkillUnlockedMessage(skillId) {
        const skillNames = {
            'revit-basics': 'Revit Basics',
            'revit-families': 'Revit Families',
            'dynamo-basics': 'Dynamo Basics',
            'python-basics': 'Python Basics',
            'karamba-basics': 'Karamba3D Basics'
        };
        
        const notification = document.createElement('div');
        notification.className = 'skill-unlock-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>🔓 SKILL UNLOCKED!</h3>
                <p>${skillNames[skillId]} has been mastered!</p>
                <p>New paths are now available!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Check boss quest availability
    function checkBossQuests() {
        const bossQuests = document.querySelectorAll('.boss-quest');
        
        bossQuests.forEach(boss => {
            const requirements = boss.querySelectorAll('.req-item');
            let allComplete = true;
            
            requirements.forEach(req => {
                const skillName = req.textContent.replace('🔒 ', '').toLowerCase().replace(' ', '-');
                const isComplete = localStorage.getItem(`skill_${skillName}_completed`) === 'true';
                
                if (isComplete) {
                    req.textContent = '✅ ' + req.textContent.replace('🔒 ', '');
                    req.classList.remove('incomplete');
                } else {
                    allComplete = false;
                }
            });
            
            if (allComplete) {
                boss.classList.remove('locked');
                const status = boss.querySelector('.quest-status');
                if (status) {
                    status.textContent = '✅ READY TO ATTACK!';
                    status.style.background = '#d1fae5';
                    status.style.color = '#065f46';
                }
            }
        });
    }

    // File upload handler
    function handleFileUpload(inputId, questId) {
        const fileInput = document.getElementById(inputId);
        if (!fileInput) return;
        
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
                
                if (fileSize > 50) {
                    alert('File too large! Maximum size is 50MB.');
                    return;
                }
                
                // Store file info (in real app, would upload to server)
                localStorage.setItem(`file_${questId}_uploaded`, file.name);
                
                // Enable complete button
                const completeBtn = document.querySelector(`[data-quest="${questId}"] .complete-btn`);
                if (completeBtn) {
                    completeBtn.disabled = false;
                    completeBtn.textContent = 'Complete Quest';
                }
                
                alert(`✅ File "${file.name}" uploaded successfully!\nYou can now complete the quest.`);
            }
        });
    }

    // Resource filter functionality
    function setupResourceFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const resourceCards = document.querySelectorAll('.resource-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Show/hide resources
                resourceCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else if (card.classList.contains(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Initialize quest system
    function initQuestSystem() {
        // Load player stats
        loadPlayerStats();
        
        // Setup file upload handlers
        handleFileUpload('revit-file-upload', 'revit-families-practice');
        
        // Setup resource filters
        setupResourceFilters();
        
        // Check boss quests on load
        checkBossQuests();
        
        // Mark completed quests from localStorage
        document.querySelectorAll('.quest-card').forEach(quest => {
            const questId = quest.getAttribute('data-quest');
            if (localStorage.getItem(`quest_${questId}_completed`) === 'true') {
                const completeBtn = quest.querySelector('.complete-btn');
                if (completeBtn) {
                    completeBtn.innerHTML = '<i class="fas fa-check"></i> COMPLETED';
                    completeBtn.style.background = '#10b981';
                    completeBtn.disabled = true;
                }
            }
        });
    }

    // ===== RESOURCE LIBRARY FUNCTIONALITY =====

    // Track resource completion
    function trackResourceCompletion(resourceId, totalItems, completedItems) {
        localStorage.setItem(`resource_${resourceId}_progress`, completedItems);
        updateResourceStats();
    }

    // Update resource statistics
    function updateResourceStats() {
        // Calculate completed resources
        let completedCount = 0;
        let totalHours = 0;
        let projectsUploaded = 0;
        
        // Check each resource type
        const resources = [
            { id: 'bimscape', type: 'video', hours: 6, total: 24 },
            { id: 'python-book', type: 'book', hours: 20, total: 20 },
            // Add more resources as needed
        ];
        
        resources.forEach(resource => {
            const progress = parseInt(localStorage.getItem(`resource_${resource.id}_progress`) || '0');
            if (progress >= resource.total) {
                completedCount++;
                totalHours += resource.hours;
            }
        });
        
        // Count uploaded projects
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('file_') && key.endsWith('_uploaded')) {
                projectsUploaded++;
            }
        }
        
        // Update display
        const resourcesCompleted = document.getElementById('resources-completed');
        const hoursSpent = document.getElementById('hours-spent');
        const projectsUploadedElem = document.getElementById('projects-uploaded');
        const skillsMastered = document.getElementById('skills-mastered');
        
        if (resourcesCompleted) resourcesCompleted.textContent = completedCount;
        if (hoursSpent) hoursSpent.textContent = totalHours;
        if (projectsUploadedElem) projectsUploadedElem.textContent = projectsUploaded;
        if (skillsMastered) skillsMastered.textContent = playerStats.skillsUnlocked;
        
        // Update resource count in header
        const resourceCount = document.getElementById('resource-count');
        if (resourceCount) resourceCount.textContent = 25 + completedCount;
    }

    // SA Market Info Modal
    function showSAMarketInfo() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('sa-market-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'sa-market-modal';
            modal.className = 'sa-market-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🇿🇦 SA Computational Design Market</h3>
                        <button class="modal-close" onclick="closeModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <h4>Top Firms Using Computational Design:</h4>
                        <ul>
                            <li><strong>DHK Architects</strong> - Extensive Grasshopper use, environmental analysis</li>
                            <li><strong>Paragon Architects (CT)</strong> - Parametric design, complex geometry</li>
                            <li><strong>MMA Architects</strong> - BIM integration, computational workflows</li>
                            <li><strong>SAOTA (CT)</strong> - High-end rendering, parametric modeling</li>
                            <li><strong>Counterspace (JHB)</strong> - Experimental, research-driven</li>
                        </ul>
                        
                        <h4>Engineering Firms with Computational Teams:</h4>
                        <ul>
                            <li><strong>Arup SA</strong> - Advanced modeling, structural optimization</li>
                            <li><strong>Aurecon</strong> - Digital engineering, BIM coordination</li>
                            <li><strong>WSP</strong> - Computational design specialists</li>
                            <li><strong>Royal HaskoningDHV</strong> - Environmental simulations</li>
                        </ul>
                        
                        <h4>Salary Ranges (2026 estimates):</h4>
                        <ul>
                            <li>Junior Computational Designer: R280k - R420k</li>
                            <li>Computational Designer (2-3 yrs): R400k - R600k</li>
                            <li>Senior Computational Designer: R550k - R800k</li>
                            <li>Principal/Lead: R750k - R1.2M+</li>
                        </ul>
                        
                        <h4>Most In-Demand Skills:</h4>
                        <ol>
                            <li>Revit + Dynamo (85% of job postings)</li>
                            <li>Grasshopper (60% of computational roles)</li>
                            <li>Python scripting (40% and growing)</li>
                            <li>Environmental analysis tools (Ladybug, etc.)</li>
                            <li>BIM coordination/management</li>
                        </ol>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
    }

    // Research Papers Modal
    function showResearchPapers() {
        const modal = document.createElement('div');
        modal.className = 'sa-market-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📄 Essential Research Papers</h3>
                    <button class="modal-close" onclick="closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <h4>Must-Read Papers for MSc Applications:</h4>
                    
                    <div class="paper-category">
                        <h5>Computational Design Theory:</h5>
                        <ul>
                            <li><a href="https://doi.org/10.1016/j.autcon.2019.102844" target="_blank">"Generative design in architecture" - Shiffman et al.</a></li>
                            <li><a href="https://doi.org/10.1080/00038628.2020.1759186" target="_blank">"Algorithmic architecture" - Terzidis</a></li>
                            <li><a href="https://doi.org/10.1016/j.aei.2021.101337" target="_blank">"Machine learning in architectural design" - Newton</a></li>
                        </ul>
                    </div>
                    
                    <div class="paper-category">
                        <h5>Structural Optimization:</h5>
                        <ul>
                            <li><a href="https://doi.org/10.1007/s00158-018-2031-2" target="_blank">"Topology optimization for architectural design" - Aage et al.</a></li>
                            <li><a href="https://doi.org/10.1016/j.engstruct.2018.11.001" target="_blank">"Structural optimization for additive manufacturing" - Wu et al.</a></li>
                        </ul>
                    </div>
                    
                    <div class="paper-category">
                        <h5>SA Context Research:</h5>
                        <ul>
                            <li><a href="https://www.saia.org.za/wp-content/uploads/2023/05/SA-Comp-Design-Landscape.pdf" target="_blank">"SA Computational Design Landscape" - SAIA Report</a></li>
                            <li><a href="https://www.researchgate.net/publication/356789789_Computational_design_in_South_African_architecture" target="_blank">"Computational Design in SA Architecture" - Wits University</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Close modal function
    function closeModal() {
        const modals = document.querySelectorAll('.sa-market-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
    .level-up-notification, .skill-unlock-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.5s ease forwards;
        max-width: 300px;
    }

    .skill-unlock-notification {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .notification-content h3 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }

    .notification-content p {
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    `;

    document.head.appendChild(notificationStyles);

    // Initialize quest system when page loads
    initQuestSystem();
    updateResourceStats();
});