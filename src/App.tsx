import React, { useState, useEffect } from 'react';
import {
  Play,
  Download,
  ExternalLink,
  Copy,
  Check,
  X,
  Sliders,
  Film,
  ArrowUpRight,
  Printer,
  Eye,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  HERO_IMAGE,
  SOCIAL_LINKS,
  SERVICES,
  WHY_CHOOSE_ME,
  VIDEO_SHOWCASE,
  WORK_PROCESS,
  TECHNICAL_SKILLS,
  VideoShowcaseItem,
  downloadPortfolioDossier,
} from './data/portfolioData';

function extractYouTubeEmbedUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handle direct 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?autoplay=1&rel=0`;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
      if (url.pathname.startsWith('/shorts/')) {
        const shortsId = url.pathname.split('/shorts/')[1]?.split('/')[0];
        if (shortsId) return `https://www.youtube.com/embed/${shortsId}?autoplay=1&rel=0`;
      }
      if (url.pathname.startsWith('/embed/')) {
        return trimmed;
      }
    }
  } catch {
    return null;
  }
  return null;
}

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}

function ResilientImage({ src, alt, className = '', style, fallbackLabel }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1816] via-[#121318] to-[#0f0f0f] text-center p-6 ${className}`}
        style={style}
      >
        <Film className="w-8 h-8 text-[#FF6B35] mb-2 opacity-80" />
        <span className="text-xs font-medium text-[#CCCCCC]">{fallbackLabel || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      style={style}
    />
  );
}

export default function App() {
  const [activeVideoFilter, setActiveVideoFilter] = useState<
    'all' | 'hacks-edit' | 'retention' | 'color-sound'
  >('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoShowcaseItem | null>(null);
  const [gradeSplit, setGradeSplit] = useState<number>(78);
  const [activeMarkerIdx, setActiveMarkerIdx] = useState<number>(0);
  const [customYoutubeInput, setCustomYoutubeInput] = useState<string>('');
  const [customEmbeds, setCustomEmbeds] = useState<Record<string, string>>({});
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [isMutedPreview, setIsMutedPreview] = useState<boolean>(true);
  const [playheadProgress, setPlayheadProgress] = useState<number>(22);

  // Portfolio Dossier Modal state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [dossierDownloaded, setDossierDownloaded] = useState<boolean>(false);

  // Interactive Project Estimator & Contact Copy state
  const [selectedServiceType, setSelectedServiceType] = useState<string>('Short-Form Editing');
  const [monthlyVolume, setMonthlyVolume] = useState<'4' | '12' | '24'>('12');
  const [turnaroundSpeed, setTurnaroundSpeed] = useState<'standard' | 'priority'>('standard');
  const [clientName, setClientName] = useState<string>('');
  const [clientChannel, setClientChannel] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
        setIsDossierOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle playhead movement when lightbox preview is active
  useEffect(() => {
    if (!selectedVideo || !isPlayingPreview) return;
    const interval = window.setInterval(() => {
      setPlayheadProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 220);
    return () => window.clearInterval(interval);
  }, [selectedVideo, isPlayingPreview]);

  const filteredVideos =
    activeVideoFilter === 'all'
      ? VIDEO_SHOWCASE
      : VIDEO_SHOWCASE.filter((v) => v.category === activeVideoFilter);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  const handleTriggerDossierDownload = () => {
    downloadPortfolioDossier();
    setDossierDownloaded(true);
    window.setTimeout(() => setDossierDownloaded(false), 3000);
  };

  const handleApplyCustomEmbed = (videoId: string) => {
    const embedUrl = extractYouTubeEmbedUrl(customYoutubeInput);
    if (embedUrl) {
      setCustomEmbeds((prev) => ({ ...prev, [videoId]: embedUrl }));
      setCustomYoutubeInput('');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generatedBriefText = `Hi Deergh! I'd love to collaborate on video editing for my channel.
• Focus Service: ${selectedServiceType}
• Volume: ${monthlyVolume} videos / month
• Turnaround: ${turnaroundSpeed === 'priority' ? '24h Express Priority' : '24–48h Standard'}
${clientName ? `• Name: ${clientName}\n` : ''}${clientChannel ? `• Channel / Handle: ${clientChannel}\n` : ''}${projectNotes ? `• Project Details: ${projectNotes}` : ''}`.trim();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#CCCCCC] flex flex-col">
      {/* Top Bar Contract: Strict 1-row, 3-zone header */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#FF6B35]/20 px-6 py-4 no-print">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-display text-xl font-bold tracking-tight text-[#FF6B35] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
          >
            DEERGH
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#CCCCCC]">
            <a
              href="#services"
              className="hover:text-[#FF6B35] hover:underline underline-offset-8 transition-colors duration-150 whitespace-nowrap"
            >
              Services
            </a>
            <a
              href="#videos"
              className="hover:text-[#FF6B35] hover:underline underline-offset-8 transition-colors duration-150 whitespace-nowrap"
            >
              Videos
            </a>
            <a
              href="#process"
              className="hover:text-[#FF6B35] hover:underline underline-offset-8 transition-colors duration-150 whitespace-nowrap"
            >
              Process
            </a>
            <a
              href="#portfolio"
              className="hover:text-[#FF6B35] hover:underline underline-offset-8 transition-colors duration-150 whitespace-nowrap"
            >
              Portfolio
            </a>
            <a
              href="#contact"
              className="hover:text-[#FF6B35] hover:underline underline-offset-8 transition-colors duration-150 whitespace-nowrap"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="px-5 py-2 text-sm font-semibold bg-[#FF6B35] text-black rounded-md hover:bg-[#E85A2C] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section: Split-Screen Hero & Oversized Typographic Impact */}
        <section className="relative border-b border-[#FF6B35]/15 bg-gradient-to-br from-[#FF6B35]/[0.07] via-[#0f0f0f] to-[#0066FF]/[0.05] py-16 lg:py-24 px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Typographic Hierarchy & Quantitative Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#AAAAAA] font-mono-tabular">
                <span className="text-[#FF6B35] font-medium">HACKS EDIT Creator</span>
                <span aria-hidden="true">·</span>
                <span>Reels / TikToks / Shorts</span>
                <span aria-hidden="true">·</span>
                <span>4K 60fps Post-Production</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.08]">
                DEERGH HADIYAL
              </h1>

              <p className="text-xl sm:text-2xl lg:text-[26px] text-[#FF6B35] font-semibold leading-snug max-w-2xl">
                Short-Form Video Editing That Gets Results
              </p>

              <p className="text-base text-[#AAAAAA] leading-relaxed max-w-[62ch]">
                Professional video editor specializing in high-performing Reels, TikToks, and Shorts.
                I transform raw clips into engaging, algorithm-optimized content that captures
                attention in the first 3 seconds and drives real channel growth.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="px-7 py-3.5 text-base font-semibold bg-[#FF6B35] text-black rounded-md hover:bg-[#E85A2C] transition-transform duration-150 active:scale-[0.99] whitespace-nowrap cursor-pointer"
                >
                  Get Started
                </button>
                <a
                  href={SOCIAL_LINKS.youtubeChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 text-base font-semibold bg-transparent text-[#0066FF] border-2 border-[#0066FF] rounded-md hover:bg-[#0066FF]/10 transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span>View Work on YouTube</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(VIDEO_SHOWCASE[0])}
                  className="px-5 py-3.5 text-sm font-medium text-[#CCCCCC] hover:text-white transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#FF6B35] fill-[#FF6B35]" />
                  <span>Inspect Showreel Breakdown</span>
                </button>
              </div>

              {/* Claim-to-Proof Quantitative Metrics Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-xl">
                <div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-white">
                    0–3s
                  </div>
                  <div className="text-xs text-[#999999] mt-1">
                    Hook Architecture · Visual &amp; Sonic Lock
                  </div>
                </div>
                <div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#FF6B35]">
                    24–48h
                  </div>
                  <div className="text-xs text-[#999999] mt-1">
                    Turnaround Window · Frame-Accurate
                  </div>
                </div>
                <div>
                  <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-white">
                    4K 60p
                  </div>
                  <div className="text-xs text-[#999999] mt-1">
                    Master Delivery · Rec.709 &amp; -14 LUFS
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase Frame with Interactive NLE Scrubber Trigger */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setSelectedVideo(VIDEO_SHOWCASE[0])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedVideo(VIDEO_SHOWCASE[0]);
                  }
                }}
                className="group relative rounded-2xl overflow-hidden border border-[#FF6B35]/30 bg-[#141414] cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
              >
                <div className="aspect-video relative overflow-hidden">
                  <ResilientImage
                    src={HERO_IMAGE}
                    alt="Deergh Hadiyal Video Editing Suite and Color Grading Workstation"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

                  {/* Top Timecode & Format Readout (Unboxed clean text) */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-white/90">
                    <span>REC · 00:00:58:14</span>
                    <span>HACKS EDIT · MASTER TIMELINE</span>
                  </div>

                  {/* Center Play Affordance */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#FF6B35] text-black flex items-center justify-center shadow-lg transition-transform duration-150 group-hover:scale-110">
                      <Play className="w-7 h-7 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Scrim Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#FF6B35] font-semibold">
                        Interactive Showreel &amp; Color Inspector
                      </div>
                      <div className="text-base font-semibold text-white">
                        Click to inspect timeline cuts &amp; raw-to-graded look
                      </div>
                    </div>
                    <span className="text-xs font-mono-tabular text-[#CCCCCC] whitespace-nowrap">
                      16:9 &amp; 9:16
                    </span>
                  </div>
                </div>

                {/* Simulated NLE Timeline Footer Bar */}
                <div className="px-4 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between text-xs font-mono-tabular text-[#999999]">
                  <span>V1 · Premiere Pro + After Effects</span>
                  <span className="text-[#FF6B35]">A1+A2 · -14.0 LUFS Master</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Editorial Marquee Divider (Portfolio Reference Section 2.B) */}
        <div
          aria-hidden="true"
          className="border-b border-white/10 bg-[#0b0b0b] py-3 overflow-hidden select-none no-print"
        >
          <div className="animate-marquee flex items-center gap-8 text-xs font-mono-tabular text-[#888888]">
            <span>short-form video editing · reels &amp; tiktoks · youtube shorts · hacks edit series · motion graphics · davinci resolve color grading · retention storytelling · thumbnail design ·</span>
            <span>short-form video editing · reels &amp; tiktoks · youtube shorts · hacks edit series · motion graphics · davinci resolve color grading · retention storytelling · thumbnail design ·</span>
          </div>
        </div>

        {/* Services Section (#services) */}
        <section id="services" className="py-20 px-6 max-w-[1200px] mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono-tabular text-[#FF6B35] mb-2">
              Capabilities &amp; Post-Production
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Services Engineered for Audience Retention
            </h2>
            <p className="text-sm sm:text-base text-[#AAAAAA] mt-3 leading-relaxed">
              Every frame is cut with platform algorithms and human psychology in mind—from the
              opening 3-second hook to the final seamless loop.
            </p>
          </div>

          {/* 6 Services Grid (Single-Elevation Depth, Natural Editorial Numbering) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.index}
                onClick={() => {
                  setSelectedServiceType(service.title);
                  scrollToSection('contact');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedServiceType(service.title);
                    scrollToSection('contact');
                  }
                }}
                className="group bg-[#FF6B35]/[0.04] border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/[0.08] rounded-xl p-7 transition-all duration-150 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono-tabular text-sm font-semibold text-[#FF6B35]">
                      {service.index}.
                    </span>
                    <span className="font-mono-tabular text-xs text-[#888888]">
                      {service.turnaround}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2.5 group-hover:text-[#FF6B35] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#999999] leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 text-xs text-[#CCCCCC]">
                  <span className="truncate">{service.deliverables}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#FF6B35] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Me Strip (Separated by whitespace & left accent border as in reference) */}
          <div className="mt-16 bg-[#0066FF]/[0.05] border-l-4 border-[#0066FF] rounded-r-xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-mono-tabular text-[#0066FF] mb-1">
                  The Competitive Advantage
                </p>
                <h3 className="font-display text-2xl font-bold text-white">Why Choose Me</h3>
              </div>
              <p className="text-xs font-mono-tabular text-[#AAAAAA]">
                YouTube · TikTok · Instagram Reels · Snapchat
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {WHY_CHOOSE_ME.map((item, idx) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold text-white">
                      <span className="text-[#FF6B35] font-mono-tabular mr-2">
                        0{idx + 1}.
                      </span>
                      {item.title}
                    </h4>
                    <span className="text-xs font-mono-tabular text-[#FF6B35] whitespace-nowrap">
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Showcase Section (#videos) - Dynamic Bento Grid + Lightbox + Live YouTube Embedder */}
        <section
          id="videos"
          className="py-20 px-6 bg-[#141414] border-y border-[#FF6B35]/15"
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-mono-tabular text-[#FF6B35] mb-2">
                  Selected Works &amp; Showreel
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  Video Showcase
                </h2>
                <p className="text-sm sm:text-base text-[#AAAAAA] mt-3 leading-relaxed">
                  Watch my latest work from the{' '}
                  <span className="text-white font-medium">HACKS EDIT</span> channel. Fast-paced,
                  engaging content that showcases my editing style and expertise in creating
                  viral-ready videos. Click any project to inspect the cut breakdown or embed a live
                  YouTube video.
                </p>
              </div>

              {/* Interactive Filter Controls (Functional buttons per Rule 1.A) */}
              <div className="flex items-center gap-1 p-1 bg-[#0f0f0f] border border-white/10 rounded-lg self-start">
                {(
                  [
                    { id: 'all', label: 'All Work' },
                    { id: 'hacks-edit', label: 'HACKS EDIT' },
                    { id: 'retention', label: 'Retention Cuts' },
                    { id: 'color-sound', label: 'Color & Sound' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveVideoFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                      activeVideoFilter === tab.id
                        ? 'bg-[#FF6B35] text-black font-semibold'
                        : 'text-[#AAAAAA] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bento Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {filteredVideos.map((video, index) => {
                const isWide = activeVideoFilter === 'all' && index === 0;
                const activeEmbedUrl = customEmbeds[video.id];

                return (
                  <article
                    key={video.id}
                    className={`${
                      isWide ? 'lg:col-span-7' : activeVideoFilter === 'all' ? 'lg:col-span-5' : 'lg:col-span-6'
                    } group rounded-2xl overflow-hidden bg-[#0f0f0f] border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all duration-200 flex flex-col justify-between`}
                  >
                    <div>
                      {/* Media Container */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        {activeEmbedUrl ? (
                          <iframe
                            src={activeEmbedUrl}
                            title={video.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedVideo(video);
                              setActiveMarkerIdx(0);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedVideo(video);
                                setActiveMarkerIdx(0);
                              }
                            }}
                            className="w-full h-full relative cursor-pointer"
                          >
                            <ResilientImage
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              style={{ filter: video.colorFilterGraded }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            {/* Top Metadata Line (Unboxed text with middot separators) */}
                            <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-white/90">
                              <span>
                                {video.categoryLabel} · {video.resolution} · {video.fps}
                              </span>
                              <span>{video.duration}</span>
                            </div>

                            {/* Play / Inspect Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#FF6B35] text-black flex items-center justify-center shadow-md transition-transform duration-150 group-hover:scale-110">
                                <Play className="w-6 h-6 fill-black ml-0.5" />
                              </div>
                            </div>

                            {/* Bottom Telemetry Overlay */}
                            <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-[#CCCCCC]">
                              <span>3s Hook Hold: {video.hookRate}</span>
                              <span className="text-[#FF6B35]">
                                Avg. Retention: {video.avgRetention}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-[#888888] font-mono-tabular mb-2">
                          <span>{video.softwareUsed}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-1.5">
                          {video.title}
                        </h3>
                        <p className="text-sm text-[#FF6B35] font-medium mb-3">
                          {video.subtitle}
                        </p>
                        <p className="text-sm text-[#999999] leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#121212]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVideo(video);
                          setActiveMarkerIdx(0);
                        }}
                        className="text-xs font-semibold text-white hover:text-[#FF6B35] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>Open Edit &amp; Color Inspector</span>
                      </button>

                      <a
                        href={video.defaultYoutubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#0066FF] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>Watch on @deerghhadiyal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </article>
                );
              })}

              {/* Interactive Before/After Color & Retention Comparison Card in the Bento Grid */}
              {activeVideoFilter === 'all' && (
                <div className="lg:col-span-7 rounded-2xl bg-[#0f0f0f] border border-[#0066FF]/30 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono-tabular text-[#0066FF]">
                        Interactive Look Development · DaVinci Resolve Pipeline
                      </span>
                      <span className="text-xs font-mono-tabular text-[#AAAAAA]">
                        Drag slider: {gradeSplit}% Graded Look
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-2">
                      Before &amp; After: Flat Camera Log vs. Viral Master Grade
                    </h3>
                    <p className="text-sm text-[#999999] mb-6 max-w-2xl">
                      Compare ungraded flat camera footage against the final high-contrast color
                      grade and kinetic polish applied to every HACKS EDIT upload.
                    </p>

                    {/* Interactive Split Image Container */}
                    <div className="relative aspect-video rounded-xl overflow-hidden select-none border border-white/10">
                      {/* Raw Log Base Layer */}
                      <ResilientImage
                        src={VIDEO_SHOWCASE[2].thumbnail}
                        alt="Raw Flat Log Footage"
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'saturate(0.38) contrast(0.78) brightness(0.95)',
                        }}
                      />
                      {/* Graded Clipped Layer */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - gradeSplit}% 0 0)` }}
                      >
                        <ResilientImage
                          src={VIDEO_SHOWCASE[2].thumbnail}
                          alt="Final Graded Footage"
                          className="w-full h-full object-cover"
                          style={{
                            filter: 'saturate(1.28) contrast(1.18) brightness(1.04)',
                          }}
                        />
                      </div>

                      {/* Vertical Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-[#FF6B35] shadow-[0_0_12px_#FF6B35]"
                        style={{ left: `${gradeSplit}%` }}
                      />

                      {/* Corner Labels */}
                      <div className="absolute top-3 left-3 text-xs font-mono-tabular text-white bg-black/70 px-2.5 py-1 rounded">
                        FINAL GRADE · Rec.709 + Halation
                      </div>
                      <div className="absolute top-3 right-3 text-xs font-mono-tabular text-[#CCCCCC] bg-black/70 px-2.5 py-1 rounded">
                        RAW S-Log3 · Flat Profile
                      </div>
                    </div>
                  </div>

                  {/* Range Slider Control */}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-xs font-mono-tabular text-[#888888] whitespace-nowrap">
                      0% Raw
                    </span>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={gradeSplit}
                      onChange={(e) => setGradeSplit(Number(e.target.value))}
                      aria-label="Color grade comparison slider"
                      className="w-full accent-[#FF6B35] cursor-pointer"
                    />
                    <span className="text-xs font-mono-tabular text-[#FF6B35] whitespace-nowrap">
                      100% Graded
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Channel CTA Footer */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#AAAAAA]">
                Want to see the full catalog of uploads and Shorts? Visit my official YouTube
                channel.
              </p>
              <a
                href={SOCIAL_LINKS.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-sm font-semibold bg-[#FF6B35] text-black rounded-md hover:bg-[#E85A2C] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Visit YouTube Channel (@deerghhadiyal)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* My Work Process & Technical Skills Section (#process) */}
        <section id="process" className="py-20 px-6 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Cols: My Work Process */}
            <div className="lg:col-span-7">
              <p className="text-xs font-mono-tabular text-[#FF6B35] mb-2">
                Post-Production Methodology
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
                My Work Process
              </h2>

              <div className="space-y-6">
                {WORK_PROCESS.map((step) => (
                  <div
                    key={step.index}
                    className="bg-[#FF6B35]/[0.04] border border-[#FF6B35]/20 hover:bg-[#FF6B35]/[0.08] transition-colors rounded-xl p-7"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FF6B35] mb-2">
                      <span>
                        {step.index} · {step.label}
                      </span>
                      <span className="text-[#AAAAAA]">{step.targetOutcome}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#999999] leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="text-xs font-mono-tabular text-[#CCCCCC] pt-3 border-t border-white/10">
                      Techniques: {step.keyTechniques}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Technical Skills & Stack (Zero-Pill Unboxed Metadata Discipline) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-mono-tabular text-[#0066FF] mb-2">
                  Tools &amp; Ecosystem
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8">
                  Technical Skills
                </h2>

                <div className="space-y-8 border-t border-white/10 pt-6">
                  {TECHNICAL_SKILLS.map((group) => (
                    <div key={group.category} className="border-b border-white/10 pb-6">
                      <h3 className="text-sm font-mono-tabular font-semibold text-[#FF6B35] mb-2">
                        {group.category}
                      </h3>
                      <p className="text-base text-white leading-relaxed">
                        {group.items.map((item, i) => (
                          <React.Fragment key={item}>
                            <span>{item}</span>
                            {i < group.items.length - 1 && (
                              <span className="mx-2.5 text-[#FF6B35]" aria-hidden="true">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Specifications Summary */}
              <div className="mt-8 p-6 rounded-xl bg-[#141414] border border-white/10">
                <div className="text-xs font-mono-tabular text-[#FF6B35] mb-2">
                  Standard Master Delivery Specs
                </div>
                <p className="text-sm text-[#CCCCCC] leading-relaxed">
                  H.264 / Apple ProRes 422 HQ · 1080x1920 (9:16 Vertical) &amp; 3840x2160 (16:9
                  UHD) · Rec.709 Color Space · -14 LUFS Normalized Stereo Master
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* My Professional Portfolio PDF / Dossier Section (#portfolio) */}
        <section
          id="portfolio"
          className="py-20 px-6 bg-gradient-to-br from-[#0066FF]/[0.08] via-[#0f0f0f] to-[#FF6B35]/[0.05] border-y border-[#0066FF]/25"
        >
          <div className="max-w-[900px] mx-auto text-center">
            <p className="text-xs font-mono-tabular text-[#0066FF] mb-2">
              Shareable Credentials &amp; Capabilities Deck
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              My Professional Portfolio
            </h2>

            <div className="bg-[#0066FF]/[0.07] border-2 border-[#0066FF]/35 rounded-2xl p-8 sm:p-12 max-w-[640px] mx-auto">
              <div className="text-xs font-mono-tabular text-[#CCCCCC] mb-3">
                DEERGH_HADIYAL_PORTFOLIO · 2026 EDITION
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Download My Portfolio Dossier
              </h3>
              <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed mb-8">
                Access my complete professional portfolio showcasing my services, expertise,
                technical skills, and contact information. Perfect for sharing with potential
                clients, creative directors, and collaborators.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleTriggerDossierDownload}
                  className="px-6 py-3.5 text-sm font-semibold bg-[#0066FF] hover:bg-[#0055CC] text-white rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {dossierDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Portfolio Dossier Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Portfolio Dossier</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="px-6 py-3.5 text-sm font-semibold bg-transparent text-white border border-white/20 hover:border-white/50 rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#FF6B35]" />
                  <span>Preview &amp; Print PDF</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Interactive Project Scope Section (#contact) */}
        <section
          id="contact"
          className="py-20 px-6 bg-gradient-to-br from-[#FF6B35]/[0.08] via-[#0f0f0f] to-[#0066FF]/[0.05]"
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 5 Cols: Direct Social Channels & Copy Controls */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-mono-tabular text-[#FF6B35]">
                Direct Channels &amp; Collaborations
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Let&apos;s Create Together
              </h2>
              <p className="text-base text-[#AAAAAA] leading-relaxed">
                Ready to transform your video content and grow your audience? Reach out through my
                social channels or configure your project brief to discuss how I can help take your
                channel to the next level.
              </p>

              {/* Social Channel Links List (Matching Reference Links + Copy Affordance) */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    id: 'yt-main',
                    label: 'YouTube Channel',
                    value: '@deerghhadiyal',
                    href: SOCIAL_LINKS.youtubeChannel,
                  },
                  {
                    id: 'yt-hacks',
                    label: 'HACKS EDIT Series',
                    value: 'youtube.com/@deerghhadiyal',
                    href: SOCIAL_LINKS.youtubeChannel,
                  },
                  {
                    id: 'ig-main',
                    label: 'Instagram Handle',
                    value: '@deergh_hadiyal',
                    href: SOCIAL_LINKS.instagramUrl,
                  },
                  {
                    id: 'ig-profile',
                    label: 'Instagram Profile',
                    value: 'instagram.com/deergh_hadiyal',
                    href: SOCIAL_LINKS.instagramUrl,
                  },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#141414] border border-white/10 hover:border-[#0066FF]/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-[#888888]">{channel.label}</div>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base font-semibold text-[#0066FF] hover:underline truncate block"
                      >
                        {channel.value}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyText(channel.id, channel.href)}
                        className="px-3 py-1.5 text-xs font-medium text-[#CCCCCC] hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="Copy link to clipboard"
                      >
                        {copiedKey === channel.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <span className="text-[#FF6B35]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#CCCCCC] hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                        aria-label={`Open ${channel.label}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Interactive Project Brief Builder */}
            <div className="lg:col-span-7 bg-[#141414] border border-[#FF6B35]/25 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-mono-tabular text-[#FF6B35]">
                    Interactive Scope Estimator
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Build Your Edit Package Brief
                  </h3>
                </div>
                <span className="text-xs font-mono-tabular text-[#999999]">
                  Instant DM / Inquiry Ready
                </span>
              </div>

              <div className="space-y-6">
                {/* Service Type Selector */}
                <div>
                  <label className="block text-xs font-mono-tabular text-[#AAAAAA] mb-2">
                    01. Select Primary Service
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICES.map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => setSelectedServiceType(s.title)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer truncate ${
                          selectedServiceType === s.title
                            ? 'bg-[#FF6B35] text-black border-[#FF6B35] font-semibold'
                            : 'bg-[#0f0f0f] text-[#CCCCCC] border-white/10 hover:border-white/30'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume & Turnaround */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tabular text-[#AAAAAA] mb-2">
                      02. Monthly Video Volume
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { val: '4', label: '4 Videos' },
                          { val: '12', label: '12 Videos' },
                          { val: '24', label: '24+ Videos' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setMonthlyVolume(opt.val)}
                          className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                            monthlyVolume === opt.val
                              ? 'bg-[#0066FF] text-white border-[#0066FF] font-semibold'
                              : 'bg-[#0f0f0f] text-[#CCCCCC] border-white/10 hover:border-white/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tabular text-[#AAAAAA] mb-2">
                      03. Delivery Cadence
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTurnaroundSpeed('standard')}
                        className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          turnaroundSpeed === 'standard'
                            ? 'bg-[#0066FF] text-white border-[#0066FF] font-semibold'
                            : 'bg-[#0f0f0f] text-[#CCCCCC] border-white/10 hover:border-white/30'
                        }`}
                      >
                        24–48h Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => setTurnaroundSpeed('priority')}
                        className={`py-2 px-3 text-xs font-mono-tabular rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          turnaroundSpeed === 'priority'
                            ? 'bg-[#FF6B35] text-black border-[#FF6B35] font-semibold'
                            : 'bg-[#0f0f0f] text-[#CCCCCC] border-white/10 hover:border-white/30'
                        }`}
                      >
                        24h Express
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional Creator Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="creator-name"
                      className="block text-xs font-mono-tabular text-[#AAAAAA] mb-1.5"
                    >
                      Your Name / Brand
                    </label>
                    <input
                      id="creator-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Alex Rivera"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0f0f0f] border border-white/15 rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="creator-channel"
                      className="block text-xs font-mono-tabular text-[#AAAAAA] mb-1.5"
                    >
                      Channel Link or Handle
                    </label>
                    <input
                      id="creator-channel"
                      type="text"
                      value={clientChannel}
                      onChange={(e) => setClientChannel(e.target.value)}
                      placeholder="e.g., @alexcreates"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0f0f0f] border border-white/15 rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="project-notes"
                    className="block text-xs font-mono-tabular text-[#AAAAAA] mb-1.5"
                  >
                    Editing Style Reference or Goals
                  </label>
                  <textarea
                    id="project-notes"
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Tell me about your raw footage, target retention goals, or reference videos..."
                    className="w-full px-3.5 py-2 text-sm bg-[#0f0f0f] border border-white/15 rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>

                {/* Generated Brief Preview & Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopyText('project-brief', generatedBriefText)}
                    className="px-5 py-3 text-sm font-semibold bg-[#FF6B35] text-black rounded-md hover:bg-[#E85A2C] transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {copiedKey === 'project-brief' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Brief Copied! Paste in Instagram DM</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Project Brief for DM</span>
                      </>
                    )}
                  </button>

                  <a
                    href={SOCIAL_LINKS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0055CC] rounded-md transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>Message @deergh_hadiyal on Instagram</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#0f0f0f] border-t border-[#FF6B35]/15 py-8 px-6 text-center text-xs text-[#666666] no-print">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Deergh Hadiyal · Video Editor &amp; Content Creator · All rights reserved</p>
          <div className="flex items-center gap-6 text-[#999999]">
            <a
              href={SOCIAL_LINKS.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6B35] transition-colors"
            >
              YouTube (@deerghhadiyal)
            </a>
            <a
              href={SOCIAL_LINKS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF6B35] transition-colors"
            >
              Instagram (@deergh_hadiyal)
            </a>
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal for Video Showcase & Timeline Breakdown */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print"
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
        >
          <div className="w-full max-w-[1040px] bg-[#141414] border border-[#FF6B35]/30 rounded-2xl overflow-hidden shadow-2xl my-auto">
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0f0f0f]">
              <div className="min-w-0">
                <div className="text-xs font-mono-tabular text-[#FF6B35]">
                  {selectedVideo.categoryLabel} · {selectedVideo.resolution} · {selectedVideo.fps}
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-[#CCCCCC] hover:text-white bg-white/5 hover:bg-white/15 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close video inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Player / Interactive NLE View */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8 bg-black flex flex-col justify-between">
                <div className="relative aspect-video overflow-hidden">
                  {customEmbeds[selectedVideo.id] ? (
                    <iframe
                      src={customEmbeds[selectedVideo.id]}
                      title={selectedVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <ResilientImage
                        src={selectedVideo.thumbnail}
                        alt={selectedVideo.title}
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ filter: selectedVideo.colorFilterGraded }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                      {/* Active Timeline Marker Callout Overlay */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-white">
                        <span className="bg-black/75 px-3 py-1.5 rounded border border-white/10">
                          {selectedVideo.timelineMarkers[activeMarkerIdx]?.time} —{' '}
                          <strong className="text-[#FF6B35]">
                            {selectedVideo.timelineMarkers[activeMarkerIdx]?.label}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsMutedPreview((m) => !m)}
                          className="p-2 bg-black/75 rounded border border-white/10 text-white hover:text-[#FF6B35] cursor-pointer"
                          aria-label={isMutedPreview ? 'Unmute preview' : 'Mute preview'}
                        >
                          {isMutedPreview ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-[#FF6B35]" />
                          )}
                        </button>
                      </div>

                      {/* Bottom Active Cut Explanation */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between text-xs font-mono-tabular text-[#FF6B35] mb-1">
                          <span>Active Cut Breakdown</span>
                          <span>
                            3s Hook: {selectedVideo.hookRate} · Retention:{' '}
                            {selectedVideo.avgRetention}
                          </span>
                        </div>
                        <p className="text-sm text-white">
                          {selectedVideo.timelineMarkers[activeMarkerIdx]?.detail}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Interactive Timeline Scrubber Bar */}
                <div className="p-4 bg-[#0f0f0f] border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview((p) => !p)}
                      className="px-3 py-1.5 text-xs font-mono-tabular font-semibold bg-[#FF6B35] text-black rounded cursor-pointer whitespace-nowrap"
                    >
                      {isPlayingPreview ? 'Pause Playhead' : 'Play Timeline'}
                    </button>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF6B35] transition-all duration-150"
                        style={{ width: `${playheadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono-tabular text-[#AAAAAA]">
                      {selectedVideo.duration}
                    </span>
                  </div>

                  {/* Live YouTube Video URL Embedder */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      value={customYoutubeInput}
                      onChange={(e) => setCustomYoutubeInput(e.target.value)}
                      placeholder="Paste any YouTube Video or Short URL from @deerghhadiyal to embed live..."
                      className="flex-1 px-3 py-1.5 text-xs bg-[#141414] border border-white/15 rounded text-white placeholder:text-[#666666] focus:outline-none focus:border-[#FF6B35]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCustomEmbed(selectedVideo.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[#0066FF] text-white rounded hover:bg-[#0055CC] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Load YouTube Video
                    </button>
                    {customEmbeds[selectedVideo.id] && (
                      <button
                        type="button"
                        onClick={() =>
                          setCustomEmbeds((prev) => {
                            const next = { ...prev };
                            delete next[selectedVideo.id];
                            return next;
                          })
                        }
                        className="px-3 py-1.5 text-xs text-[#CCCCCC] hover:text-white bg-white/10 rounded cursor-pointer whitespace-nowrap"
                      >
                        Reset View
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Cut-by-Cut Timeline Breakdown */}
              <div className="lg:col-span-4 p-6 bg-[#141414] border-l border-white/10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-mono-tabular text-[#FF6B35] mb-1">
                    Frame-Accurate Anatomy
                  </div>
                  <h4 className="font-display text-lg font-bold text-white mb-4">
                    Retention Timeline Markers
                  </h4>

                  <div className="space-y-2.5">
                    {selectedVideo.timelineMarkers.map((marker, idx) => (
                      <button
                        key={marker.time}
                        type="button"
                        onClick={() => {
                          setActiveMarkerIdx(idx);
                          setPlayheadProgress((idx + 1) * 25);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                          activeMarkerIdx === idx
                            ? 'bg-[#FF6B35]/15 border-[#FF6B35]'
                            : 'bg-[#0f0f0f] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                          <span className="text-[#FF6B35] font-semibold">{marker.time}</span>
                          <span className="text-[#AAAAAA]">Cut 0{idx + 1}</span>
                        </div>
                        <div className="text-sm font-semibold text-white mb-1">{marker.label}</div>
                        <p className="text-xs text-[#999999] leading-relaxed">{marker.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <a
                    href={selectedVideo.defaultYoutubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 text-xs font-semibold bg-[#FF6B35] text-black rounded-md hover:bg-[#E85A2C] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Watch Channel on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedVideo.categoryLabel;
                      setSelectedVideo(null);
                      setSelectedServiceType(
                        title === 'HACKS EDIT Series' ? 'Short-Form Editing' : title
                      );
                      scrollToSection('contact');
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Request Similar Edit Style
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable / Previewable Portfolio Dossier Modal */}
      {isDossierOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Deergh Hadiyal Professional Portfolio Dossier"
        >
          <div className="w-full max-w-[880px] bg-[#141414] border border-[#0066FF]/40 rounded-2xl overflow-hidden shadow-2xl my-auto">
            {/* Modal Action Header */}
            <div className="px-6 py-4 bg-[#0f0f0f] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="text-xs font-mono-tabular text-[#0066FF]">
                Deergh_Hadiyal_Portfolio.pdf · Interactive Dossier Preview
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerDossierDownload}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#0066FF] text-white rounded hover:bg-[#0055CC] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#FF6B35] text-black rounded hover:bg-[#E85A2C] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(false)}
                  className="p-1.5 text-[#CCCCCC] hover:text-white bg-white/5 rounded cursor-pointer"
                  aria-label="Close portfolio preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Content Sheet */}
            <div className="p-8 sm:p-12 space-y-8 text-left max-h-[80vh] overflow-y-auto">
              <div className="border-b border-white/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-bold text-white">DEERGH HADIYAL</h2>
                  <p className="text-lg text-[#FF6B35] font-semibold">
                    Short-Form Video Editing That Gets Results
                  </p>
                </div>
                <div className="text-xs font-mono-tabular text-[#AAAAAA] space-y-1 sm:text-right">
                  <div>YouTube: youtube.com/@deerghhadiyal</div>
                  <div>Series: HACKS EDIT (@deerghhadiyal)</div>
                  <div>Instagram: instagram.com/deergh_hadiyal</div>
                </div>
              </div>

              <p className="text-sm text-[#CCCCCC] leading-relaxed">
                Professional video editor specializing in high-performing Reels, TikToks, and
                Shorts. I transform raw clips into engaging, algorithm-optimized content that
                captures attention and drives real growth.
              </p>

              <div>
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#FF6B35] mb-4">
                  Core Editing &amp; Post-Production Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((s) => (
                    <div
                      key={s.index}
                      className="p-4 rounded-lg bg-[#0f0f0f] border border-white/10"
                    >
                      <div className="text-sm font-bold text-white mb-1">
                        {s.index}. {s.title}
                      </div>
                      <p className="text-xs text-[#999999] mb-2">{s.description}</p>
                      <div className="text-[11px] font-mono-tabular text-[#FF6B35]">
                        {s.deliverables}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono-tabular uppercase tracking-wider text-[#FF6B35] mb-3">
                  Technical Stack &amp; Specializations
                </h3>
                <div className="space-y-2 text-xs text-[#CCCCCC]">
                  <div>
                    <strong className="text-white">Software:</strong> Adobe Premiere Pro · DaVinci
                    Resolve · After Effects · Adobe Audition
                  </div>
                  <div>
                    <strong className="text-white">Specializations:</strong> Short-Form Video ·
                    YouTube Optimization · TikTok/Reels Strategy · Motion Graphics · Color Grading ·
                    Sound Design
                  </div>
                  <div>
                    <strong className="text-white">Platforms:</strong> YouTube · Instagram · TikTok
                    · Snapchat · Twitter · LinkedIn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
