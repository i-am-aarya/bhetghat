export interface GameAssets {
  characterMaleSprite: HTMLImageElement;
  characterFemaleSprite: HTMLImageElement;
  characterMale2Sprite: HTMLImageElement;
  mapImg: HTMLImageElement;
}

export function loadImage(imgSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

export async function loadAssets(): Promise<GameAssets> {
  const [
    characterMaleSprite,
    characterFemaleSprite,
    characterMale2Sprite,
    mapImg,
  ] = await Promise.all([
    loadImage("/assets/characters/character-male.png"),
    loadImage("/assets/characters/character-female.png"),
    loadImage("/assets/characters/character-male-2.png"),
    loadImage("/assets/map/gameMap.png"),
  ]);

  return {
    characterMaleSprite,
    characterFemaleSprite,
    characterMale2Sprite,
    mapImg,
  };
}
