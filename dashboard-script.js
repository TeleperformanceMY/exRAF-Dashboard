// Replace this part with actual API call:
async function fetchReferrals(phone, email) {
    const response = await fetch(`YOUR_API_ENDPOINT?phone=${phone}&email=${email}`);
    return await response.json();
}
// Translations for all languages
const translations = {
    en: {
        dashboardTitle: "Referral Dashboard",
        dashboardSubtitle: "Enter your details to view your referral status",
        phoneLabel: "Phone Number:",
        phonePlaceholder: "Enter your phone number (01XXXXXXXX)",
        phoneError: "Please provide a valid phone number.",
        phoneHint: "Your phone number must be linked to TnG eWallet for the payment process",
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
        motivationText: "Keep pushing your friends! Candidates who complete assessments quickly are more likely to get hired.",
        locationSocial: "Our Social Media",
        noReferrals: "No referrals found with these details.",
        referralName: "Friend's Name",
        referralEmail: "Email",
        referralStage: "Stage",
        referralStatus: "Status",
        referralDate: "Application Date",
        referralDays: "Days in Stage",
        referralAction: "Action",
        remindBtn: "Remind",
        celebrateBtn: "Celebrate!",
        statusReceived: "Received Application",
        statusAssessment: "Endorsed to Assessment",
        statusTalent: "Endorsed to Talent Acquisition",
        statusOperations: "Endorsed to Operations",
        statusProbation: "Hired (in probation period)",
        statusPassed: "Hired (passed probation)",
        statusFailed: "Failed",
        statusUnreliable: "Unreliable"
    },
    ja: {
        dashboardTitle: "紹介ダッシュボード",
        dashboardSubtitle: "詳細を入力して紹介状況を表示",
        phoneLabel: "電話番号:",
        phonePlaceholder: "電話番号を入力してください (01XXXXXXXX)",
        phoneError: "有効な電話番号を入力してください。",
        phoneHint: "支払いプロセスのため、電話番号はTnG eWalletにリンクされている必要があります",
        emailLabel: "メールアドレス:",
        emailPlaceholder: "メールアドレスを入力してください",
        emailError: "有効なメールアドレスを入力してください。",
        viewStatusBtn: "紹介状況を表示",
        backToRAF: "紹介フォームに戻る",
        yourReferralsTitle: "あなたの紹介",
        backBtn: "戻る",
        totalReferrals: "総紹介数",
        hiredReferrals: "採用",
        inProgress: "進行中",
        statusDistribution: "ステータス分布",
        motivationText: "友達を励まし続けましょう！ 迅速に審査を完了した候補者は採用される可能性が高くなります。",
        locationSocial: "ソーシャルメディア",
        noReferrals: "これらの詳細に一致する紹介は見つかりませんでした。",
        referralName: "友達の名前",
        referralEmail: "メール",
        referralStage: "ステージ",
        referralStatus: "状態",
        referralDate: "申込日",
        referralDays: "ステージ日数",
        referralAction: "アクション",
        remindBtn: "リマインダー",
        celebrateBtn: "お祝い！",
        statusReceived: "申込受付済み",
        statusAssessment: "審査に推薦",
        statusTalent: "人材獲得に推薦",
        statusOperations: "オペレーションに推薦",
        statusProbation: "採用（試用期間中）",
        statusPassed: "採用（試用期間通過）",
        statusFailed: "不合格",
        statusUnreliable: "信頼性なし"
    },
    ko: {
        dashboardTitle: "추천 대시보드",
        dashboardSubtitle: "세부 정보를 입력하여 추천 상태 확인",
        phoneLabel: "전화번호:",
        phonePlaceholder: "전화번호를 입력하세요 (01XXXXXXXX)",
        phoneError: "유효한 전화번호를 입력해 주세요.",
        phoneHint: "결제 과정을 위해 전화번호는 TnG eWallet에 연결되어 있어야 합니다",
        emailLabel: "이메일 주소:",
        emailPlaceholder: "이메일 주소를 입력하세요",
        emailError: "유효한 이메일 주소를 입력해 주세요.",
        viewStatusBtn: "추천 상태 보기",
        backToRAF: "추천 양식으로 돌아가기",
        yourReferralsTitle: "귀하의 추천",
        backBtn: "뒤로",
        totalReferrals: "총 추천 수",
        hiredReferrals: "채용됨",
        inProgress: "진행 중",
        statusDistribution: "상태 분포",
        motivationText: "친구들을 계속 독려하세요! 평가를 빠르게 완료한 후보자는 채용될 가능성이 더 높습니다.",
        locationSocial: "소셜 미디어",
        noReferrals: "이 세부 정보와 일치하는 추천을 찾을 수 없습니다.",
        referralName: "친구 이름",
        referralEmail: "이메일",
        referralStage: "단계",
        referralStatus: "상태",
        referralDate: "신청 날짜",
        referralDays: "단계 일수",
        referralAction: "조치",
        remindBtn: "알림",
        celebrateBtn: "축하합니다!",
        statusReceived: "신청서 접수",
        statusAssessment: "평가 추천",
        statusTalent: "인재 채용 추천",
        statusOperations: "운영 추천",
        statusProbation: "채용 (수습 기간 중)",
        statusPassed: "채용 (수습 기간 통과)",
        statusFailed: "실패",
        statusUnreliable: "신뢰할 수 없음"
    },
    "zh-CN": {
        dashboardTitle: "推荐仪表板",
        dashboardSubtitle: "输入您的详细信息以查看推荐状态",
        phoneLabel: "电话号码:",
        phonePlaceholder: "输入您的电话号码 (01XXXXXXXX)",
        phoneError: "请输入有效的电话号码。",
        phoneHint: "您的电话号码必须链接到TnG eWallet以进行支付流程",
        emailLabel: "电子邮件地址:",
        emailPlaceholder: "输入您的电子邮件地址",
        emailError: "请输入有效的电子邮件地址。",
        viewStatusBtn: "查看推荐状态",
        backToRAF: "返回推荐表格",
        yourReferralsTitle: "您的推荐",
        backBtn: "返回",
        totalReferrals: "总推荐数",
        hiredReferrals: "已雇用",
        inProgress: "进行中",
        statusDistribution: "状态分布",
        motivationText: "继续推动您的朋友！快速完成评估的候选人更有可能被录用。",
        locationSocial: "社交媒体",
        noReferrals: "未找到与这些详细信息匹配的推荐。",
        referralName: "朋友姓名",
        referralEmail: "电子邮件",
        referralStage: "阶段",
        referralStatus: "状态",
        referralDate: "申请日期",
        referralDays: "阶段天数",
        referralAction: "操作",
        remindBtn: "提醒",
        celebrateBtn: "庆祝！",
        statusReceived: "已收到申请",
        statusAssessment: "推荐至评估",
        statusTalent: "推荐至人才获取",
        statusOperations: "推荐至运营",
        statusProbation: "已雇用（试用期）",
        statusPassed: "已雇用（通过试用）",
        statusFailed: "失败",
        statusUnreliable: "不可靠"
    },
    "zh-HK": {
        dashboardTitle: "推薦儀表板",
        dashboardSubtitle: "輸入您的詳細信息以查看推薦狀態",
        phoneLabel: "電話號碼:",
        phonePlaceholder: "輸入您的電話號碼 (01XXXXXXXX)",
        phoneError: "請輸入有效的電話號碼。",
        phoneHint: "您的電話號碼必須連結到TnG eWallet以進行支付流程",
        emailLabel: "電子郵件地址:",
        emailPlaceholder: "輸入您的電子郵件地址",
        emailError: "請輸入有效的電子郵件地址。",
        viewStatusBtn: "查看推薦狀態",
        backToRAF: "返回推薦表格",
        yourReferralsTitle: "您的推薦",
        backBtn: "返回",
        totalReferrals: "總推薦數",
        hiredReferrals: "已僱用",
        inProgress: "進行中",
        statusDistribution: "狀態分佈",
        motivationText: "繼續推動您的朋友！快速完成評估嘅候選人更有可能被錄用。",
        locationSocial: "社交媒體",
        noReferrals: "未找到與這些詳細信息匹配嘅推薦。",
        referralName: "朋友姓名",
        referralEmail: "電子郵件",
        referralStage: "階段",
        referralStatus: "狀態",
        referralDate: "申請日期",
        referralDays: "階段天數",
        referralAction: "操作",
        remindBtn: "提醒",
        celebrateBtn: "慶祝！",
        statusReceived: "已收到申請",
        statusAssessment: "推薦至評估",
        statusTalent: "推薦至人才獲取",
        statusOperations: "推薦至運營",
        statusProbation: "已僱用（試用期）",
        statusPassed: "已僱用（通過試用）",
        statusFailed: "失敗",
        statusUnreliable: "不可靠"
    }
};

// Sample data structure
const sampleData = {
    "60123456789:fansheng072799@gmail.com": [
        {
            name: "Fan Sheng Chen",
            email: "fansheng072799@gmail.com",
            stage: "Hired",
            status: "Terminated before 90 days",
            statusType: "unreliable",
            applicationDate: "2025-01-31",
            hireDate: "2025-02-06",
            daysInStage: 5,
            category: "Hospitality/Travel",
            source: "TWO95",
            needsAction: false
        },
        {
            name: "John Doe",
            email: "john.doe@example.com",
            stage: "Assessment",
            status: "Endorsed to Assessment",
            statusType: "assessment",
            applicationDate: "2025-03-15",
            hireDate: "",
            daysInStage: 12,
            category: "Automotive",
            source: "Employee Referral",
            needsAction: true
        }
    ],
    "60123456788:keerthanajahanathan95@gmail.com": [
        {
            name: "Keerthana Jahanathan",
            email: "keerthanajahanathan95@gmail.com",
            stage: "Hired",
            status: "Successfully hired",
            statusType: "passed",
            applicationDate: "2024-04-30",
            hireDate: "2024-05-13",
            daysInStage: 13,
            category: "Automotive",
            source: "TWO95",
            needsAction: false
        },
        {
            name: "Devendhiran Pillai",
            email: "devendhiranpillai@gmail.com",
            stage: "Offer Presented",
            status: "Endorsed to Talent Acquisition",
            statusType: "talent",
            applicationDate: "2024-07-01",
            hireDate: "",
            daysInStage: 45,
            category: "Hospitality/Travel",
            source: "TWO95",
            needsAction: true
        },
        {
            name: "Alice Smith",
            email: "alice.smith@example.com",
            status: "Received Application",
            statusType: "received",
            stage: "Application",
            applicationDate: "2025-02-20",
            daysInStage: 8,
            needsAction: false
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    let currentLanguage = 'en';
    let statusChart = null;
    
    // Language selector
    const langSelect = document.createElement('select');
    langSelect.id = 'lang-select';
    langSelect.className = 'form-select mb-3';
    langSelect.innerHTML = `
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh-CN">Mandarin</option>
        <option value="zh-HK">Cantonese</option>
    `;
    document.querySelector('.card-body').insertBefore(langSelect, document.getElementById('auth-step'));
    
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
            if (translation[key]) el.placeholder = translation[key];
        });
    }
    
    // Language change handler
    langSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        updateTranslations();
        
        // Refresh chart if it exists
        if (statusChart) {
            updateChart();
        }
    });
    
    // Form submission
    document.getElementById('dashboard-submit').addEventListener('click', function() {
        const phone = document.getElementById('dashboard-phone').value.trim();
        const email = document.getElementById('dashboard-email').value.trim();
        
        // Simple validation
        if (!phone || phone.length < 8) {
            document.getElementById('dashboard-phone').classList.add('is-invalid');
            return;
        } else {
            document.getElementById('dashboard-phone').classList.remove('is-invalid');
        }
        
        if (!email || !email.includes('@')) {
            document.getElementById('dashboard-email').classList.add('is-invalid');
            return;
        } else {
            document.getElementById('dashboard-email').classList.remove('is-invalid');
        }
        
        // In production, you would fetch data from your API here
        // For demo, we'll use the sample data
        const key = `${phone}:${email}`;
        const referrals = sampleData[key] || [];
        
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
        
        // Update referral list
        const referralList = document.getElementById('referral-list');
        referralList.innerHTML = '';
        
        if (referrals.length === 0) {
            referralList.innerHTML = `
                <div class="alert alert-info" data-translate="noReferrals">
                    No referrals found with these details.
                </div>
            `;
            updateTranslations();
            return;
        }
        
        referrals.forEach(referral => {
            const item = document.createElement('div');
            item.className = `referral-item status-${referral.statusType}`;
            
            // Get status translation
            const statusTranslation = translations[currentLanguage][`status${referral.statusType.charAt(0).toUpperCase() + referral.statusType.slice(1)}`] || referral.status;
            
            // Action button
            let actionButton = '';
            if (referral.needsAction) {
                actionButton = `
                    <button class="btn btn-sm btn-primary" data-translate="remindBtn">
                        ${translations[currentLanguage]?.remindBtn || 'Remind'}
                    </button>
                `;
            } else if (referral.stage === 'Hired' && referral.statusType === 'passed') {
                actionButton = `
                    <button class="btn btn-sm btn-success" data-translate="celebrateBtn">
                        ${translations[currentLanguage]?.celebrateBtn || 'Celebrate!'}
                    </button>
                `;
            }
            
            item.innerHTML = `
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
            `;
            
            referralList.appendChild(item);
        });
        
        // Update translations for dynamic content
        updateTranslations();
        
        // Add event listeners to action buttons
        document.querySelectorAll('.referral-item .btn-primary').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.closest('.referral-item').querySelector('h5').textContent;
                alert(`${translations[currentLanguage]?.remindBtn || 'Reminder'} sent to ${name}!`);
            });
        });
        
        document.querySelectorAll('.referral-item .btn-success').forEach(btn => {
            btn.addEventListener('click', function() {
                alert(translations[currentLanguage]?.celebrateBtn || 'Congratulations on your successful referral!');
            });
        });
    }
    
    // Update chart with referral data
    function updateChart(referrals = []) {
        const ctx = document.getElementById('statusChart').getContext('2d');
        
        // Count status types
        const statusCounts = {
            received: 0,
            assessment: 0,
            talent: 0,
            operations: 0,
            probation: 0,
            passed: 0,
            failed: 0,
            unreliable: 0
        };
        
        referrals.forEach(ref => {
            if (statusCounts.hasOwnProperty(ref.statusType)) {
                statusCounts[ref.statusType]++;
            }
        });
        
        // Get translated labels
        const t = translations[currentLanguage];
        const labels = [
            t.statusReceived,
            t.statusAssessment,
            t.statusTalent,
            t.statusOperations,
            t.statusProbation,
            t.statusPassed,
            t.statusFailed,
            t.statusUnreliable
        ];
        
        const data = [
            statusCounts.received,
            statusCounts.assessment,
            statusCounts.talent,
            statusCounts.operations,
            statusCounts.probation,
            statusCounts.passed,
            statusCounts.failed,
            statusCounts.unreliable
        ];
        
        // Colors for each status
        const backgroundColors = [
            'rgba(255, 193, 7, 0.7)',    // Received - yellow
            'rgba(255, 193, 7, 0.7)',    // Assessment - yellow
            'rgba(255, 193, 7, 0.7)',    // Talent - yellow
            'rgba(255, 193, 7, 0.7)',    // Operations - yellow
            'rgba(32, 201, 151, 0.7)',   // Probation - light green
            'rgba(40, 167, 69, 0.7)',    // Passed - green
            'rgba(220, 53, 69, 0.7)',    // Failed - red
            'rgba(220, 53, 69, 0.7)'     // Unreliable - red
        ];
        
        // Destroy previous chart if exists
        if (statusChart) {
            statusChart.destroy();
        }
        
        // Create new chart
        statusChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
    
    // Initialize translations
    updateTranslations();
});
