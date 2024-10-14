const request = require('request');
const express = require('express');
const cors  = require('cors');
// const cookieParser = require('cookie-parser');


const app = express();
app.use(cors());
app.use(express.json())

// app.use(cookieParser())

const middle = express.urlencoded({
    extended: false,
    limit:1000,
    parameterLimit:4,
})

const port = 3400;


app.post('/InventoryLevels',(req, res) => {
    const { inventory_item_id } = req.body
    let apikey = 'your api key';
    let pass = 'your-api-secret-key';
    let inventoryLevels = 'inventory_levels';

    console.log(inventory_item_id)
    console.log("Inventory Id Receievd")
    if(!inventory_item_id)
    {
        return res.status(400).send({status:'failed'})
    }

    let options = {
        'method' : 'GET',
        'url' : `https://${apikey}:${pass}@yourshop.myshopify.com/admin/api/2024-04/${inventoryLevels}.json?inventory_item_ids=${inventory_item_id}&location_ids=enter 1st location id,enter 2nd location id if you have, and if you have a 3rd store then put it here.json`,
        'headers':{
            'Content-Type': 'application/json'
        } 
    }
    request(options, function (error, response){
        if (error) throw  new Error(error);
        var inventorylevelsJSON = JSON.parse(response.body);   
          res.status(200).send({inventorylevelsJSON});
     });  
})

app.post('/graphql',(req, res) => {
    const { Prcode } = req.body

    let pass = 'Your-Secret-Key';
    console.log(Prcode)
    console.log("Inventory Id Receievd")
    if(!Prcode)
    {
        return res.status(400).send({status:'failed'})
    }

    const query = `{
        productVariants(first: 10, query: "sku:${Prcode}") {
          nodes {
            sku
            product{
            id
            title
            }
            inventoryItem {
          id
        }
          image {
              url
            }
          }
        }
      }`;

    let options = {
        'method' : 'POST',
        'url' : `https://yourshopname.myshopify.com/admin/api/2024-10/graphql.json`,
        'body' : JSON.stringify({query}),
        
        'headers':{
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': pass,
        } 
    }
    request(options, function (error, response){
        if (error) throw  new Error(error);
        var inventorylevelsJSON = JSON.parse(response.body);   
          res.status(200).send({inventorylevelsJSON});
     });  
})



app.listen(port, () => {
  console.log(`Server running on port${port}`);
});