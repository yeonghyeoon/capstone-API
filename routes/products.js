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
router.post('/:productId/comments', (req, res) => {
    console.log('req.body for posting comments', req.body)
    const products = readProducts();
    const productId = parseInt(req.params.productId)
    const product = products.find((eachItem) => eachItem.id === productId);

    if(!product) {
        return res.status(404).json({error: "Product not found"})
    }
    if (!req.body.comment) {
        return res.status(400).send("comment required")
    }
    const newComment = {
        id: uuid4(),
        comment: req.body.comment
    }
    product.comments.unshift(newComment)
    fs.writeFileSync(__dirname + '/../data/products.json', JSON.stringify(products))

    res.status(201).json(product)
    
})


//* editing comments *//
router.patch('/:productId/comments/:commentId', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.productId);
    const commentId = req.params.commentId;

    const productIndex = products.findIndex((item) => item.id === productId)

    if(productIndex === -1) {
        return res.status(404).json({error: "Product not found"})
    }

    const product = products[productIndex]

    const commentIndex = product.comments.findIndex((comment) => comment.id === commentId)

    if(commentIndex === -1) {
        return res.status(404).json({error: "Comment not found"})
    }
    if (!req.body.comment) {
        return res.status(400).send("comment required")
    }

    product.comments[commentIndex].comment = req.body.comment

    products[productIndex] = product;

    fs.writeFileSync(__dirname + '/../data/products.json', JSON.stringify(products))
    res.json(product);
})






//* deleting comments *//
router.delete('/:productId/comments/:commentId', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.productId);
    const commentId = req.params.commentId;

    const productIndex = products.findIndex((item) => item.id === productId)

    if(productIndex === -1) {
        return res.status(404).json({error: "Product not found"})
    }

    const product = products[productIndex]

    const commentIndex = product.comments.findIndex((comment) => comment.id === commentId)

    if(commentIndex === -1) {
        return res.status(404).json({error: "Comment not found"})
    }
    
    product.comments.splice(commentIndex, 1)

    products[productIndex] = product;

    fs.writeFileSync(__dirname + '/../data/products.json', JSON.stringify(products))
    res.json(product);

})

module.exports = router;
