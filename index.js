const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;




app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

  try {
      const productsCollection = client.db("productTaskDB").collection("products");
      const usersCollection = client.db("productTaskDB").collection("users");
      const cartProductsCollection = client.db("productTaskDB").collection("carts");
      const ordersCollection = client.db("productTaskDB").collection("orders");
 

    
     // get all Products


     app.get('/api/products', async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
  })
     app.get('/api/products/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
  })

  app.post('/api/user', async (req, res) => {
    const user = req.body;
  
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).send('Error hashing password');
      }
  

      user.password = hash;
  
      try {
        // Attempt to insert the user into the database
        const result = await usersCollection.insertOne(user);
        res.json(result)
      } catch (error) {
        console.error('Error inserting user into the database:', error);
        res.status(500).send('Error creating user');
      }
    });
  });
    
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Fetch the user from the database based on the provided email
      const user = await usersCollection.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
  
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
    
    app.get('/api/users', async (req, res) => {
      const query = {};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })
    
    // Post CartData

    app.post('/api/cart', async (req, res) => {
      try {
        const cartData = req.body;
        const result = await cartProductsCollection.insertOne(cartData);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/carts', async (req, res) => {
      const query = {}
      const result = await cartProductsCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/api/orders', async (req, res) => {
      const data = req.body;
      const result = await ordersCollection.insertMany(data);
      res.json(result)
    })

    app.get('/api/orders', async (req, res) => {
      const query = {};
      const result = await ordersCollection.find(query).toArray();
      res.send(result)
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
