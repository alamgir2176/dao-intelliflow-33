# DAO Smart Contracts

This folder contains minimal smart contracts for the AI DAO Governance Platform.

## Contracts

### 1. DAO.sol
Core DAO contract that handles:
- DAO creation with name and description
- Member management (add/remove members)
- Proposal creation and management
- Voting mechanism
- Proposal execution

### 2. DAOFactory.sol
Factory contract for deploying new DAOs:
- Creates new DAO instances
- Tracks all DAOs and user's DAOs
- Provides pagination for DAO listings
- Manages DAO records and metadata

### 3. GovernanceToken.sol
ERC20-compatible governance token with:
- Standard token functionality (transfer, approve, etc.)
- Delegation mechanism for voting power
- Vote tracking and delegation
- Mint/burn functionality

## Deployment Instructions

1. **Compile contracts** using your preferred Solidity compiler (Hardhat/Foundry/Remix)
2. **Deploy GovernanceToken** first (optional, if you want token-based voting)
3. **Deploy DAOFactory** 
4. **Create DAOs** through the factory contract

## Network Configuration

The frontend is already configured for:
- **Hyperion Testnet** (Chain ID: 133717)
- **LazAI Pre-Testnet** (Chain ID: 133718)

## Integration Steps

After deployment:

1. **Copy contract addresses** from your deployment
2. **Copy ABIs** from compiled contracts
3. **Update frontend** with contract addresses and ABIs
4. **Test integration** with wagmi hooks

## Usage Flow

1. Users connect wallet via RainbowKit
2. Create DAO through DAOFactory
3. Add members to DAO
4. Create proposals
5. Members vote on proposals
6. Execute successful proposals

## Security Notes

- These are minimal contracts for demonstration
- Add proper access controls for production
- Consider timelock mechanisms for governance
- Implement proper voting quorums
- Add emergency pause functionality

## Frontend Integration

Use wagmi hooks to interact with contracts:
```typescript
import { useContractWrite, useContractRead } from 'wagmi'

// Example: Create DAO
const { write: createDAO } = useContractWrite({
  address: DAO_FACTORY_ADDRESS,
  abi: daoFactoryAbi,
  functionName: 'createDAO',
})
```