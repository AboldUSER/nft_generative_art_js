# NFT Generative Art JS

This is a set of javascript/node scripts for creating generative art.

Sample traits, weights, and layer images are already provided.

#### To run with the existing sample assets:
- First, make sure you have node installed, then run `npm i` or `yarn install` to install the necessary node modules.
- Second, update the `collectionNum` variable in the generate_traits.js script to the number of images you want to create.
    - Note that the number of images has to be equal to or less than the total number of unique image combinations.
- Third, run the generate_traits.js script with `npm run generate:traits` or `yarn generate:traits`.
- Fourth, run the generate_images.js script with `npm run generate:images` or `yarn generate:images`.
- Fifth, run the generate_hashes.js script with `npm run generate:hashes` or `yarn generate:hashes`.
- Sixth, update the following variables in the generate_metadata.js script to align with your project: `metadataDescription`, `metadataName`, `metadataImageStorageHash`.
- Seventh, run the generate_metadata.js.script with `npm run generate:metadata` or `yarn generate:metadata`.

#### To run with your own assets:
- Replace the existing traits folders with your art layers, with the bottom layer in folder `trait1`, next layer in folder `trait2` and so on. The image files should be in alphabetical order inside the folders.
- Replace the trait names in the file `tnames.dat` with your trait names, starting with the bottom layer first.
- Replace the trait weights in the file `weights.dat` with your trait weights, starting with the bottom layer and then aligning with the same order (alphabetical) as the images in their respective trait folders.
- Then follow the same steps as above.

### Script descriptions

|**generate_traits.js** |
| :------------- |
|*Inputs* |
|tnames.dat - separate file that lists the name of each trait type |
|weights.dat - separate file that lists the expected occurance of each trait within the overall collection |
|collectionNum - variable of type number to set the number of collection items to generate |
|attributeRules - optional and customizable logic to set rules for trait generation (e.g., trait x cannot appear with trait y) |
|*Outputs* |
|imageTraits.csv - csv file containing list of all collection items' traits. As a csv file, further analysis can be done directly in a terminal or in a more user friendly program like Excel, including modifying individual items directly |
|rarity.csv - csv file that lists each individual trait and the percentage (rarity) of its occurance in the generated collection |

|**generate_images.js**|
| :------------- |
|*Inputs*|
|imageTraits.csv - file must exist, and is generated from generate_traits.js|
|imgWidth - variable of type number to set the width of each image|
|imgHeight - variable of type number to set the height of each image|
|imageRules - optional and customizable logic to set rules for image generation (e.g., trait x always set as top layer)|
|*Outputs*|
|images folder - folder containing all generated collection images, with files named sequentially (e.g., 1.png, 2.png, ...)|

|**generate_hashes.js**|
| :------------- |
|*Inputs*|
|images folder and contained image files - must exist, and is generated from generate_images.js|
|*Outputs*|
|imageHashes.csv - csv file that lists the sha256 hash of each image and the 'provenance' hash of all image hashes|

|**generate_metadata.js**|
| :------------- |
|*Inputs*|
|imageTraits.csv - file must exist, and is generated from generate_traits.js|
|metadataDescription - variable of type string to set the description for the metadata json files|
|metadataName - variable of type string to set the name for the metadata json files|
|metadataImageStorageHash - variable of type string to set the namebase IPFS folder hash for the metadata json files|
|*Outputs*|
|metadata folder - folder containing all generated json files for each image, with files named sequentially|