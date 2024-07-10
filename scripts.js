async function fetchData() {
    const walletAddress = document.getElementById('walletAddress').value;
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.keungz.com/well-claim/${walletAddress}`;
    try {
        const response = await fetch(apiUrl);
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
            const tokenId = item.contractArguments.NFTClaimable.tokenId;
            const airdrop = BigInt(item.contractArguments.NFTClaimable.airdropTotalClaimable);
            const rewards = BigInt(item.contractArguments.NFTClaimable.rewardsTotalClaimable);

            totalAirdrop += airdrop;
            totalRewards += rewards;

            const imgUrl = data.nftImages[classType][tokenId];
            const percentage = (Number(rewards) / Number(airdrop) * 100).toFixed(2);

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <h3>Token ID: ${tokenId}</h3>
                <img src="${imgUrl}" alt="${classType} Image">
                <p>Locked Rewards: ${(airdrop / BigInt(1e18)).toString()}</p>
                <p>Unlocked Rewards: ${(rewards / BigInt(1e18)).toString()}</p>
                <p>Unlocked Percentage: ${percentage}%</p>
            `;
            gallery.appendChild(galleryItem);
        });
    });

    const totalPercentage = (Number(totalRewards) / Number(totalAirdrop) * 100).toFixed(2);
    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = `Total Locked Rewards: ${(totalAirdrop / BigInt(1e18)).toString()} | Total Unlocked Rewards: ${(totalRewards / BigInt(1e18)).toString()} | Total Unlocked Percentage: ${totalPercentage}%`;
}
