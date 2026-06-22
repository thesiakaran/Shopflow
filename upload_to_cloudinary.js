const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dce53krjt',
  api_key: '465665198856811',
  api_secret: 'YP3Rb4wLMHdC3i10mKaHXVqvyU4'
});

const FASHION_JSON_PATH = path.join(__dirname, 'backend', 'product-catalog-service', 'src', 'main', 'resources', 'data', 'fashion.json');
const IMAGES_DIR = path.join(__dirname, 'frontend', 'dist', 'images');
const PROGRESS_FILE = path.join(__dirname, 'upload_progress.json');

async function uploadImages() {
  console.log("Starting Cloudinary bulk upload...");

  // Read fashion.json
  let products = JSON.parse(fs.readFileSync(FASHION_JSON_PATH, 'utf8'));
  
  // Load progress if exists
  let uploadedMap = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    uploadedMap = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming upload. ${Object.keys(uploadedMap).length} images already uploaded.`);
  }

  let successCount = 0;
  let errorCount = 0;

  // We will upload in batches of 10 to avoid overwhelming the network/API
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (product) => {
      // If already uploaded or already a cloudinary URL, skip
      if (product.imageUrl.includes('cloudinary.com')) return;
      if (uploadedMap[product.id]) {
        product.imageUrl = uploadedMap[product.id];
        return;
      }

      const imageName = `${product.id}.jpg`;
      const localImagePath = path.join(IMAGES_DIR, imageName);

      if (fs.existsSync(localImagePath)) {
        try {
          const result = await cloudinary.uploader.upload(localImagePath, {
            folder: 'shopflow_fashion',
            public_id: product.id.toString(),
            overwrite: true
          });
          
          product.imageUrl = result.secure_url;
          uploadedMap[product.id] = result.secure_url;
          successCount++;
          
          // Delete local file to free up space!
          fs.unlinkSync(localImagePath);
        } catch (error) {
          console.error(`Failed to upload ${imageName}:`, error.message);
          errorCount++;
        }
      }
    });

    await Promise.all(promises);
    
    // Save progress every batch
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(uploadedMap));
    fs.writeFileSync(FASHION_JSON_PATH, JSON.stringify(products, null, 2));

    process.stdout.write(`\rProgress: ${Math.min(i + BATCH_SIZE, products.length)} / ${products.length} processed. Success: ${successCount}, Errors: ${errorCount}`);
  }

  console.log("\n\nUpload Complete!");
  console.log(`Successfully uploaded to Cloudinary: ${successCount}`);
  console.log("Your fashion.json has been updated and the local images have been deleted.");
}

uploadImages().catch(console.error);
