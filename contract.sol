// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint256 id;
        address payable owner;
        string title;
        string description;
        uint256 price;
        bool purchased;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    
    event ItemListed(uint256 id, address owner, string title, string description, uint256 price);
    event ItemPurchased(uint256 id, address buyer, address seller, string title, uint256 price);

    function listNewItem(string memory _title, string memory _description, uint256 _price) external {
        itemCount++;
        items[itemCount] = Item(itemCount, payable(msg.sender), _title, _description, _price, false);
        emit ItemListed(itemCount, msg.sender, _title, _description, _price);
    }

    function purchaseItem(uint256 _id) external payable {
        require(_id > 0 && _id <= itemCount, "Invalid item ID");
        Item storage item = items[_id];
        require(!item.purchased, "Item already purchased");
        require(msg.value >= item.price, "Insufficient funds");

        item.purchased = true;
        item.owner = payable(msg.sender); // Change owner to buyer
        item.owner.transfer(item.price); // Send amount to seller
        emit ItemPurchased(_id, msg.sender, item.owner, item.title, item.price);
    }

    function getAllItems() external view returns (Item[] memory) {
        Item[] memory allItems = new Item[](itemCount);
        for (uint256 i = 1; i <= itemCount; i++) {
            allItems[i - 1] = items[i];
        }
        return allItems;
    }

}
