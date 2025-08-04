document.addEventListener('DOMContentLoaded', function() {
    const AppState = {
        currentLanguage: 'en',
        statusChart: null,
        currentReferralsData: [],
        isLoading: false
    };
    
    initializeApp();
    
    function initializeApp() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
        updateTranslations();
        setupEventListeners();
        document.getElementById('dashboard-phone').focus();
    }
    
    function setupEventListeners() {
        document.getElementById('lang-select').addEventListener('change', handleLanguageChange);
        document.getElementById('dashboard-submit').addEventListener('click', handleFormSubmit);
        
        document.getElementById('dashboard-phone').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        document.addEventListener('click', handleReminderClick);
        
        document.getElementById('dashboard-form').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFormSubmit();
            }
        });
    }
    
    async function handleFormSubmit() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        
        if (!validateInputs(phone, email)) return;
        
        setLoadingState(true);
        
        try {
            const apiData = await ApiService.fetchReferrals(phone, email);
            AppState.currentReferralsData = processReferrals(apiData);
            showReferralResults(AppState.currentReferralsData, phone, email);
        } catch (error) {
            console.error('Error:', error);
            showNonBlockingError(translations[AppState.currentLanguage].errorMessage);
        } finally {
            setLoadingState(false);
        }
    }
    
    function processReferrals(apiData) {
        return apiData.map(item => {
            const lastUpdate = new Date(item.Modified || item.Created);
            const daysInStage = Math.floor((new Date() - lastUpdate) / (86400000));
            
            const status = item.Recent_x0020_Status || 'Application Received';
            const mappedStatus = StatusMapping.mapStatusToGroup(status);
            const statusType = StatusMapping.getSimplifiedStatusType(status);
            const stage = StatusMapping.determineStage(status);
            
            const isXRAF = (item.Source_x0020_Name || '').includes('xRAF') || 
                          (item.Source_x0020_Name || '').includes('Employee Referral');
            const isPreviousCandidate = mappedStatus === 'Previously Applied (No Payment)' || !isXRAF;
            
            return {
                id: item.ID,
                name: item.Person_x0020_Full_x0020_Name,
                email: item.Person_x0020_Email,
                phone: item.Default_x0020_Phone,
                status,
                source: item.Source_x0020_Name,
                location: item.Location,
                created: item.Created,
                modified: item.Modified,
                daysInStage,
                mappedStatus,
                statusType,
                stage,
                isPreviousCandidate,
                needsAction: (stage === 'Assessment Stage' || stage === 'Interview Stage') && 
                            daysInStage > 3 && !isPreviousCandidate
            };
        });
    }
    
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
    
    function setLoadingState(isLoading) {
        const submitBtn = document.getElementById('dashboard-submit');
        submitBtn.disabled = isLoading;
        submitBtn.innerHTML = isLoading ? 
            `<span class="spinner-border spinner-border-sm me-2"></span>${translations[AppState.currentLanguage].connectingMessage}` :
            translations[AppState.currentLanguage].viewStatusBtn;
    }
    
    function handleLanguageChange(e) {
        AppState.currentLanguage = e.target.value;
        updateTranslations();
        if (document.getElementById('results-step').style.display !== 'none') {
            showReferralResults(AppState.currentReferralsData);
        }
    }
    
    function showReferralResults(referrals, phone, email) {
        document.getElementById('auth-step').style.display = 'none';
        document.getElementById('results-step').style.display = 'block';
        
        const userName = referrals[0]?.name || email.split('@')[0];
        document.getElementById('results-step').innerHTML = createResultsContent(userName, referrals);
        
        updateChart(referrals);
        updateEarningsTable(referrals);
        updateReminderSection(referrals);
        updateReferralList(referrals);
        updateTranslations();
        
        document.getElementById('dashboard-back').addEventListener('click', handleBackButton);
    }
    
    function createResultsContent(userName, referrals) {
        const hiredCount = referrals.filter(r => r.stage.includes('Hired')).length;
        const inProgressCount = referrals.filter(r => 
            !r.stage.includes('Hired') && 
            !r.stage.includes('Not Selected') && 
            !r.stage.includes('Previously Applied')
        ).length;
        
        return `
            <div class="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h3>${userName}</h3>
                    <h4 data-translate="yourReferralsTitle">Your Referrals</h4>
                </div>
                <button id="dashboard-back" class="btn btn-outline-secondary" data-translate="backBtn">
                    <i class="fas fa-arrow-left me-2"></i> Back
                </button>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="totalReferrals">Total Referrals</h5>
                            <h3 class="text-primary">${referrals.length}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="hiredReferrals">Hired</h5>
                            <h3 class="text-success">${hiredCount}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body text-center">
                            <h5 class="card-title" data-translate="inProgress">In Progress</h5>
                            <h3 class="text-warning">${inProgressCount}</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="statusDistribution">Status Distribution</h5>
                    <div class="chart-container">
                        <canvas id="statusChart"></canvas>
                    </div>
                    <div class="chart-legend text-center mt-3" id="chartLegend"></div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="earningsTitle">Your Earnings</h5>
                    <div class="table-responsive">
                        <table class="table">
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
                                    <th data-translate="earningsTotal">Total Earnings</th>
                                    <th colspan="3" id="total-earnings" class="text-end">RM 0</th>
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
            
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3" data-translate="remindFriendsTitle">Remind Your Friends</h5>
                    <p class="text-center" data-translate="remindFriendsText">Help your friends complete their assessments to join TP!</p>
                    <div id="friends-to-remind" class="row"></div>
                </div>
            </div>
            
            <div id="referral-list"></div>
        `;
    }
    
    function handleBackButton() {
        document.getElementById('auth-step').style.display = 'block';
        document.getElementById('results-step').style.display = 'none';
        document.getElementById('dashboard-phone').value = '';
        document.getElementById('dashboard-email').value = '';
        document.getElementById('dashboard-phone').focus();
    }
    
    function handleReminderClick(e) {
        if (e.target.classList.contains('remind-btn')) {
            const button = e.target.closest('.remind-btn');
            const name = button.dataset.name;
            const phone = button.dataset.phone.replace(/^0/, '60');
            const message = `Hi ${name}, this is a reminder to complete your TP assessment.`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        }
    }
    
    function updateChart(referrals) {
        const ctx = document.getElementById('statusChart').getContext('2d');
        
        // Count statuses
        const counts = {};
        StatusMapping.displayOrder.forEach(group => {
            counts[group] = referrals.filter(r => r.mappedStatus === group).length;
        });
        
        // Destroy previous chart
        if (AppState.statusChart) AppState.statusChart.destroy();
        
        // Create new chart
        AppState.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: StatusMapping.displayOrder.map(group => 
                    translations[AppState.currentLanguage][`status${group.replace(/\s|\(|\)/g, '')}`] || group),
                datasets: [{
                    data: StatusMapping.displayOrder.map(group => counts[group]),
                    backgroundColor: [
                        '#0087FF', '#00d769', '#ffc107', '#fd7e14',
                        '#f5d200', '#84c98b', '#6c757d', '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }
    
    function updateEarningsTable(referrals) {
        const earningsBody = document.getElementById('earnings-body');
        earningsBody.innerHTML = '';
        
        // Calculate eligible candidates
        const passedAssessment = referrals.filter(r => 
            (r.stage === 'Assessment Stage' || r.stage === 'Interview Stage' || 
             r.stage === 'Final Review' || r.stage.includes('Hired')) && 
            !r.isPreviousCandidate
        ).length;
        
        const passedProbation = referrals.filter(r => 
            r.stage === 'Hired (Confirmed)' && r.daysInStage >= 90 && !r.isPreviousCandidate
        ).length;
        
        // Add rows
        const assessmentEarnings = passedAssessment * 50;
        const probationEarnings = passedProbation * 750;
        const totalEarnings = assessmentEarnings + probationEarnings;
        
        earningsBody.innerHTML = `
            <tr>
                <td data-translate="statusAssessmentPassed">Assessment Passed</td>
                <td>RM 50</td>
                <td>${passedAssessment}</td>
                <td>RM ${assessmentEarnings}</td>
            </tr>
            <tr>
                <td data-translate="statusProbationPassed">Probation Completed</td>
                <td>RM 750</td>
                <td>${passedProbation}</td>
                <td>RM ${probationEarnings}</td>
            </tr>
        `;
        
        document.getElementById('total-earnings').textContent = `RM ${totalEarnings}`;
    }
    
    function updateReminderSection(referrals) {
        const container = document.getElementById('friends-to-remind');
        container.innerHTML = '';
        
        const friendsToRemind = referrals.filter(r => r.needsAction);
        
        if (friendsToRemind.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted" data-translate="noRemindersNeeded">All your friends are on track!</p>
                </div>
            `;
            return;
        }
        
        friendsToRemind.forEach(friend => {
            container.innerHTML += `
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5>${friend.name}</h5>
                                <span class="badge bg-${friend.statusType}">${friend.mappedStatus}</span>
                            </div>
                            <p class="small">${friend.email}</p>
                            <p class="small" data-translate="referralDays">Days in Stage: ${friend.daysInStage}</p>
                            <button class="btn btn-primary w-100 remind-btn" 
                                data-name="${friend.name}" 
                                data-phone="${friend.phone}">
                                <i class="fab fa-whatsapp me-2"></i>
                                <span data-translate="remindBtn">Send Reminder</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    function updateReferralList(referrals) {
        const container = document.getElementById('referral-list');
        container.innerHTML = '';
        
        if (referrals.length === 0) {
            container.innerHTML = `
                <div class="card">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <h5 data-translate="noReferrals">No referrals found yet</h5>
                        <p data-translate="startReferring">Start referring friends to see them here</p>
                        <a href="https://tpmyandtpth.github.io/xRAF/" class="btn btn-primary mt-3" data-translate="referFriend">
                            <i class="fas fa-user-plus me-2"></i>Refer a Friend
                        </a>
                    </div>
                </div>
            `;
            return;
        }
        
        referrals.forEach(ref => {
            container.innerHTML += `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5>${ref.name}</h5>
                                <p class="small text-muted">${ref.email}</p>
                            </div>
                            <span class="badge bg-${ref.statusType}">${ref.mappedStatus}</span>
                        </div>
                        
                        <div class="row mt-3">
                            <div class="col-md-3">
                                <small class="text-muted" data-translate="referralStage">Stage</small>
                                <p>${ref.stage}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Location</small>
                                <p>${ref.location || 'N/A'}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted" data-translate="referralDays">Days in Stage</small>
                                <p>${ref.daysInStage}</p>
                            </div>
                            <div class="col-md-3">
                                ${ref.needsAction ? `
                                <button class="btn btn-sm btn-primary w-100 remind-btn" 
                                    data-name="${ref.name}" 
                                    data-phone="${ref.phone}">
                                    <i class="fab fa-whatsapp me-2"></i>
                                    <span data-translate="remindBtn">Remind</span>
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    function updateTranslations() {
        const lang = AppState.currentLanguage;
        const t = translations[lang] || translations.en;
        
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (t[key]) el.textContent = t[key];
        });
        
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (t[key]) el.placeholder = t[key];
        });
    }
    
    function showNonBlockingError(message) {
        const container = document.getElementById('error-alert-container');
        const alert = document.createElement('div');
        alert.className = 'alert alert-warning alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        container.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }, 5000);
    }
});
