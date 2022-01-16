
const { app, BrowserWindow, ipcMain, remote} = require('electron')
const express = require("express");
const bodyParser = require('body-parser')

const port = process.env.PORT || 2022

var ex = express();
ex.set('view engine', 'ejs')
ex.use(express.static('public'))

ex.use(bodyParser.urlencoded({ extended: false }))
ex.use(bodyParser.json())


app.on('ready', function () {
  
  const mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: { nodeIntegration: true }}); 


  ex.get("/", function(req,res){
    res.render('index')
  });

  ex.post("/whats", async function(req,res){
    const {number, message} = req.body

    await enviar(number,message, res)
  });

  function enviar(telefone,mensagem, res){
   
    mainWindow.loadURL("https://web.whatsapp.com/send?phone="+telefone+"&text="+mensagem, 
      {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
      }
    );
    mainWindow.webContents.once('dom-ready',() => {
      mainWindow.webContents.executeJavaScript(`
          setTimeout(() => {
            const btsend = document.querySelector('[data-testid=send]').parentElement
            btsend.click();
          }, 15000)
        `)
      })
      res.redirect('/')
  }

  ex.listen(port, ()=> {
    console.log(`Servidor rodando: http://localhost:${port}`);
  });
});

