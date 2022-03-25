var onboarding = null;
var onboardButton = document.getElementById('onboard');
var chainlistLink = document.getElementById('chainlist');

var accounts;

const updateButton = () => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    onboardButton.innerText = 'Click here to install MetaMask!';
    onboardButton.onclick = () => {
        onboardButton.innerText = 'Onboarding in progress';
        onboardButton.disabled = true;
        onboarding.startOnboarding();
    };
    } else if (accounts && accounts.length > 0) {
        onboardButton.innerText = 'Connected';
        onboardButton.disabled = true;
        chainlistLink.style.visibility = 'hidden';
        onboarding.stopOnboarding();
        
    } else {
        onboardButton.innerText = 'Connect to MetaMask';
        chainlistLink.style.visibility = 'visible';

        onboardButton.onclick = async () => {
        await window.ethereum.request({
        method: 'eth_requestAccounts',
        });
    };
    }
};

window.addEventListener('DOMContentLoaded', () => {
    onboarding = new MetaMaskOnboarding();

    updateButton();
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {

        window.ethereum.on('accountsChanged', (newAccounts) => {
            accounts = newAccounts;
            updateButton();
            document.getElementById('addr').value = accounts[0];
        });
        if (window.ethereum.isConnected()) {
            window.ethereum.request({ method: 'eth_accounts' }).then((result) => {
                document.getElementById('addr').value = result;
                onboardButton.innerText = 'Connected';
                onboardButton.disabled = true;
                chainlistLink.style.visibility = 'hidden';
            });
        }
    }
    console.log("Page Loaded.");
});

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        onboarding = new MetaMaskOnboarding();

        updateButton();
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    
            window.ethereum.on('accountsChanged', (newAccounts) => {
                accounts = newAccounts;
                updateButton();
                document.getElementById('addr').value = accounts[0];
            });
            if (window.ethereum.isConnected()) {
                window.ethereum.request({ method: 'eth_accounts' }).then((result) => {
                    if (result.length > 0) {
                        document.getElementById('addr').value = result;
                        onboardButton.innerText = 'Connected';
                        onboardButton.disabled = true;
                        chainlistLink.style.visibility = 'hidden';
                    }
                });
            }
        }
    
        console.log("Page Complete.");
    }
  }
