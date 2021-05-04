export const vaultManagerParamsABI = [
  {
    inputs: [
      { internalType: "address", name: "_vaultParameters", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "devaluationPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "initialCollateralRatio",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "liquidationDiscount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "liquidationRatio",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "maxColPercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "minColPercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "min", type: "uint256" },
      { internalType: "uint256", name: "max", type: "uint256" }
    ],
    name: "setColPartRange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "stabilityFeeValue", type: "uint256" },
      { internalType: "uint256", name: "liquidationFeeValue", type: "uint256" },
      {
        internalType: "uint256",
        name: "initialCollateralRatioValue",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "liquidationRatioValue",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "liquidationDiscountValue",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "devaluationPeriodValue",
        type: "uint256"
      },
      { internalType: "uint256", name: "usdpLimit", type: "uint256" },
      { internalType: "uint256[]", name: "oracles", type: "uint256[]" },
      { internalType: "uint256", name: "minColP", type: "uint256" },
      { internalType: "uint256", name: "maxColP", type: "uint256" }
    ],
    name: "setCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "newValue", type: "uint256" }
    ],
    name: "setDevaluationPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "newValue", type: "uint256" }
    ],
    name: "setInitialCollateralRatio",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "newValue", type: "uint256" }
    ],
    name: "setLiquidationDiscount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "newValue", type: "uint256" }
    ],
    name: "setLiquidationRatio",
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
