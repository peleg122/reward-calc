async function fetchData() {
    const walletAddress = document.getElementById('walletAddress').value;
    const apiUrl = `https://api.keungz.com/well-claim/${walletAddress}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayData(data) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    let totalAirdrop = BigInt(0);
    let totalRewards = BigInt(0);

    ['kzg', 'kubz', 'ygpz'].forEach(classType => {
        data.airdropNFTSignatures[classType].forEach(item => {
            const airdrop = BigInt(item.contractArguments.NFTClaimable.airdropTotalClaimable);
            const rewards = BigInt(item.contractArguments.NFTClaimable.rewardsTotalClaimable);

            totalAirdrop += airdrop;
            totalRewards += rewards;

            const imgUrl = data.nftImages[classType][item.contractArguments.NFTClaimable.tokenId];
            const percentage = (Number(rewards) / Number(airdrop) * 100).toFixed(2);

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${imgUrl}" alt="${classType} Image">
                <p>Airdrop: ${(airdrop / BigInt(1e18)).toString()}</p>
                <p>Rewards: ${(rewards / BigInt(1e18)).toString()}</p>
                <p>Percentage: ${percentage}%</p>
            `;
            gallery.appendChild(galleryItem);
        });
    });

    const totalPercentage = (Number(totalRewards) / Number(totalAirdrop) * 100).toFixed(2);
    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = `Total Airdrop: ${(totalAirdrop / BigInt(1e18)).toString()} | Total Rewards: ${(totalRewards / BigInt(1e18)).toString()} | Total Percentage: ${totalPercentage}%`;
}
