// Connect to Ethereum using ethers.js
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Smart contract address and ABI
const contractAddress = "0x3E604F83389b1A0170f497785B510E7CBf55d13a"; // Deployed to Sepolia testnet
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

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in decimal

// Prompt user to connect their MetaMask wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log("Connected:", userAccount);

            // Check current chain and switch to Sepolia if needed
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== SEPOLIA_CHAIN_ID) {
                await switchToSepolia();
            }
        } catch (error) {
            console.error("Error connecting:", error);
        }
    } else {
        console.error("MetaMask not found.");
    }
}

// Switch to Sepolia testnet
async function switchToSepolia() {
    try {
        // Try to switch to Sepolia
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                // Add Sepolia testnet to MetaMask
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: SEPOLIA_CHAIN_ID,
                            chainName: 'Sepolia Testnet',
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            blockExplorerUrls: ['https://sepolia.etherscan.io'],
                        },
                    ],
                });
            } catch (addError) {
                console.error('Error adding Sepolia network:', addError);
            }
        } else {
            console.error('Error switching to Sepolia:', switchError);
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
