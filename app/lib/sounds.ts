export const sounds = {
  flip: "/sounds/flipCard.mp3",
  correct: "/sounds/correctAnswer.mp3",
  skip: "/sounds/skip.mp3",
  timeUp: "/sounds/timeUp.mp3",
  victory: "/sounds/victory.mp3",
  draw: "/sounds/gameDraw.mp3",
  fastTickTock: "/sounds/fastTickTock.mp3",
};

export const playSound = (sound: string, duration?: number) => {
  const audio = new Audio(sound);

  audio.currentTime = 0;
  audio.play().catch(() => {
    // Audio playback was blocked by the browser.
  });

  if (duration) {
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, duration);
  }
}