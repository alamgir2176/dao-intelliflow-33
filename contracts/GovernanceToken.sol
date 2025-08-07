// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GovernanceToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Governance features
    mapping(address => address) public delegates;
    mapping(address => uint256) public votingPower;
    mapping(address => uint256) public nonces;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _initialHolder
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply * 10**decimals;
        balanceOf[_initialHolder] = totalSupply;
        votingPower[_initialHolder] = totalSupply;
        delegates[_initialHolder] = _initialHolder;
        emit Transfer(address(0), _initialHolder, totalSupply);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Transfer to zero address");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function delegate(address _delegatee) public {
        address currentDelegate = delegates[msg.sender];
        uint256 delegatorBalance = balanceOf[msg.sender];
        
        delegates[msg.sender] = _delegatee;
        
        emit DelegateChanged(msg.sender, currentDelegate, _delegatee);
        
        _moveDelegates(currentDelegate, _delegatee, delegatorBalance);
    }

    function getCurrentVotes(address _account) external view returns (uint256) {
        return votingPower[_account];
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        
        _moveDelegates(delegates[_from], delegates[_to], _value);
        
        emit Transfer(_from, _to, _value);
    }

    function _moveDelegates(address _srcRep, address _dstRep, uint256 _amount) internal {
        if (_srcRep != _dstRep && _amount > 0) {
            if (_srcRep != address(0)) {
                uint256 srcRepOld = votingPower[_srcRep];
                uint256 srcRepNew = srcRepOld - _amount;
                votingPower[_srcRep] = srcRepNew;
                emit DelegateVotesChanged(_srcRep, srcRepOld, srcRepNew);
            }
            
            if (_dstRep != address(0)) {
                uint256 dstRepOld = votingPower[_dstRep];
                uint256 dstRepNew = dstRepOld + _amount;
                votingPower[_dstRep] = dstRepNew;
                emit DelegateVotesChanged(_dstRep, dstRepOld, dstRepNew);
            }
        }
    }

    function mint(address _to, uint256 _amount) external {
        // Note: In production, this should have proper access control
        require(_to != address(0), "Mint to zero address");
        
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        
        _moveDelegates(address(0), delegates[_to], _amount);
        
        emit Transfer(address(0), _to, _amount);
    }

    function burn(uint256 _amount) external {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        
        totalSupply -= _amount;
        balanceOf[msg.sender] -= _amount;
        
        _moveDelegates(delegates[msg.sender], address(0), _amount);
        
        emit Transfer(msg.sender, address(0), _amount);
    }
}