// Connect to an Ethereum node using Web3.js
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Smart contract address and ABI
const contractAddress = "0x3B8976FD5FB5bF01960446438D24E45Fcb199cf1"; // Replace with your contract address
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "key1",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "value1",
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
                "name": "key",
                "type": "string"
            }
        ],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "key",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "value",
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
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get the account from MetaMask
let userAccount;

// Prompt user to connect their MetaMask wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.enable();
            userAccount = (await web3.eth.getAccounts())[0];
            console.log("Connected:", userAccount);
        } catch (error) {
            console.error("Error connecting:", error);
        }
    } else {
        console.error("MetaMask not found.");
    }
}

// Store button click event
document.getElementById("storeButton").addEventListener("click", async () => {
    const urlInput = document.getElementById("urlInput").value;
    const commentInput = document.getElementById("commentInput").value;

    if (!userAccount) {
        await connectWallet();
    }

    try {
        await contract.methods.store(urlInput, commentInput).send({ from: userAccount });
    } catch (error) {
        console.error("Error storing comment:", error);
    }
});

function processUrlInput(inputId) {
    const inputElement = document.getElementById(inputId);
    const inputValue = inputElement.value;

    // Remove http/https and protocol
    let correctedUrl = inputValue.replace(/https?:\/\//i, "");

    // Remove query string and hash
    correctedUrl = correctedUrl.split(/[?#]/)[0];

    inputElement.value = correctedUrl;
}

document.getElementById("urlInput").addEventListener("input", () => {
    processUrlInput("urlInput");
});

document.getElementById("retrieveUrlInput").addEventListener("input", () => {
    processUrlInput("retrieveUrlInput");
});


// Retrieve button click event
document.getElementById("retrieveButton").addEventListener("click", async () => {
    const retrieveUrlInput = document.getElementById("retrieveUrlInput").value;

    try {
        const comment = await contract.methods.retrieve(retrieveUrlInput).call();
        document.getElementById("retrievedComment").textContent = comment;
    } catch (error) {
        console.error("Error retrieving comment:", error);
    }
});

function createListItem(url, comment) {
    const listItem = document.createElement("li");

    const urlAnchor = document.createElement("a");
    urlAnchor.textContent = url;
    urlAnchor.href = "https://" + url;
    urlAnchor.target = "_blank"; // Open in a new tab/window
    urlAnchor.className = "url";

    const brElement = document.createElement("br");

    const commentSpan = document.createElement("span");
    commentSpan.textContent = comment;
    commentSpan.className = "comment";

    listItem.appendChild(urlAnchor);
    listItem.appendChild(brElement);
    listItem.appendChild(commentSpan);

    return listItem;
}

// Listen for new StringStored events
contract.events.StringStored({
    fromBlock: "genesis"
}, function (error, event) {
    if (error) {
        console.error(error);
    } else {
        const userName = event.returnValues.key1;
        const userString = event.returnValues.value1;

        // Create and prepend the new list item
        const stringList = document.getElementById("stringList");
        const listItem = createListItem(userName, userString);
        stringList.insertBefore(listItem, stringList.firstChild);
    }
});
