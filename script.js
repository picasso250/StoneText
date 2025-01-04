
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
    listItem.className = "article-item";
    const userNameSpan = document.createElement("span");
    userNameSpan.className = "user-name";
    userNameSpan.textContent = userName; // 使用 textContent

    const userStringSpan = document.createElement("span");
    userStringSpan.className = "user-string";
    userStringSpan.innerHTML = marked.parse(userString, { sanitize: true }); // Render Markdown safely

    listItem.appendChild(userNameSpan);
    listItem.appendChild(document.createElement("br"));
    listItem.appendChild(userStringSpan);

    return listItem;
}

const okButton = document.getElementById("okButton");

// Update title
document.title = "文章存储地";

const articleList = document.getElementById("articleList");

// Listen for new events
function listenForEvents(contract) {
    contract.events.StatusLog({ fromBlock: "genesis" }, (error, event) => {
        if (error) return console.error(error);
        const userName = event.returnValues.user;
        const encryptedStatus = event.returnValues.newStatus;
        const decryptedStatus = encryptedStatus; // No decryption
        articleList.insertBefore(createListItem(userName, decryptedStatus), articleList.firstChild);
        // Re-render MathJax after new article is added
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise && MathJax.typesetPromise();
        }
        okButton.disabled = false; // Re-enable the button after operation
    });
}

// Load ABI and initialize contract
loadABI((contractABI) => {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    listenForEvents(contract);

    // Event listener for button click
    okButton.addEventListener("click", async () => {
        const text = editor.getValue().trim();

        if (!text) {
            return alert("请输入状态！");
        }

        if (!userAccount) await connectWallet();

        okButton.disabled = true; // Disable the button

        const encryptedMessage = text; // No encryption
        try {
            contract.methods.updateStatus(encryptedMessage).send({ from: userAccount })
                .on("transactionHash", hash => {
                    console.log("Transaction hash:", hash);
                    okButton.textContent = "写入中..."; // Change button text
                    editor.setValue(''); // Clear the editor content
                })
                .on("receipt", receipt => {
                    console.log("Transaction receipt:", receipt);
                    okButton.textContent = "确认"; // Reset button text
                })
                .on("confirmation", (confirmationNumber, receipt) => {
                    okButton.textContent = "确认"; // Reset button text
                    okButton.disabled = false; // Re-enable the button after operation
                    console.log("Confirmation number:", confirmationNumber, receipt);
                })
                .on("error", error => {
                    console.error("Transaction error:", error);
                    okButton.textContent = "确认"; // Reset button text
                    okButton.disabled = false; // Re-enable the button after operation
                });
        } catch (error) {
            console.error("Error storing message:", error);
            okButton.textContent = "确认"; // Reset button text
        }
    });

    // Remove event listener for decrypt button
    // decryptButton.addEventListener("click", decryptAllRecords);

    // Remove event listener for key input change
    // document.getElementById("keyInput").addEventListener("input", toggleDecryptButton);
});
