// used to create a server;
var express = require('express');
// used to send http request
var request = require('request');
var fs = require('fs');
// Jquery
var cheerio = require('cheerio')
var info = "[+] ";
var app1 = express();
// search value
var search = "mac";
var numberofitems = 0;
console.log(info+ "initialization");
app1.use('/',function(req , res ,next) {
  // all web scraping
  if(req.query.q)
  {
      search = req.query.q;
  }


  var url = 'https://www.avito.ma/fr/maroc/'+ search.replace(/[^a-zA-Z0-9]/g,'-');;
  // console.log(url);
  // console.log(search);
  // console.log(search.replace(/[^a-zA-Z0-9]/g,'-'));
  var json;
  // send a request to the url and get the html response;
  request(url, function(error,response,body) {
    if(!error)
    {
        numberofitems = 0;
        // load the response and make it browesable using jquery
        var $ = cheerio.load(body);
        var title , price , urldesc;
        json  = { "item":[]};
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
                var regex1 = new RegExp(`${search}`, 'i');
                // console.log(json.item[i].title);
                // console.log(json.item[i].title.search(regex1));
                if(json.item[i].title.search(regex1) == (-1))
                {
                  json.item[i] = null;
                }
            });

            $('.price_value').eq(i).filter(function()
              {
                var data = $(this);
                price = data.text();
                if(json.item[i] != null)
                {
                  json.item[i].price = parseInt(price.replace(/\s/g, ''));
                  if(!json.item[i].price)
                  {
                    json.item[i] = null;
                  }else
                  {
                    numberofitems += 1;
                  }
                }
              });

        }
        var item;
        // edit the html file to insert the results
        fs.readFile('index.html',(err, data) => {
            var $ = cheerio.load(data);
            if (err) throw err;
            var count =0;
            // RMS of prices
            var rms = 0;
            // remove old list and update the list
            $('tbody').empty();
            // create list of items in the html file
            for(var i = 0; i <   json.item.length ;i++)
            {
              item = json.item[i];
              if((item == undefined) || (item == null )){delete item;continue;}

              count++;
              rms += item.price;
              $('tbody').append("<tr><th scope='row'>" + count + "</th><td>"+ item.title +"</td><td>" + item.price +"</td><td><a href='"+ item.urldesc +"'>"+ item.location +"</a></td><td class='deleteitem'><img src='http://localhost:8080/img/close.png'/></td></tr>");
            }
            // keep the value of the input after the submit
            $('#searchBar').val(search);
            // calculate and display the changes
            $('#rms').text("Moyenne: "+ (rms / numberofitems).toFixed(2) +" dh");
            // write the changes in the html file
            fs.writeFile('index.html',$.html(),'utf-8', function (err) {
              if (err) throw err
              res.sendFile('index.html' , { root : __dirname});
              });
          });

    }
    else {
      console.log(info+"error sending the request"+error);
      res.send("Error 403");
    }

    });

});
app1.listen('8080');

// const { app, BrowserWindow } = require('electron');
//
// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let win
//
// function createWindow () {
//   // Create the browser window.
//   win = new BrowserWindow({ width: 800, height: 600 ,frame: false})
//
//   // and load the index.html of the app.
//   win.loadURL(`file://${__dirname}/index.html`)
//
//   // Open the DevTools.
//   win.webContents.openDevTools()
//   win.setAutoHideMenuBar(true)
//   // Emitted when the window is closed.
//   win.on('closed', () => {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     win = null
//   })
// }
//
// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)
//
// // Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
//
// app.on('activate', () => {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (win === null) {
//     createWindow()
//   }
// })
// exports= module.exports = app1;
