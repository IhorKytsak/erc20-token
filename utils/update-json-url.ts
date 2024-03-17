import fs from 'fs'
import path from 'path'
import 'dotenv/config'

const jsonFolder = path.join(process.cwd(), 'build', 'json')
// const baseUrl = `https://ipfs.io/ipfs/${process.env.PINATA_IMAGES_CID}`
const baseUrl = `ipfs://${process.env.PINATA_IMAGES_CID}`

fs.readdir(jsonFolder, (err, files) => {
  if (err) throw err

  files.forEach((file) => {
    const jsonFile = path.join(jsonFolder, file)
    const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8')) as any

    const [fileName] = file.split('.')

    json.image = `${baseUrl}/${fileName}.png`

    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2))
    console.log(`Updated ${file}`)
  })
})
