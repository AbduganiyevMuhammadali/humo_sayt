import { ref } from 'vue'

// Проверяет, существует ли изображение по пути. Если да — возвращает true,
// и компонент показывает фото; иначе остаётся анимированный fallback.
export function useImageExists(src) {
  const exists = ref(false)
  const img = new Image()
  img.onload = () => (exists.value = true)
  img.onerror = () => (exists.value = false)
  img.src = src
  return exists
}
