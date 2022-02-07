const fs = require("fs")
const sha256 = require('js-sha256')
const dir = './images'
const hrstart = process.hrtime()

/* 
* @dev generates a hash of each image and then a 'provenance' hash of all image hashes
*/

function run() {
    let files = fs.readdirSync(dir)
    imgNum = files.length

    if (files.length == 0) {
        throw new Error('No images. Run generate_images.js first.');
    }

    let provenance = ''
    const header = 'Image #,Hash' + '\n'
    let csv = header
    for (let i = 1; i <= imgNum; i++) {
        const base64 = fs.readFileSync(`./images/${i}.png`, 'base64')
        const hash = sha256(JSON.stringify(base64))
        csv += i + ',' + hash + '\n'
        provenance += hash
    }
    provenance = sha256(JSON.stringify(provenance))
    csv += 'provenance' + ',' + provenance
    fs.writeFileSync('imageHashes.csv', csv)
    const hrend = process.hrtime(hrstart)
    console.info('Generated Hashes (imageHashes.csv). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

run()