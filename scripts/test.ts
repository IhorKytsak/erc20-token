import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const [owner, acc2] = await ethers.getSigners()

  const ERC20Token = await ethers.getContractAt(
    'ERC20Token',
    contractAddress,
    owner
  )

  const ownerBallance = await ERC20Token.balanceOf(owner)
  const totalSupply = await ERC20Token.totalSupply()
  const cap = await ERC20Token.cap()

  // console.log('Owner:', owner)
  console.log('Owner Ballance:', ownerBallance.toString())
  console.log('TotalSupply:', totalSupply.toString())
  console.log('cap:', cap.toString())

  try {
    await ERC20Token.mint(50)

    console.log('Minting successful')
  } catch (error) {
    console.log('Minting failed, InvalidOwner')
  }

  const balanceAfterMint = await ERC20Token.balanceOf(owner)

  console.log('balance after mint 50 TT:', balanceAfterMint.toString())

  try {
    await ERC20Token.burn(50)

    console.log('Burning successful')
  } catch (error) {
    console.log('Burning failed, InvalidOwner')
  }

  const balanceAfterBurn = await ERC20Token.balanceOf(owner)

  console.log('balance after burn 50 TT:', balanceAfterBurn.toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
