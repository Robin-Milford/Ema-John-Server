const express = require('express')
require('dotenv').config()
const bodyParser=require('body-parser');
const cors=require('cors');


const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cigf8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.send('Server working successfully')
})



client.connect(err => {
  const collection = client.db("EmaJohnStore").collection("Products");
  const orderCollection = client.db("EmaJohnStore").collection("Orders");
  console.log("Database connected")

  app.post('/addProduct',(req,res)=>{
      const product=req.body;
      collection.insertOne(product)
      .then(result =>{
          console.log(result.insertedCount);
          res.send(result.insertedCount);
      })
  })

  app.get('/products',(req,res)=>{
      collection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })
})

    app.post('/productByKeys',(req,res)=>{
        const productKeys=req.body;
        collection.find({key: {$in: productKeys}})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

    app.post('/addOrder',(req,res)=>{
        const order=req.body;
        orderCollection.insertOne(order)
        .then(result =>{
            res.send(result.insertedCount>0);
        })
    })
  

});

app.listen(process.env.PORT || port)