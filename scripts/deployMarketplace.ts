import { run, ethers, network } from 'hardhat'

import type { AddressLike } from 'ethers'

async function main() {
  const erc20TestAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const nftTestAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  const erc20Address = '0xe8bab5cd7f95fbc0cd3b1dadc455a6bbfac53e18'
  const nftAddress = '0xF8373E9A09160Df4DBAB6A123f5bd424325F407d'

  const Marketplace = await ethers.getContractFactory('Marketplace')

  console.log(`Deploying...`)

  const contract = await Marketplace.deploy(nftAddress, erc20Address)

  await contract.waitForDeployment()

  console.log(`Contract address ${contract.target}`)

  if (network.name === 'sepolia') {
    console.log(`Waiting for verification...`)
    await contract.deploymentTransaction()?.wait(6)
    await verify(contract.target, [nftAddress, erc20Address])
  }
}

async function verify(address: AddressLike, constructorArguments: any[]) {
  await run('verify:verify', {
    address,
    constructorArguments,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
