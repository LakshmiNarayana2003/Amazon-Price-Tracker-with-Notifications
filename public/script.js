async function checkPrice() {
    const url = document.getElementById('amazonUrl').value;
    const priceLimit = parseFloat(document.getElementById('priceLimit').value);
    
    if (!url || !priceLimit) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading, hide result
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');

    try {
        const response = await fetch('/check-price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, priceLimit })
        });

        const data = await response.json();
        
        if (data.success) {
            document.getElementById('priceResult').innerHTML = `
                Current Price: <strong>₹${data.price}</strong><br>
                Price Limit: <strong>₹${priceLimit}</strong><br>
                Status: <strong>${data.price <= priceLimit ? '🎉 Price is below limit!' : '⏳ Price is above limit'}</strong>
            `;
        } else {
            document.getElementById('priceResult').innerHTML = `
                Error: ${data.error}
            `;
        }
    } catch (error) {
        document.getElementById('priceResult').innerHTML = `
            Error: Could not check price. Please try again.
        `;
    } finally {
        // Hide loading, show result
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('result').classList.remove('hidden');
    }
}