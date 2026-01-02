// My Roadmap JavaScript - Makes everything interactive!

document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL STATE =====
    const playerStats = {
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        questsCompleted: 0,
        skillsUnlocked: 1,
        resourcesCompleted: 0,
        projectsUploaded: 0
    };

    // ===== INITIALIZE EVERYTHING =====
    initNavigation();
    loadPlayerStats();
    initQuestSystem();
    initSidebar();
    initDarkMode();
    initPrintButton();
    initAnimations();

    // ===== NAVIGATION SYSTEM =====
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item, .timeline-nav li');
        const contentArea = document.getElementById('content-area');
        
        // Load initial content
        loadSection('starting-point');
        
        // Add click listeners
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                setActiveNav(this);
                loadSection(sectionId);
            });
        });
    }

    function setActiveNav(activeItem) {
        // Remove active from all nav items
        document.querySelectorAll('.nav-item, .timeline-nav li').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active to clicked item
        activeItem.classList.add('active');
    }

    function loadSection(sectionId) {
        const contentArea = document.getElementById('content-area');
        
        // Hide all sections
        document.querySelectorAll('.content-area > section').forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        } else {
            // Load section content dynamically
            loadSectionContent(sectionId);
        }
        
        // Update progress bar
        updateProgressBar(sectionId);
        
        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
        }
    }

    function loadSectionContent(sectionId) {
        const contentArea = document.getElementById('content-area');
        
        // Create new section if it doesn't exist
        let section = document.getElementById(sectionId);
        if (!section) {
            section = document.createElement('section');
            section.id = sectionId;
            section.className = 'active-section';
            contentArea.appendChild(section);
        }
        
        // Load content based on section
        let content = '';
        
        switch(sectionId) {
            case 'skill-tree':
                content = getSkillTreeContent();
                break;
            case 'quest-log':
                content = getQuestLogContent();
                break;
            case '2026':
                content = getYear2026Content();
                break;
            case '2027':
                content = getYear2027Content();
                break;
            case '2028':
                content = getYear2028Content();
                break;
            case '2029':
                content = getYear2029Content();
                break;
            case 'resources':
                content = getResourceLibraryContent();
                break;
            default:
                content = '<h2>Section not found</h2>';
        }
        
        section.innerHTML = content;
        
        // Re-initialize any interactive elements in this section
        if (sectionId === 'quest-log') {
            initQuestButtons();
        }
        if (sectionId === 'resources') {
            initResourceFilters();
        }
        if (sectionId === 'skill-tree') {
            initSkillTree();
        }
    }

    // ===== PROGRESS BAR =====
    function updateProgressBar(sectionId) {
        const progressMap = {
            'starting-point': 10,
            'skill-tree': 15,
            'quest-log': 20,
            '2026': 30,
            '2027': 50,
            '2028': 70,
            '2029': 85,
            'resources': 90
        };
        
        const progress = progressMap[sectionId] || 10;
        const progressBar = document.getElementById('overall-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // ===== PLAYER STATS SYSTEM =====
    function loadPlayerStats() {
        const savedStats = localStorage.getItem('roadmapPlayerStats');
        if (savedStats) {
            Object.assign(playerStats, JSON.parse(savedStats));
            updateStatsDisplay();
        }
    }

    function savePlayerStats() {
        localStorage.setItem('roadmapPlayerStats', JSON.stringify(playerStats));
        updateStatsDisplay();
    }

    function updateStatsDisplay() {
        // Update skill percentages
        updateSkillBars();
        
        // Update quest count
        const questsElement = document.getElementById('quests-completed');
        if (questsElement) {
            questsElement.textContent = playerStats.questsCompleted;
        }
    }

    function updateSkillBars() {
        // Calculate skill percentages based on XP and completed tasks
        const xpBoost = Math.min(30, (playerStats.xp / 100));
        const questBoost = Math.min(20, playerStats.questsCompleted * 2);
        const totalBoost = xpBoost + questBoost;
        
        // Update skill bars
        const skills = {
            'revit': { base: 75, element: 'skill-revit-bar', text: 'skill-revit' },
            'grasshopper': { base: 25, element: 'skill-grasshopper-bar', text: 'skill-grasshopper' },
            'python': { base: 10, element: 'skill-python-bar', text: 'skill-python' }
        };
        
        Object.keys(skills).forEach(skill => {
            const skillData = skills[skill];
            const newPercentage = Math.min(100, skillData.base + totalBoost);
            const barElement = document.getElementById(skillData.element);
            const textElement = document.getElementById(skillData.text);
            
            if (barElement) {
                barElement.style.width = `${newPercentage}%`;
            }
            if (textElement) {
                textElement.textContent = `${Math.round(newPercentage)}%`;
            }
        });
    }

    // ===== QUEST SYSTEM =====
    function initQuestSystem() {
        initQuestButtons();
        loadQuestProgress();
    }

    function initQuestButtons() {
        // Complete quest buttons
        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const questId = this.closest('.quest-card').getAttribute('data-quest');
                completeQuest(questId);
            });
        });
        
        // Resource link buttons
        document.querySelectorAll('.resource-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.getAttribute('href') === 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') {
                    e.preventDefault();
                    // Replace Rick Roll with actual resource
                    window.open('https://www.youtube.com/@BIMscape', '_blank');
                }
            });
        });
        
        // File upload buttons
        document.querySelectorAll('.upload-btn').forEach(button => {
            button.addEventListener('click', function() {
                const questId = this.closest('.quest-card').getAttribute('data-quest');
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.rfa,.rvt,.gh,.py,.pdf';
                fileInput.style.display = 'none';
                
                fileInput.addEventListener('change', function(e) {
                    if (e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const fileName = file.name;
                        
                        // Store file info
                        localStorage.setItem(`file_${questId}_uploaded`, fileName);
                        playerStats.projectsUploaded++;
                        
                        // Enable complete button
                        const completeBtn = document.querySelector(`[data-quest="${questId}"] .complete-btn`);
                        if (completeBtn) {
                            completeBtn.disabled = false;
                            completeBtn.textContent = 'Complete Quest';
                        }
                        
                        // Show success message
                        showNotification(`✅ File "${fileName}" uploaded successfully!`, 'success');
                        savePlayerStats();
                    }
                });
                
                document.body.appendChild(fileInput);
                fileInput.click();
                document.body.removeChild(fileInput);
            });
        });
    }

    function loadQuestProgress() {
        // Mark completed quests
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

    function completeQuest(questId) {
        // Mark as completed
        localStorage.setItem(`quest_${questId}_completed`, 'true');
        
        // Add XP
        playerStats.xp += getQuestXP(questId);
        playerStats.questsCompleted++;
        
        // Check for level up
        if (playerStats.xp >= playerStats.xpToNextLevel) {
            playerStats.level++;
            playerStats.xp -= playerStats.xpToNextLevel;
            playerStats.xpToNextLevel = Math.floor(playerStats.xpToNextLevel * 1.5);
            showNotification(`🎉 LEVEL UP! You are now Level ${playerStats.level}!`, 'level-up');
        }
        
        // Update quest button
        const questCard = document.querySelector(`[data-quest="${questId}"]`);
        if (questCard) {
            const completeBtn = questCard.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.innerHTML = '<i class="fas fa-check"></i> COMPLETED';
                completeBtn.style.background = '#10b981';
                completeBtn.disabled = true;
            }
        }
        
        // Save and update
        savePlayerStats();
        updateSkillBars();
        
        // Check for skill unlocks
        checkSkillUnlocks();
        
        return false;
    }

    function getQuestXP(questId) {
        if (questId.includes('learn')) return 100;
        if (questId.includes('practice')) return 200;
        if (questId.includes('boss')) return 500;
        return 50;
    }

    function checkSkillUnlocks() {
        // Check Revit Families skill
        const learnComplete = localStorage.getItem('quest_revit-families-learn_completed') === 'true';
        const practiceComplete = localStorage.getItem('quest_revit-families-practice_completed') === 'true';
        
        if (learnComplete && practiceComplete) {
            const revitFamiliesNode = document.querySelector('[data-skill="revit-families"]');
            if (revitFamiliesNode && revitFamiliesNode.classList.contains('locked')) {
                revitFamiliesNode.classList.remove('locked');
                revitFamiliesNode.classList.add('unlocked');
                revitFamiliesNode.querySelector('.node-status').textContent = '✅ COMPLETED';
                showNotification('🔓 SKILL UNLOCKED: Revit Families!', 'skill-unlock');
            }
        }
    }

    // ===== SIDEBAR =====
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarClose = document.getElementById('sidebar-close');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.add('active');
            });
        }
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                sidebar.classList.remove('active');
            });
        }
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(event.target) && 
                    !sidebarToggle.contains(event.target) &&
                    event.target !== sidebarToggle) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ===== DARK MODE =====
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Check for saved theme
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else if (currentTheme === 'light') {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = false;
        } else if (prefersDarkScheme.matches) {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }
        
        // Toggle dark mode
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
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

    // ===== PRINT BUTTON =====
    function initPrintButton() {
        const printButton = document.getElementById('print-button');
        if (printButton) {
            printButton.addEventListener('click', function() {
                window.print();
            });
        }
    }

    // ===== ANIMATIONS =====
    function initAnimations() {
        // Animate progress bars on load
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-fill, .skill-level');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-out';
                    bar.style.width = width;
                }, 100);
            });
        }, 500);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                               type === 'level-up' ? 'fa-trophy' : 
                               type === 'skill-unlock' ? 'fa-unlock' : 
                               'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // ===== SKILL TREE =====
    function initSkillTree() {
        const skillNodes = document.querySelectorAll('.skill-node');
        skillNodes.forEach(node => {
            node.addEventListener('click', function() {
                if (!this.classList.contains('locked')) {
                    const skillName = this.querySelector('.node-title').textContent;
                    showNotification(`Viewing ${skillName} details`, 'info');
                }
            });
        });
    }

    // ===== CONTENT GENERATORS =====
    function getSkillTreeContent() {
        return `
            <div class="section-header">
                <h2 class="section-title">🌳 SKILL TREE PROGRESSION</h2>
                <div class="time-estimate">Current Level: <span id="player-level">${playerStats.level}</span></div>
            </div>
            
            <div class="skill-tree-container">
                <!-- PARAMETRIC PATH -->
                <div class="skill-path">
                    <h3 class="path-title"><i class="fas fa-project-diagram"></i> Parametric Path</h3>
                    <div class="skill-nodes">
                        <div class="skill-node unlocked" data-skill="revit-basics">
                            <div class="node-icon">📐</div>
                            <div class="node-title">Revit Basics</div>
                            <div class="node-level">Lvl 1</div>
                            <div class="node-status">✅ COMPLETED</div>
                        </div>
                        
                        <div class="skill-connector">→</div>
                        
                        <div class="skill-node ${playerStats.questsCompleted >= 2 ? 'unlocked' : 'locked'}" data-skill="revit-families">
                            <div class="node-icon">🧩</div>
                            <div class="node-title">Revit Families</div>
                            <div class="node-level">Lvl 2</div>
                            <div class="node-status">${playerStats.questsCompleted >= 2 ? '✅ COMPLETED' : '🔒 LOCKED'}</div>
                            <div class="node-requirements">Requires: Revit Basics</div>
                        </div>
                        
                        <div class="skill-connector">→</div>
                        
                        <div class="skill-node locked" data-skill="dynamo-basics">
                            <div class="node-icon">⚙️</div>
                            <div class="node-title">Dynamo Basics</div>
                            <div class="node-level">Lvl 3</div>
                            <div class="node-status">🔒 LOCKED</div>
                            <div class="node-requirements">Requires: Revit Families</div>
                        </div>
                    </div>
                </div>
                
                <!-- CODING PATH -->
                <div class="skill-path">
                    <h3 class="path-title"><i class="fas fa-code"></i> Coding Path</h3>
                    <div class="skill-nodes">
                        <div class="skill-node ${playerStats.questsCompleted >= 3 ? 'unlocked' : 'locked'}" data-skill="python-basics">
                            <div class="node-icon">🐍</div>
                            <div class="node-title">Python Basics</div>
                            <div class="node-level">Lvl 1</div>
                            <div class="node-status">${playerStats.questsCompleted >= 3 ? '✅ COMPLETED' : '🔒 LOCKED'}</div>
                            <div class="node-requirements">Complete 3 quests to unlock</div>
                        </div>
                    </div>
                </div>
                
                <!-- STRUCTURAL PATH -->
                <div class="skill-path">
                    <h3 class="path-title"><i class="fas fa-bridge"></i> Structural Path</h3>
                    <div class="skill-nodes">
                        <div class="skill-node locked" data-skill="karamba-basics">
                            <div class="node-icon">🏗️</div>
                            <div class="node-title">Karamba3D Basics</div>
                            <div class="node-level">Lvl 1</div>
                            <div class="node-status">🔒 LOCKED</div>
                            <div class="node-requirements">Unlocks April 2026</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="skill-tree-info">
                <h4><i class="fas fa-info-circle"></i> How Skill Progression Works:</h4>
                <ol>
                    <li>Complete <strong>Learning Quest</strong> (watch video/read article)</li>
                    <li>Complete <strong>Practice Quest</strong> (upload project file)</li>
                    <li>Skill unlocks → Next skill becomes available</li>
                    <li>Unlock all skills in a path to access <strong>BOSS PROJECT</strong></li>
                </ol>
            </div>
        `;
    }

    function getQuestLogContent() {
        return `
            <div class="section-header">
                <h2 class="section-title">📜 ACTIVE QUESTS</h2>
                <div class="time-estimate">Quests Completed: <span id="quests-completed">${playerStats.questsCompleted}</span>/50</div>
            </div>
            
            <div class="quest-categories">
                <!-- LEARNING QUESTS -->
                <div class="quest-category">
                    <h3 class="category-title"><i class="fas fa-graduation-cap"></i> Learning Quests</h3>
                    <div class="quest-list">
                        <div class="quest-card learning-quest" data-quest="revit-families-learn">
                            <div class="quest-header">
                                <div class="quest-title">📚 Learn: Advanced Revit Families</div>
                                <div class="quest-reward">+100 XP</div>
                            </div>
                            <div class="quest-desc">
                                <p><strong>Resource:</strong> BIMscape YouTube - "Revit Families Masterclass"</p>
                                <p><strong>Task:</strong> Watch all 6 videos (total 2.5 hours)</p>
                            </div>
                            <div class="quest-actions">
                                <a href="https://www.youtube.com/@BIMscape" target="_blank" class="quest-button resource-btn">
                                    <i class="fas fa-external-link-alt"></i> Open Resource
                                </a>
                                <button class="quest-button complete-btn" onclick="document.querySelector('[data-quest=\\"revit-families-learn\\"] .complete-btn').click()">
                                    <i class="fas fa-check"></i> Mark as Watched
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- PRACTICE QUESTS -->
                <div class="quest-category">
                    <h3 class="category-title"><i class="fas fa-hammer"></i> Practice Quests</h3>
                    <div class="quest-list">
                        <div class="quest-card practice-quest" data-quest="revit-families-practice">
                            <div class="quest-header">
                                <div class="quest-title">⚒️ Practice: Create Parametric Family</div>
                                <div class="quest-reward">+200 XP</div>
                            </div>
                            <div class="quest-desc">
                                <p><strong>Project:</strong> Create a parametric window family with:</p>
                                <ul>
                                    <li>Adjustable width/height</li>
                                    <li>Material parameters</li>
                                    <li>3 type variations</li>
                                </ul>
                            </div>
                            <div class="quest-actions">
                                <button class="quest-button upload-btn">
                                    <i class="fas fa-upload"></i> Upload .RFA File
                                </button>
                                <button class="quest-button complete-btn" disabled>
                                    <i class="fas fa-check"></i> Complete Upload First
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- BOSS QUESTS -->
                <div class="quest-category">
                    <h3 class="category-title"><i class="fas fa-dragon"></i> Boss Quests (Portfolio Projects)</h3>
                    <div class="quest-list">
                        <div class="quest-card boss-quest ${playerStats.questsCompleted >= 2 ? '' : 'locked'}" data-quest="january-boss">
                            <div class="quest-header">
                                <div class="quest-title">🏆 BOSS: Parametric Facade System</div>
                                <div class="quest-reward">+500 XP</div>
                            </div>
                            <div class="quest-desc">
                                <p><strong>Requirements:</strong> Complete all January skill quests first</p>
                                <div class="requirements-list">
                                    <span class="req-item ${playerStats.questsCompleted >= 2 ? 'complete' : 'incomplete'}">
                                        ${playerStats.questsCompleted >= 2 ? '✅' : '🔒'} Revit Families
                                    </span>
                                    <span class="req-item incomplete">🔒 Dynamo Basics</span>
                                </div>
                            </div>
                            ${playerStats.questsCompleted >= 2 ? 
                                '<div class="quest-status">✅ READY TO ATTACK!</div>' : 
                                '<div class="quest-status">🔒 LOCKED - Complete prerequisites</div>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function getResourceLibraryContent() {
        return `
            <div class="section-header">
                <h2 class="section-title">📚 RESOURCE LIBRARY</h2>
                <div class="time-estimate">Total Resources: <span id="resource-count">25</span></div>
            </div>
            
            <div class="resource-filters">
                <button class="filter-btn active" data-filter="all">All Resources</button>
                <button class="filter-btn" data-filter="video">🎥 Videos</button>
                <button class="filter-btn" data-filter="book">📚 Books</button>
                <button class="filter-btn" data-filter="course">🎓 Courses</button>
                <button class="filter-btn" data-filter="free">🆓 Free</button>
                <button class="filter-btn" data-filter="paid">💰 Paid</button>
                <button class="filter-btn" data-filter="sa">🇿🇦 SA Focus</button>
            </div>
            
            <div class="resources-grid">
                <!-- REVIT RESOURCES -->
                <div class="resource-card video free sa" data-skill="revit">
                    <div class="resource-type">🎥 Video Series | 🇿🇦 SA</div>
                    <div class="resource-title">BIMscape YouTube - Revit Families Masterclass</div>
                    <div class="resource-desc">SA-based comprehensive guide to parametric families in Revit (24 videos)</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-clock"></i> 6 hours</span>
                        <span><i class="fas fa-globe"></i> SA-Based</span>
                        <span><i class="fas fa-tag"></i> Revit</span>
                    </div>
                    <a href="https://www.youtube.com/@BIMscape" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> Watch Series
                    </a>
                    <div class="resource-progress">
                        <div class="progress-label">Watched: <span id="bimscape-progress">0</span>/24 videos</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
                
                <!-- PYTHON RESOURCES -->
                <div class="resource-card book free" data-skill="python">
                    <div class="resource-type">📚 Free Book</div>
                    <div class="resource-title">Automate the Boring Stuff with Python</div>
                    <div class="resource-desc">Practical Python programming for beginners (free online)</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-book"></i> 20 chapters</span>
                        <span><i class="fas fa-download"></i> Free PDF</span>
                        <span><i class="fas fa-tag"></i> Python</span>
                    </div>
                    <a href="https://automatetheboringstuff.com" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> Read Online
                    </a>
                </div>
                
                <!-- GRASSHOPPER RESOURCES -->
                <div class="resource-card course paid" data-skill="grasshopper">
                    <div class="resource-type">🎓 Course Bundle</div>
                    <div class="resource-title">Parametric House - Grasshopper Mastery</div>
                    <div class="resource-desc">From beginner to advanced parametric design (5 courses)</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-rand"></i> R850</span>
                        <span><i class="fas fa-certificate"></i> Certificate</span>
                        <span><i class="fas fa-tag"></i> Grasshopper</span>
                    </div>
                    <a href="https://parametrichouse.com/courses" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> View Course
                    </a>
                </div>
                
                <!-- KARAMBA RESOURCES -->
                <div class="resource-card course paid" data-skill="karamba">
                    <div class="resource-type">🎓 Certification</div>
                    <div class="resource-title">Karamba3D Certification Course</div>
                    <div class="resource-desc">Structural analysis and optimization in Grasshopper</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-euro-sign"></i> €150 (≈R3,000)</span>
                        <span><i class="fas fa-award"></i> Industry Cert</span>
                        <span><i class="fas fa-tag"></i> Karamba3D</span>
                    </div>
                    <a href="https://www.karamba3d.com/training" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> Get Certified
                    </a>
                </div>
                
                <!-- DYNAMO RESOURCES -->
                <div class="resource-card video free" data-skill="dynamo">
                    <div class="resource-type">🎥 Video Tutorials</div>
                    <div class="resource-title">Dynamo Primer - Official Tutorials</div>
                    <div class="resource-desc">Official Dynamo learning resource with examples</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-clock"></i> 4 hours</span>
                        <span><i class="fas fa-book"></i> Interactive</span>
                        <span><i class="fas fa-tag"></i> Dynamo</span>
                    </div>
                    <a href="https://primer.dynamobim.org" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> Start Learning
                    </a>
                </div>
                
                <!-- COMPUTATIONAL DESIGN BOOK -->
                <div class="resource-card book paid" data-skill="theory">
                    <div class="resource-type">📚 Essential Book</div>
                    <div class="resource-title">Algorithms-Aided Design by Arturo Tedeschi</div>
                    <div class="resource-desc">The comprehensive guide to parametric design (R650)</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-book"></i> 400 pages</span>
                        <span><i class="fas fa-rand"></i> R650</span>
                        <span><i class="fas fa-tag"></i> Theory</span>
                    </div>
                    <a href="https://www.arturotedeschi.com" target="_blank" class="resource-link">
                        <i class="fas fa-external-link-alt"></i> Buy Book
                    </a>
                </div>
                
                <!-- SA MARKET INSIGHTS -->
                <div class="resource-card sa free" data-skill="sa-market">
                    <div class="resource-type">🇿🇦 Market Insights</div>
                    <div class="resource-title">SA Computational Design Market Report</div>
                    <div class="resource-desc">Which SA firms use computational design and what they look for</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-building"></i> Local Focus</span>
                        <span><i class="fas fa-chart-bar"></i> Industry Data</span>
                        <span><i class="fas fa-tag"></i> Career</span>
                    </div>
                    <button class="resource-link" onclick="showNotification('Market insights loaded! Check the SA Market section for details.', 'info')">
                        <i class="fas fa-eye"></i> View Insights
                    </button>
                </div>
                
                <!-- RESEARCH PAPERS -->
                <div class="resource-card free" data-skill="research">
                    <div class="resource-type">📄 Research Papers</div>
                    <div class="resource-title">Key Computational Design Papers</div>
                    <div class="resource-desc">Essential academic papers from Bartlett, MIT, ETH</div>
                    <div class="resource-meta">
                        <span><i class="fas fa-file-pdf"></i> PDF Collection</span>
                        <span><i class="fas fa-graduation-cap"></i> Academic</span>
                        <span><i class="fas fa-tag"></i> Research</span>
                    </div>
                    <button class="resource-link" onclick="showNotification('Research papers loaded! Check the academic resources section.', 'info')">
                        <i class="fas fa-download"></i> Download Pack
                    </button>
                </div>
            </div>
            
            <div class="resource-stats">
                <h3 class="section-subtitle">Your Learning Progress:</h3>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-number" id="resources-completed">${playerStats.resourcesCompleted}</div>
                        <div class="stat-label">Resources Completed</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" id="hours-spent">${Math.floor(playerStats.xp / 10)}</div>
                        <div class="stat-label">Hours Spent Learning</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" id="skills-mastered">${playerStats.skillsUnlocked}</div>
                        <div class="stat-label">Skills Mastered</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" id="projects-uploaded">${playerStats.projectsUploaded}</div>
                        <div class="stat-label">Projects Uploaded</div>
                    </div>
                </div>
            </div>
        `;
    }

    function getYear2026Content() {
        return `
            <div class="section-header">
                <h2 class="section-title">🎯 2026 - FOUNDATION YEAR</h2>
                <div class="time-estimate">Focus: Building Core Computational Skills</div>
            </div>
            
            <div class="year-overview">
                <div class="year-stats">
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Months of Learning</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">40+</div>
                        <div class="stat-label">Skills to Master</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">10</div>
                        <div class="stat-label">Portfolio Projects</div>
                    </div>
                </div>
                
                <h3 class="section-subtitle">2026 Monthly Focus:</h3>
                <div class="timeline-tracker">
                    <div class="timeline-phase current">
                        <div class="phase-icon">📅</div>
                        <div class="phase-info">
                            <div class="phase-title">Jan 2026: Advanced Revit + Dynamo</div>
                            <div class="phase-desc">Parametric families, Revit automation</div>
                        </div>
                    </div>
                    <div class="timeline-phase">
                        <div class="phase-icon">🐍</div>
                        <div class="phase-info">
                            <div class="phase-title">Feb 2026: Python Programming</div>
                            <div class="phase-desc">Coding fundamentals for design</div>
                        </div>
                    </div>
                    <div class="timeline-phase">
                        <div class="phase-icon">🌿</div>
                        <div class="phase-info">
                            <div class="phase-title">Mar 2026: Grasshopper Mastery</div>
                            <div class="phase-desc">Parametric modeling in Rhino</div>
                        </div>
                    </div>
                </div>
                
                <div class="advantage-box">
                    <h3><i class="fas fa-lightbulb"></i> 2026 Key Objectives:</h3>
                    <ul>
                        <li>Master parametric modeling in Revit and Rhino</li>
                        <li>Learn Python programming for automation</li>
                        <li>Build first computational design portfolio</li>
                        <li>Secure vacation work/internship</li>
                        <li>Establish professional online presence</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function getYear2027Content() {
        return `
            <div class="section-header">
                <h2 class="section-title">🔥 2027 - CORE MASTERY (YEAR 3)</h2>
                <div class="time-estimate">Focus: Advanced Tools + Research</div>
            </div>
            
            <div class="year-overview">
                <div class="year-stats">
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Major Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">4</div>
                        <div class="stat-label">Research Papers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">1</div>
                        <div class="stat-label">International Internship</div>
                    </div>
                </div>
                
                <h3 class="section-subtitle">2027 Skill Paths:</h3>
                <div class="skill-paths-grid">
                    <div class="path-card">
                        <h4><i class="fas fa-robot"></i> Robotic Fabrication</h4>
                        <ul>
                            <li>KUKA|prc programming</li>
                            <li>Toolpath optimization</li>
                            <li>Material systems</li>
                        </ul>
                    </div>
                    <div class="path-card">
                        <h4><i class="fas fa-brain"></i> Machine Learning</h4>
                        <ul>
                            <li>Python ML libraries</li>
                            <li>Dataset creation</li>
                            <li>Generative design</li>
                        </ul>
                    </div>
                    <div class="path-card">
                        <h4><i class="fas fa-gamepad"></i> Real-Time Visualization</h4>
                        <ul>
                            <li>Unreal Engine for Arch</li>
                            <li>VR/AR development</li>
                            <li>Interactive configurators</li>
                        </ul>
                    </div>
                </div>
                
                <h3 class="section-subtitle">2027 Boss Projects:</h3>
                <div class="boss-projects">
                    <div class="boss-card">
                        <div class="boss-icon">🤖</div>
                        <div class="boss-info">
                            <div class="boss-title">Robotic Timber Pavilion</div>
                            <div class="boss-desc">Full design-to-fabrication workflow with robotic assembly</div>
                        </div>
                        <div class="boss-status">🔒 Unlocks Q3 2027</div>
                    </div>
                    <div class="boss-card">
                        <div class="boss-icon">🧠</div>
                        <div class="boss-info">
                            <div class="boss-title">AI-Driven Urban Generator</div>
                            <div class="boss-desc">ML algorithm for sustainable neighborhood layouts</div>
                        </div>
                        <div class="boss-status">🔒 Unlocks Q4 2027</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Add similar functions for other years...
    function getYear2028Content() {
        return `<div class="section-header"><h2>🚀 2028 - Coming Soon!</h2><p>Content will be added as you progress.</p></div>`;
    }
    
    function getYear2029Content() {
        return `<div class="section-header"><h2>🎓 2029 - Coming Soon!</h2><p>Content will be added as you progress.</p></div>`;
    }

    // Make functions available globally for inline onclick handlers
    window.completeQuest = function(questId) {
        const event = new Event('click');
        const button = document.querySelector(`[data-quest="${questId}"] .complete-btn`);
        if (button) button.dispatchEvent(event);
    };
});