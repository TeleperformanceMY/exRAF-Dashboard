const ApiService = (function() {
    const POWER_AUTOMATE_URL = 'https://prod-77.southeastasia.logic.azure.com:443/workflows/3dcf20be6af641a4b49eb48727473a47/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uVigg-lTLRaUgLgUdGUnqCt9-TWJC7E7c8ryTjLC0Hw';

    async function fetchReferrals(phone, email) {
        console.log('=== Starting fetchReferrals ===');
        console.log('Phone:', phone);
        console.log('Email:', email);
        
        try {
            console.log('--- Fetching Data via Power Automate ---');
            const response = await fetch(POWER_AUTOMATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, email })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Power Automate Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Power Automate response:', data);
            
            // Handle different response formats
            let referrals = [];
            if (Array.isArray(data)) {
                referrals = data;
            } else if (data && Array.isArray(data.referrals)) {
                referrals = data.referrals;
            } else if (data && Array.isArray(data.value)) {
                referrals = data.value;
            } else if (data) {
                referrals = [data];
            }
            
            console.log(`Received ${referrals.length} referrals`);
            return referrals;
            
        } catch (error) {
            console.error('Error fetching referrals:', error);
            return [];
        }
    }

    return { fetchReferrals };
})();
