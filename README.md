# StoneText

一个极简的去中心化文本存储协议，基于以太坊智能合约实现。

## 项目理念

### 1. 零过度设计 (Zero Over-Engineering)
- 每一行代码都要有明确的存在的价值
- 拒绝为了技术而技术
- 功能需求优先于技术栈选择

### 2. 原子化变更 (Atomic Changes)
- 每次提交都应该是最小可验证单元
- 单一职责，独立测试
- 小步快跑，快速迭代

### 3. 稳定性优先 (Stability First)
- 生产环境代码必须经过充分测试
- 优先考虑安全性而非功能完整性
- 向后兼容性是核心考量

### 4. 技术栈约束 (Tech Stack Constraints)
- 不引入不必要的依赖
- 选择成熟稳定的技术方案
- 避免框架依赖导致的锁定

### 5. 验证流程 (Verification Process)
- 每个功能都要有对应的验证
- 代码审查关注业务逻辑正确性
- 自动化测试覆盖核心路径

---

## StoneText 合约部署

### 最新部署 (Arbitrum 主网)

- **合约地址**: `0x5e950c7A70aDB3331C32b5393E17649fFf4aC0a6`
- **交易哈希**: `0xf9668543645b40d5b33808111198761f0433434ea093c9c160bb75b53a7fe80a`
- **部署者**: `0x5E81BF553E9Ab75872a47bAd30A0fd3589AD215E`
- **网络**: Arbitrum One 主网
- **部署日期**: 2026-01-13

### 以往部署 (Sepolia 测试网)

- **合约地址**: `0x3E604F83389b1A0170f497785B510E7CBf55d13a`
- **交易哈希**: `0xac3500272e7aba97fe763f24ca6a82ced36db25308519e253c845d0d0c2f2c37`
- **网络**: Sepolia 测试网
- **状态**: 已弃用（仅用于测试）

### 合约详情

- **名称**: StoneText
- **用途**: 在区块链上存储文本字符串并触发事件
- **编译器版本**: Solidity 0.8.30
- **核心函数**: 
  - `store(string memory str)` - 存储字符串并触发 StringStored 事件
- **事件**:
  - `StringStored(address indexed user, string str)`

### 使用方法

1. 安装 MetaMask 浏览器扩展
2. 在浏览器中打开 `index.html`（会自动切换到 Arbitrum）
3. 连接钱包并存储文本消息
4. **注意**: 这是真实的主网，交易会消耗真实的 ETH

### 在 Arbiscan 上查看

[在 Arbiscan 上查看合约](https://arbiscan.io/address/0x5e950c7A70aDB3331C32b5393E17649fFf4aC0a6)

---

## 开发环境

本项目使用 Foundry 进行开发和部署。

### 基础命令

```shell
# 编译合约
$ forge build

# 运行测试
$ forge test

# 格式化代码
$ forge fmt

# Gas 快照
$ forge snapshot

# 启动本地节点
$ anvil

# 部署合约
$ forge script script/StoneText.s.sol --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### 帮助信息

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## 技术架构

- **前端**: 原生 HTML/CSS/JavaScript，无框架依赖
- **智能合约**: Solidity 0.8.30，最小化设计
- **交互**: ethers.js v6，仅连接核心功能
- **网络**: Arbitrum One（低费用，高速度）

## 许可证

MIT License
