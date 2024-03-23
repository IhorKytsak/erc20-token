import { run, ethers, network } from 'hardhat'

import type { AddressLike } from 'ethers'

async function main() {
  const name = 'TestNFT'
  const symbol = 'TNFT'
  const baseUrl = 'ipfs:/QmdphAmPUnrrywUtbbWB61LwYfGsk3NZfsSjyxE8V3AMAM/'
  const ERC721Token = await ethers.getContractFactory('ERC721Token')

  console.log(`Deploying...`)

  const contract = await ERC721Token.deploy(name, symbol, baseUrl)

  await contract.waitForDeployment()

  console.log(`Contract address ${contract.target}`)

  if (network.name === 'sepolia') {
    console.log(`Waiting for verification...`)
    await contract.deploymentTransaction()?.wait(6)
    await verify(contract.target, [name, symbol, baseUrl])
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
