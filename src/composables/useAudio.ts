import { ref, onUnmounted } from 'vue'

export interface AudioOptions {
  volume?: number
  loop?: boolean
}

export function useAudio(src: string, options: AudioOptions = {}) {
  const audio = ref<HTMLAudioElement>()
  const { volume = 1, loop = false } = options

  const createAudio = () => {
    if (!audio.value) {
      audio.value = new Audio(src)
      audio.value.volume = volume
      audio.value.loop = loop
    }
    return audio.value
  }

  const play = async () => {
    const audioElement = createAudio()
    try {
      audioElement.currentTime = 0
      await audioElement.play()
    } catch (error) {
      console.warn('Failed to play audio:', error)
    }
  }

  const pause = () => {
    if (audio.value) {
      audio.value.pause()
    }
  }

  onUnmounted(() => {
    if (audio.value) {
      audio.value.pause()
      audio.value = undefined
    }
  })

  return {
    play,
    pause
  }
}

// Convenience functions for common audio files
export function useChimeAudio(options?: AudioOptions) {
  return useAudio('/sounds/success-chime.mp3', { volume: 1, ...options })
}

export function useTimerAudio(options?: AudioOptions) {
  return useAudio('/sounds/tick-tock.mp3', { volume: 0.4, loop: true, ...options })
}