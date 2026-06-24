const fs = require('fs');

const reqUrl = '/api/products/electronics';
const mockData = JSON.parse(fs.readFileSync('./public/mock-electronics.json', 'utf8'));

let arrayData = Array.isArray(mockData) ? mockData : (mockData?.content || []);
const parts = reqUrl.split('?')[0].split('/');
const idStr = parts[parts.length - 1];

console.log("idStr:", idStr);

if (idStr && idStr !== 'electronics' && idStr !== 'products') {
    const product = arrayData.find(p => String(p.id) === idStr || String(p.mongoID) === idStr);
    console.log("Returning product:", product || arrayData[0]);
} else {
    console.log("Returning mockData. Type of content:", typeof mockData.content, "Is array?", Array.isArray(mockData.content));
}
