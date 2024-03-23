import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const [owner, acc1] = await ethers.getSigners()

  const ERC20Token = await ethers.getContractAt(
    'ERC20Token',
    contractAddress,
    owner
  )

  const ownerBallance = await ERC20Token.balanceOf(owner)
  const totalSupply = await ERC20Token.totalSupply()
  const cap = await ERC20Token.cap()

  // console.log('Owner:', owner)
  // console.log('Owner Ballance:', ownerBallance.toString())
  console.log('TotalSupply:', totalSupply.toString())
  // console.log('cap:', cap.toString())

  //! Mint tokens
  // try {
  //   await ERC20Token.mint(50)

  //   console.log('Minting successful')
  // } catch (error) {
  //   console.log('Minting failed, InvalidOwner')
  // }

  // const balanceAfterMint = await ERC20Token.balanceOf(owner)

  // console.log('balance after mint 50 TT:', balanceAfterMint.toString())

  //! Burn tokens
  // try {
  //   await ERC20Token.burn(50)

  //   console.log('Burning successful')
  // } catch (error) {
  //   console.log('Burning failed, InvalidOwner')
  // }

  // const balanceAfterBurn = await ERC20Token.balanceOf(owner)

  // console.log('balance after burn 50 TT:', balanceAfterBurn.toString())

  //! Buy tokens
  // try {
  //   const valueToSend = ethers.parseEther('0.1')
  //   await ERC20Token.connect(acc1).buyToken({
  //     value: valueToSend,
  //   })

  //   const ballance = await ERC20Token.balanceOf(acc1.address)

  //   console.log('Token received:', ballance.toString())
  // } catch (error) {
  //   console.log('Burning failed, InvalidOwner')
  // }

  //! Set allowance
  // try {
  //   const valueToAllow = ethers.parseEther('0.2')
  //   const marketplaceAddr = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788'
  //   await ERC20Token.connect(acc1).approve(marketplaceAddr, valueToAllow)

  //   const allowance = await ERC20Token.allowance(acc1.address, marketplaceAddr)

  //   console.log('Allowance:', allowance.toString())
  // } catch (error) {
  //   console.log('Burning failed, InvalidOwner')
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
