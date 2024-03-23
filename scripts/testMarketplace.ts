import { ethers } from 'hardhat'

async function main() {
  const contractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'

  const [owner, acc1] = await ethers.getSigners()

  const Marketplace = await ethers.getContractAt(
    'Marketplace',
    contractAddress,
    owner
  )

  // const erc20 = await Marketplace.erc20()
  // const nft = await Marketplace.nft()
  // console.log('erc20:', erc20)
  // console.log('nft:', nft)

  //! Put NFT on sale
  // await Marketplace.putNFTOnSale(1)
  //! Remove NFT from sale
  // await Marketplace.removeNFTFromSale(1)

  for (let i = 1; i <= 3; i++) {
    const isonSale = await Marketplace.tokenIdForSale(i)

    console.log('isonSale-', i, '--', isonSale)
  }

  //! Buy NFT
  // try {
  //   const valueToSend = ethers.parseEther('0.001') //cost of 1 nft
  //   const buy = await Marketplace.connect(acc1).buyNFT(1)

  //   console.log('buy is successfull!!!')
  // } catch (error) {
  //   console.log('Failed to buy')
  //   console.log(error)
  // }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
