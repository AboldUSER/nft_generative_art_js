const fs = require("fs")
const hrstart = process.hrtime()

// Change these variables to align with the project
const metadataDescription = 'This is a sample project description'
const metadataName = 'Sample Project'
const metadataImageStorageHash = 'Q1234'

const attData = fs.readFileSync('imageTraits.csv', 'utf8')

const traitNames = fs.readFileSync('tnames.dat').toString().trim().split(/\s+/)

function run() {

    const dirExists = fs.statSync('./metadata',{throwIfNoEntry: false} )
    
    if (!dirExists) {
        fs.mkdirSync('./metadata')
      }

    const csvData = []
    let lbreak = attData.split("\n")
    lbreak.forEach(res => {
        csvData.push(res.split(","))
    })
    let metadataObj = {}
    for (let i = 0; i < csvData.length - 1; i++) {
        metadataObj.description = metadataDescription
        metadataObj.name = metadataName + ' #' + (i + 1)
        metadataObj.image = 'ipfs://' + metadataImageStorageHash + '/' + (i + 1)
        const atts = []
        for (let b = 0; b < traitNames.length; b++) {
            const something = {
                trait_type: traitNames[b],
                value: csvData[i + 1][b + 1]
            }
            atts.push(something)
        }
        metadataObj.attributes = atts
        metadataJSON = JSON.stringify(metadataObj)
        fs.writeFileSync(`metadata/${i + 1}`, metadataJSON)
    }
}

run()
const hrend = process.hrtime(hrstart)
console.info('Generated MetaData JSON Files (./metadata). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)