const fs = require("fs")
const weighted = require('weighted')
const sha256 = require('js-sha256')

/* 
* @dev number of items in the collection
*/
const collectionNum = 123 // Change this to your desired collection number

/* 
* @dev attribute rules to prevent certian conmbinations from existing
* example rule is commented out below
* caution - the more rules added may impact the final rarity score compared to the predefined weights
* if no rules are needed, then comment out or remove if statement(s) and only return true
*/
const attributeRules = (_nft) => {
    // if (_nft.Background == 'yellow' && (_nft.Shape == 'triangle' || _nft.Shape == 'square')) {
    //     return false
    // }
    return true
}

const getTraitNames = () => {
    return fs.readFileSync('./tnames.dat').toString().trim().split(/\s+/)
}

const getWeights = () => {
    return fs.readFileSync('./weights.dat').toString().split(/\r\n/)
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
    fs.writeFileSync('./imageTraits.csv', csv)
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
            const rarity = occurance / collectionNum
            csv += element + ',' + rarity.toFixed(5) + '\n'
        }
        )
    }
    csv = csv.trim()
    fs.writeFileSync('./rarity.csv', csv)
}

const run = async () => {
    const hrstart = process.hrtime()
    const traitNames = getTraitNames()
    const weights = getWeights()
    const traitsPositions = []

    let combinations

    fs.readdir(`./traits`, (err, traitGroups) => {
        if (err) console.log(err)
        comboArr = []
        for (let i = 1; i <= traitGroups.length; i++) {
            comboArr.push(fs.readdirSync(`./traits/trait${i}`).length)
        }
        combinations = comboArr[0]
        for (let z = 1; z < comboArr.length; z++) {
            combinations = comboArr[z] * combinations
        }

        if (combinations < collectionNum) {
            console.log('NOT ENOUGH TRAITS TO FULFILL COLLECTION NUMBER')
        } else {

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
                const attributeFiles = fs.readdirSync(`./traits/trait${c + 1}`)

                for (let d = 0; d < attributeFiles.length; d++) {
                    const attribute = attributeFiles[d].replace(/\.[^/.]+$/, "")
                    const weight = weights[traitsPositions[c] + d + 1]
                    obj[attribute] = parseFloat(weight)
                }
            }
            const nftAttributes = []
            const nftHashes = []
            let attempts = 0

            for (var e = collectionNum; e--;) {
                if (combinations < attempts) {
                    console.log('NOT ENOUGH TRAITS TO FULFILL COLLECTION NUMBER')
                    return
                }
                const nft = getAttributes(traitsAndWeights)
                const nftHash = sha256(JSON.stringify(nft))
                if (nftHashes.includes(nftHash)) { e++; continue }
                const legal = attributeRules(nft)
                if (!legal) {
                    attempts++
                    e++ 
                    continue
                }
                if (attempts > 0) attempts = 0
                nftHashes.push(nftHash)
                nftAttributes.push(nft)
            }

            generateTraitTable(traitNames, nftAttributes)
            generateRarityTable(traitNames, nftAttributes, traitsAndWeights)

            const hrend = process.hrtime(hrstart)
            console.info('Generated Image Trait Table (imageTraits.csv) and Rarity Table (rarity.csv). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        }
    })
}

run()
