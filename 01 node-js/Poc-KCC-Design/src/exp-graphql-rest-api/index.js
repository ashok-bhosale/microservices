const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3003;;
//const cors = require('cors');
app.use(express.json());
 // Use CORS middleware
 //app.use(cors());

// REST endpoint to fetch items (calls SYS API GraphQL)
app.get('/items', async (req, res) => {
  try {
    const response = await axios.post(
      'http://localhost:3002/graphql',
      {
        query: `{
          getItems {
            id
            name
            description
          }
        }`
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    let items=response.data.data.getItems;

    items= items.map(item=>
    {
       return {...item, name:'Item from port :${port} '+":"+port};
    }
    
    );
    res.json(items);
    
  } catch (error) {
    res.status(500).send('Error fetching data from SYS API');
  }
});

app.listen(port, () => {
  console.log(`EXP API (REST) running on http://localhost:${port}`);
});