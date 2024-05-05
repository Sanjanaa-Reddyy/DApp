const contractAddress = '0x0bb9EA9E43BA4c9f1582dE8D9c3C9F541F76457F'; // Replace with your contract address
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ItemListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ItemPurchased",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllItems",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "purchased",
						"type": "bool"
					}
				],
				"internalType": "struct Marketplace.Item[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_seller",
				"type": "address"
			}
		],
		"name": "getSellerItems",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "itemCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "purchased",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listNewItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "purchaseItem",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sellerItems",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let marketplaceContract;
let accounts = []

window.addEventListener('load', async () => {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('listNewItemBtn').addEventListener('click', showListNewItem);
    document.getElementById('buyItemBtn').addEventListener('click', showBuyItem);
    document.getElementById('ownedBtn').addEventListener('click', showOwned);
});

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            //await window.ethereum.enable();
            accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            marketplaceContract = new web3.eth.Contract(abi, contractAddress);
            document.getElementById('connectWallet').innerText = "Wallet Connected";
            document.getElementById('connectWallet').disabled = true;
            document.getElementById('listNewItemBtn').style.display = "inline-block";
            document.getElementById('buyItemBtn').style.display = "inline-block";
            document.getElementById('ownedBtn').style.display = "inline-block";
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("Error connecting to wallet. Please check the console for details.");
        }
    } else {
        alert("Please install MetaMask.");
    }
}

async function listItem(title, description, price) {
    try {
        const accounts = await web3.eth.getAccounts();
        const transaction = await marketplaceContract.methods.listNewItem(title, description, web3.utils.toWei(price, "ether")).send({ from: accounts[0] });
        openListingPopup(transaction.transactionHash);
        document.getElementById('listItemForm').reset(); // Clear the form
    } catch (error) {
        console.error("Error listing item:", error);
        alert("Error listing item. Please check the console for details.");
    }
}

function openListingPopup(hash) {
    let message = `Item listed successfully! <br> Transaction Hash: ${hash}. <br> <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank">View on Etherscan</a>`
    document.getElementById('popupMessage').innerHTML = message;
    document.getElementById('popup').style.display = "block";
}

function openPurchasingingPopup(hash) {
    let message = `Item purchased successfully! <br> Transaction Hash: ${hash}. <br> <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank">View on Etherscan</a>`
    document.getElementById('popupMessage').innerHTML = message;
    document.getElementById('popup').style.display = "block";
}

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('popup').style.display = "none";
}


document.getElementById('listItemForm').addEventListener('submit', submitForm);

async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const price = document.getElementById('price').value;

    await listItem(title, description, price);
}

async function purchaseItem(id, price) {
    try {
        const accounts = await web3.eth.getAccounts();
        transaction = await marketplaceContract.methods.purchaseItem(id).send({ from: accounts[0], value: price });
        openPurchasingingPopup(transaction.transactionHash);
        showBuyItem();
    } catch (error) {
        console.error("Error purchasing item:", error);
    }
}

async function displayItems() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = "";

    const accounts = await web3.eth.getAccounts();
    const itemCount = await marketplaceContract.methods.itemCount().call();
    for (let i = 1; i <= itemCount; i++) {
        const item = await marketplaceContract.methods.items(i).call();
        if (!item.purchased && item.owner.toLowerCase() !== accounts[0].toLowerCase()) {
            const itemCard = document.createElement('div');
            itemCard.innerHTML = `
                <h3>${he.encode(item.title)}</h3>
                <p>${he.encode(item.description)}</p>
                <p>Price: ${web3.utils.fromWei(item.price, 'ether')} ETH</p>
                <button onclick="purchaseItem(${item.id}, ${item.price})">Purchase</button>
            `;
            itemsList.appendChild(itemCard);
        }
    }
}


async function displayOwnedItems() {
    const ownedItemsList = document.getElementById('ownedItemsList');
    ownedItemsList.innerHTML = "";

    const accounts = await web3.eth.getAccounts();
    const itemCount = await marketplaceContract.methods.itemCount().call();
    for (let i = 1; i <= itemCount; i++) {
        const item = await marketplaceContract.methods.items(i).call();
        if (item.owner.toLowerCase() === accounts[0].toLowerCase()) {
            const itemCard = document.createElement('div');
            //itemCard.innerHTML 
            let data = `
                <h3>${he.encode(item.title)}</h3>
                <p>${he.encode(item.description)}</p>
                <p>Price: ${web3.utils.fromWei(item.price, 'ether')} ETH</p>
                
            `;
            if(item.purchased == false){
                data += `<p style="color: green;">Listed for sale</p>
                <hr>
                `;
            }else{
                data += `<hr>`
            }
            itemCard.innerHTML = data;
            ownedItemsList.appendChild(itemCard);
        }
    }
}

function showListNewItem() {
    document.getElementById('listNewItemSection').style.display = "block";
    document.getElementById('buyItemSection').style.display = "none";
    document.getElementById('ownedSection').style.display = "none";
}

function showBuyItem() {
    document.getElementById('listNewItemSection').style.display = "none";
    document.getElementById('buyItemSection').style.display = "block";
    document.getElementById('ownedSection').style.display = "none";
    displayItems();
}

function showOwned() {
    document.getElementById('listNewItemSection').style.display = "none";
    document.getElementById('buyItemSection').style.display = "none";
    document.getElementById('ownedSection').style.display = "block";
    displayOwnedItems();
}
