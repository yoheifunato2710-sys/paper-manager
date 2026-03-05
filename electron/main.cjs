const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const DATA_FILE = 'data.json';
const PDF_SUBDIR = 'pdfs';

let mainWindow = null;
let dataFolderPath = null;

function sanitizeFolderName(name) {
  return String(name).replace(/[\\/:*?"<>|]/g, '_');
}

function getDataPath() {
  if (!dataFolderPath) return null;
  return path.join(dataFolderPath, DATA_FILE);
}

function getPdfDir() {
  if (!dataFolderPath) return null;
  const dir = path.join(dataFolderPath, PDF_SUBDIR);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(__dirname, '..', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── IPC ──
ipcMain.handle('select-data-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'データの保存・参照先フォルダを選択',
  });
  if (result.canceled || !result.filePaths.length) return null;
  dataFolderPath = result.filePaths[0];
  return dataFolderPath;
});

ipcMain.handle('get-data-path', () => dataFolderPath);

ipcMain.handle('read-data', async () => {
  const filePath = getDataPath();
  if (!filePath || !fs.existsSync(filePath)) {
    return { folders: [], papers: {} };
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    return {
      folders: Array.isArray(data.folders) ? data.folders : [],
      papers: data.papers && typeof data.papers === 'object' ? data.papers : {},
    };
  } catch (e) {
    return { folders: [], papers: {} };
  }
});

ipcMain.handle('write-data', async (_, { folders, papers }) => {
  const filePath = getDataPath();
  if (!filePath) return false;
  try {
    fs.writeFileSync(filePath, JSON.stringify({ folders, papers }, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
});

// relativePath: e.g. "FolderName/0.pdf" (sanitized folder name + index)
ipcMain.handle('save-pdf', async (_, relativePath, base64DataUrl) => {
  const pdfDir = getPdfDir();
  if (!pdfDir) return false;
  const match = /^data:application\/pdf;base64,(.+)$/.exec(base64DataUrl);
  if (!match) return false;
  const fullPath = path.join(pdfDir, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try {
    fs.writeFileSync(fullPath, Buffer.from(match[1], 'base64'));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
});

ipcMain.handle('get-pdf-file-url', async (_, relativePath) => {
  if (!dataFolderPath) return null;
  const fullPath = path.join(dataFolderPath, PDF_SUBDIR, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return 'file:///' + fullPath.replace(/\\/g, '/');
});

ipcMain.handle('open-pdf-external', async (_, relativePath) => {
  if (!dataFolderPath) return;
  const fullPath = path.join(dataFolderPath, PDF_SUBDIR, relativePath);
  if (fs.existsSync(fullPath)) {
    const { shell } = require('electron');
    shell.openPath(fullPath);
  }
});

ipcMain.handle('pdf-exists', async (_, relativePath) => {
  if (!dataFolderPath) return false;
  const fullPath = path.join(dataFolderPath, PDF_SUBDIR, relativePath);
  return fs.existsSync(fullPath);
});
