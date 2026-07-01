import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function pad(n) {
  return String(n).padStart(4, '0')
}

/**
 * Renders a video-like frame sequence on a Three.js plane, scrubbed by scroll
 * position. Frame index is a pure function of scroll progress, so scrolling
 * up naturally reverses the sequence.
 */
export default function ScrollFrameSequence({
  framePath = '/frames/dealersync',
  frameCount,
  heightMultiplier = 3,
  children,
}) {
  const wrapperRef = useRef(null)
  const stickyRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const frameIndexRef = useRef(0)
  const textureRef = useRef(null)
  const meshRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const renderRef = useRef(null)
  const [progressPct, setProgressPct] = useState(0)
  const [ready, setReady] = useState(false)

  // Preload every frame image.
  useEffect(() => {
    let loaded = 0
    let cancelled = false
    const images = new Array(frameCount)

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = `${framePath}/frame_${pad(i + 1)}.jpg`
      img.onload = img.onerror = () => {
        loaded++
        if (!cancelled) {
          setProgressPct(Math.round((loaded / frameCount) * 100))
          if (loaded === frameCount) setReady(true)
        }
      }
      images[i] = img
    }
    imagesRef.current = images

    return () => {
      cancelled = true
    }
  }, [framePath, frameCount])

  // Set up the Three.js scene once images are ready.
  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    const sticky = stickyRef.current
    if (!canvas || !sticky) return

    const firstImg = imagesRef.current[0]
    const imgAspect = firstImg.naturalWidth / firstImg.naturalHeight

    // Guard against StrictMode's dev double-invoke: a second WebGL context
    // request on the same canvas after the first was disposed comes back
    // broken, so only create the renderer/scene/texture once and reuse them
    // across remounts.
    let renderer = rendererRef.current
    let scene = sceneRef.current
    let camera = cameraRef.current
    let texture = textureRef.current
    let mesh = meshRef.current

    if (!renderer) {
      scene = new THREE.Scene()
      sceneRef.current = scene

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer

      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      camera.position.z = 1
      cameraRef.current = camera

      texture = new THREE.Texture(firstImg)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
      textureRef.current = texture

      const geometry = new THREE.PlaneGeometry(1, 1)
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      mesh = new THREE.Mesh(geometry, material)
      meshRef.current = mesh
      scene.add(mesh)
    }

    const renderNow = () => renderer.render(scene, camera)
    renderRef.current = renderNow

    // "Contain" fit: scale the camera frustum to real pixel dimensions and
    // size the plane to the image's full aspect ratio, so the whole frame is
    // always visible (no cropping) with the sticky container's background
    // showing through as letterboxing/pillarboxing.
    const applyContain = (vw, vh) => {
      camera.left = -vw / 2
      camera.right = vw / 2
      camera.top = vh / 2
      camera.bottom = -vh / 2
      camera.updateProjectionMatrix()

      const viewportAspect = vw / vh
      let planeWidth
      let planeHeight
      if (imgAspect > viewportAspect) {
        planeWidth = vw
        planeHeight = vw / imgAspect
      } else {
        planeHeight = vh
        planeWidth = vh * imgAspect
      }
      mesh.scale.set(planeWidth, planeHeight, 1)
    }

    const resize = () => {
      const vw = sticky.clientWidth
      const vh = sticky.clientHeight
      renderer.setSize(vw, vh, false)
      applyContain(vw, vh)
      renderNow()
    }
    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [ready])

  // Dispose Three.js resources only on true component teardown.
  useEffect(() => {
    return () => {
      meshRef.current?.geometry?.dispose()
      meshRef.current?.material?.dispose()
      textureRef.current?.dispose()
      rendererRef.current?.dispose()
    }
  }, [])

  // Map scroll position within the sticky section to a frame index.
  useEffect(() => {
    if (!ready) return

    const onScroll = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const scrollable = wrapper.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.min(Math.max(scrolled / scrollable, 0), 1)
      const index = Math.round(progress * (frameCount - 1))

      if (index !== frameIndexRef.current && textureRef.current) {
        frameIndexRef.current = index
        textureRef.current.image = imagesRef.current[index]
        textureRef.current.needsUpdate = true
        renderRef.current?.()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready, frameCount])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${heightMultiplier * 100}vh` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-charcoal">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal">
            <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden mb-4">
              <div
                className="h-full bg-gold-gradient transition-all duration-150"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-white/40 text-sm">Loading animation… {progressPct}%</p>
          </div>
        )}

        {ready && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto max-w-2xl text-center px-6">{children}</div>
          </div>
        )}
      </div>
    </div>
  )
}
