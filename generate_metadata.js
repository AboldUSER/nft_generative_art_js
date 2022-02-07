const fs = require("fs")
const hrstart = process.hrtime()

/* 
* @dev configuration for the metadata json file
* change below  variables to fit your project
* the below code assumes IPFS storage with a file structure of a folder containing images in sequential order
* if using your own hosting service or different file structure, then just update the metadataObj accordingly
*/
const metadataDescription = 'This is a sample project description'
const metadataName = 'Sample Project'
const metadataImageStorageHash = 'Q1234'

let attData
try {
    attData = fs.readFileSync('imageTraits.csv', 'utf8')
} catch (err) {
    if (err && err.errno == -4058) {
        throw new Error('No traits. Run generate_traits.js first.');
    } else if (err) console.log(err)
}

const traitNames = fs.readFileSync('tnames.dat').toString().trim().split(/\s+/)

function run() {

    const dirExists = fs.statSync('./metadata', { throwIfNoEntry: false })

    if (dirExists) {
        fs.rmdirSync('./metadata', { recursive: true });
    }
    fs.mkdirSync('./metadata')

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
    const hrend = process.hrtime(hrstart)
    console.info('Generated MetaData JSON Files (./metadata). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

run()