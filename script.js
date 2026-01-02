// ===== ROADMAP APP - COMPLETE FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== STATE MANAGEMENT =====
    const appState = {
        currentSection: 'starting-point',
        player: {
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            questsCompleted: 0,
            resourcesCompleted: 0,
            projectsUploaded: 0
        },
        skills: {
            revit: 75,
            grasshopper: 25,
            python: 10
        },
        quests: {
            'revit-families-learn': false,
            'revit-families-practice': false,
            'january-boss': false
        }
    };

    // ===== INITIALIZE APP =====
    initApp();

    function initApp() {
        loadState();
        initNavigation();
        initSidebar();
        initQuestSystem();
        initDarkMode();
        initPrintButton();
        initSkillTree();
        initResourceFilters();
        updateAllDisplays();
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('Welcome to your Computational Design Roadmap! 🚀', 'info');
        }, 1000);
    }

    // ===== STATE MANAGEMENT =====
    function loadState() {
        const savedState = localStorage.getItem('roadmapState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            Object.assign(appState.player, parsed.player || {});
            Object.assign(appState.quests, parsed.quests || {});
            appState.currentSection = parsed.currentSection || 'starting-point';
        }
    }

    function saveState() {
        localStorage.setItem('roadmapState', JSON.stringify({
            player: appState.player,
            quests: appState.quests,
            currentSection: appState.currentSection
        }));
    }

    // ===== NAVIGATION SYSTEM =====
    function initNavigation() {
        // Top navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                navigateToSection(sectionId, this);
            });
        });

        // Sidebar navigation
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.dataset.section;
                navigateToSection(sectionId, this);
            });
        });

        // Set initial active section
        navigateToSection(appState.currentSection);
    }

    function navigateToSection(sectionId, clickedElement = null) {
        // Update current section
        appState.currentSection = sectionId;
        
        // Update navigation highlights
        document.querySelectorAll('.nav-item, .sidebar-nav li').forEach(item => {
            item.classList.remove('active');
        });
        
        if (clickedElement) {
            clickedElement.classList.add('active');
        } else {
            // Find and activate corresponding nav items
            document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(item => {
                item.classList.add('active');
            });
        }
        
        // Show/hide sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update progress bar
        updateProgressBar();
        
        // Save state
        saveState();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    // ===== SIDEBAR =====
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const sidebarClose = document.getElementById('sidebar-close');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.add('active');
            });
        }

        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 1024 && 
                sidebar.classList.contains('active') &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    // ===== QUEST SYSTEM =====
    function initQuestSystem() {
        // Complete quest buttons
        document.querySelectorAll('.btn-complete').forEach(button => {
            button.addEventListener('click', function() {
                const questId = this.dataset.quest;
                if (questId && !this.disabled) {
                    completeQuest(questId, this);
                }
            });
        });

        // Upload buttons
        document.querySelectorAll('.btn-upload').forEach(button => {
            button.addEventListener('click', function() {
                const questId = this.dataset.quest;
                simulateFileUpload(questId);
            });
        });

        // Load quest progress
        updateQuestProgress();
    }

    function completeQuest(questId, button) {
        // Mark as completed
        appState.quests[questId] = true;
        appState.player.questsCompleted++;
        
        // Add XP based on quest type
        if (questId.includes('learn')) {
            appState.player.xp += 100;
        } else if (questId.includes('practice')) {
            appState.player.xp += 200;
        } else if (questId.includes('boss')) {
            appState.player.xp += 500;
        }
        
        // Check for level up
        checkLevelUp();
        
        // Update button
        button.innerHTML = '<i class="fas fa-check"></i> COMPLETED';
        button.style.background = '#10b981';
        button.disabled = true;
        
        // Update displays
        updateAllDisplays();
        saveState();
        
        // Show notification
        showNotification(`Quest completed! +${questId.includes('boss') ? '500' : questId.includes('practice') ? '200' : '100'} XP`, 'success');
        
        // Check skill unlocks
        checkSkillUnlocks();
    }

    function simulateFileUpload(questId) {
        const completeButton = document.querySelector(`.btn-complete[data-quest="${questId}"]`);
        if (completeButton) {
            completeButton.disabled = false;
            completeButton.innerHTML = '<i class="fas fa-check"></i> Complete Quest';
            showNotification('File uploaded successfully! You can now complete the quest.', 'success');
            appState.player.projectsUploaded++;
            updateAllDisplays();
        }
    }

    function updateQuestProgress() {
        // Update quests completed display
        const questsCompletedEl = document.getElementById('quests-completed');
        if (questsCompletedEl) {
            questsCompletedEl.textContent = appState.player.questsCompleted;
        }
        
        // Mark completed quests
        Object.keys(appState.quests).forEach(questId => {
            if (appState.quests[questId]) {
                const button = document.querySelector(`.btn-complete[data-quest="${questId}"]`);
                if (button) {
                    button.innerHTML = '<i class="fas fa-check"></i> COMPLETED';
                    button.style.background = '#10b981';
                    button.disabled = true;
                }
                
                // Enable upload button if practice quest is complete
                if (questId.includes('practice')) {
                    const uploadButton = document.querySelector(`.btn-upload[data-quest="${questId}"]`);
                    if (uploadButton) {
                        uploadButton.disabled = true;
                        uploadButton.style.opacity = '0.5';
                    }
                }
            }
        });
        
        // Update boss quest status
        updateBossQuestStatus();
    }

    function updateBossQuestStatus() {
        const learnComplete = appState.quests['revit-families-learn'];
        const practiceComplete = appState.quests['revit-families-practice'];
        
        if (learnComplete && practiceComplete) {
            const bossQuest = document.querySelector('[data-quest="january-boss"]');
            if (bossQuest) {
                const status = bossQuest.querySelector('.quest-status');
                if (status) {
                    status.textContent = '✅ READY TO ATTACK!';
                    status.style.background = '#d1fae5';
                    status.style.color = '#065f46';
                }
                
                // Update requirements
                const requirements = bossQuest.querySelectorAll('.requirement');
                requirements.forEach(req => {
                    if (req.textContent.includes('Revit Families')) {
                        req.textContent = '✅ Revit Families';
                    }
                });
            }
        }
    }

    // ===== SKILL TREE =====
    function initSkillTree() {
        // Skill node clicks
        document.querySelectorAll('.skill-node.unlocked').forEach(node => {
            node.addEventListener('click', function() {
                const skillName = this.querySelector('.node-title').textContent;
                showNotification(`Viewing ${skillName} details`, 'info');
            });
        });
    }

    function checkSkillUnlocks() {
        // Unlock Revit Families after 2 quests
        if (appState.player.questsCompleted >= 2) {
            const revitFamiliesNode = document.getElementById('node-revit-families');
            if (revitFamiliesNode && revitFamiliesNode.classList.contains('locked')) {
                revitFamiliesNode.classList.remove('locked');
                revitFamiliesNode.classList.add('unlocked');
                revitFamiliesNode.querySelector('.node-status').textContent = '✅ COMPLETED';
                revitFamiliesNode.querySelector('.node-requirements').textContent = 'Unlocked!';
                showNotification('🔓 New skill unlocked: Revit Families!', 'success');
            }
        }
        
        // Unlock Python Basics after 3 quests
        if (appState.player.questsCompleted >= 3) {
            const pythonNode = document.getElementById('node-python');
            if (pythonNode && pythonNode.classList.contains('locked')) {
                pythonNode.classList.remove('locked');
                pythonNode.querySelector('.node-status').textContent = '🔓 AVAILABLE';
                pythonNode.querySelector('.node-requirements').textContent = 'Complete Python quest to unlock';
                showNotification('🔓 Python Basics path unlocked!', 'success');
            }
        }
    }

    // ===== PROGRESS & LEVELS =====
    function checkLevelUp() {
        while (appState.player.xp >= appState.player.xpToNextLevel) {
            appState.player.xp -= appState.player.xpToNextLevel;
            appState.player.level++;
            appState.player.xpToNextLevel = Math.floor(appState.player.xpToNextLevel * 1.5);
            
            showNotification(`🎉 LEVEL UP! You are now Level ${appState.player.level}!`, 'level-up');
            
            // Increase skills slightly on level up
            appState.skills.revit = Math.min(100, appState.skills.revit + 2);
            appState.skills.grasshopper = Math.min(100, appState.skills.grasshopper + 5);
            appState.skills.python = Math.min(100, appState.skills.python + 8);
        }
    }

    function updateProgressBar() {
        const progressMap = {
            'starting-point': 10,
            'skill-tree': 20,
            'quest-log': 30,
            '2026': 40,
            '2027': 55,
            '2028': 70,
            '2029': 85,
            'resources': 95
        };
        
        const progressBar = document.getElementById('overall-progress');
        if (progressBar) {
            const progress = progressMap[appState.currentSection] || 10;
            progressBar.style.width = `${progress}%`;
        }
    }

    // ===== SKILL BARS =====
    function updateSkillBars() {
        // Calculate skill boosts
        const questBoost = Math.min(20, appState.player.questsCompleted * 2);
        const levelBoost = (appState.player.level - 1) * 3;
        const totalBoost = questBoost + levelBoost;
        
        // Update each skill
        Object.keys(appState.skills).forEach(skill => {
            const baseValue = appState.skills[skill];
            const boostedValue = Math.min(100, baseValue + totalBoost);
            
            const bar = document.getElementById(`skill-${skill}-bar`);
            const text = document.getElementById(`skill-${skill}`);
            
            if (bar) {
                bar.style.width = `${boostedValue}%`;
            }
            if (text) {
                text.textContent = `${Math.round(boostedValue)}%`;
            }
        });
    }

    // ===== RESOURCE LIBRARY =====
    function initResourceFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const resourceCards = document.querySelectorAll('.resource-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                // Filter resources
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

    // ===== DARK MODE =====
    function initDarkMode() {
        const darkModeSwitch = document.getElementById('dark-mode-switch');
        
        // Check saved preference
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            if (darkModeSwitch) darkModeSwitch.checked = true;
        }
        
        // Toggle dark mode
        if (darkModeSwitch) {
            darkModeSwitch.addEventListener('change', function() {
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'true');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'false');
                }
            });
        }
    }

    // ===== PRINT FUNCTIONALITY =====
    function initPrintButton() {
        const printButton = document.getElementById('print-btn');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'level-up': 'fa-trophy',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // ===== UPDATE ALL DISPLAYS =====
    function updateAllDisplays() {
        // Update player level
        const levelEl = document.getElementById('player-level');
        if (levelEl) levelEl.textContent = appState.player.level;
        
        // Update quests completed
        const questsEl = document.getElementById('quests-completed');
        if (questsEl) questsEl.textContent = appState.player.questsCompleted;
        
        // Update resource count
        const resourceCountEl = document.getElementById('resource-count');
        if (resourceCountEl) {
            resourceCountEl.textContent = 25 + appState.player.resourcesCompleted;
        }
        
        // Update skill bars
        updateSkillBars();
        
        // Update quest progress
        updateQuestProgress();
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // N for next section, P for previous section
        if (e.key === 'n' || e.key === 'ArrowRight') {
            navigateToNextSection();
        } else if (e.key === 'p' || e.key === 'ArrowLeft') {
            navigateToPreviousSection();
        } else if (e.key === 'h') {
            navigateToSection('starting-point');
        } else if (e.key === 'd') {
            // Toggle dark mode
            const switchEl = document.getElementById('dark-mode-switch');
            if (switchEl) {
                switchEl.checked = !switchEl.checked;
                switchEl.dispatchEvent(new Event('change'));
            }
        }
    });

    function navigateToNextSection() {
        const sections = ['starting-point', 'skill-tree', 'quest-log', '2026', '2027', '2028', '2029', 'resources'];
        const currentIndex = sections.indexOf(appState.currentSection);
        if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1]);
        }
    }

    function navigateToPreviousSection() {
        const sections = ['starting-point', 'skill-tree', 'quest-log', '2026', '2027', '2028', '2029', 'resources'];
        const currentIndex = sections.indexOf(appState.currentSection);
        if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1]);
        }
    }
});