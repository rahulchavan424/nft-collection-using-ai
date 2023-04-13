import * as express from 'express';
import App from "./index";

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('$> [API]\tGET /')
  res.status(200).send(`Welcome to the Starton API !\nCurrent time is : ` + new Date().toISOString());
  console.log('$> [API]\tGET / - SUCCESS')
});

router.post('/generate', async (req, res) => {
  console.log('$> [API]\tPOST /generate')

  if (!req.body) {
    const error: string = 'Body is missing in your request'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  if (!req.body.collectionName || !req.body.nbPictures || !req.body.prompt) {
    const error: string = 'Incomplete request, you must provide collectionName, nbPictures and prompt fields'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  try {
    const pictureArray = await App.openAi.generatePictures(req.body)
    console.log('pictureArray - ', pictureArray)
    console.log('$> [API]\tPOST /generate - SUCCESS')
    return res.status(200).send(pictureArray)
  } catch (e) {
    console.error(e)
    return res.status(502).send({
      message: "OpenAI is not responding",
      error: e
    })
  }
});

router.post('/deploy', async (req, res) => {
  console.log('$> [API]\tPOST /deploy')

  if (!req.body) {
    const error: string = 'Body is missing in your request'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  if (!req.body.smartContractName || !req.body.smartContractSymbol || !req.body.ownerWallet || !req.body.pictures || !req.body.network) {
    const error: string = 'Incomplete request, you must provide address, smartContractName and pictures fields'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  if (!req.body.ownerWallet.match(/0x[a-fA-F0-9]{40}/)) {
    const error: string = 'Invalid Ethereum address format'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  console.log('body - ', req.body)

  const network: string = req.body.network
  const smartContractName: string = req.body.smartContractName
  const smartContractSymbol: string = req.body.smartContractSymbol
  const ownerWallet = req.body.ownerWallet
  const pictures: Array<string> = req.body.pictures ? req.body.pictures : []

  if (!pictures.length) {
    const error: string = 'Incomplete request, pictures array should not be empty'
    console.log(error)
    return res.status(400).send({
      message: error,
      error: null
    })
  }

  console.log(pictures)

  let picturesBuffers: Array<Buffer> = []

  try {
    picturesBuffers = await App.openAi.extractPictureBuffers(pictures)
  } catch (e) {
    return res.status(403).send({
      message: 'Could not get picture data',
      error: e
    })
  }

  console.log('picturesBuffers - ', picturesBuffers)

  let picturesCids: Array<string> = []

  try {
    picturesCids = await App.starton.uploadPicturesOnIPFS(picturesBuffers)
  } catch (e) {
    return res.status(500).send({
      message: 'Could not upload pictures on IPFS',
      error: e
    })
  }

  console.log('picturesCids - ', picturesCids)

  let metadataCids: Array<string> = []

  try {
    metadataCids = await App.starton.uploadMetadataOnIPFS(smartContractName, picturesCids)
  } catch (e) {
    return res.status(500).send({
      message: 'Could not upload metadata on IPFS',
      error: e
    })
  }

  console.log('metadataCids - ', metadataCids)

  let contract: string = ''

  try {
    contract = await App.starton.deployContract(network, smartContractName, smartContractSymbol, picturesCids.length, metadataCids[0])
  } catch (e) {
    return res.status(500).send({
      message: 'Could not deploy ERC721 smart-contract',
      error: e
    })
  }

  console.log('contract - ', contract)


  await new Promise(f=>setTimeout(f, 5000))


  let transactions
  try {
    transactions = await App.starton.mintCollection(network, smartContractName, contract, ownerWallet, metadataCids)
  } catch (e) {
    return res.status(500).send({
      message: 'Could not mint NFT',
      error: e
    })
  }

  console.log('transactions - ', transactions)
  console.log('$> [API]\tPOST /deploy - SUCCESS')

  console.log('CCC')
  return res.status(201).send({
    message: 'Collection successfully deployed',
    smartContractAddress: contract,
    error: null
  })
});

export { router as Router }
