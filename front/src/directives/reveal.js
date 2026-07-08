// Scroll-reveal directive: adds `is-visible` when the element enters the viewport.
// Usage: <div v-reveal class="reveal"> ... </div>

const observer = new IntersectionObserver(
  (entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
)

export const reveal = {
  mounted(el) {
    el.classList.add('reveal')
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}
