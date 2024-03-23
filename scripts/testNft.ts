import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  const [owner, acc1] = await ethers.getSigners()

  const NFT = await ethers.getContractAt('ERC721Token', contractAddress, owner)

  const valueToSendTooLittle = ethers.parseEther('0.001') //cost of 1 nft
  const valueToSend = await NFT.cost()

  console.log('cost:', valueToSend.toString())

  // try {
  //   const mint = await NFT.connect(acc1).mint(1, {
  //     value: valueToSend,
  //   })
  // } catch (error) {
  //   console.log('Failed to mint')
  //   console.log(error)
  // }

  const totalSupply = await NFT.totalSupply()

  // console.log('Owner:', owner)
  console.log('TotalSupply:', totalSupply.toString())

  // const tokenUri = await NFT.tokenURI(1)

  // console.log('tokenUri:', tokenUri)

  //! appproving NFT transaction
  // const approved = await NFT.approve(acc1, 1)
  // const approvedMarcetplace = await NFT.approve(
  //   '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
  //   1
  // )

  // const getApproved = await NFT.getApproved(1)
  // console.log('getApproved for nft 1', getApproved)

  //! check NFTs of acc
  const ownerNFTs = await NFT.walletOfOwner(acc1)
  console.log(
    'Owner NFTs:',
    ownerNFTs.map((ownerNFT) => ownerNFT.toString())
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
