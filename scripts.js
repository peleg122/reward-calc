function fetchData() {
    const walletAddress = document.getElementById('walletAddress').value;
    const apiUrl = `https://api.keungz.com/well-claim/${walletAddress}?callback=processData`;

    const oldScript = document.getElementById('jsonp-script');
    const newScript = document.createElement('script');
    newScript.id = 'jsonp-script';
    newScript.src = apiUrl;

    // Replace old script with new script
    oldScript.parentNode.replaceChild(newScript, oldScript);
}

function processData(response) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    let totalAirdrop = BigInt(0);
    let totalRewards = BigInt(0);

    ['kzg', 'kubz', 'ygpz'].forEach(classType => {
        response.airdropNFTSignatures[classType].forEach(item => {
            const airdrop = BigInt(item.contractArguments.NFTClaimable.airdropTotalClaimable);
            const rewards = BigInt(item.contractArguments.NFTClaimable.rewardsTotalClaimable);

            totalAirdrop += airdrop;
            totalRewards += rewards;

            const imgUrl = response.nftImages[classType][item.contractArguments.NFTClaimable.tokenId];
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${imgUrl}" alt="${classType} Image">
                <p>Airdrop: ${(airdrop / BigInt(1e18)).toString()}</p>
                <p>Rewards: ${(rewards / BigInt(1e18)).toString()}</p>
            `;
            gallery.appendChild(galleryItem);
        });
    });

    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = `Total Airdrop: ${(totalAirdrop / BigInt(1e18)).toString()} | Total Rewards: ${(totalRewards / BigInt(1e18)).toString()}`;
}
