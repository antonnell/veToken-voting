export const vaultMangerStandardABI = [
  {
    inputs: [
      { internalType: "address payable", name: "_vault", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "main",
        type: "uint256"
      },
      { indexed: false, internalType: "uint256", name: "usdp", type: "uint256" }
    ],
    name: "Exit",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "main",
        type: "uint256"
      },
      { indexed: false, internalType: "uint256", name: "usdp", type: "uint256" }
    ],
    name: "Join",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "mainAmount", type: "uint256" }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "deposit_Eth",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "usdpAmount", type: "uint256" }
    ],
    name: "repay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "mainAmount", type: "uint256" }
    ],
    name: "repayAllAndWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "ethAmount", type: "uint256" }],
    name: "repayAllAndWithdraw_Eth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "vault",
    outputs: [{ internalType: "contract Vault", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
];
