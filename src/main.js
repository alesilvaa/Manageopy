import './style.css'

document.documentElement.classList.add('js')

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year')
  if (year) year.textContent = new Date().getFullYear()

  const reveals = document.querySelectorAll('.reveal')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const staggerGroups = document.querySelectorAll(
    '.service-grid, .public-project-grid, .testimonial-grid, .process-steps',
  )

  staggerGroups.forEach((group) => {
    ;[...group.children].forEach((element, index) => {
      if (element.classList.contains('reveal')) {
        element.style.setProperty('--reveal-delay', `${Math.min(index * 90, 270)}ms`)
      }
    })
  })

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'))
    document.querySelectorAll('.process-steps li').forEach((step) => step.classList.add('is-active'))
    document.documentElement.classList.add('motion-ready')
    return
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'))
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08,
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
      rootMargin: '-18% 0px -18% 0px',
      threshold: 0.55,
    },
  )

  document.querySelectorAll('.project-feature').forEach((project) => projectObserver.observe(project))

  const process = document.querySelector('.process')
  const processSteps = [...document.querySelectorAll('.process-steps li')]
  let processFrame = null

  const updateProcessProgress = () => {
    processFrame = null
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

  const requestProcessUpdate = () => {
    if (processFrame !== null) return
    processFrame = requestAnimationFrame(updateProcessProgress)
  }

  updateProcessProgress()
  window.addEventListener('scroll', requestProcessUpdate, { passive: true })
  window.addEventListener('resize', requestProcessUpdate)

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
