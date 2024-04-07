const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app1 = express();
let globalVariable;
// Set EJS as the view engine
app1.set("view engine", "ejs");

// Set views directory
app1.set("views", path.join(__dirname, "front-end"));

// Body parser middleware
app1.use(bodyParser.urlencoded({ extended: true }));
app1.use(bodyParser.json());

// Serve static files
app1.use(express.static(path.join(__dirname, "front-end")));

// Route to render the EJS template for the root URL
app1.get("/", (req, res) => {
  res.render("index",{
    files:[],
    message:""
  });
});

// Route to handle form submission
app1.post('/endpoint', async (req, res) => {
  try {
    const files = await fs.promises.readdir(req.body.data);
    globalVariable = req.body.data;
    res.render("index", { files: files,message:"" });
  } catch (err) {
    res.render("index",{files:[],message:"Error:Direction not found."})   
  }
});
let count = 0;
app1.post('/rename', async (req, res) => {
  try {
    count = 0;
    const elements = req.body.elements1;
    const files = await fs.promises.readdir(globalVariable);

    for (let i = 0; i < elements.length; i++) {
      const file = elements[i];
      if(files.includes(file.value)) {
        const oldPath = path.join(globalVariable, file.value);
        const newPath = path.join(globalVariable, req.body.newName + (count === 0 ? "":"(" + count + ")")); // New filename
        await fs.promises.rename(oldPath, newPath);
        ++count
        console.log("File renamed:", file);
        continue;
      } 
       else {
        const oldPath = path.join(globalVariable, file.value);
        const newPath = path.join(globalVariable, req.body.newName); // New filename
        await fs.promises.rename(oldPath, newPath);
        console.log("File renamed:", file);
       } 
      
    }
    const files1 = await fs.promises.readdir(globalVariable);
    res.render("index", { files: files1,message:""});
  } catch(err) {
    console.error(err);
  }
});

// Start Express server
const server = app1.listen(3000, () => {
  console.log("Running on 3000 port");
});

// Create Electron window
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load Express server URL
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools if needed
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Quit server when Electron app is quitting
app.on("quit", () => {
  server.close();
});
