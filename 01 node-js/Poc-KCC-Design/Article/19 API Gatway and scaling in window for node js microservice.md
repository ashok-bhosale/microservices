To implement an API Gateway with load balancing for Node.js REST APIs on a **Windows Server**, follow these steps. We'll configure **NGINX** as the load balancer and API gateway while running multiple Node.js REST API instances.

---

## **1. Setup Node.js REST API Replicas on Windows**

1. **Create or Update `server.js`:** Modify your existing Node.js server to accept a dynamic port for creating multiple replicas:
    
    ```javascript
    const express = require('express');
    const app = express();
    const port = process.env.PORT || 3003;
    
    app.use(express.json());
    
    app.get('/items', (req, res) => {
      res.json([{ id: 1, name: `Item from port ${port}` }]);
    });
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    ```
    
2. **Run Multiple Instances:** Open multiple Command Prompt (or PowerShell) windows and run the following commands for each instance:
    
    ```cmd
    set PORT=3003 && node server.js
    set PORT=3004 && node server.js
    set PORT=3005 && node server.js
    ```
    
    Each instance will now be listening on ports `3003`, `3004`, and `3005`.
    

---

## **2. Install and Configure NGINX on Windows**

### **Step 1: Install NGINX**

1. Download the Windows version of NGINX:
    
    - Go to the [NGINX download page](https://nginx.org/en/download.html) and download the stable release for Windows.
    - Extract the downloaded `.zip` file to a folder, e.g., `C:\nginx`.
2. Verify the installation:
    
    - Open Command Prompt, navigate to the NGINX folder:
        
        ```cmd
        cd C:\nginx
        ```
        
    - Start NGINX:
        
        ```cmd
        nginx.exe
        ```
        
    - Open a browser and navigate to `http://localhost:80`. You should see the NGINX welcome page.

---

### **Step 2: Configure NGINX as Load Balancer**

1. Open the NGINX configuration file located in `C:\nginx\conf\nginx.conf` using a text editor like Notepad or VS Code.
    
2. Replace the default configuration under the `http` block with the following:
    
    ```nginx
    http {
        upstream node_servers {
            server localhost:3003;
            server localhost:3004;
            server localhost:3005;
        }
    
        server {
            listen 8080;
    
            location / {
                proxy_pass http://node_servers;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }
    }
    ```
    
    - `upstream node_servers`: Defines the backend Node.js replicas.
    - `proxy_pass http://node_servers`: Routes traffic to the Node.js servers.
3. Save the configuration file and restart NGINX:
    
    ```cmd
		    nginx.exe -s reload
    ```
    
4. Test the load balancer by sending requests to `http://localhost:8080/items`. Each request will be routed to a different Node.js server in a round-robin fashion.
    

---

## **3. Automate Node.js Instances with Scripts**

Instead of running multiple instances manually, create a batch script:

1. Create a file named `start-servers.bat`:
    
    ```cmd
    @echo off
    start cmd /k "set PORT=3003 && node server.js"
    start cmd /k "set PORT=3004 && node server.js"
    start cmd /k "set PORT=3005 && node server.js"
    pause
    ```
    
2. Double-click `start-servers.bat` to launch all instances in separate Command Prompt windows.
    

---

## **4. Optional: Monitor Load Balancing**

You can monitor NGINX logs to verify load balancing behavior.

1. Logs are saved in `C:\nginx\logs\access.log`.
2. Open the log file to see how requests are distributed across the backend servers.

---

## **5. Test the Setup**

1. Open a browser or use a tool like `curl` or Postman.
    - URL: `http://localhost:8080/items`
2. Observe responses:
    - First request: `Item from port 3003`
    - Second request: `Item from port 3004`
    - Third request: `Item from port 3005`

---

## **6. Scale Further with Docker (Optional)**

If your Windows Server supports Docker, containerize your Node.js APIs and run them using Docker for easy scalability.

1. Install Docker Desktop on Windows Server.
2. Use the `Dockerfile` provided earlier to build and run containers.

---

## **7. Run as a Service (Optional)**

If you'd like NGINX and Node.js instances to start automatically with Windows:

- Use **Task Scheduler** to run the `start-servers.bat` script and NGINX on startup.

---

With this setup, you now have an API Gateway (NGINX) and a load-balanced architecture on a Windows Server! Let me know if you need help with any specific step.