const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell
} = require('electron')
let ps = require("./ps.js")
// let ps = require("./ps.js")
const conf = require('./config.json')
let settings = require("./settings.json")
let win;

ipcMain.on("addwindow", (event, arg) => childWindow(arg.url))

function childWindow(url) {
  let childwindow = new BrowserWindow({
    width: 350,
    height: 200,
    parent: win,
    frame:false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  // childwindow.webContents.openDevTools();
  childwindow.loadFile(url)
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    icon: "./icon.png",
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  })
  win.loadFile('index.html')
  win.setMenu(null)
  if(settings.devmode) {
    globalShortcut.register("CommandOrControl+Shift+I", () => {
      if(win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools()
      }
    })
    globalShortcut.register("CommandOrControl+Shift+R", () => { app.relaunch(); app.exit(); } )
  }
  globalShortcut.register("CommandOrControl+Shift+W", () => app.quit())
  win.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url)
  });
}

app.whenReady().then(() => {
  createWindow()
  ipcMain.on("startbot", (event, tok) => {
    ps.init(win, tok)
  })
  ipcMain.on("restart", () => {
    app.relaunch()
    app.exit()
  })
})

/*

TODO:
 + display profile pictures for defaults
 - be able to send custom emojis
 + custom scripts and actions (user provides a js file with commands/event handlers)
 - get non-custom emoji to look normal
 - load more messages as user scrolls up (button or auto)
 - timestamps, deleted messages, edits
  + made it look a whole lot nicer
 - make message readability better (separation between)
 - open links externally (also autolink)
 - display embeds (yt videos, webpage metadata, just straight embeds)
 - keep bot online while app is closed (minimize to tray)
 - server select div scroll on overflow
  - fuck that lmao

MAYBE:
  - status updater
  - brute force fucker for bot tokens lmao
  - VOICE? bruh
*/
