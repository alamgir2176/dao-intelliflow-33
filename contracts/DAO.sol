// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true for "for", false for "against"
    }

    struct DAOInfo {
        string name;
        string description;
        address creator;
        uint256 memberCount;
        uint256 proposalCount;
        bool isActive;
    }

    DAOInfo public daoInfo;
    mapping(address => bool) public members;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCounter;

    event DAOCreated(string name, address creator);
    event MemberAdded(address member);
    event MemberRemoved(address member);
    event ProposalCreated(uint256 proposalId, string title, address proposer);
    event VoteCast(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId);

    modifier onlyMember() {
        require(members[msg.sender], "Not a DAO member");
        _;
    }

    modifier onlyCreator() {
        require(msg.sender == daoInfo.creator, "Not the DAO creator");
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        address _creator
    ) {
        daoInfo = DAOInfo({
            name: _name,
            description: _description,
            creator: _creator,
            memberCount: 1,
            proposalCount: 0,
            isActive: true
        });
        
        members[_creator] = true;
        emit DAOCreated(_name, _creator);
        emit MemberAdded(_creator);
    }

    function addMember(address _member) external onlyCreator {
        require(!members[_member], "Already a member");
        members[_member] = true;
        daoInfo.memberCount++;
        emit MemberAdded(_member);
    }

    function removeMember(address _member) external onlyCreator {
        require(members[_member], "Not a member");
        require(_member != daoInfo.creator, "Cannot remove creator");
        members[_member] = false;
        daoInfo.memberCount--;
        emit MemberRemoved(_member);
    }

    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _votingDuration
    ) external onlyMember returns (uint256) {
        uint256 proposalId = proposalCounter++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.title = _title;
        proposal.description = _description;
        proposal.proposer = msg.sender;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + _votingDuration;
        proposal.forVotes = 0;
        proposal.againstVotes = 0;
        proposal.executed = false;

        daoInfo.proposalCount++;
        emit ProposalCreated(proposalId, _title, msg.sender);
        return proposalId;
    }

    function vote(uint256 _proposalId, bool _support) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = _support;

        if (_support) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        emit VoteCast(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");

        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }

    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        string memory title,
        string memory description,
        address proposer,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.proposer,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }

    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }

    function getVote(uint256 _proposalId, address _voter) external view returns (bool) {
        require(proposals[_proposalId].hasVoted[_voter], "Voter has not voted");
        return proposals[_proposalId].voteChoice[_voter];
    }

    function isMember(address _address) external view returns (bool) {
        return members[_address];
    }

    function getDAOInfo() external view returns (DAOInfo memory) {
        return daoInfo;
    }
}