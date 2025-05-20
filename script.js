// Replace this part with actual API call:
async function fetchReferrals(phone, email) {
    const response = await fetch(`YOUR_API_ENDPOINT?phone=${phone}&email=${email}`);
    return await response.json();
}
