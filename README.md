## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## StoneText Contract Deployment

### Latest Deployment (Arbitrum Mainnet)

- **Contract Address**: `0x5e950c7A70aDB3331C32b5393E17649fFf4aC0a6`
- **Transaction Hash**: `0xf9668543645b40d5b33808111198761f0433434ea093c9c160bb75b53a7fe80a`
- **Deployer**: `0x5E81BF553E9Ab75872a47bAd30A0fd3589AD215E`
- **Network**: Arbitrum One Mainnet
- **Deploy Date**: 2026-01-13

### Previous Deployment (Sepolia Testnet)

- **Contract Address**: `0x3E604F83389b1A0170f497785B510E7CBf55d13a`
- **Transaction Hash**: `0xac3500272e7aba97fe763f24ca6a82ced36db25308519e253c845d0d0c2f2c37`
- **Network**: Sepolia Testnet
- **Status**: Deprecated (used for testing only)

### Contract Details

- **Name**: StoneText
- **Purpose**: Store text strings on blockchain with events
- **Compiler Version**: solidity 0.8.30
- **Functions**: 
  - `store(string memory str)` - Store a string and emit StringStored event
- **Events**:
  - `StringStored(address indexed user, string str)`

### How to Use

1. Install MetaMask browser extension
2. Open `index.html` in your browser (will automatically switch to Arbitrum)
3. Connect your wallet and store text messages
4. **Note**: This is the real mainnet, transactions cost real ETH

### View on Arbiscan

[View Contract on Arbiscan](https://arbiscan.io/address/0x5e950c7A70aDB3331C32b5393E17649fFf4aC0a6)
