const fs = require("fs")
const { createCanvas, loadImage } = require('canvas')
const { parse } = require('csv-parse')

/* 
* @dev canvas configuration
*/
const imgWidth = 512 // Change this to desired width of your image
const imgHeight = 512 // Change this to desired height of your image

/* 
* @dev image rules to change things such as order of layers (e.g., ensure a certian trait is always on top)
* example rule is commented out below 
* if no rules are needed, then comment out or remove if statement(s)
*/
const imageRules = (_imgAttributes) => {
    const attLength = _imgAttributes.length
    const newAttributes = []
    for (i = 0; i < attLength; i++) {
        const miniArr = [i + 1]
        miniArr.push(_imgAttributes[i])
        newAttributes.push(miniArr)
    }
    // if (_imgAttributes.includes('steel')) {
    //     newAttributes.push(newAttributes.splice(_imgAttributes.indexOf('steel'), 1)[0])
    //     return newAttributes
    // }
    return newAttributes
}

const canvas = createCanvas(imgWidth, imgHeight)
const ctx = canvas.getContext("2d")

const getTraitNames = () => {
    return fs.readFileSync('./tnames.dat').toString().trim().split(/\s+/)
}

const generateImage = async (_traitNames, _nft) => {
    const arr = []
    const imgNum = _nft[0]
    _nft.shift()
    const imgAttributes = imageRules(_nft)
    imgAttributes.forEach(async el => {
        const imgProm = new Promise(async (resolve) => {
            const image = await loadImage(`./traits/trait${el[0]}/${el[1]}.png`);
            resolve(image);
        })
        arr.push(imgProm)
    })
    await Promise.all(arr).then((renderObjectArray) => {
        ctx.clearRect(0, 0, imgWidth, imgHeight);
        renderObjectArray.forEach((image) => {
            ctx.drawImage(
                image,
                0,
                0,
                imgWidth,
                imgHeight
            );
        });
    }
    )
    fs.writeFileSync(
        `./images/${imgNum}.png`,
        canvas.toBuffer("image/png")
    );
}

const run = async () => {
    const hrstart = process.hrtime()
    const traitNames = getTraitNames()

    const dirExists = fs.statSync('./images', { throwIfNoEntry: false })

    if (dirExists) {
        fs.rmdirSync('./images', { recursive: true });
    }
    fs.mkdirSync('./images')

    fs.readFile('./imageTraits.csv', async function (err, fileData) {
        if (err && err.errno == -4058) {
        throw new Error('No traits. Run generate_traits.js first.');
        } else if (err) console.log(err)
        parse(fileData, { columns: false, trim: true }, async function (err, rows) {
            if (err) console.log(err);
            const fileLen = rows.length
            for (let i = 0; i < fileLen; i++) {
                if (i == 0) {
                    continue
                }
                ;
                const nft = rows[i]
                await generateImage(traitNames, nft)
            }
            const hrend = process.hrtime(hrstart)
            console.info('Generated Images (./images). Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        })
    })
}

run()
