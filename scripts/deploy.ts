import { run, ethers, network } from 'hardhat'

import type { AddressLike } from 'ethers'

async function main() {
  const ERC20Token = await ethers.getContractFactory('ERC20Token')

  console.log(`Deploying...`)

  const contract = await ERC20Token.deploy()

  await contract.waitForDeployment()

  console.log(`Contract address ${contract.target}`)

  // const owner = await contract.owner()
  // console.log('Owner:', owner)

  if (network.name === 'sepolia') {
    console.log(`Waiting for verification...`)
    await contract.deploymentTransaction()?.wait(6)
    await verify(contract.target, [])
  }
}

async function verify(address: AddressLike, constructorArguments: any[]) {
  await run('verify:verify', {
    address,
    constructorArguments,
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
