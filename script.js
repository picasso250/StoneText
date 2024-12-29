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
            console.log("ABI loaded successfully:", contractABI);
            callback && callback(contractABI);
        })
        .catch(error => {
            console.error("Failed to load ABI:", error);
        });
}

loadABI(function (contractABI) {

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
            await contract.methods.updateStatus(input).send({ from: userAccount });
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

    // Listen for new events
    contract.events.StatusLog({
        fromBlock: "genesis"
    }, function (error, event) {
        if (error) {
            console.error(error);
        } else {
            const userName = event.returnValues.user;
            const userString = event.returnValues.newStatus;

            // Create and prepend the new list item
            const stringList = document.getElementById("stringList");
            const listItem = createListItem(userName, userString);
            stringList.insertBefore(listItem, stringList.firstChild);
        }
    });
});
