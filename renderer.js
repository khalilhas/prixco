const { remote, ipcRenderer } = require("electron")
document.getElementById("win-minimize-btn").addEventListener('click', ()=>
{
  remote.getCurrentWindow().minimize()
})
document.getElementById("win-minmax-btn").addEventListener('click',()=>
{
  const currentWindow = remote.getCurrentWindow();
  if(currentWindow.isMaximized())
  {
    currentWindow.unmaximize()
  }else {
    currentWindow.maximize();
  }
})
document.getElementById("win-close-btn").addEventListener('click',()=>
{
  remote.app.quit()
})
