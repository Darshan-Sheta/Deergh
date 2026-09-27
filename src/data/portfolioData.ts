import heroEditingSuiteImg from '../assets/images/hero_editing_suite_1790528737920.jpg';
import showcaseHacksEditImg from '../assets/images/showcase_hacks_edit_1790528752374.jpg';
import showcaseViralRetentionImg from '../assets/images/showcase_viral_retention_1790528765326.jpg';
import showcaseColorGradeImg from '../assets/images/showcase_color_grade_1790528777648.jpg';

export interface ServiceItem {
  index: string;
  title: string;
  description: string;
  deliverables: string;
  turnaround: string;
}

export interface FeatureReason {
  title: string;
  description: string;
  metric: string;
}

export interface TimelineCutMarker {
  time: string;
  label: string;
  detail: string;
}

export interface VideoShowcaseItem {
  id: string;
  category: 'hacks-edit' | 'retention' | 'color-sound';
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  aspect: '16:9' | '9:16';
  featuredSpan?: boolean;
  duration: string;
  fps: string;
  resolution: string;
  avgRetention: string;
  hookRate: string;
  softwareUsed: string;
  defaultYoutubeUrl: string;
  colorFilterRaw: string;
  colorFilterGraded: string;
  timelineMarkers: TimelineCutMarker[];
}

export interface WorkProcessItem {
  index: string;
  label: string;
  title: string;
  description: string;
  keyTechniques: string;
  targetOutcome: string;
}

export const HERO_IMAGE = heroEditingSuiteImg;

export const SOCIAL_LINKS = {
  youtubeChannel: 'https://youtube.com/@deerghhadiyal',
  youtubeHandle: '@deerghhadiyal',
  hacksEditLabel: 'youtube.com/@deerghhadiyal',
  instagramUrl: 'https://www.instagram.com/deergh_hadiyal/',
  instagramHandle: '@deergh_hadiyal',
  instagramClean: 'instagram.com/deergh_hadiyal',
};

export const SERVICES: ServiceItem[] = [
  {
    index: '01',
    title: 'Short-Form Editing',
    description:
      'Fast-paced, attention-grabbing edits optimized for Reels, TikToks, and Shorts with trending transitions and effects.',
    deliverables: '9:16 Vertical Master · Dynamic Subtitles · Custom SFX',
    turnaround: '24–48h Delivery',
  },
  {
    index: '02',
    title: 'Content Optimization',
    description:
      'Strategic pacing, hooks, and storytelling designed to maximize engagement and watch time across algorithmic feeds.',
    deliverables: '3-Second Hook Architecture · Retention Pacing · J/L Cuts',
    turnaround: 'Retention Audited',
  },
  {
    index: '03',
    title: 'Motion & Graphics',
    description:
      'Custom animations, transitions, and visual effects that elevate your content production value and viewer comprehension.',
    deliverables: 'After Effects Compositing · Kinetic Typography · Visual Callouts',
    turnaround: '4K 60fps Render',
  },
  {
    index: '04',
    title: 'Color & Sound',
    description:
      'Professional color grading and audio mixing for cinematic quality that stands out in crowded mobile and desktop feeds.',
    deliverables: 'DaVinci Resolve Grade · LUFS Audio Mastering · Foley Layering',
    turnaround: 'Rec.709 Calibrated',
  },
  {
    index: '05',
    title: 'Thumbnail Design',
    description:
      'Eye-catching thumbnails engineered to maximize click-through rates and viewer interest from the very first impression.',
    deliverables: 'High-Contrast Composition · Visual Curiosity Gap · A/B Variants',
    turnaround: 'CTR Focused',
  },
  {
    index: '06',
    title: 'Growth Strategy',
    description:
      'Editing optimized for YouTube algorithm, trending sounds, and platform-specific best practices that convert viewers to subscribers.',
    deliverables: 'Platform-Native Formatting · Loop Engineering · Trend Alignment',
    turnaround: 'Multi-Platform Ready',
  },
];

export const WHY_CHOOSE_ME: FeatureReason[] = [
  {
    title: 'Algorithm-Aware',
    description: 'Every cut optimized for platform performance and audience retention curves.',
    metric: '92%+ 3s Hook Hold',
  },
  {
    title: 'Fast Turnaround',
    description: 'Quick delivery without compromising timeline precision or visual polish.',
    metric: '24–48h Standard',
  },
  {
    title: 'Growth Focus',
    description: 'Editing designed to grow channels and build loyal audiences, not just exist.',
    metric: 'High Watch-Through',
  },
  {
    title: 'Professional Quality',
    description: 'Cinematic production value, clean sound design, and color at competitive rates.',
    metric: '4K 60fps Masters',
  },
  {
    title: 'Collaborative',
    description: 'Your creative vision combined with my post-production expertise working together.',
    metric: 'Frame-Accurate Revisions',
  },
  {
    title: 'Multiple Platforms',
    description: 'Expertise in YouTube Shorts, Long-Form, TikTok, Instagram Reels, and Snapchat.',
    metric: 'Cross-Platform Specs',
  },
];

export const VIDEO_SHOWCASE: VideoShowcaseItem[] = [
  {
    id: 'hacks-edit-latest',
    category: 'hacks-edit',
    categoryLabel: 'HACKS EDIT Series',
    title: 'Latest Upload — High-Velocity Entertainment Cut',
    subtitle: 'Check out my most recent video from the HACKS EDIT series',
    description:
      'Fast-paced entertainment editing combining frame-accurate speed ramps, kinetic captioning, layered whoosh/impact sound design, and zero-dead-air storytelling built for viral shareability.',
    thumbnail: showcaseHacksEditImg,
    aspect: '16:9',
    featuredSpan: true,
    duration: '00:58',
    fps: '60 fps',
    resolution: '4K UHD',
    avgRetention: '94.2%',
    hookRate: '88.5%',
    softwareUsed: 'Premiere Pro · After Effects · Audition',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.55) contrast(0.85) brightness(0.95)',
    colorFilterGraded: 'saturate(1.22) contrast(1.14) brightness(1.02)',
    timelineMarkers: [
      {
        time: '00:00–00:03',
        label: 'Visual + Sonic Hook',
        detail: 'Immediate motion cut paired with sub-bass drop and bold central kinetic title.',
      },
      {
        time: '00:04–00:19',
        label: 'Pattern Interrupt Cadence',
        detail: 'Visual angle or b-roll state change every 1.8 seconds to reset viewer attention.',
      },
      {
        time: '00:20–00:45',
        label: 'Escalating Tension & SFX',
        detail: 'Layered riser audio, dynamic zoom tracking, and custom motion callouts.',
      },
      {
        time: '00:46–00:58',
        label: 'Seamless Loop Payoff',
        detail: 'Resolution cut engineered to flow directly back into frame 00:00 for replay boost.',
      },
    ],
  },
  {
    id: 'featured-viral-work',
    category: 'retention',
    categoryLabel: 'Content Optimization',
    title: 'Featured Work — Algorithm-Optimized Retention Edit',
    subtitle: 'Trending content optimized for maximum engagement',
    description:
      'Engineered specifically for competitive vertical and horizontal feeds. Combines psychological curiosity hooks with tight J-cuts, dynamic audio ducking, and custom motion overlays.',
    thumbnail: showcaseViralRetentionImg,
    aspect: '16:9',
    featuredSpan: false,
    duration: '00:45',
    fps: '60 fps',
    resolution: '4K UHD',
    avgRetention: '91.8%',
    hookRate: '86.0%',
    softwareUsed: 'Premiere Pro · After Effects',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.5) contrast(0.82) sepia(0.08)',
    colorFilterGraded: 'saturate(1.18) contrast(1.16) brightness(1.03)',
    timelineMarkers: [
      {
        time: '00:00–00:02',
        label: 'Curiosity Gap Opener',
        detail: 'High-contrast visual question established in the first 48 frames.',
      },
      {
        time: '00:03–00:28',
        label: 'Rhythmic Pacing Lock',
        detail: 'Dialogue trimmed to remove all breath pauses; synced to 128 BPM percussive stem.',
      },
      {
        time: '00:29–00:45',
        label: 'High-Impact Climax',
        detail: 'Speed-ramped reveal with optical glow and stereo-widened sound design.',
      },
    ],
  },
  {
    id: 'studio-quality-grade',
    category: 'color-sound',
    categoryLabel: 'Color & Sound',
    title: 'Studio Quality — Cinematic Grade & Sonic Mastering',
    subtitle: 'Professional editing with cinematic color grading',
    description:
      'Full look development in DaVinci Resolve transforming flat camera log profiles into rich, filmic contrast with skin-tone protection, halation, and -14 LUFS broadcast audio mastering.',
    thumbnail: showcaseColorGradeImg,
    aspect: '16:9',
    featuredSpan: false,
    duration: '01:12',
    fps: '24 fps',
    resolution: '4K DCI',
    avgRetention: '89.6%',
    hookRate: '84.2%',
    softwareUsed: 'DaVinci Resolve · Adobe Audition',
    defaultYoutubeUrl: 'https://youtube.com/@deerghhadiyal',
    colorFilterRaw: 'saturate(0.45) contrast(0.80) brightness(0.92)',
    colorFilterGraded: 'saturate(1.25) contrast(1.18) brightness(1.04)',
    timelineMarkers: [
      {
        time: 'Node 01–03',
        label: 'CST & Primary Balance',
        detail: 'Color Space Transform from Log to DaVinci Wide Gamut with balanced lift/gamma/gain.',
      },
      {
        time: 'Node 04–06',
        label: 'Split-Tone & Skin Qualifier',
        detail: 'Warm tungsten highlights (#FF6B35) against deep slate-cobalt shadows (#0066FF).',
      },
      {
        time: 'Mix Bus',
        label: 'Spatial Foley & Dialogue Clarity',
        detail: 'Multiband compression, EQ carving at 3kHz for vocal presence, and custom room tone.',
      },
    ],
  },
];

export const WORK_PROCESS: WorkProcessItem[] = [
  {
    index: '01',
    label: 'HACKS EDIT Series',
    title: 'Fast-Paced Entertainment Content',
    description:
      'Trend-focused, viral-ready content with quick cuts, trending audio, and maximized engagement hooks. Designed for explosive growth and audience retention in competitive feeds.',
    keyTechniques: 'Speed Ramping · Frame-Accurate Whip Transitions · Beat-Synced SFX',
    targetOutcome: 'Explosive Reach & Shareability',
  },
  {
    index: '02',
    label: 'Engagement Mastery',
    title: 'Algorithm-Optimized Storytelling',
    description:
      'Strategic editing patterns proven to increase watch time, reduce drop-off, and maximize audience retention across all platforms.',
    keyTechniques: '3-Second Hook Scripting · 2-Second Pattern Interrupts · Seamless Loop Endings',
    targetOutcome: 'Sustained Average Percentage Viewed (APV)',
  },
  {
    index: '03',
    label: 'Visual Excellence',
    title: 'Professional Production Value',
    description:
      'Cinematic color treatments and visual effects that make content stand out in crowded feeds and elevate production value to industry standards.',
    keyTechniques: 'Custom Film LUTs · Keyframed Motion Tracking · -14 LUFS Audio Polish',
    targetOutcome: 'Instant Brand Authority & Viewer Trust',
  },
];

export const TECHNICAL_SKILLS = [
  {
    category: 'Software',
    items: ['Adobe Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Adobe Audition'],
  },
  {
    category: 'Specializations',
    items: [
      'Short-Form Video',
      'YouTube Optimization',
      'TikTok/Reels Strategy',
      'Motion Graphics',
      'Color Grading',
      'Sound Design',
    ],
  },
  {
    category: 'Platforms',
    items: ['YouTube', 'Instagram', 'TikTok', 'Snapchat', 'Twitter', 'LinkedIn'],
  },
];

export function downloadPortfolioDossier() {
  const dossierHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Deergh Hadiyal — Professional Video Editing Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f0f0f;
      color: #e4e4e7;
      line-height: 1.6;
      padding: 48px 24px;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      background: #141414;
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 12px;
      padding: 48px;
    }
    .header {
      border-bottom: 1px solid rgba(255, 107, 53, 0.25);
      padding-bottom: 28px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 {
      font-size: 36px;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .tagline {
      font-size: 18px;
      color: #FF6B35;
      font-weight: 600;
    }
    .contact-meta {
      font-size: 13px;
      color: #a1a1aa;
      text-align: right;
    }
    .contact-meta a {
      color: #0066FF;
      text-decoration: none;
    }
    h2 {
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #FF6B35;
      margin: 32px 0 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 8px;
    }
    .summary {
      font-size: 15px;
      color: #cccccc;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .card {
      background: rgba(255, 107, 53, 0.04);
      border: 1px solid rgba(255, 107, 53, 0.18);
      padding: 18px;
      border-radius: 8px;
    }
    .card h3 {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .card p {
      font-size: 13px;
      color: #a1a1aa;
    }
    .meta-line {
      font-size: 12px;
      color: #FF6B35;
      margin-top: 8px;
    }
    .skill-row {
      margin-bottom: 12px;
      font-size: 14px;
    }
    .skill-row strong {
      color: #FF6B35;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
      color: #71717a;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { background: #ffffff; color: #111111; padding: 0; }
      .page { background: #ffffff; border: none; padding: 24px; }
      h1, .card h3 { color: #111111; }
      .summary, .card p, .contact-meta { color: #3f3f46; }
      .card { border-color: #e4e4e7; background: #fafafa; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1>DEERGH HADIYAL</h1>
        <div class="tagline">Short-Form Video Editing That Gets Results</div>
      </div>
      <div class="contact-meta">
        <div>YouTube: <a href="https://youtube.com/@deerghhadiyal">@deerghhadiyal</a></div>
        <div>Series: HACKS EDIT (youtube.com/@deerghhadiyal)</div>
        <div>Instagram: <a href="https://www.instagram.com/deergh_hadiyal/">@deergh_hadiyal</a></div>
      </div>
    </div>

    <p class="summary">
      Professional video editor specializing in high-performing Reels, TikToks, and Shorts. I transform raw clips into engaging, algorithm-optimized content that captures attention and drives real channel growth.
    </p>

    <h2>Core Services & Capabilities</h2>
    <div class="grid">
      ${SERVICES.map(
        (s) => `
      <div class="card">
        <h3>${s.index}. ${s.title}</h3>
        <p>${s.description}</p>
        <div class="meta-line">${s.deliverables}</div>
      </div>`
      ).join('')}
    </div>

    <h2>Work Process & Methodology</h2>
    <div class="grid">
      ${WORK_PROCESS.map(
        (p) => `
      <div class="card">
        <h3>${p.label} — ${p.title}</h3>
        <p>${p.description}</p>
        <div class="meta-line">${p.keyTechniques}</div>
      </div>`
      ).join('')}
    </div>

    <h2>Technical Stack & Platforms</h2>
    <div class="skill-row"><strong>Software:</strong> Adobe Premiere Pro · DaVinci Resolve · After Effects · Adobe Audition</div>
    <div class="skill-row"><strong>Specializations:</strong> Short-Form Video · YouTube Optimization · TikTok/Reels Strategy · Motion Graphics · Color Grading · Sound Design</div>
    <div class="skill-row"><strong>Platforms:</strong> YouTube · Instagram · TikTok · Snapchat · Twitter · LinkedIn</div>

    <div class="footer">
      <span>© 2026 Deergh Hadiyal · Video Editor & Content Creator</span>
      <span>youtube.com/@deerghhadiyal · instagram.com/deergh_hadiyal</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([dossierHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Deergh_Hadiyal_Portfolio.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
