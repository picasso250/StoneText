// Connect to an Ethereum node using Web3.js
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0x4f4B0BaBC9591796cf1ca2636FD9F6520C18953e";
let userAccount;

// Load ABI and initialize contract
function loadABI(callback) {
    fetch("./ABI.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(callback)
        .catch(error => console.error("Failed to load ABI:", error));
}

// Connect to user's wallet
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

// Encrypt and decrypt functions
function encryptMessage(message, key) {
    return CryptoJS.AES.encrypt(message, key).toString();
}

function decryptMessage(ciphertext, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

// Create list item for new events
function createListItem(userName, userString) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span class="user-name">${userName}</span><br><span class="user-string">${userString}</span>`;
    return listItem;
}

// Listen for new events
function listenForEvents(contract) {
    contract.events.StatusLog({ fromBlock: "genesis" }, (error, event) => {
        if (error) return console.error(error);
        const key = document.getElementById("keyInput").value;
        const userName = event.returnValues.user;
        const encryptedStatus = event.returnValues.newStatus;
        const decryptedStatus = key ? decryptMessage(encryptedStatus, key) || "解密失败" : encryptedStatus;
        const stringList = document.getElementById("stringList");
        stringList.insertBefore(createListItem(userName, decryptedStatus), stringList.firstChild);
    });
}

// Load ABI and initialize contract
loadABI((contractABI) => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    listenForEvents(contract);

    // Event listener for button click
    document.getElementById("okButton").addEventListener("click", async () => {
        const input = document.getElementById("input").value;
        const key = document.getElementById("keyInput").value;

        if (!userAccount) await connectWallet();
        if (!key) return alert("请输入密钥！");

        const encryptedMessage = encryptMessage(input, key);
        try {
            await contract.methods.updateStatus(encryptedMessage).send({ from: userAccount });
            console.log("Message stored successfully:", encryptedMessage);
        } catch (error) {
            console.error("Error storing encrypted message:", error);
        }
    });
});