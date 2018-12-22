// used to create a server;
var express = require('express')
var bodyParser = require('body-parser')
// used to send http request
var request = require('request')
var fs = require('fs')
// Jquery
var cheerio = require('cheerio')

var info = "[+] ";
var app1 = express();
console.log(info+ "initialization");
app1.use(function(req , res ,next) {
  console.log(req.body['search']);
  console.log(info +'Use callback');
  // all web scraping
  var url = "https://www.avito.ma/fr/maroc/iphone8";
  // send a request to the url and get the html response;
  request(url, function(error,response,html) {
    if(!error)
    {
        // load the response and make it browesable using jquery
        var $ = cheerio.load(html);
        var title , price , urldesc;
        var json  = { "item":[]}
        for(var i = 0; i < $('.fs14').length; i= i + 2)
        {
            $('.fs14 > a').eq(i).filter(function()
            {
                var data = $(this);
                title = data.text();
                url = data.attr("href");
                json.item[i]={"title":"","price":"","urldesc":"","location":""};
                json.item[i].title = title;

                json.item[i].urldesc = url;
                json.item[i].location =   $('.fs14 > small > a').eq(i).text();
            });
            $('.price_value').eq(i).filter(function()
              {
                var data = $(this);
                price = data.text();
                json.item[i].price = parseInt(price.replace(/\s/g, ''));
                if(!json.item[i].price)
                {
                  delete json.item[i];
                }
              })
          }
          req.body = json;
          console.log(json);
          next();
    }
    else {
      console.log(info+"error sending the request"+error)
    }
  });
})
app1.get("/",function (req,res) {
      console.log(info+" get function");
      var item
      // edit the html file to insert the results
      fs.readFile('index.html',(err, data) => {
        if (err) throw err;
        var $ = cheerio.load(data);
        var count =0;
        // RMS of prices
        var rms = 0;
        // remove old list and update the list
        $('tbody').empty();

        for(var i = 0; i <  req.body.item.length;i++)
        {
          item = req.body.item[i];
          if(item == undefined){continue;}
          count++;
          rms += item.price;
          $('tbody').append("<tr><th scope='row'>" + count + "</th><td>"+ item.title +"</td><td>" + item.price +"</td><td><a href='"+ item.urldesc +"'>"+ item.location +"</a></td></tr>");
        }
        $('#rms').text("Moyenne: "+ (rms / req.body.item.length).toFixed(2) +" dh");
        fs.writeFile('index.html',$.html(),'utf-8', function (err) {
          if (err) throw err
          console.log('filelistAsync complete');
        });
      });

      res.sendFile('index.html' , { root : __dirname});
        /*
    var html = "<h3>"+ item.title +"</h3>";
    html = html + "prix: <b>"+ item.price +"</b> dh</br>";
    html = html + "location: <a href='"+ item.urldesc +"'>"+ item.location + "</a>";
    */
    // res.send(html);

})
app1.listen('8080');

const { app, BrowserWindow } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 ,frame: false})

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
  win.setAutoHideMenuBar(true)
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
exports= module.exports = app1;
