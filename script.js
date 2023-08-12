// Connect to an Ethereum node using Web3.js
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Smart contract address and ABI
const contractAddress = "0x6F4715FA5f41a567e27146800E4447396B20259d"; // Replace with your contract address
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
        "inputs": [],
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
    const input = document.getElementById("input").value;
    if (!userAccount) {
        await connectWallet();
    }
    try {
        await contract.methods.store(input).send({ from: userAccount });
    } catch (error) {
        console.error("Error storing string:", error);
    }
});

let options = {
    fromBlock: "genesis",
    toBlock: 'latest'
};

contract.getPastEvents("StringStored", options)
    .then(results => {
        const stringList = document.getElementById("stringList");
        results.forEach(event => {
            const listItem = document.createElement("li");
            const userName = event.returnValues.user;
            const userString = event.returnValues.str;
            listItem.textContent = `${userName}: ${userString}`;
            stringList.appendChild(listItem);
        });
    })
    .catch(err => { throw err; });


contract.once("allEvents", {
    fromBlock: "genesis"
}, function (error, event) {
    if (error) {
        console.error(error);
    } else {
        if (event.event === "StringStored") {
            const userName = event.returnValues.user;
            const userString = event.returnValues.str;
            console.log(`User: ${userName}, String: ${userString}`);
        }
    }
});
