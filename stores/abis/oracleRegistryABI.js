export const oracleRegistryABI = [
  {
    inputs: [
      { internalType: "address", name: "vaultParameters", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "oracleByAsset",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "oracleByType",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "oracle", type: "address" },
      { internalType: "uint256", name: "oracleType", type: "uint256" }
    ],
    name: "setOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "vaultParameters",
    outputs: [
      { internalType: "contract VaultParameters", name: "", type: "address" }
    ],
    stateMutability: "view",
    type: "function"
  }
];
