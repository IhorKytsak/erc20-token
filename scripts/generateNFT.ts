import mergeImages from 'merge-images'
import { Canvas, Image } from 'node-canvas'
import { MersenneTwister19937, bool, real } from 'random-js'
import path from 'path'
import fs from 'fs'

import { content } from '../layers/content'

const layersPath = path.join(process.cwd(), 'layers')

function saveBase64Image(base64PngImage: string, fileName: string) {
  const base64 = base64PngImage.split(',')[1]
  const imageBuffer = Buffer.from(base64, 'base64')

  fs.writeFileSync(fileName, imageBuffer)
}

async function margeLayersAndSave(layers: string[], outputFile: string) {
  const image = await mergeImages(layers, { Canvas: Canvas, Image: Image })
  saveBase64Image(image, outputFile)
}

type IOption = {
  name: string
  file: string
  weight: number
}

type ILayer = {
  name: string
  probability: number
  options: IOption[]
}

function randomlySelectedLayers(layersPath: string, layers: Array<ILayer>) {
  const mt = MersenneTwister19937.autoSeed()

  let images = []
  let selectedTraits: { [key: string]: string } = {}

  for (const layer of layers) {
    if (bool(layer.probability)(mt)) {
      let selected = pickWeighted(mt, layer.options)
      selectedTraits[layer.name] = selected.name
      images.push(path.join(layersPath, layer.name, selected.file))
    }
  }

  return { images, selectedTraits }
}

function pickWeighted(mt: MersenneTwister19937, options: IOption[]): IOption {
  const weightSum = options.reduce((acc, option) => {
    return acc + (option.weight ?? 1.0)
  }, 0)

  const r = real(0.0, weightSum, false)(mt)

  let summedWeight = 0.0
  let choosenOption = options[0]
  for (const option of options) {
    summedWeight += option.weight ?? 1.0
    if (r < summedWeight) {
      choosenOption = option
      return option
    }
  }
  return choosenOption
}

function generateMetadata(content: any, tokenId: number, traits: any) {
  let attributes: any = []
  for (const [trait_type, value] of Object.entries(traits)) {
    attributes.push({
      trait_type,
      value,
    })
  }
  return content.metadataTemplate(tokenId, attributes)
}

async function generateNFT(
  num: number,
  layersPath: string,
  outputPath: string
) {
  let generated = new Set()

  for (let tokenId = 1; tokenId < num; tokenId++) {
    console.log(`Generating NFT #${tokenId} ...`)
    let selection = randomlySelectedLayers(layersPath, content.layers)
    const traits = JSON.stringify(selection.selectedTraits)

    if (generated.has(traits)) {
      console.log('Duplicate detected. Retrying...')
      tokenId--
      continue
    } else {
      generated.add(traits)
      await margeLayersAndSave(
        selection.images,
        path.join(outputPath, 'images', `${tokenId}.png`)
      )

      let metadata = generateMetadata(
        content,
        tokenId,
        selection.selectedTraits
      )
      fs.writeFileSync(
        path.join(outputPath, 'json', `${tokenId}.json`),
        JSON.stringify(metadata, null, 2)
      )
    }
  }
}

const outputPath = path.join(process.cwd(), 'build')
generateNFT(100, layersPath, outputPath)
