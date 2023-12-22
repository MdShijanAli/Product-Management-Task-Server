const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

  try {
      const productsCollection = client.db("productTaskDB").collection("products");
 

    
     // get all Products


     app.get('/api/products', async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
  })
     app.get('/api/products/:id', async (req, res) => {
      const query = {};
      const result = await productsCollection.findOne(query);
      res.send(result);
  })

    


      

  }
  finally {

  }


}
run().catch(err => console.log(err));










app.get('/', (req, res) => {
  res.send('Server is Running')
})

app.listen(port, () => {
  console.log(`Server is Running on PORT: ${port}`)
})