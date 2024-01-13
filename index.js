const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5050;
// const shopRoutes = require('./routes/shop');
// const aboutRoutes = require('./routes/about');
// const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/images',express.static(path.join(__dirname, 'public/images')));


app.use((req, res, next) => {
    if(
        req.method === 'POST' && req.headers['content-type'] !== 'application/json'
    ) {
        return res.status(400).send("need proper JSON")
    }
    next();
})

// app.use('/shop', shopRoutes);
// app.use('/about', aboutRoutes);
// app.use('/contact', contactRoutes);
app.use('/products', productRoutes)



app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
})