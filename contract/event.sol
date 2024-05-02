// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTFactory is ERC721, Ownable {
    using SafeMath for uint256;

    // Event structure
    struct Event {
        uint256 eventId;
        address creator;
        uint256 poolPrize;
        uint256 startTime;
        string endTime;
        bool closed;
        mapping(address => bool) winners;
        string imageUrl;
        string eventname;
    }

    // Mapping from event ID to Event
    mapping(uint256 => Event) public events;

    // Counter for event IDs
    uint256 public eventIdCounter;

    // Constructor for NFTFactory
    constructor() ERC721("ShardEvent", "SE") Ownable(msg.sender) {}

    // Create an event, mint an NFT, and deposit prize pool
    function createEvent(string memory _eventName ,string  memory _endTime, uint256 _prizepool, string memory _imageUrl) external payable {
        require(msg.value == _prizepool, "Deposit amount must be greater than zero");

        // Mint new NFT
        _safeMint(msg.sender, eventIdCounter);

        events[eventIdCounter].eventId = eventIdCounter;
        events[eventIdCounter].eventname = _eventName;
        events[eventIdCounter].creator = msg.sender; // Store the creator's address
        events[eventIdCounter].poolPrize = msg.value;
        events[eventIdCounter].startTime = block.timestamp;
        events[eventIdCounter].endTime = _endTime;
        events[eventIdCounter].closed = false;
        events[eventIdCounter].imageUrl = _imageUrl;

        // Increment event ID counter
        eventIdCounter++;
    }

    // Close an event and distribute prizes to winners
    function closeEvent(uint256 _eventId, address winner1, address winner2) external {
        require(_eventId < eventIdCounter, "Invalid event ID");
        require(!events[_eventId].closed, "Event is already closed");
        require(winner1 != address(0) && winner2 != address(0), "Invalid winners");

        // Mark event as closed
        events[_eventId].closed = true;

        // Distribute prizes to winners
        uint256 prizePerWinner1 = events[_eventId].poolPrize * 2 / 3;
        uint256 prizePerWinner2 = events[_eventId].poolPrize - prizePerWinner1;

        // Transfer prize to winners
        _safeTransfer(msg.sender, winner1, _eventId);
        payable(winner1).transfer(prizePerWinner1);
        payable(winner2).transfer(prizePerWinner2);

        // Mark winners in the event
        events[_eventId].winners[winner1] = true;
        events[_eventId].winners[winner2] = true;
    }

    // Get all events (returning details in separate arrays)
    function getAllEvents()
        external
        view
        returns (
            uint256[] memory eventIds,
             string[] memory eventNames,
            address[] memory creators,
            uint256[] memory poolPrizes,
            uint256[] memory startTimes,
            string[] memory endTimes,
            bool[] memory closedStatus,
            string[] memory imageUrls
            
        )
    {
        eventIds = new uint256[](eventIdCounter);
        creators = new address[](eventIdCounter);
        poolPrizes = new uint256[](eventIdCounter);
        startTimes = new uint256[](eventIdCounter);
        endTimes = new string[](eventIdCounter);
        closedStatus = new bool[](eventIdCounter);
        imageUrls = new string[](eventIdCounter);
         eventNames = new string[](eventIdCounter); 

        for (uint256 i = 0; i < eventIdCounter; i++) {
            eventIds[i] = events[i].eventId;
            eventNames[i] = events[i].eventname;
            creators[i] = events[i].creator;
            poolPrizes[i] = events[i].poolPrize;
            startTimes[i] = events[i].startTime;
            endTimes[i] = events[i].endTime;
            closedStatus[i] = events[i].closed;
            imageUrls[i] = events[i].imageUrl;
        }

        return (eventIds,eventNames, creators, poolPrizes, startTimes, endTimes, closedStatus, imageUrls);
    }
}
