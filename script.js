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

function createListItem(userName, userString) {
    const listItem = document.createElement("li");
    const userNameSpan = document.createElement("span");
    userNameSpan.className = "user-name";
    userNameSpan.textContent = userName; // 使用 textContent
    
    const userStringSpan = document.createElement("span");
    userStringSpan.className = "user-string";
    userStringSpan.textContent = userString; // 使用 textContent

    listItem.appendChild(userNameSpan);
    listItem.appendChild(document.createElement("br"));
    listItem.appendChild(userStringSpan);
    
    return listItem;
}

const okButton = document.getElementById("okButton");

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
        okButton.disabled = false; // Re-enable the button after operation
    });
}

const decryptButton = document.getElementById("decryptButton");

// Toggle Decrypt button visibility
function toggleDecryptButton() {
    const key = document.getElementById("keyInput").value;
    decryptButton.style.display = key ? "block" : "none";
}

// Decrypt all records
function decryptAllRecords() {
    const key = document.getElementById("keyInput").value;
    const listItems = document.querySelectorAll("#stringList li");
    listItems.forEach(item => {
        const encryptedString = item.querySelector(".user-string").innerText;
        const decryptedString = decryptMessage(encryptedString, key);
        item.querySelector(".user-string").innerText = decryptedString || encryptedString; // If decryption fails, keep original
    });
    decryptButton.style.display = "none";
}

// Load ABI and initialize contract
loadABI((contractABI) => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    listenForEvents(contract);

    // Event listener for button click
    okButton.addEventListener("click", async () => {

        const text = document.getElementById("textInput").value.trim();
        const key = document.getElementById("keyInput").value.trim();

        if (!text) {
            return alert("请输入状态！");
        }

        if (!userAccount) await connectWallet();
        if (!key) {
            return alert("请输入密钥！");
        }
        
        okButton.disabled = true; // Disable the button

        const encryptedMessage = encryptMessage(text, key);
        try {
            await contract.methods.updateStatus(encryptedMessage).send({ from: userAccount });
            console.log("Message stored successfully:", encryptedMessage);
        } catch (error) {
            console.error("Error storing encrypted message:", error);
        } finally {
            okButton.disabled = false; // Re-enable the button after operation
        }
    });

    // Event listener for decrypt button
    decryptButton.addEventListener("click", decryptAllRecords);

    // Event listener for key input change
    document.getElementById("keyInput").addEventListener("input", toggleDecryptButton);
});