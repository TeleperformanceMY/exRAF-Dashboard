// Main Application Script with Updated Logic
document.addEventListener('DOMContentLoaded', function() {
    // Application State
    const AppState = {
        currentLanguage: 'en',
        statusChart: null,
        currentReferralsData: [],
        isLoading: false,
        debugMode: false // Set to true for debugging
    };
    
    // Initialize application
    function initializeApp() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
        updateTranslations();
        setupEventListeners();
        document.getElementById('dashboard-phone').focus();
        
        // Test connection if in debug mode
        if (AppState.debugMode) {
            ApiService.testConnection();
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        document.getElementById('lang-select').addEventListener('change', handleLanguageChange);
        document.getElementById('dashboard-submit').addEventListener('click', handleFormSubmit);
        
        // Phone number validation - only numbers
        document.getElementById('dashboard-phone').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        // Delegate event handling for dynamic content
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remind-btn')) {
                handleReminderClick(e);
            }
            if (e.target.id === 'dashboard-back') {
                handleBackButton();
            }
        });
        
        // Enter key support
        document.getElementById('dashboard-form').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFormSubmit();
            }
        });
    }
    
    // Handle form submission
    async function handleFormSubmit() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        
        if (!validateInputs(phone, email)) return;
        
        setLoadingState(true);
        
        try {
            // Fetch referrals from API
            const apiData = await ApiService.fetchReferrals(phone, email);
            
            // Process and store referrals
            AppState.currentReferralsData = processReferrals(apiData);
            
            // Always show dashboard
            showReferralResults(AppState.currentReferralsData);
            
        } catch (error) {
            console.error('Error:', error);
            // Still show dashboard with empty data
            AppState.currentReferralsData = [];
            showReferralResults([]);
            showNonBlockingError(translations[AppState.currentLanguage].errorMessage);
        } finally {
            setLoadingState(false);
        }
    }
    
    // Process API response with new logic
    function processReferrals(apiData) {
        if (!Array.isArray(apiData)) return [];
        
        return apiData.map(item => {
            // Parse dates
            const parseDate = (dateStr) => {
                if (!dateStr) return new Date();
                // Handle various date formats
                if (dateStr.includes('/')) {
                    const [month, day, year] = dateStr.split(/[\/\s]/).filter(Boolean).map(Number);
                    return new Date(year, month - 1, day);
                }
                return new Date(dateStr);
            };
            
            const updatedDate = parseDate(item.UpdatedDate || item.updatedDate);
            const createdDate = parseDate(item.CreatedDate || item.createdDate);
            const daysInStage = Math.floor((new Date() - updatedDate) / (86400000));
            
            // Get status and source
            const rawStatus = (item.Status || item.status || 'Application Received').trim();
            const source = (item.Source || item.source || item.SourceName || '').toLowerCase();
            
            // Check if xRAF referral
            const isXRAF = source.includes('xraf') || source.includes('employee referral');
            
            // Get assessment result if available
            const assessment = item.assessment || null;
            
            // Map status based on new rules
            let mappedStatus = StatusMapping.mapStatusToGroup(rawStatus, assessment);
            
            // Override if not xRAF
            if (!isXRAF) {
                mappedStatus = 'Previously Applied (No Payment)';
            }
            
            const statusType = StatusMapping.getSimplifiedStatusType(rawStatus, assessment);
            const stage = StatusMapping.determineStage(rawStatus, assessment);
            
            // Check if needs reminder (only Application Received status)
            const needsAction = mappedStatus === 'Application Received' && daysInStage > 3;
            
            return {
                // IDs
                id: item.Person_system_id || item.personId || item.ID,
                personId: item.Person_system_id || item.personId || item.ID,
                
                // Contact info
                name: item.First_Name || item.name || 'Unknown',
                email: item.Email || item.email || '',
                phone: item.Employee || item.phone || '',
                
                // Status info
                status: rawStatus,
                mappedStatus: mappedStatus,
                statusType: statusType,
                stage: stage,
                
                // Source and eligibility
                source: item.Source || item.source || '',
                isXRAF: isXRAF,
                isPreviousCandidate: !isXRAF,
                
                // Assessment info
                assessment: assessment,
                hasPassedAssessment: assessment && assessment.score >= 70,
                assessmentScore: assessment ? assessment.score : null,
                assessmentDate: assessment ? assessment.date : null,
                
                // Location info
                location: item.Location || item.location || '',
                nationality: item.F_Nationality || item.nationality || '',
                
                // Dates
                createdDate: createdDate,
                updatedDate: updatedDate,
                daysInStage: daysInStage,
                
                // Action flags
                needsAction: needsAction,
                
                // Payment eligibility
                isEligibleForAssessmentPayment: isXRAF && assessment && assessment.score >= 70,
                isEligibleForProbationPayment: isXRAF && mappedStatus === 'Hired (Confirmed)',
                
                // Original data
                _original: item
            };
        });
    }
    
    // Validate form inputs
    function validateInputs(phone, email) {
        let isValid = true;
        
        if (!validatePhone(phone)) {
            showError(document.getElementById('dashboard-phone'), 
                     translations[AppState.currentLanguage].phoneError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-phone'));
        }
        
        if (!validateEmail(email)) {
            showError(document.getElementById('dashboard-email'), 
                     translations[AppState.currentLanguage].emailError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-email'));
        }
        
        return isValid;
    }
    
    function validatePhone(phone) {
        return /^01\d{8,9}$/.test(phone);
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(input, message) {
        const formControl = input.closest('.mb-3');
        const error = formControl.querySelector('.invalid-feedback');
        error.textContent = message;
        input.classList.add('is-invalid');
    }
    
    function clearError(input) {
        input.classList.remove('is-invalid');
    }
    
    // Set loading state
    function setLoadingState(isLoading) {
        const submitBtn = document.getElementById('dashboard-submit');
        submitBtn.disabled = isLoading;
        submitBtn.innerHTML = isLoading ? 
            `<span class="spinner-border spinner-border-sm me-2"></span>${translations[AppState.currentLanguage].connectingMessage}` :
            translations[AppState.currentLanguage].viewStatusBtn;
    }
    
    // Handle language change
    function handleLanguageChange(e) {
        AppState.currentLanguage = e.target.value;
        updateTranslations();
        if (document.getElementById('results-step').style.display !== 'none') {
            showReferralResults(AppState.currentReferralsData);
        }
    }
    
    // Show results dashboard
    function showReferralResults(referrals) {
        document.getElementById('auth-step').style.display = 'none';
        const resultsStep = document.getElementById('results-step');
        resultsStep.style.display = 'block';
        
        // Create results content
        resultsStep.innerHTML = createResultsContent(referrals);
        
        // Initialize dashboard components
        updateChart(referrals);
        updateEarningsTable(referrals);
        updateReminderSection(referrals);
        updateReferralList(referrals);
        updateStatusGuide();
        updateTranslations();
    }
    
    // Create results HTML with new sections
    function createResultsContent(referrals) {
        const hiredCount = referrals.filter(r => 
            r.mappedStatus === 'Hired (Confirmed)' || r.mappedStatus === 'Hired (Probation)'
        ).length;
        
        const inProgressCount = referrals.filter(r => 
            r.mappedStatus === 'Application Received' || 
            r.mappedStatus === 'Assessment Stage'
        ).length;
        
        const userName = document.getElementById('dashboard-email').value.split('@')[0];
        
        return `
            <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h3 class="user-name-display">${userName}</h3>
                    <h4 data-translate="yourReferralsTitle">Your Referrals</h4>
                </div>
                <button id="dashboard-back" class="btn btn-outline-secondary" data-translate="backBtn">
                    <i class="fas fa-arrow-left me-2"></i> Back
                </button>
            </div>
            
            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <div class="card stats-card">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="totalReferrals">Total Referrals</h5>
                            <h3 class="text-primary">${referrals.length}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card stats-card hired">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="hiredReferrals">Hired</h5>
                            <h3 class="text-success">${hiredCount}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card stats-card progress">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="inProgress">In Progress</h5>
                            <h3 class="text-warning">${inProgressCount}</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Status Distribution Chart -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="statusDistribution">Status Distribution</h5>
                    <div class="chart-container">
                        <canvas id="statusChart"></canvas>
                        <img src="TPLogo11.png" class="chart-logo" alt="TP Logo">
                    </div>
                </div>
            </div>

            <!-- Earnings Table -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="earningsTitle">Your Earnings</h5>
                    <div class="table-responsive">
                        <table class="earnings-table">
                            <thead>
                                <tr>
                                    <th data-translate="earningsStage">Stage</th>
                                    <th data-translate="earningsAmount">Amount (RM)</th>
                                    <th data-translate="earningsCount">Count</th>
                                    <th data-translate="earningsTotal">Total</th>
                                </tr>
                            </thead>
                            <tbody id="earnings-body"></tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="3" data-translate="earningsTotal">Total Earnings</th>
                                    <th id="total-earnings">RM 0</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="text-center mt-3">
                        <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#tngModal" data-translate="paymentNote">
                            Payment Terms & Conditions
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Status Guide -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-4" data-translate="statusGuideTitle">Status Guide & Payment Information</h5>
                    <div id="status-guide-content"></div>
                </div>
            </div>
            
            <!-- Reminder Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="remindFriendsTitle">Remind Your Friends</h5>
                    <p class="text-center" data-translate="remindFriendsText">Help your friends complete their assessments to join TP!</p>
                    <div id="friends-to-remind" class="row"></div>
                </div>
            </div>
            
            <!-- Referral List -->
            <div id="referral-list"></div>
            
            <!-- Social Media -->
            <div class="mt-4">
                <div class="row text-center">
                    <div class="col-md-4 mb-3">
                        <h5 data-translate="tpGlobal">TP Global</h5>
                        <div class="d-flex justify-content-center gap-3">
                            <a href="https://www.linkedin.com/company/teleperformance" class="social-icon" target="_blank"><i class="fab fa-linkedin"></i></a>
                            <a href="https://www.youtube.com/@TeleperformanceGroup" class="social-icon" target="_blank"><i class="fab fa-youtube"></i></a>
                            <a href="https://www.tiktok.com/@teleperformance_group" class="social-icon" target="_blank"><i class="fab fa-tiktok"></i></a>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5 data-translate="followMalaysia">TP Malaysia</h5>
                        <div class="d-flex justify-content-center gap-3">
                            <a href="https://www.facebook.com/TPinMalaysia/" class="social-icon" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a href="http://www.instagram.com/tp_malaysia/" class="social-icon" target="_blank"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5 data-translate="followThailand">TP Thailand</h5>
                        <div class="d-flex justify-content-center gap-3">
                            <a href="http://www.facebook.com/TPinThailand/" class="social-icon" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a href="http://www.instagram.com/tpinthailand/" class="social-icon" target="_blank"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Handle back button
    function handleBackButton() {
        document.getElementById('auth-step').style.display = 'block';
        document.getElementById('results-step').style.display = 'none';
        document.getElementById('dashboard-phone').value = '';
        document.getElementById('dashboard-email').value = '';
        document.getElementById('dashboard-phone').focus();
        AppState.currentReferralsData = [];
    }
    
    // Handle WhatsApp reminders
    function handleReminderClick(e) {
        const button = e.target.closest('.remind-btn');
        if (!button) return;
        
        const name = button.dataset.name;
        const phone = button.dataset.phone;
        if (!phone) return;
        
        // Format phone for WhatsApp
        const formattedPhone = phone.startsWith('0') ? '6' + phone : phone;
        const message = `Hi ${name}, this is a reminder to complete your TP assessment. We're excited about your application! Please complete it at your earliest convenience. If you need any help, feel free to ask me.`;
        
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }
    
    // Update status chart
    function updateChart(referrals) {
        const ctx = document.getElementById('statusChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destroy previous chart
        if (AppState.statusChart) {
            AppState.statusChart.destroy();
        }
        
        // Count statuses
        const counts = {};
        StatusMapping.displayOrder.forEach(status => {
            counts[status] = referrals.filter(r => r.mappedStatus === status).length;
        });
        
        // Chart colors
        const colors = ['#0087FF', '#00d769', '#f5d200', '#84c98b', '#5f365e', '#dc3545'];
        
        // Create new chart
        AppState.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: StatusMapping.displayOrder.map(status => 
                    translations[AppState.currentLanguage][`status${status.replace(/[\s()]/g, '')}`] || status
                ),
                datasets: [{
                    data: StatusMapping.displayOrder.map(status => counts[status] || 0),
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update earnings table with new logic
    function updateEarningsTable(referrals) {
        const earningsBody = document.getElementById('earnings-body');
        if (!earningsBody) return;
        
        // Calculate eligible candidates
        const assessmentPassed = referrals.filter(r => r.isEligibleForAssessmentPayment).length;
        const probationCompleted = referrals.filter(r => r.isEligibleForProbationPayment).length;
        
        // Calculate earnings
        const assessmentEarnings = assessmentPassed * 50;
        const probationEarnings = probationCompleted * 750;
        const totalEarnings = assessmentEarnings + probationEarnings;
        
        earningsBody.innerHTML = `
            <tr>
                <td data-translate="statusAssessmentPassed">Assessment Passed (Score ≥ 70%)</td>
                <td>RM 50</td>
                <td>${assessmentPassed}</td>
                <td>RM ${assessmentEarnings}</td>
            </tr>
            <tr>
                <td data-translate="statusProbationPassed">Probation Completed (90 days)</td>
                <td>RM 750</td>
                <td>${probationCompleted}</td>
                <td>RM ${probationEarnings}</td>
            </tr>
        `;
        
        document.getElementById('total-earnings').textContent = `RM ${totalEarnings}`;
    }
    
    // Update reminder section
    function updateReminderSection(referrals) {
        const container = document.getElementById('friends-to-remind');
        if (!container) return;
        
        // Filter friends needing reminder (Application Received status only)
        const friendsToRemind = referrals.filter(r => 
            r.mappedStatus === 'Application Received' && r.phone
        );
        
        if (friendsToRemind.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted" data-translate="noRemindersNeeded">All your friends are on track!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        friendsToRemind.forEach(friend => {
            container.innerHTML += `
                <div class="col-md-6 mb-3">
                    <div class="friend-to-remind">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5>${friend.name}</h5>
                            <span class="badge bg-${friend.statusType}">${friend.mappedStatus}</span>
                        </div>
                        <p class="small mb-1">${friend.email}</p>
                        <p class="small mb-2"><span data-translate="referralDays">Days in Stage</span>: ${friend.daysInStage}</p>
                        <button class="btn btn-primary w-100 remind-btn" 
                            data-name="${friend.name}" 
                            data-phone="${friend.phone}">
                            <i class="fab fa-whatsapp me-2"></i>
                            <span data-translate="remindBtn">Send Reminder</span>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    // Update referral list
    function updateReferralList(referrals) {
        const container = document.getElementById('referral-list');
        if (!container) return;
        
        if (referrals.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-body text-center py-5 empty-state">
                        <i class="fas fa-users empty-state-icon"></i>
                        <h4 data-translate="noReferrals">No referrals found yet</h4>
                        <p data-translate="startReferring">Start referring friends to see them appear here!</p>
                        <a href="https://tpmyandtpth.github.io/xRAF/" class="btn btn-primary mt-3">
                            <i class="fas fa-user-plus me-2"></i><span data-translate="referFriend">Refer a Friend</span>
                        </a>
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '<h5 class="mb-3">All Referrals</h5>';
        
        // Sort referrals by status order
        const sortedReferrals = [...referrals].sort((a, b) => {
            const aIndex = StatusMapping.displayOrder.indexOf(a.mappedStatus);
            const bIndex = StatusMapping.displayOrder.indexOf(b.mappedStatus);
            return aIndex - bIndex;
        });
        
        sortedReferrals.forEach(ref => {
            const assessmentInfo = ref.assessment ? 
                `<span class="assessment-score ${ref.assessmentScore < 70 ? 'low' : ''}">
                    Score: ${ref.assessmentScore}%
                </span>` : '';
            
            container.innerHTML += `
                <div class="card referral-card status-${ref.statusType} mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5>${ref.name}</h5>
                                <p class="small text-muted mb-1">${ref.email}</p>
                                ${ref.personId ? `<p class="small text-muted">ID: ${ref.personId}</p>` : ''}
                            </div>
                            <div class="text-end">
                                <span class="badge bg-${ref.statusType} status-badge">
                                    ${ref.mappedStatus}
                                </span>
                                ${assessmentInfo}
                            </div>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-3">
                                <small class="text-muted" data-translate="referralStage">Stage</small>
                                <p>${ref.stage}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted" data-translate="location">Location</small>
                                <p>${ref.location || 'N/A'}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted" data-translate="referralDays">Days in Stage</small>
                                <p>${ref.daysInStage}</p>
                            </div>
                            <div class="col-md-3">
                                ${ref.needsAction && ref.phone ? `
                                <button class="btn btn-sm btn-success w-100 remind-btn" 
                                    data-name="${ref.name}" 
                                    data-phone="${ref.phone}">
                                    <i class="fab fa-whatsapp me-2"></i>
                                    <span data-translate="remindBtn">Remind</span>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="mt-2">
                            <small class="text-muted">
                                <span data-translate="source">Source</span>: ${ref.source || 'N/A'} | 
                                <span data-translate="statusDetails">Status Details</span>: ${ref.status}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // Update status guide section
    function updateStatusGuide() {
        const container = document.getElementById('status-guide-content');
        if (!container) return;
        
        const t = translations[AppState.currentLanguage];
        
        container.innerHTML = `
            <div class="row">
                <!-- Status Examples -->
                <div class="col-md-6">
                    <h6 class="mb-3" data-translate="statusExamples">Status Examples</h6>
                    <div class="status-examples">
                        ${statusExamples.map(example => `
                            <div class="status-example">
                                <div class="d-flex justify-content-between align-items-center">
                                    <strong>${t[`status${example.status.replace(/[\s()]/g, '')}`] || example.status}</strong>
                                    <span class="badge bg-${StatusMapping.getSimplifiedStatusType(example.status)}">
                                        ${example.status}
                                    </span>
                                </div>
                                <p class="mb-1 mt-2 small">${example.description}</p>
                                <small class="text-muted">${example.action}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Payment Conditions -->
                <div class="col-md-6">
                    <h6 class="mb-3" data-translate="paymentConditions">Payment Conditions</h6>
                    <div class="table-responsive">
                        <table class="table status-guide-table">
                            <thead>
                                <tr>
                                    <th data-translate="stage">Stage</th>
                                    <th data-translate="condition">Condition</th>
                                    <th data-translate="payment">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(earningsStructure).map(([key, value]) => `
                                    <tr>
                                        <td>${value.label}</td>
                                        <td>${value.condition}</td>
                                        <td><strong>${value.payment}</strong></td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td>Previously Applied</td>
                                    <td data-translate="noPaymentNote">Candidate applied before referral</td>
                                    <td><strong>No Payment</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="payment-notes mt-3">
                        <p class="small mb-1"><i class="fas fa-info-circle me-2"></i>All payments via Touch 'n Go eWallet</p>
                        <p class="small mb-1"><i class="fas fa-info-circle me-2"></i>Payments processed within 30 days</p>
                        <p class="small"><i class="fas fa-info-circle me-2"></i>Must be active TP employee at payment time</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update translations
    function updateTranslations() {
        const lang = AppState.currentLanguage;
        const t = translations[lang] || translations.en;
        
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
    }
    
    // Show non-blocking error
    function showNonBlockingError(message) {
        const alertContainer = document.getElementById('alert-container');
        const alertId = 'alert-' + Date.now();
        
        const alert = document.createElement('div');
        alert.id = alertId;
        alert.className = 'alert alert-warning alert-dismissible fade show';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alertEl = document.getElementById(alertId);
            if (alertEl) {
                alertEl.classList.remove('show');
                setTimeout(() => alertEl.remove(), 150);
            }
        }, 5000);
    }
    
    // Initialize the app
    initializeApp();
    
    // Expose state for debugging
    window.AppState = AppState;
});
