import './style.css'
import './services.css'
import './mobile.css'
import './seo-pages.css'

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year')
  if (year) year.textContent = new Date().getFullYear()

  const reveals = document.querySelectorAll('.reveal')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const staggerGroups = document.querySelectorAll(
    '.service-grid, .public-project-grid, .testimonial-grid, .process-steps',
  )
  const staggerStep = window.innerWidth <= 700 ? 70 : 100

  staggerGroups.forEach((group) => {
    ;[...group.children].forEach((element, index) => {
      if (element.classList.contains('reveal')) {
        element.style.setProperty('--reveal-delay', `${Math.min(index * staggerStep, 300)}ms`)
      }
    })
  })

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'))
    document.querySelectorAll('.process-steps li').forEach((step) => step.classList.add('is-active'))
    document.documentElement.classList.add('motion-ready')
    return
  }

  const revealPage = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'))
    })
  }

  const fontReady = document.fonts?.ready ?? Promise.resolve()
  Promise.race([fontReady, new Promise((resolve) => window.setTimeout(resolve, 650))]).then(revealPage)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    },
  )

  reveals.forEach((element) => observer.observe(element))

  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-showcasing', entry.isIntersecting)
      })
    },
    {
      rootMargin: '-14% 0px -14% 0px',
      threshold: 0.4,
    },
  )

  document.querySelectorAll('.project-feature').forEach((project) => projectObserver.observe(project))

  const process = document.querySelector('.process')
  const processSteps = [...document.querySelectorAll('.process-steps li')]
  const depthElements = [
    ...document.querySelectorAll(
      '.service-figure, .project-visual, .testimonial-photo, .system-case-head',
    ),
  ]
  let motionFrame = null

  const updateProcessProgress = () => {
    if (!process || processSteps.length === 0) return

    const rect = process.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const distance = rect.height + viewportHeight * 0.35
    const progress = Math.min(1, Math.max(0, (viewportHeight * 0.78 - rect.top) / distance))

    process.style.setProperty('--process-progress', progress.toFixed(3))
    processSteps.forEach((step, index) => {
      const threshold = 0.08 + index * 0.2
      step.classList.toggle('is-active', progress >= threshold)
    })
  }

  const updateDepthMotion = () => {
    const viewportHeight = window.innerHeight

    depthElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isNearViewport = rect.bottom > -120 && rect.top < viewportHeight + 120

      element.classList.toggle('is-motion-active', isNearViewport)
      if (!isNearViewport) return

      const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2
      const travelRange = viewportHeight / 2 + rect.height / 2
      const normalizedOffset = Math.max(-1, Math.min(1, centerOffset / travelRange))
      const strength = element.classList.contains('project-visual') ? 10 : 6
      const motionY = -normalizedOffset * strength

      element.style.setProperty('--motion-y', `${motionY.toFixed(2)}px`)

      if (element.classList.contains('project-visual')) {
        const previewPosition = 50 - normalizedOffset * 24
        element.style.setProperty('--preview-position', `${previewPosition.toFixed(2)}%`)
      }
    })
  }

  const updatePageMotion = () => {
    motionFrame = null
    updateProcessProgress()
    updateDepthMotion()
  }

  const requestMotionUpdate = () => {
    if (motionFrame !== null) return
    motionFrame = requestAnimationFrame(updatePageMotion)
  }

  updatePageMotion()
  window.addEventListener('scroll', requestMotionUpdate, { passive: true })
  window.addEventListener('resize', requestMotionUpdate)

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')]
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)
        })
      })
    },
    {
      rootMargin: '-38% 0px -55% 0px',
      threshold: 0,
    },
  )

  navSections.forEach((section) => navObserver.observe(section))
})
