// Connect to Ethereum using ethers.js
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Smart contract address and ABI
const contractAddress = "0x5e950c7A70aDB3331C32b5393E17649fFf4aC0a6"; // Deployed to Arbitrum mainnet
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringStored",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Get the contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Get the account from MetaMask
let userAccount;

// Arbitrum mainnet configuration
const ARBITRUM_CHAIN_ID = "0xa4b1"; // 42161 in decimal

// Prompt user to connect their MetaMask wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log("Connected:", userAccount);

            // Check current chain and switch to Arbitrum if needed
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== ARBITRUM_CHAIN_ID) {
                await switchToArbitrum();
            }
        } catch (error) {
            console.error("Error connecting:", error);
        }
    } else {
        console.error("MetaMask not found.");
    }
}

// Switch to Arbitrum mainnet
async function switchToArbitrum() {
    try {
        // Try to switch to Arbitrum
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ARBITRUM_CHAIN_ID }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                // Add Arbitrum mainnet to MetaMask
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: ARBITRUM_CHAIN_ID,
                            chainName: 'Arbitrum One',
                            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            blockExplorerUrls: ['https://arbiscan.io'],
                        },
                    ],
                });
            } catch (addError) {
                console.error('Error adding Arbitrum network:', addError);
            }
        } else {
            console.error('Error switching to Arbitrum:', switchError);
        }
    }
}

// Store button click event
document.getElementById("storeButton").addEventListener("click", async () => {
    const input = document.getElementById("input").value;
    if (!userAccount) {
        await connectWallet();
    }
    try {
        const tx = await contract.store(input);
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);
    } catch (error) {
        console.error("Error storing string:", error);
    }
});

function createListItem(userName, userString) {
    const listItem = document.createElement("li");

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = userName;
    userNameSpan.className = "user-name";

    const brElement = document.createElement("br");

    const userStringSpan = document.createElement("span");
    userStringSpan.textContent = userString;
    userStringSpan.className = "user-string";

    listItem.appendChild(userNameSpan);
    listItem.appendChild(brElement);
    listItem.appendChild(userStringSpan);

    return listItem;
}

let options = {
    fromBlock: "genesis",
    toBlock: 'latest'
};

// Listen for new StringStored events
contract.on("StringStored", (user, str, event) => {
    console.log("New StringStored event:", { user, str });
    
    // Create and prepend the new list item
    const stringList = document.getElementById("stringList");
    const listItem = createListItem(user, str);
    stringList.insertBefore(listItem, stringList.firstChild);
});

// Load existing events on page load
window.addEventListener('load', async () => {
    if (window.ethereum) {
        await connectWallet();
    }
    
    // Get past events using ethers.js
    try {
        const filter = contract.filters.StringStored();
        const events = await contract.queryFilter(filter, 0, "latest");
        
        // Display existing events in reverse order (newest first)
        const stringList = document.getElementById("stringList");
        events.reverse().forEach(event => {
            const userName = event.args.user;
            const userString = event.args.str;
            const listItem = createListItem(userName, userString);
            stringList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading past events:", error);
    }
});
