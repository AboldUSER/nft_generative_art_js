const fs = require("fs")
const weighted = require('weighted')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas')
const sha256 = require('js-sha256')
const hrstart = process.hrtime()

// Change this to the number of images to create
const imgNum = 100

const getTraitNames = () => {
    return fs.readFileSync('tnames.dat').toString().trim().split(/\s+/)
}

const getWeights = () => {
    return fs.readFileSync('weights.dat').toString().split(/\r\n/)
}

const getAttributes = (_traitsAndWeights) => {
    const attributes = {}
    for (let i = 0; i < _traitsAndWeights.length; i++) {
        generatedAttribute = weighted.select(_traitsAndWeights[i][1])
        attributes[_traitsAndWeights[i][0]] = generatedAttribute
    }
    return attributes
}

const generateTraitTable = (_traitNames, _nftAttributes) => {
    let header = 'Image #,' + _traitNames.join() + '\n'
    let csv = header
    let imageCounter = 1
    _nftAttributes.forEach(element => {
        csv += imageCounter + ',' + Object.values(element).join() + '\n'
        ++imageCounter
    })
    csv = csv.trim()
    fs.writeFileSync('imageTraits.csv', csv)
}

const generateRarityTable = (_traitNames, _nftAttributes, _traitsAndWeights) => {
    let header = 'Trait,Rarity' + '\n'
    let csv = header

    for (let i = 0; i < _traitNames.length; i++) {
        csv += _traitNames[i] + '\n'
        const traits = Object.keys(_traitsAndWeights[i][1])

        traits.forEach(element => {
            let occurance = 0
            _nftAttributes.forEach(el => {
                let trait = _traitNames[i]
                if (el[trait] == element) {
                    occurance = occurance + 1
                }
            })
            const rarity = occurance / imgNum
            csv += element + ',' + rarity.toFixed(5) + '\n'
        }
        )
    }
    csv = csv.trim()
    fs.writeFileSync('rarity.csv', csv)
}

const generateImages = (_traitNames, _nftAttributes) => {
    let imgCounter = 1

    _nftAttributes.forEach(async element => {
        const arr = []
        const imgAttributes = Object.values(element)
        let imgAttCounter = 1
        imgAttributes.forEach(el => {
            arr.push(`traits/trait${imgAttCounter}/${el}.png`)
            imgAttCounter += 1
        })
        mergeImages(arr, {
            Canvas: Canvas,
            Image: Image
        })
            .then(base64 => {
                let base64Image = base64.split(';base64,').pop()
                fs.writeFile(`images/${imgCounter}.png`, base64Image, { encoding: 'base64' }, function (err) {
                    if (err) { console.log(err) }
                })
                imgCounter += 1
            })
    })
}

function run() {
    const traitNames = getTraitNames()
    const weights = getWeights()
    const traitsPositions = []

    for (let a = 0; a <= traitNames.length; a++) {
        for (let b = 0; b < weights.length; b++) {
            if (weights[b].match(`#Trait ${a}`)) {
                traitsPositions.push(b)
            }
        }
    }

    const traitsAndWeights = []
    for (let c = 0; c < traitNames.length; c++) {
        traitsAndWeights.push([traitNames[c]])
        const obj = {}
        traitsAndWeights[c].push(obj)
        const attributeFiles = fs.readdirSync(`traits/trait${c + 1}`)

        for (let d = 0; d < attributeFiles.length; d++) {
            const attribute = attributeFiles[d].replace(/\.[^/.]+$/, "")
            const weight = weights[traitsPositions[c] + d + 1]
            obj[attribute] = parseFloat(weight)
        }
    }
    const nftAttributes = []
    const nftHashes = []

    for (var e = imgNum; e--;) {
        const nft = getAttributes(traitsAndWeights)
        const nftHash = sha256(JSON.stringify(nft))
        if (nftHashes.includes(nftHash)) { e++; continue }
        nftHashes.push(nftHash)
        nftAttributes.push(nft)
    }

    generateTraitTable(traitNames, nftAttributes)
    generateRarityTable(traitNames, nftAttributes, traitsAndWeights)
    generateImages(traitNames, nftAttributes)
}

run()
const hrend = process.hrtime(hrstart)
console.info('Generated Images (./images), Image Trait Table (imageTraits.csv), and Rarity Table (rarity.csv). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)