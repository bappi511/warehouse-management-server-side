const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjn2o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('electronicsWarehouse').collection('product');
        const query = {};

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productCollection.findOne(query);
            res.send(products);
        });
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = {

                $set: {
                    quantity: JSON.parse(updatedItem.quantity)
                }
            };
            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result);

        });
        // app.put('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const quantity = req.body;
        //     console.log(quantity);
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             quantity: quantity.quantity
        //         }
        //     }
        //     const result = await itemCollection.updateOne(query, updatedProduct, options);
        //     res.send(result)
        // })

    }
    finally {

    }
}
run().catch(console.dir);


//middleware;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('electronics warehouse server running')
});

app.listen(port, () => {
    console.log('server running at', port);
})