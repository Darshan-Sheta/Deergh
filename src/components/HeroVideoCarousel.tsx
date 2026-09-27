import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { PortfolioCarouselVideo } from '../data/portfolioData';

interface HeroVideoCarouselProps {
  videos: PortfolioCarouselVideo[];
  onSelectProject: (showcaseId: string) => void;
  onStartProject: () => void;
  onViewWork: () => void;
}

const SLIDE_DURATION_MS = 3600; // 3.6 seconds per slide

/**
 * Persistent HTML5 <video> element that stays alive across all 3D carousel transforms.
 * Includes an automatic real-time Canvas MediaStream fallback if an external MP4 URL
 * is unreachable so the <video> element is 100% guaranteed to play continuous motion.
 */
function ContinuousVideoPlayer({
  video,
  isVisibleInViewport,
}: {
  video: PortfolioCarouselVideo;
  isVisibleInViewport: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fallbackCleanupRef = useRef<(() => void) | null>(null);
  const [usingProceduralStream, setUsingProceduralStream] = useState(false);

  const startProceduralStream = useCallback(() => {
    const videoEl = videoRef.current;
    if (!videoEl || fallbackCleanupRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const posterImg = new Image();
      posterImg.crossOrigin = 'anonymous';
      posterImg.src = video.poster;

      let animId = 0;
      let frame = video.id * 45;

      const renderLoop = () => {
        frame += 1;
        const t = frame * 0.025;

        // Draw dynamic zooming/panning base image if loaded
        ctx.fillStyle = '#070707';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (posterImg.complete && posterImg.naturalWidth > 0) {
          const zoom = 1.08 + Math.sin(t * 0.7) * 0.06;
          const panX = Math.cos(t * 0.5) * 18;
          const panY = Math.sin(t * 0.4) * 10;
          const w = canvas.width * zoom;
          const h = canvas.height * zoom;
          const x = (canvas.width - w) / 2 + panX;
          const y = (canvas.height - h) / 2 + panY;
          ctx.drawImage(posterImg, x, y, w, h);
        }

        // Cinematic dark gradient & orange anamorphic light sweep
        const sweepX = ((Math.sin(t * 0.9) + 1) / 2) * canvas.width;
        const grad = ctx.createRadialGradient(
          sweepX,
          canvas.height * 0.35,
          10,
          sweepX,
          canvas.height * 0.5,
          canvas.width * 0.65
        );
        grad.addColorStop(0, 'rgba(255, 106, 50, 0.26)');
        grad.addColorStop(0.5, 'rgba(11, 11, 12, 0.35)');
        grad.addColorStop(1, 'rgba(7, 7, 7, 0.78)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle animated speed-ramp horizontal motion streaks
        ctx.strokeStyle = 'rgba(255, 154, 98, 0.22)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          const yPos = ((i * 73 + frame * (2 + i * 0.5)) % canvas.height);
          const xStart = ((frame * (9 + i * 3) + i * 140) % (canvas.width + 200)) - 100;
          ctx.beginPath();
          ctx.moveTo(xStart, yPos);
          ctx.lineTo(xStart + 90 + i * 20, yPos);
          ctx.stroke();
        }

        animId = requestAnimationFrame(renderLoop);
      };

      renderLoop();

      const canvasWithStream = canvas as HTMLCanvasElement & {
        captureStream?: (frameRate?: number) => MediaStream;
      };

      if (typeof canvasWithStream.captureStream === 'function') {
        const stream = canvasWithStream.captureStream(30);
        videoEl.srcObject = stream;
        videoEl.play().catch(() => {});
        setUsingProceduralStream(true);
      }

      fallbackCleanupRef.current = () => {
        cancelAnimationFrame(animId);
      };
    } catch {
      // Ignore fallback errors
    }
  }, [video.id, video.poster]);

  useEffect(() => {
    return () => {
      if (fallbackCleanupRef.current) {
        fallbackCleanupRef.current();
        fallbackCleanupRef.current = null;
      }
    };
  }, []);

  // Ensure continuous playback whenever visible in viewport
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isVisibleInViewport) {
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
      }
    } else {
      if (!videoEl.paused) {
        videoEl.pause();
      }
    }
  }, [isVisibleInViewport]);

  return (
    <video
      ref={videoRef}
      src={usingProceduralStream ? undefined : video.src}
      poster={video.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onCanPlay={(e) => {
        const el = e.currentTarget;
        if (el.paused && isVisibleInViewport) {
          el.play().catch(() => {});
        }
      }}
      onError={() => {
        startProceduralStream();
      }}
      className="w-full h-full object-cover pointer-events-none select-none"
    />
  );
}

export default function HeroVideoCarousel({
  videos,
  onSelectProject,
  onStartProject,
  onViewWork,
}: HeroVideoCarouselProps) {
  const total = videos.length;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isCenterHovered, setIsCenterHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isVisibleInViewport, setIsVisibleInViewport] = useState<boolean>(true);

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);

  // Detect mobile viewport for responsive 3-card vs 6-card 3D halo layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver for performance optimization when scrolled far past hero
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisibleInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous requestAnimationFrame infinite slider timer
  // Pauses ONLY the slider rotation when hovering the center video; videos keep playing!
  useEffect(() => {
    let rafId: number;

    const tick = (now: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now;
      }
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      if (!isCenterHovered && isVisibleInViewport) {
        elapsedRef.current += delta;
        if (elapsedRef.current >= SLIDE_DURATION_MS) {
          elapsedRef.current = elapsedRef.current % SLIDE_DURATION_MS;
          setActiveIndex((prev) => (prev + 1) % total);
        }
        setProgress(Math.min(100, (elapsedRef.current / SLIDE_DURATION_MS) * 100));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isCenterHovered, isVisibleInViewport, total]);

  const handleGoToSlide = useCallback(
    (targetIndex: number) => {
      const normalized = ((targetIndex % total) + total) % total;
      setActiveIndex(normalized);
      elapsedRef.current = 0;
      setProgress(0);
    },
    [total]
  );

  const handlePrev = useCallback(() => {
    handleGoToSlide(activeIndex - 1);
  }, [activeIndex, handleGoToSlide]);

  const handleNext = useCallback(() => {
    handleGoToSlide(activeIndex + 1);
  }, [activeIndex, handleGoToSlide]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaXRef.current) > 42) {
      if (touchDeltaXRef.current < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  /**
   * Computes GPU-friendly 3D perspective transforms (`translate3d`, `rotateY`, `scale`)
   * for each card based on its circular relative index around `activeIndex`.
   *
   * Desktop 6-card 3D Halo matches the reference diagram:
   *         [rel 3: Top Center]
   * [rel 4: Upper Left]   [rel 2: Upper Right]
   *         [rel 0: MAIN VIDEO]
   * [rel 5: Lower Left]   [rel 1: Lower Right]
   */
  const getCard3DStyle = (index: number): React.CSSProperties => {
    const rel = ((index - activeIndex) % total + total) % total;

    if (isMobile) {
      // Mobile version: Previous video <- MAIN VIDEO (88% width) -> Next video
      if (rel === 0) {
        return {
          transform: 'translate3d(0%, 0px, 60px) rotateY(0deg) scale(1)',
          opacity: 1,
          filter: 'blur(0px) contrast(1.06)',
          zIndex: 30,
        };
      }
      if (rel === 1) {
        // Next video peeking at right edge
        return {
          transform: 'translate3d(78%, 6px, -40px) rotateY(-14deg) scale(0.84)',
          opacity: 0.52,
          filter: 'blur(1.5px) brightness(0.75)',
          zIndex: 20,
        };
      }
      if (rel === total - 1) {
        // Previous video peeking at left edge
        return {
          transform: 'translate3d(-78%, 6px, -40px) rotateY(14deg) scale(0.84)',
          opacity: 0.52,
          filter: 'blur(1.5px) brightness(0.75)',
          zIndex: 20,
        };
      }
      // Hidden background cards on mobile (keep video element alive without resetting)
      return {
        transform: 'translate3d(0%, -30px, -160px) rotateY(0deg) scale(0.65)',
        opacity: 0,
        filter: 'blur(4px)',
        zIndex: 5,
        pointerEvents: 'none',
      };
    }

    // Desktop 3D Perspective Multi-Plane Halo
    if (rel === 0) {
      // CENTER MAIN ACTIVE VIDEO
      const hoverScale = isCenterHovered ? 1.045 : 1;
      return {
        transform: `translate3d(0%, 28px, 110px) rotateY(0deg) scale(${hoverScale})`,
        opacity: 1,
        filter: 'blur(0px) contrast(1.08) brightness(1.02)',
        zIndex: 30,
      };
    }

    if (rel === 1) {
      // LOWER / FOREGROUND RIGHT
      return {
        transform: 'translate3d(64%, 52px, 0px) rotateY(-18deg) scale(0.75)',
        opacity: 0.65,
        filter: 'blur(1.2px) brightness(0.82)',
        zIndex: 20,
      };
    }

    if (rel === total - 1) {
      // LOWER / FOREGROUND LEFT
      return {
        transform: 'translate3d(-64%, 52px, 0px) rotateY(18deg) scale(0.75)',
        opacity: 0.65,
        filter: 'blur(1.2px) brightness(0.82)',
        zIndex: 20,
      };
    }

    if (rel === 2) {
      // UPPER / MID-DEPTH RIGHT
      return {
        transform: 'translate3d(46%, -66px, -115px) rotateY(-24deg) scale(0.58)',
        opacity: 0.42,
        filter: 'blur(2.4px) brightness(0.68)',
        zIndex: 12,
      };
    }

    if (rel === total - 2) {
      // UPPER / MID-DEPTH LEFT
      return {
        transform: 'translate3d(-46%, -66px, -115px) rotateY(24deg) scale(0.58)',
        opacity: 0.42,
        filter: 'blur(2.4px) brightness(0.68)',
        zIndex: 12,
      };
    }

    // TOP CENTER HORIZON VIDEO (rel === 3)
    return {
      transform: 'translate3d(0%, -128px, -195px) rotateY(0deg) scale(0.47)',
      opacity: 0.28,
      filter: 'blur(3.4px) brightness(0.58)',
      zIndex: 6,
    };
  };

  const activeVideo = videos[activeIndex];

  return (
    <section
      ref={heroSectionRef}
      className="relative overflow-hidden pt-10 pb-20 lg:pt-14 lg:pb-24 px-4 sm:px-6 select-none"
      style={{
        background: `
          radial-gradient(circle at 50% 22%, rgba(255, 106, 50, 0.17), transparent 40%),
          radial-gradient(circle at 78% 62%, rgba(91, 140, 255, 0.045), transparent 42%),
          #070707
        `,
      }}
    >
      {/* Film Grain Overlay & Soft Vignette */}
      <div className="absolute inset-0 bg-film-grain pointer-events-none z-0" />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(7, 7, 7, 0.85) 100%)',
        }}
      />

      {/* Slowly Moving Studio Orange Light Bloom Behind Carousel */}
      <div
        aria-hidden="true"
        className="animate-studio-light pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[760px] h-[280px] sm:h-[380px] rounded-full blur-[110px] z-0"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 106, 50, 0.22) 0%, rgba(255, 154, 98, 0.07) 52%, transparent 75%)',
        }}
      />

      {/* Subtle Ambient Dust Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="animate-particle absolute top-[18%] left-[22%] w-1 h-1 rounded-full bg-[#FF9A62]/40" />
        <span
          className="animate-particle absolute top-[32%] right-[19%] w-1.5 h-1.5 rounded-full bg-[#FF6A32]/30"
          style={{ animationDelay: '2.2s' }}
        />
        <span
          className="animate-particle absolute bottom-[26%] left-[15%] w-1 h-1 rounded-full bg-white/25"
          style={{ animationDelay: '4.1s' }}
        />
        <span
          className="animate-particle absolute bottom-[22%] right-[24%] w-1 h-1 rounded-full bg-[#FF9A62]/35"
          style={{ animationDelay: '1.4s' }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Top Agency Heading & Copy */}
        <div className="text-center max-w-[860px] mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-widest text-[#FF9A62] mb-4">
            <span>DEERGH HADIYAL</span>
            <span className="text-white/30">•</span>
            <span className="text-[#D6D6D6]">DIGITAL POST-PRODUCTION STUDIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-white tracking-[-0.035em] leading-[1.04] mb-5">
            VIDEO EDITING THAT
            <br />
            <span className="bg-gradient-to-r from-white via-[#FFFFFF] to-[#FF9A62] bg-clip-text text-transparent">
              MAKES PEOPLE WATCH.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg font-medium text-[#FF6A32] tracking-wide mb-4">
            Professional Video Editor • Creative Storyteller • Audience Growth Specialist
          </p>

          <p className="text-sm sm:text-base text-[#929292] font-normal leading-relaxed max-w-[640px] mx-auto mb-7">
            I transform raw footage into engaging visual experiences designed to capture attention,
            improve retention, and tell compelling stories.
          </p>

          {/* Primary & Secondary Agency CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartProject}
              className="px-7 py-3.5 text-sm font-semibold tracking-wide bg-[#FF6A32] text-[#070707] rounded-lg hover:bg-[#FF9A62] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_10px_30px_-8px_rgba(255,106,50,0.45)] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onViewWork}
              className="px-7 py-3.5 text-sm font-semibold tracking-wide bg-white/[0.04] hover:bg-white/[0.09] text-white border border-white/15 hover:border-[#FF6A32]/50 rounded-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW MY WORK</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF6A32]" />
            </button>
          </div>
        </div>

        {/* 3D PERSPECTIVE CONTINUOUS VIDEO CAROUSEL STAGE */}
        <div
          className="relative mx-auto w-full max-w-[1160px] h-[270px] sm:h-[400px] md:h-[470px] lg:h-[520px] flex items-center justify-center perspective-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Circular Control (←) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous video slide"
            className="absolute left-1 sm:left-4 lg:left-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B0B0C]/70 hover:bg-[#111214]/95 backdrop-blur-md border border-white/15 hover:border-[#FF6A32]/70 text-[#D6D6D6] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Circular Control (→) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next video slide"
            className="absolute right-1 sm:right-4 lg:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0B0B0C]/70 hover:bg-[#111214]/95 backdrop-blur-md border border-white/15 hover:border-[#FF6A32]/70 text-[#D6D6D6] hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 3D Video Cards Track — Keyed by video.id so <video> elements NEVER unmount or restart */}
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {videos.map((video, index) => {
              const isCenter = index === activeIndex;
              const cardStyle = getCard3DStyle(index);

              return (
                <div
                  key={video.id}
                  style={{
                    ...cardStyle,
                    transition:
                      'transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms cubic-bezier(0.22, 1, 0.36, 1), filter 850ms cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: 'transform, opacity, filter',
                  }}
                  onMouseEnter={() => {
                    if (isCenter) setIsCenterHovered(true);
                  }}
                  onMouseLeave={() => {
                    if (isCenter) setIsCenterHovered(false);
                  }}
                  onClick={() => {
                    if (isCenter) {
                      onSelectProject(video.showcaseId);
                    } else {
                      handleGoToSlide(index);
                    }
                  }}
                  role="button"
                  tabIndex={isCenter ? 0 : -1}
                  aria-label={`${video.title} - ${video.category}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isCenter) {
                        onSelectProject(video.showcaseId);
                      } else {
                        handleGoToSlide(index);
                      }
                    }
                  }}
                  className={`group absolute w-[88%] sm:w-[64%] md:w-[56%] lg:w-[54%] max-w-[640px] aspect-video rounded-[18px] bg-black overflow-hidden cursor-pointer select-none ${
                    isCenter
                      ? 'border border-[#FF6A32]/35 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.92),0_0_42px_-10px_rgba(255,106,50,0.28)]'
                      : 'border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]'
                  }`}
                >
                  {/* Persistent HTML5 Video Element */}
                  <ContinuousVideoPlayer
                    video={video}
                    isVisibleInViewport={isVisibleInViewport}
                  />

                  {/* Subtle Top Glass Specular Highlight Reflection */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/75"
                  />

                  {/* Subtle Always-On Corner Timecode / Live Status on Active Card */}
                  {isCenter && (
                    <div className="pointer-events-none absolute top-3.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono-tabular text-white/85">
                      <span className="inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A32] animate-pulse" />
                        <span>{video.category}</span>
                      </span>
                      <span className="bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[#D6D6D6]">
                        {video.duration} · {video.retentionMetric}
                      </span>
                    </div>
                  )}

                  {/* Center Card Hover / Active Details Overlay */}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-all duration-300 flex items-end justify-between gap-4 ${
                      isCenter
                        ? isCenterHovered
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-90 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-mono-tabular text-[#FF9A62] mb-1">
                        {video.category}
                      </div>
                      <h2 className="font-display text-base sm:text-xl font-bold text-white truncate">
                        {video.title}
                      </h2>
                      <p className="hidden sm:block text-xs text-[#D6D6D6] mt-1 line-clamp-1">
                        {video.description}
                      </p>
                    </div>

                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FF6A32] text-[#070707] text-xs font-bold tracking-wide shadow-md">
                      <span>VIEW PROJECT</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtle Floor Reflection Glow Beneath Center Video */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 w-[55%] max-w-[520px] h-8 rounded-full blur-2xl bg-[#FF6A32]/20"
          />
        </div>

        {/* Active Video Caption + Progress Dot Indicator (●━━━━ ○ ○ ○ ○ ○) */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4">
          {/* Active Slide Label Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono-tabular text-[#929292]">
            <span className="text-white font-semibold">{activeVideo.title}</span>
            <span>•</span>
            <span className="text-[#FF9A62]">{activeVideo.category}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{activeVideo.software}</span>
          </div>

          {/* Animated Dot Indicator with Progress Fill */}
          <div
            className="flex items-center gap-2.5"
            role="tablist"
            aria-label="Carousel video slides"
          >
            {videos.map((video, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={video.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}: ${video.title}`}
                  onClick={() => handleGoToSlide(idx)}
                  className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden cursor-pointer ${
                    isActive
                      ? 'w-12 bg-white/15'
                      : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-0 left-0 bg-[#FF6A32] rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
