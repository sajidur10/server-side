const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// Midleware use code
app.use(cors());
app.use(express.json())

// Mongodb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4t5n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongodb crud oparetion
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('warehouse-management').collection('service');
        // get product all
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)

        });

        // get product ditals
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
            res.send(service)

        });

        // post product
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // delete product
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(quary);
            res.send(result)
        });

        // update product
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const service = req.body;
            const filter = { _id: ObjectId(id) };
            const opions = { upsert: true };
            const updateProduct = {
                $set: { quantity: service.quantity }
            };
            const result = await serviceCollection.updateOne(filter, updateProduct, opions);
            console.log(filter, updateProduct, opions)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('warehouse-management-server is running')
})
app.listen(port, () => {
    console.log("listenport", port);
})