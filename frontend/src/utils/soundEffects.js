import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const SFX_URLS = {
  tap: "https://raw.githubusercontent.com/remarkablegames/water-pipe/master/public/sounds/click.mp3",
  success: "https://raw.githubusercontent.com/remarkablegames/water-pipe/master/public/sounds/splash.mp3",
  error: "https://raw.githubusercontent.com/remarkablegames/water-pipe/master/public/sounds/click.mp3",
};

const soundCache = {};
let audioModeReady = false;
let audioModePromise = null;

async function ensureAudioMode() {
  if (audioModeReady) return;
  if (!audioModePromise) {
    audioModePromise = setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      shouldPlayInBackground: false,
    })
      .then(() => {
        audioModeReady = true;
      })
      .catch(() => {})
      .finally(() => {
        audioModePromise = null;
      });
  }
  await audioModePromise;
}

function getSound(type) {
  const source = SFX_URLS[type] ?? SFX_URLS.tap;
  if (soundCache[type]) return soundCache[type];
  const player = createAudioPlayer({ uri: source });
  soundCache[type] = player;
  return player;
}

export async function playSfx(type = "tap", enabled = true) {
  if (!enabled) return;
  try {
    await ensureAudioMode();
    const player = getSound(type);
    player.seekTo(0);
    player.play();
  } catch (error) {
    // Keep UI responsive even if effect fails to load.
  }
}
