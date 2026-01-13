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

### Latest Deployment (Sepolia Testnet)

- **Contract Address**: `0x3E604F83389b1A0170f497785B510E7CBf55d13a`
- **Transaction Hash**: `0xac3500272e7aba97fe763f24ca6a82ced36db25308519e253c845d0d0c2f2c37`
- **Deployer**: `0x5E81BF553E9Ab75872a47bAd30A0fd3589AD215E`
- **Network**: Sepolia Testnet
- **Deploy Date**: 2026-01-13

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
2. Switch to Sepolia testnet
3. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
4. Open `index.html` in your browser
5. Connect your wallet and store text messages

### View on Etherscan

[View Contract on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x3E604F83389b1A0170f497785B510E7CBf55d13a)
