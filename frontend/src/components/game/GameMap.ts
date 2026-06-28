export interface Tileset {
  firstgid: number
  columns: number
  image: string
  name: string
  imagewidth: number
  imageheight: number
  tilewidth: number
  tileheight: number
}

export interface Chunk {
  data: number[]
  width: number
  height: number
}

export interface MapLayer {
  // chunks: Chunk[]
  data: number[]
  height: number
  width: number
}

export interface MapData {
  // tilesets: Tileset[]
  tilesets: Tileset
  layers: MapLayer[]
  tilewidth: number
  tileheight: number
}

export class GameMap {
  mapData: MapData
  // tilesetImages: Map<string, HTMLImageElement>
  tilesetImage: HTMLImageElement
  tilewidth: number
  tileheight: number

  constructor(
    mapData: MapData,
    // tilesetImages: Map<string, HTMLImageElement>
    tilesetImage: HTMLImageElement
  ) {

    this.mapData = mapData
    this.tilesetImage = tilesetImage
    this.tilewidth = mapData.tilewidth
    this.tileheight = mapData.tileheight
  }

  update() {

  }

  draw(c: CanvasRenderingContext2D) {
    for(const layer of this.mapData.layers) {
      for(let y=0; y<layer.height; y++) {
        for(let x=0; x<layer.width; x++) {

          const tileIndex = y * layer.width + x
          const gid = layer.data[tileIndex]
          if(gid===0) continue

          // const sx = gid % this.mapData.tilesets[0].tileheight
          const sx = gid % this.mapData.tilesets.columns
          const sy = gid - sx

          c.drawImage(
            this.tilesetImage,

            sx,
            sy,

            // this.mapData.tilesets[0].tilewidth,
            // this.mapData.tilesets[0].tilewidth,

            this.mapData.tilesets.tilewidth,
            this.mapData.tilesets.tilewidth,

            x * this.tilewidth,
            y * this.tileheight,

            this.tilewidth,
            this.tileheight
          )

          console.log("Tile Drawn!")

        }
      }
    }

  }

  getTilesetFromFirstgid() {

  }

}