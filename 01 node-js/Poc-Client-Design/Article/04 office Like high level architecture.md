Sure! Let's break down your architecture and build a sample application based on your description. This involves three **Node.js applications** (Sys API, EXP API, and Collibra API) and a **front-end Angular app**. 

Here’s the breakdown of the architecture:

- **Collibra API**: This is the existing Node.js API.
- **SYS API Layer (GraphQL)**: This layer will query the Collibra API via GraphQL.
- **EXP API Layer (REST)**: This REST API will expose endpoints that interact with the SYS API (GraphQL).
- **Angular Frontend**: This will call the EXP REST API and present the data to the user.

---

### **1. Collibra API (Existing Node.js API)**

For the sake of simplicity, I’ll assume this API exposes some basic data. We'll simulate it here.

#### **collibra-api/index.js**:
```js
const express = require('express');
const app = express();
const port = 3001;

// Sample data to simulate Collibra API
const data = {
  items: [
    { id: 1, name: 'Item 1', description: 'This is item 1' },
    { id: 2, name: 'Item 2', description: 'This is item 2' },
    { id: 3, name: 'Item 3', description: 'This is item 3' }
  ]
};

// REST endpoint to fetch items
app.get('/items', (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Collibra API running on http://localhost:${port}`);
});
```

In this example, **Collibra API** exposes a REST endpoint `/items` which will return some dummy items in JSON format.

---

### **2. SYS API Layer (GraphQL API)**

This layer will query the **Collibra API** using **GraphQL**. We'll use **Apollo Server** to set up GraphQL and query the Collibra API.

#### **sys-api/index.js**:
To make the provided code compatible with **Node.js 20**, you should make the following updates:

1. Use `@apollo/server` instead of `apollo-server` as `apollo-server` is no longer actively maintained. The new version requires a modular approach.
2. Adjust `@apollo/server` to work with Express using the required middleware.
3. Ensure the asynchronous server start process is properly handled with the latest `@apollo/server` patterns.

Here’s the updated code:

---

### Updated Code for Node.js 20
```javascript
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { gql } = require('graphql-tag');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

// Define GraphQL schema
const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    getItems: [Item]
  }
`;

// Resolver to fetch items
const resolvers = {
  Query: {
    getItems: async () => {
      const response = await axios.get('http://localhost:3001/items');
      return response.data.items;
    },
  },
};

async function startServer() {
  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // Start the server

  const app = express();
  const port = 3002;

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/graphql', expressMiddleware(server)); // Attach Apollo middleware to the app

  // Start the Express server
  app.listen(port, () => {
    console.log(`SYS API (GraphQL) running on http://localhost:${port}/graphql`);
  });
}

startServer();
```

---

### Key Changes:
1. **Switch to `@apollo/server`**:
   - Installed using:
     ```bash
     npm install @apollo/server graphql graphql-tag express cors body-parser
     ```
   - Uses `expressMiddleware` from `@apollo/server/express4` for Express integration.

2. **Middleware Handling**:
   - Added `cors` and `body-parser` middleware, which are often required for APIs.

3. **Async Server Initialization**:
   - `ApolloServer` now requires `await server.start()` before applying middleware.

4. **Path for GraphQL**:
   - Middleware applied explicitly to the `/graphql` endpoint.

---

### Run the Code:
Save the updated file (e.g., `index.js`) and run:
```bash
node index.js
```

---

This will make your app compatible with Node.js 20 and use the latest Apollo Server library, ensuring better performance and support.

Here, we have a **GraphQL API** using **Apollo Server**. The `getItems` query is used to fetch data from the **Collibra API** (via a REST call using Axios). The **Collibra API** returns the list of items, which are then exposed via GraphQL.

---

### **3. EXP API Layer (REST API)**

This REST API will act as a bridge between the front-end (Angular app) and the **SYS API Layer** (GraphQL). It will fetch data from **SYS API** using **GraphQL queries** and return it to the front-end.

#### **exp-api/index.js**:
```js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003;

app.use(express.json());

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
    res.json(response.data.data.getItems);
  } catch (error) {
    res.status(500).send('Error fetching data from SYS API');
  }
});

app.listen(port, () => {
  console.log(`EXP API (REST) running on http://localhost:${port}`);
});
```

In this **EXP API Layer**, we have a REST endpoint `/items` which makes a **GraphQL** query to the **SYS API Layer** and forwards the response to the client. It uses Axios to send a GraphQL query request to the **SYS API**.

---

### **4. Frontend: Angular App**

The Angular app will make a **REST API** call to the **EXP API** to fetch items.

#### **Angular Service to Call EXP API:**

First, set up a service in Angular to fetch the data from the **EXP API**.

##### **src/app/item.service.ts**:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3003/items';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
```

In this service, the `getItems()` method makes a REST API call to `http://localhost:3003/items` (EXP API) to fetch the list of items.

#### **Angular Component to Display Items:**

Now, create a component to display the items returned from the API.

##### **src/app/item-list/item-list.component.ts**:
```ts
import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe((data) => {
      this.items = data;
    });
  }
}
```

##### **src/app/item-list/item-list.component.html**:
```html
<div class="item-list">
  <h1>Items List</h1>
  <ul>
    <li *ngFor="let item of items">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </li>
  </ul>
</div>
```

In this component, the `ngOnInit()` lifecycle hook calls the `ItemService.getItems()` method to fetch the list of items from the **EXP API**, and the template displays these items.

---

### **Running the Full Application**

1. **Start Collibra API**:
   - Go to the `collibra-api` directory and run:
     ```bash
     node index.js
     ```
   - The Collibra API should be running on `http://localhost:3001`.

2. **Start SYS API** (GraphQL):
   - Go to the `sys-api` directory and run:
     ```bash
     node index.js
     ```
   - The SYS API (GraphQL) should be running on `http://localhost:3002/graphql`.

3. **Start EXP API** (REST):
   - Go to the `exp-api` directory and run:
     ```bash
     node index.js
     ```
   - The EXP API (REST) should be running on `http://localhost:3003`.

4. **Run Angular App**:
   - Go to the Angular project directory and run:
     ```bash
     ng serve
     ```
   - The Angular app should be available on `http://localhost:4200`.

---

### **Summary of Architecture**

- **Collibra API**: Serves raw data over a REST API.
- **SYS API Layer**: Exposes a **GraphQL API** that queries the Collibra API.
- **EXP API Layer**: Serves as a **REST API** that queries the SYS API (GraphQL) and returns data to the frontend.
- **Frontend (Angular)**: Makes **REST API calls** to the **EXP API** and displays the data.

This setup demonstrates how to connect multiple layers of APIs using **REST** and **GraphQL** and how to build an Angular app to interact with a backend architecture involving both types of APIs.