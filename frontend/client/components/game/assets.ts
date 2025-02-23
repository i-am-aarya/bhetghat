export interface GameAssets {
  characterMaleSprite: HTMLImageElement;
  characterFemaleSprite: HTMLImageElement;
  characterMale2Sprite: HTMLImageElement;
  mapImg: HTMLImageElement;
  mapForegroundImg: HTMLImageElement;
  backgroundMusic: HTMLAudioElement;
}

export function loadImage(imgSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

export function loadSound(audioSrc: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.2;

    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = (error) => reject(error);
  });
}

export async function loadAssets(): Promise<GameAssets> {
  const [
    characterMaleSprite,
    characterFemaleSprite,
    characterMale2Sprite,
    mapImg,
    mapForegroundImg,
    backgroundMusic,
  ] = await Promise.all([
    loadImage("/assets/characters/character-male.png"),
    loadImage("/assets/characters/character-female.png"),
    loadImage("/assets/characters/character-male-2.png"),
    loadImage("/assets/map/gamemap-updated.png"),
    loadImage("/assets/map/foreground-updated-new.png"),
    loadSound("/assets/sounds/pokys-project.m4a"),
  ]);

  return {
    characterMaleSprite,
    characterFemaleSprite,
    characterMale2Sprite,
    mapImg,
    mapForegroundImg,
    backgroundMusic,
  };
}
