const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuid4 } = require('uuid');

function readProducts() {
    const productsData = fs.readFileSync(__dirname + '/../data/products.json');
    console.log('Raw data from file:', productsData.toString());
    const parsedData = JSON.parse(productsData);
    console.log('Parsed data:', parsedData);
    return parsedData;
}

// getting all the data
router.get('/', (req, res) => {
    res.json(readProducts())
})


// getting data of single item
router.get('/:productId', (req, res) => {
    const products = readProducts();
    console.log('products', products)

    // product.id is not string 
    const productId = parseInt(req.params.productId)
    console.log("parsed product ID", productId)
    
    const productDetail = products.find((product) => product.id === productId)

    if(!productDetail) {
        return res.status(404).json({error : "not found"})
    }

    res.json(productDetail)
})


//* posting a new comment *//
router.post('/shop/:productId/comments', (req, res) => {
    console.log('req.body for posting comments', req.body)
    const products = readProducts();
    const product = products.find((eachItem) => eachItem.id === req.params.productId);
    if (!req.body.comments) {
        return res.status(400).send("comment required")
    }
    const newComment = {
        id: uuid4(),
        comment: req.body.comments
    }
    product.comments.push(newComment)
    fs.writeFileSync(__dirname + '/../data/videos.json', JSON.stringify(products))

    res.status(201).json(newComment)
    
})

//* editing comments *//







//* deleting comments *//


module.exports = router;
