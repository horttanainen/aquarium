import { config } from './config';
import { loadImage } from './load_image';
import { printFromCanvas } from './print';

import hwang1 from './wang_tiles/hwang1.png'
import hwang2 from './wang_tiles/hwang2.png'
import hwang3 from './wang_tiles/hwang3.png'
import hwang4 from './wang_tiles/hwang4.png'
import vwang1 from './wang_tiles/vwang1.png'
import vwang2 from './wang_tiles/vwang2.png'
import vwang3 from './wang_tiles/vwang3.png'
import vwang4 from './wang_tiles/vwang4.png'

const vTileSrcs = [vwang1, vwang2, vwang3, vwang4]
const hTileSrcs = [hwang1, hwang2, hwang3, hwang4]
let vTiles: HTMLImageElement[] = []
let hTiles: HTMLImageElement[] = []

const wangCanvas = new OffscreenCanvas((config.wangSquaresPerSide + 2) * config.wangSquarePx, (config.wangSquaresPerSide + 2) * config.wangSquarePx);
const wangContext = wangCanvas.getContext("2d");

export function getWangContext() {
  if (!wangContext) {
    throw new Error("Wang context was null")
  }
  return wangContext 
}

export async function loadTiles() {
  const vTilePromises = vTileSrcs.map(src => loadImage(src))
  const hTilePromises = hTileSrcs.map(src => loadImage(src))

  await Promise.all(vTilePromises).then(values => {
    vTiles = values
  })
  await Promise.all(hTilePromises).then(values => {
    hTiles = values
  })

  await Promise.all([...vTilePromises, ...hTilePromises])
}

export function initializeTerrain() {
  if (!wangContext) {
    throw new Error("Wang context was null")
  }
  wangContext.clearRect(0, 0, wangContext.canvas.width, wangContext.canvas.height);

  const tilesPerSide = config.wangSquaresPerSide + 1

  for (let vPos = 0; vPos < tilesPerSide * config.wangSquarePx; vPos += config.wangSquarePx * 4) {
    for (let hPos = 0; hPos < tilesPerSide * config.wangSquarePx; hPos += config.wangSquarePx * 4) {
      const vTile1 = vTiles[Math.floor(Math.random() * 4)]
      const vTile2 = vTiles[Math.floor(Math.random() * 4)]
      const vTile3 = vTiles[Math.floor(Math.random() * 4)]
      const vTile4 = vTiles[Math.floor(Math.random() * 4)]

      wangContext.drawImage(vTile1, hPos, vPos, vTile1.width, vTile1.height)
      wangContext.drawImage(vTile2, hPos + config.wangSquarePx, vPos + config.wangSquarePx, vTile2.width, vTile2.height)
      wangContext.drawImage(vTile3, hPos + config.wangSquarePx * 2, vPos + config.wangSquarePx * 2, vTile3.width, vTile3.height)
      wangContext.drawImage(vTile4, hPos + config.wangSquarePx * 3, vPos + config.wangSquarePx * 3, vTile4.width, vTile4.height)

      const hTile1 = hTiles[Math.floor(Math.random() * 4)]
      const hTile2 = hTiles[Math.floor(Math.random() * 4)]
      const hTile3 = hTiles[Math.floor(Math.random() * 4)]
      const hTile4 = hTiles[Math.floor(Math.random() * 4)]

      wangContext.drawImage(hTile1, hPos + config.wangSquarePx, vPos, hTile1.width, hTile1.height)
      wangContext.drawImage(hTile2, hPos + config.wangSquarePx * 2, vPos + config.wangSquarePx, hTile2.width, hTile2.height)
      wangContext.drawImage(hTile3, hPos + config.wangSquarePx * 3, vPos + config.wangSquarePx * 2, hTile3.width, hTile3.height)
      wangContext.drawImage(hTile4, hPos + config.wangSquarePx * 4, vPos + config.wangSquarePx * 3, hTile4.width, hTile4.height)
    }
  }

  printFromCanvas(wangCanvas)
}
