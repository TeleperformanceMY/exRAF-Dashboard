// Translations for all languages
const translations = {
    en: {
        pageLangLabel: "Choose Your Language:",
        dashboardTitle: "Referral Dashboard",
        dashboardSubtitle: "Enter your details to view your referral status",
        phoneLabel: "Phone Number:",
        phonePlaceholder: "Enter your phone number (01XXXXXXXX)",
        phoneError: "Please provide a valid phone number (01XXXXXXXX).",
        emailLabel: "Email Address:",
        emailPlaceholder: "Enter your email address",
        emailError: "Please provide a valid email address.",
        viewStatusBtn: "View Referral Status",
        backToRAF: "Back to Referral Form",
        yourReferralsTitle: "Your Referrals",
        backBtn: "Back",
        totalReferrals: "Total Referrals",
        hiredReferrals: "Hired",
        inProgress: "In Progress",
        statusDistribution: "Status Distribution",
        earningsTitle: "Your Earnings",
        earningsStage: "Stage",
        earningsAmount: "Amount (RM)",
        earningsCount: "Count",
        earningsTotal: "Total",
        remindFriendsTitle: "Remind Your Friends",
        remindFriendsText: "Help your friends complete their assessments to join Teleperformance!",
        remindBtn: "Send WhatsApp Reminder",
        tpGlobal: "TP Global",
        followMalaysia: "TP Malaysia",
        followThailand: "TP Thailand",
        noReferrals: "No referrals found with these details.",
        referralName: "Friend's Name",
        referralEmail: "Email",
        referralStage: "Stage",
        referralStatus: "Status",
        referralDate: "Application Date",
        referralDays: "Days in Stage",
        referralAction: "Action",
        statusReceived: "Application Received",
        statusAssessment: "Assessment Stage",
        statusTalent: "Interview Stage",
        statusOperations: "Final Review",
        statusProbation: "Hired (Probation)",
        statusPassed: "Hired (Confirmed)",
        statusFailed: "Not Selected",
        paymentNote: "Payment Information",
        paymentTermsTitle: "Payment Terms & Conditions",
        paymentTermsText1: "Payments will be made to your TnG eWallet linked to your phone number.",
        paymentTermsText2: "The RM750 bonus will be paid only after your referred candidate successfully completes the 90-day probation period.",
        paymentTermsText3: "All payments are subject to verification and may take up to 30 days after probation completion.",
        closeBtn: "Close",
        questionsTitle: "Questions?",
        contactUsText: "Email us at:",
        noRemindersNeeded: "All your friends are on track!"
    },
    ja: {
        // Japanese translations (similar structure as English)
    },
    ko: {
        // Korean translations (similar structure as English)
    },
    "zh-CN": {
        // Mandarin translations (similar structure as English)
    },
    "zh-HK": {
        // Cantonese translations (similar structure as English)
    }
};

// Earnings structure - only pays for passed probation
const earningsStructure = {
    probation: { amount: 750, label: "Pass Probation (90 days)" }
};

// Sample data with 0123456789 and example@tp.com
const sampleData = {
    "0123456789:example@tp.com": [
        {
            name: "John Smith",
            email: "john.smith@example.com",
            stage: "Hired",
            status: "Successfully passed probation",
            statusType: "passed",
            applicationDate: "2023-11-15",
            hireDate: "2023-11-20",
            daysInStage: 95,
            category: "Customer Service",
            source: "Employee Referral",
            needsAction: false,
            phone: "0112345678"
        },
        {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            stage: "Hired",
            status: "In probation period",
            statusType: "probation",
            applicationDate: "2023-12-10",
            hireDate: "2023-12-15",
            daysInStage: 45,
            category: "Technical Support",
            source: "Employee Referral",
            needsAction: false,
            phone: "0112345679"
        },
        {
            name: "Michael Brown",
            email: "michael.b@example.com",
            stage: "Operations",
            status: "Final review by operations",
            statusType: "operations",
            applicationDate: "2024-01-05",
            hireDate: "",
            daysInStage: 10,
            category: "Sales",
            source: "Employee Referral",
            needsAction: false,
            phone: "0112345680"
        },
        {
            name: "Emily Davis",
            email: "emily.d@example.com",
            stage: "Talent",
            status: "Interview scheduled",
            statusType: "talent",
            applicationDate: "2024-01-15",
            hireDate: "",
            daysInStage: 5,
            category: "Customer Service",
            source: "Employee Referral",
            needsAction: true,
            phone: "0112345681"
        },
        {
            name: "David Wilson",
            email: "david.w@example.com",
            stage: "Assessment",
            status: "Assessment in progress",
            statusType: "assessment",
            applicationDate: "2024-01-20",
            hireDate: "",
            daysInStage: 2,
            category: "Technical Support",
            source: "Employee Referral",
            needsAction: true,
            phone: "0112345682"
        },
        {
            name: "Lisa Miller",
            email: "lisa.m@example.com",
            stage: "Application",
            status: "Application received",
            statusType: "received",
            applicationDate: "2024-01-25",
            hireDate: "",
            daysInStage: 1,
            category: "Sales",
            source: "Employee Referral",
            needsAction: false,
            phone: "0112345683"
        },
        {
            name: "Robert Taylor",
            email: "robert.t@example.com",
            stage: "Hired",
            status: "Terminated during probation",
            statusType: "failed",
            applicationDate: "2023-10-01",
            hireDate: "2023-10-10",
            daysInStage: 45,
            category: "Customer Service",
            source: "Employee Referral",
            needsAction: false,
            phone: "0112345684"
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    let currentLanguage = 'en';
    let statusChart = null;
    
    // Update translations
    function updateTranslations() {
        const translation = translations[currentLanguage] || translations.en;
        
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translation[key]) {
                el.textContent = translation[key];
            }
        });
        
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            if (translation[key]) {
                el.placeholder = translation[key];
            }
        });
    }
    
    // Language change handler
    document.getElementById('lang-select').addEventListener('change', function() {
        currentLanguage = this.value;
        updateTranslations();
        
        // Refresh chart if it exists
        if (statusChart) {
            const referrals = getCurrentReferrals();
            if (referrals) {
                updateChart(referrals);
                updateEarningsTable(referrals);
                updateReminderSection(referrals);
                updateReferralList(referrals);
            }
        }
    });
    
    // Validate phone number
    function validatePhone(phone) {
        const regex = /^01\d{8,9}$/;
        return regex.test(phone);
    }
    
    // Validate email
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Show error message
    function showError(input, message) {
        const formControl = input.closest('.mb-3');
        const error = formControl.querySelector('.invalid-feedback');
        
        formControl.classList.add('was-validated');
        error.textContent = message;
        error.style.display = 'block';
        input.classList.add('is-invalid');
    }
    
    // Clear error
    function clearError(input) {
        const formControl = input.closest('.mb-3');
        const error = formControl.querySelector('.invalid-feedback');
        
        formControl.classList.remove('was-validated');
        error.style.display = 'none';
        input.classList.remove('is-invalid');
    }
    
    // Get referrals for current user
    function getReferrals(phone, email) {
        const key = `${phone}:${email}`;
        return sampleData[key] || [];
    }
    
    // Get current referrals (for chart refresh)
    function getCurrentReferrals() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        return getReferrals(phone, email);
    }
    
    // Update earnings table
    function updateEarningsTable(referrals) {
        const earningsBody = document.getElementById('earnings-body');
        earningsBody.innerHTML = '';
        
        let totalEarnings = 0;
        
        // Calculate counts for each earning stage
        const earningCounts = {
            probation: referrals.filter(r => r.statusType === 'passed').length
        };
        
        // Add rows for each earning type
        Object.entries(earningsStructure).forEach(([key, earning]) => {
            const count = earningCounts[key] || 0;
            const total = count * earning.amount;
            totalEarnings += total;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${translations[currentLanguage][`status${key.charAt(0).toUpperCase() + key.slice(1)}`] || earning.label}</td>
                <td>RM ${earning.amount}</td>
                <td>${count}</td>
                <td>RM ${total}</td>
            `;
            earningsBody.appendChild(row);
        });
        
        // Update total earnings
        document.getElementById('total-earnings').textContent = `RM ${totalEarnings}`;
    }
    
    // Update reminder section
    function updateReminderSection(referrals) {
        const friendsToRemind = document.getElementById('friends-to-remind');
        friendsToRemind.innerHTML = '';
        
        // Sort referrals by status (assessment first, then talent, then operations)
        const friendsNeedingReminder = referrals
            .filter(r => r.needsAction)
            .sort((a, b) => {
                const statusOrder = ['assessment', 'talent', 'operations', 'received'];
                return statusOrder.indexOf(a.statusType) - statusOrder.indexOf(b.statusType);
            });
        
        if (friendsNeedingReminder.length === 0) {
            friendsToRemind.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted" data-translate="noRemindersNeeded">All your friends are on track!</p>
                </div>
            `;
            updateTranslations();
            return;
        }
        
        friendsNeedingReminder.forEach(friend => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            
            col.innerHTML = `
                <div class="friend-to-remind status-${friend.statusType}">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>${friend.name}</h5>
                        <span class="badge status-badge bg-${getStatusBadgeColor(friend.statusType)}">
                            ${translations[currentLanguage][`status${friend.statusType.charAt(0).toUpperCase() + friend.statusType.slice(1)}`]}
                        </span>
                    </div>
                    <p class="small text-muted mb-2">${friend.email}</p>
                    <p class="small mb-2"><strong>${translations[currentLanguage].referralDays}:</strong> ${friend.daysInStage}</p>
                    <button class="btn btn-sm btn-primary w-100 remind-btn" 
                            data-name="${friend.name}" 
                            data-phone="${friend.phone}" 
                            data-translate="remindBtn">
                        <i class="fab fa-whatsapp me-2"></i>${translations[currentLanguage].remindBtn}
                    </button>
                </div>
            `;
            
            friendsToRemind.appendChild(col);
        });
        
        updateTranslations();
    }
    
    // Get badge color based on status
    function getStatusBadgeColor(statusType) {
        switch(statusType) {
            case 'passed':
            case 'probation':
                return 'success';
            case 'assessment':
            case 'talent':
            case 'operations':
                return 'warning';
            case 'failed':
                return 'danger';
            default:
                return 'secondary';
        }
    }
    
    // Form submission
    document.getElementById('dashboard-submit').addEventListener('click', function() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        let isValid = true;
        
        // Validate phone
        if (!phone) {
            showError(document.getElementById('dashboard-phone'), 
                     translations[currentLanguage].phoneError);
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError(document.getElementById('dashboard-phone'), 
                     translations[currentLanguage].phoneError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-phone'));
        }
        
        // Validate email
        if (!email) {
            showError(document.getElementById('dashboard-email'), 
                     translations[currentLanguage].emailError);
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(document.getElementById('dashboard-email'), 
                     translations[currentLanguage].emailError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-email'));
        }
        
        if (!isValid) return;
        
        // Get referrals
        const referrals = getReferrals(phone, email);
        
        // Show results
        showReferralResults(referrals);
    });
    
    // Back button
    document.getElementById('dashboard-back').addEventListener('click', function() {
        document.getElementById('auth-step').style.display = 'block';
        document.getElementById('results-step').style.display = 'none';
    });
    
    // Show referral results
    function showReferralResults(referrals) {
        document.getElementById('auth-step').style.display = 'none';
        document.getElementById('results-step').style.display = 'block';
        
        // Update stats
        document.getElementById('total-referrals').textContent = referrals.length;
        document.getElementById('hired-referrals').textContent = referrals.filter(r => r.stage === 'Hired').length;
        document.getElementById('progress-referrals').textContent = referrals.filter(r => r.stage !== 'Hired').length;
        
        // Update chart
        updateChart(referrals);
        
        // Update earnings table
        updateEarningsTable(referrals);
        
        // Update reminder section
        updateReminderSection(referrals);
        
        // Update referral list
        updateReferralList(referrals);
    }
    
    // Update referral list
    function updateReferralList(referrals) {
        const referralList = document.getElementById('referral-list');
        referralList.innerHTML = '';
        
        if (referrals.length === 0) {
            referralList.innerHTML = `
                <div class="alert alert-info" data-translate="noReferrals">
                    ${translations[currentLanguage].noReferrals}
                </div>
            `;
            updateTranslations();
            return;
        }
        
        // Sort referrals: passed > probation > operations > talent > assessment > received > failed
        const statusOrder = ['passed', 'probation', 'operations', 'talent', 'assessment', 'received', 'failed'];
        const sortedReferrals = [...referrals].sort((a, b) => {
            return statusOrder.indexOf(a.statusType) - statusOrder.indexOf(b.statusType);
        });
        
        sortedReferrals.forEach(referral => {
            const item = document.createElement('div');
            item.className = `card mb-3 status-${referral.statusType}`;
            
            // Get status translation
            const statusKey = `status${referral.statusType.charAt(0).toUpperCase() + referral.statusType.slice(1)}`;
            const statusTranslation = translations[currentLanguage][statusKey] || referral.status;
            

        friendsNeedingReminder.forEach(friend => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            
            col.innerHTML = `
                <div class="friend-to-remind">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5>${friend.name}</h5>
                        <span class="badge bg-warning">${translations[currentLanguage].statusAssessment}</span>
                    </div>
                    <p class="small text-muted mb-2">${friend.email}</p>
                    <p class="small mb-2"><strong>${translations[currentLanguage].referralDays}:</strong> ${friend.daysInStage}</p>
                    <button class="btn btn-sm btn-primary w-100 remind-btn" data-translate="remindBtn">
                        ${translations[currentLanguage].remindBtn}
                    </button>
                </div>
            `;
            
            friendsToRemind.appendChild(col);
        });
        
        updateTranslations();
    }
    
    // Form submission
    document.getElementById('dashboard-submit').addEventListener('click', function() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        let isValid = true;
        
        // Validate phone
        if (!phone) {
            showError(document.getElementById('dashboard-phone'), 
                     translations[currentLanguage].phoneError);
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError(document.getElementById('dashboard-phone'), 
                     translations[currentLanguage].phoneError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-phone'));
        }
        
        // Validate email
        if (!email) {
            showError(document.getElementById('dashboard-email'), 
                     translations[currentLanguage].emailError);
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(document.getElementById('dashboard-email'), 
                     translations[currentLanguage].emailError);
            isValid = false;
        } else {
            clearError(document.getElementById('dashboard-email'));
        }
        
        if (!isValid) return;
        
        // Get referrals
        const referrals = getReferrals(phone, email);
        
        // Show results
        showReferralResults(referrals);
    });
    
    // Back button
    document.getElementById('dashboard-back').addEventListener('click', function() {
        document.getElementById('auth-step').style.display = 'block';
        document.getElementById('results-step').style.display = 'none';
    });
    
    // Show referral results
    function showReferralResults(referrals) {
        document.getElementById('auth-step').style.display = 'none';
        document.getElementById('results-step').style.display = 'block';
        
        // Update stats
        document.getElementById('total-referrals').textContent = referrals.length;
        document.getElementById('hired-referrals').textContent = referrals.filter(r => r.stage === 'Hired').length;
        document.getElementById('progress-referrals').textContent = referrals.filter(r => r.stage !== 'Hired').length;
        
        // Update chart
        updateChart(referrals);
        
        // Update earnings table
        updateEarningsTable(referrals);
        
        // Update reminder section
        updateReminderSection(referrals);
        
        // Update referral list
        const referralList = document.getElementById('referral-list');
        referralList.innerHTML = '';
        
        if (referrals.length === 0) {
            referralList.innerHTML = `
                <div class="alert alert-info" data-translate="noReferrals">
                    ${translations[currentLanguage].noReferrals}
                </div>
            `;
            updateTranslations();
            return;
        }
        
        referrals.forEach(referral => {
            const item = document.createElement('div');
            item.className = `card mb-3 status-${referral.statusType}`;
            
            // Get status translation
            const statusKey = `status${referral.statusType.charAt(0).toUpperCase() + referral.statusType.slice(1)}`;
            const statusTranslation = translations[currentLanguage][statusKey] || referral.status;
            
            // Action button
            let actionButton = '';
            if (referral.needsAction) {
                actionButton = `
                    <button class="btn btn-sm btn-primary remind-btn" data-translate="remindBtn">
                        ${translations[currentLanguage].remindBtn}
                    </button>
                `;
            } else if (referral.stage === 'Hired' && referral.statusType === 'passed') {
                actionButton = `
                    <button class="btn btn-sm btn-success celebrate-btn" data-translate="celebrateBtn">
                        ${translations[currentLanguage].celebrateBtn}
                    </button>
                `;
            }
            
            item.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="mb-1">${referral.name}</h5>
                            <p class="mb-1 text-muted small">${referral.email}</p>
                        </div>
                        <span class="badge bg-secondary">${statusTranslation}</span>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <small class="text-muted" data-translate="referralStage">Stage</small>
                            <p>${referral.stage}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted" data-translate="referralDate">Application Date</small>
                            <p>${new Date(referral.applicationDate).toLocaleDateString()}</p>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted" data-translate="referralDays">Days in Stage</small>
                            <p>${referral.daysInStage}</p>
                        </div>
                        <div class="col-md-3 text-end">
                            ${actionButton}
                        </div>
                    </div>
                </div>
            `;
            
            referralList.appendChild(item);
        });
        
        // Add payment note
        const paymentNote = document.createElement('div');
        paymentNote.className = 'alert alert-warning mt-3';
        paymentNote.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>
            <span data-translate="paymentNote">${translations[currentLanguage].paymentNote}</span>
        `;
        referralList.appendChild(paymentNote);
        
        // Update translations for dynamic content
        updateTranslations();
    }
  // Update chart with referral data (now as pie chart)
function updateChart(referrals) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    const translation = translations[currentLanguage] || translations.en;
    
    // Count status types
    const statusCounts = {
        received: referrals.filter(r => r.statusType === 'received').length,
        assessment: referrals.filter(r => r.statusType === 'assessment').length,
        talent: referrals.filter(r => r.statusType === 'talent').length,
        operations: referrals.filter(r => r.statusType === 'operations').length,
        probation: referrals.filter(r => r.statusType === 'probation').length,
        passed: referrals.filter(r => r.statusType === 'passed').length,
        failed: referrals.filter(r => r.statusType === 'failed' || r.statusType === 'unreliable').length
    };
    
    // Prepare data for chart
    const labels = [
        translation.statusReceived,
        translation.statusAssessment,
        translation.statusTalent,
        translation.statusOperations,
        translation.statusProbation,
        translation.statusPassed,
        translation.statusFailed
    ];
    
    const data = [
        statusCounts.received,
        statusCounts.assessment,
        statusCounts.talent,
        statusCounts.operations,
        statusCounts.probation,
        statusCounts.passed,
        statusCounts.failed
    ];
    
    const backgroundColors = [
        '#fff3cd', // received
        '#fff3cd', // assessment
        '#fff3cd', // talent
        '#fff3cd', // operations
        '#d4edda', // probation
        '#28a745', // passed
        '#f8d7da'  // failed
    ];
    
    const borderColors = [
        '#ffc107', // received
        '#ffc107', // assessment
        '#ffc107', // talent
        '#ffc107', // operations
        '#28a745', // probation
        '#218838', // passed
        '#dc3545'  // failed
    ];
    
    // Destroy previous chart if it exists
    if (statusChart) {
        statusChart.destroy();
    }
    
    // Create new chart as pie chart
    statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

    
    
    // Handle remind button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remind-btn')) {
            const referralItem = e.target.closest('.friend-to-remind') || e.target.closest('.card');
            const name = referralItem.querySelector('h5').textContent;
            
            alert(`${translations[currentLanguage].remindBtn} sent to ${name}!`);
        }
        
        if (e.target.classList.contains('celebrate-btn')) {
            alert('🎉 ' + translations[currentLanguage].celebrateBtn + ' 🎉');
        }
    });
    
    // Initialize translations
    updateTranslations();
    
    // Auto-focus phone input
    document.getElementById('dashboard-phone').focus();
    
    // Prevent non-numeric input in phone field
    document.getElementById('dashboard-phone').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});
