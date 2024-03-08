import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
describe('ERC20Token', () => {
  async function deployTokenFixture() {
    const cap = ethers.parseEther('1500')
    const amount = ethers.parseEther('1000')

    const [owner, adr1, adr2] = await ethers.getSigners()

    const TokenFactory = await ethers.getContractFactory('ERC20Token')
    const token = await TokenFactory.deploy()

    return { token, cap, amount, owner, adr1, adr2 }
  }

  describe('Deployment', function () {
    it('Should set the right totalSupply', async function () {
      const { token, amount } = await loadFixture(deployTokenFixture)

      expect(await token.totalSupply()).to.equal(amount)
    })

    it('Should set the right cap', async function () {
      const { token, cap } = await loadFixture(deployTokenFixture)

      expect(await token.cap()).to.equal(cap)
    })

    it('Should set the right owner', async function () {
      const { token, owner } = await loadFixture(deployTokenFixture)

      expect(await token.owner()).to.equal(owner.address)
    })

    it('Should assign the total supply of tokens to the owner', async () => {
      const { token, owner } = await loadFixture(deployTokenFixture)

      const ownerBalance = await token.balanceOf(owner.address)
      expect(await token.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe('Buy Token', function () {
    it('Should allow users to buy tokens with ETH', async function () {
      const { token, owner, adr1 } = await loadFixture(deployTokenFixture)

      const ethAmount = ethers.parseEther('1') // 10 TT for 1 ETH

      expect(
        await token.connect(adr1).buyToken({ value: ethAmount })
      ).to.changeTokenBalances(token, [owner, adr1], [-10, 10])

      expect(await token.balanceOf(adr1.address)).to.equal(
        ethers.parseEther('10')
      )
      expect(await ethers.provider.getBalance(token.target)).to.equal(
        ethers.parseEther('1')
      )
    })

    it('Should buy tokens when receive called', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      const ethAmount = ethers.parseEther('1')

      await adr1.sendTransaction({ to: token.target, value: ethAmount })

      expect(await token.balanceOf(adr1.address)).to.equal(
        ethers.parseEther('10')
      )
    })

    it('Should buy tokens when fallback called', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      const ethAmount = ethers.parseEther('1')

      await adr1.sendTransaction({
        to: token.target,
        value: ethAmount,
        data: '0x00',
      })

      expect(await token.balanceOf(adr1.address)).to.equal(
        ethers.parseEther('10')
      )
    })

    it('Should revert if no ETH is sent', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      await expect(token.connect(adr1).buyToken()).to.be.rejectedWith(
        'Send ETH to buy some tokens'
      )
    })

    it('Should revert if the contract has insufficient tokens', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      const ethAmount = ethers.parseEther('1001')

      await expect(
        token.connect(adr1).buyToken({ value: ethAmount })
      ).to.be.rejectedWith('Contract has not enough tokens')
    })
  })

  describe('Minting', function () {
    it('Should allow the owner to mint new tokens', async function () {
      const { token, owner } = await loadFixture(deployTokenFixture)

      const mintAmount = 50
      const initialOwnerBalance = await token.balanceOf(owner.address)
      await token.mint(mintAmount)

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance + ethers.parseEther(mintAmount.toString())
      )
    })

    it('Should not allow non-owners to mint tokens', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      const mintAmount = 50

      await expect(token.connect(adr1).mint(mintAmount)).to.be.rejectedWith(
        'Invalid Owner'
      )
    })
  })

  describe('Burning', function () {
    it('Should allow the owner to burn tokens', async function () {
      const { token, owner } = await loadFixture(deployTokenFixture)

      const burnAmount = 50

      const initialOwnerBalance = await token.balanceOf(owner.address)
      await token.burn(burnAmount)

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - ethers.parseEther(burnAmount.toString())
      )
    })

    it('Should not allow non-owners to burn tokens', async function () {
      const { token, adr1 } = await loadFixture(deployTokenFixture)

      const burnAmount = 50

      await expect(token.connect(adr1).burn(burnAmount)).to.be.rejectedWith(
        'Invalid Owner'
      )
    })

    it('Should not allow burning more tokens than the account balance', async function () {
      const { token, amount } = await loadFixture(deployTokenFixture)

      const burnAmount = amount + BigInt(1)

      await expect(token.burn(burnAmount)).to.be.revertedWithCustomError(
        token,
        'ERC20InsufficientBalance'
      )
    })
  })

  describe('Token Transfer', function () {
    it('Should transfer tokens between accounts', async function () {
      const { token, owner, adr1 } = await loadFixture(deployTokenFixture)

      const transferAmount = 10

      await expect(
        token.transfer(adr1.address, transferAmount)
      ).to.changeTokenBalances(
        token,
        [owner, adr1],
        [-transferAmount, transferAmount]
      )
    })

    it("Should not allow transferring more than the sender's balance", async function () {
      const { token, owner, adr1 } = await loadFixture(deployTokenFixture)

      const initialBalanceOwner = await token.balanceOf(owner.address)
      const transferAmount = initialBalanceOwner + BigInt('1')

      await expect(
        token.transfer(adr1.address, transferAmount)
      ).to.be.revertedWithCustomError(token, 'ERC20InsufficientBalance')
    })

    it('Should update allowance and transfer tokens from another account', async function () {
      const { token, owner, adr1, adr2 } = await loadFixture(deployTokenFixture)

      const transferAmount = 10
      await token.approve(adr1.address, transferAmount)
      await token
        .connect(adr1)
        .transferFrom(owner.address, adr2.address, transferAmount)

      expect(await token.allowance(owner.address, adr1.address)).to.equal(0)
      expect(await token.balanceOf(adr2.address)).to.equal(transferAmount)
    })

    it('Should not allow transferring more than allowed amount', async function () {
      const { token, owner, adr1, adr2 } = await loadFixture(deployTokenFixture)

      const transferAmount = 10
      await token.approve(adr1.address, transferAmount - 1)

      await expect(
        token
          .connect(adr1)
          .transferFrom(owner.address, adr2.address, transferAmount)
      ).to.be.revertedWithCustomError(token, 'ERC20InsufficientAllowance')
    })
  })
})
