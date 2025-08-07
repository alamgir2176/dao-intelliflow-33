// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DAO.sol";

contract DAOFactory {
    struct DAORecord {
        address daoAddress;
        string name;
        string description;
        address creator;
        uint256 createdAt;
        bool isActive;
    }

    mapping(address => address[]) public userDAOs;
    mapping(address => DAORecord) public daoRecords;
    address[] public allDAOs;
    uint256 public totalDAOs;

    event DAOCreated(
        address indexed daoAddress,
        string name,
        address indexed creator,
        uint256 timestamp
    );

    function createDAO(
        string memory _name,
        string memory _description
    ) external returns (address) {
        require(bytes(_name).length > 0, "DAO name cannot be empty");
        require(bytes(_description).length > 0, "DAO description cannot be empty");

        DAO newDAO = new DAO(_name, _description, msg.sender);
        address daoAddress = address(newDAO);

        // Record the DAO
        daoRecords[daoAddress] = DAORecord({
            daoAddress: daoAddress,
            name: _name,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });

        // Add to user's DAOs
        userDAOs[msg.sender].push(daoAddress);
        
        // Add to all DAOs
        allDAOs.push(daoAddress);
        totalDAOs++;

        emit DAOCreated(daoAddress, _name, msg.sender, block.timestamp);
        return daoAddress;
    }

    function getUserDAOs(address _user) external view returns (address[] memory) {
        return userDAOs[_user];
    }

    function getAllDAOs() external view returns (address[] memory) {
        return allDAOs;
    }

    function getDAORecord(address _daoAddress) external view returns (DAORecord memory) {
        return daoRecords[_daoAddress];
    }

    function getUserDAOCount(address _user) external view returns (uint256) {
        return userDAOs[_user].length;
    }

    function getDAOsByPage(uint256 _page, uint256 _limit) 
        external 
        view 
        returns (address[] memory daos, uint256 totalPages) 
    {
        require(_limit > 0, "Limit must be greater than 0");
        
        uint256 startIndex = _page * _limit;
        require(startIndex < allDAOs.length, "Page out of bounds");
        
        uint256 endIndex = startIndex + _limit;
        if (endIndex > allDAOs.length) {
            endIndex = allDAOs.length;
        }
        
        uint256 resultLength = endIndex - startIndex;
        daos = new address[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            daos[i] = allDAOs[startIndex + i];
        }
        
        totalPages = (allDAOs.length + _limit - 1) / _limit;
    }
}