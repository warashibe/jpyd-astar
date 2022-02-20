const { ethers } = require("hardhat")
const { constants } = require("@openzeppelin/test-helpers")
const { expect } = require("chai")
const { MAX_UINT256 } = constants
const { from18, to18, a, deploy } = require("../lib/utils")
const B = require("big.js")
const { EIP712Domain, domainSeparator } = require("../lib/eip712")
const Wallet = require("ethereumjs-wallet").default

const { fromRpcSig } = require("ethereumjs-util")
const ethSigUtil = require("eth-sig-util")

const Permit = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
]

describe("JPYD", function () {
  let deployer, spender
  let jpyd

  const name = "JPY Dog"
  const symbol = "JPYD"
  const version = "1"

  const wallet = Wallet.generate()
  const owner = wallet.getAddressString()
  const value = to18("100")
  const nonce = 0
  const maxDeadline = MAX_UINT256

  const buildData = (chainId, verifyingContract, deadline = maxDeadline) => ({
    primaryType: "Permit",
    types: { EIP712Domain, Permit },
    domain: { name, version, chainId, verifyingContract },
    message: {
      owner,
      spender: a(spender),
      value: B(value).toFixed(),
      nonce,
      deadline,
    },
  })

  beforeEach(async () => {
    ;[deployer, spender] = await ethers.getSigners()
    jpyd = await deploy("JPYDMock")
    await jpyd.mint(jpyd.address, 10000)
  })

  it("accepts owner signature", async function () {
    const minter = await jpyd.MINTER_ROLE()
    const chainId = B(await jpyd.getChainId()).toFixed() * 1
    expect(B(await jpyd.nonces(a(deployer))).toFixed()).to.equal("0")
    expect(await jpyd.DOMAIN_SEPARATOR()).to.equal(
      await domainSeparator(name, version, chainId, a(jpyd))
    )
    const data = buildData(chainId, a(jpyd))
    const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), {
      data,
    })
    const { v, r, s } = fromRpcSig(signature)
    const receipt = await jpyd.permit(
      owner,
      a(spender),
      value,
      B(maxDeadline).toFixed(),
      v,
      r,
      s
    )
    await receipt.wait()
    expect(B(await jpyd.nonces(owner)).toFixed()).to.equal("1")
    expect(B(await jpyd.allowance(owner, a(spender))).toFixed()).to.equal(
      B(value).toFixed()
    )
  })
})
