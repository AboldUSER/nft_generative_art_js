# NFT Generative Art JS

This is a javascript/node script for creating generative art.

Sample traits, weights, and layer images are already provided.

To run with the existing sample assets:
- First make sure you have node installed, then run `npm i` or `yarn install` to install the necessary node modules.
- Second, update the `imgNum` variable in the generate_images.js script to the number of images you want to create.
    - Note that the number of images has to be equal to or less than the total number of unique image combinations.
- Third, run the generate_images.js script.
- Fourth, run the generate_hashes.js script.
- Fifth, update the following variables in the generate_metadata.js script to align with your project: `metadataDescription`, `metadataName`, `metadataImageStorageHash`.
- Sixth, run the generate_metadata.js.script.

To run with your own assets:
- Replace the existing traits folders with your art layers, with the bottom layer in folder `trait1`, next layer in folder `trait2` and so on. The image files should be in alphabetical order inside the folders.
- Replace the trait names in the file `tnames.dat` with your trait names, starting with the bottom layer first.
- Replace the trait weights in the file `weights.dat` with your trait weights, starting with the bottom layer and then aligning with the same order (alphabetical) as the images in their respective trait folders.