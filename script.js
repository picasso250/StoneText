// Connect to an Ethereum node using Web3.js
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Smart contract address and ABI
const contractAddress = "0x4f4B0BaBC9591796cf1ca2636FD9F6520C18953e";

function loadABI(callback) {
    fetch("./ABI.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(contractABI => {
            callback && callback(contractABI);
        })
        .catch(error => {
            console.error("Failed to load ABI:", error);
        });
}

loadABI(function (contractABI) {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
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

    // AES encryption
    function encryptMessage(message, key) {
        return CryptoJS.AES.encrypt(message, key).toString();
    }

    // AES decryption
    function decryptMessage(ciphertext, key) {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Decryption failed:", error);
            return null;
        }
    }

    // Store button click event
    document.getElementById("storeButton").addEventListener("click", async () => {
        const input = document.getElementById("input").value;
        const key = document.getElementById("keyInput").value;

        if (!userAccount) {
            await connectWallet();
        }

        if (!key) {
            alert("请输入密钥！");
            return;
        }

        const encryptedMessage = encryptMessage(input, key);

        try {
            await contract.methods.updateStatus(encryptedMessage).send({ from: userAccount });
            console.log("Message stored successfully:", encryptedMessage);
        } catch (error) {
            console.error("Error storing encrypted message:", error);
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

    // Listen for new events
    contract.events.StatusLog({
        fromBlock: "genesis"
    }, function (error, event) {
        if (error) {
            console.error(error);
        } else {
            const key = document.getElementById("keyInput").value;

            const userName = event.returnValues.user;
            const encryptedStatus = event.returnValues.newStatus;

            let decryptedStatus = encryptedStatus;
            if (key) {
                decryptedStatus = decryptMessage(encryptedStatus, key) || "解密失败";
            }

            const stringList = document.getElementById("stringList");
            const listItem = createListItem(userName, decryptedStatus);
            stringList.insertBefore(listItem, stringList.firstChild);
        }
    });
});
