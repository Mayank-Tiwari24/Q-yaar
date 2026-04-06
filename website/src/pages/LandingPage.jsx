import { useEffect, useRef } from 'react'

/* ── Scroll Reveal Hook ─────────────────────────────── */
function useReveal() {
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    ref.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── 3D QR Cube Component ───────────────────────────── */
function QRCube() {
  return (
    <div style={{ perspective: 800, width: 220, height: 220, margin: '0 auto' }}>
      <div style={{
        width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        animation: 'spin3d 10s ease-in-out infinite alternate',
        position: 'relative',
      }}>
        {/* Front face */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(94,234,212,0.15), rgba(94,234,212,0.05))',
          border: '2px solid rgba(94,234,212,0.3)',
          borderRadius: 24, backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateZ(60px)',
          boxShadow: '0 0 60px rgba(94,234,212,0.15)',
        }}>
          <QRGrid />
        </div>
        {/* Back face */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(45,212,170,0.1), rgba(94,234,212,0.03))',
          border: '1px solid rgba(94,234,212,0.15)',
          borderRadius: 24,
          transform: 'translateZ(-60px) rotateY(180deg)',
        }} />
      </div>
    </div>
  )
}

/* ── Animated QR grid pattern ───────────────────────── */
function QRGrid() {
  const cells = []
  for (let i = 0; i < 49; i++) {
    const on = [0,1,2,3,4,5,6,7,8,12,13,14,20,21,27,28,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,
      10,16,17,18,24,30,31,32,
      11,19,25,33,
      22,23,26,29].includes(i)
    cells.push(
      <div key={i} style={{
        width: 16, height: 16, borderRadius: 3,
        background: on ? 'var(--teal)' : 'rgba(94,234,212,0.06)',
        transition: 'all 0.3s ease',
        animationDelay: `${i * 30}ms`,
        boxShadow: on ? '0 0 8px rgba(94,234,212,0.4)' : 'none',
      }} />
    )
  }
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 16px)',
      gap: 4, padding: 16,
    }}>{cells}</div>
  )
}

/* ── Orbiting particles ─────────────────────────────── */
function OrbitParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[0,1,2,3,4,5].map(i => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 6, height: 6, borderRadius: '50%',
          background: i % 2 === 0 ? 'var(--teal)' : 'var(--mint)',
          boxShadow: `0 0 12px ${i % 2 === 0 ? 'var(--teal-glow)' : 'rgba(167,243,208,0.3)'}`,
          animation: `orbit ${8 + i * 2}s linear infinite`,
          animationDelay: `${i * -1.3}s`,
          opacity: 0.6,
        }} />
      ))}
    </div>
  )
}

/* ── Feature Icon ───────────────────────────────────── */
function FeatureIcon({ children, color = 'var(--teal)' }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: `linear-gradient(135deg, ${color}20, ${color}08)`,
      border: `1px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 20, flexShrink: 0,
    }}>{children}</div>
  )
}

/* ── Step Card ──────────────────────────────────────── */
function StepCard({ number, title, desc, delay }) {
  return (
    <div className="reveal glass-card" style={{
      padding: 32, textAlign: 'center', transitionDelay: `${delay}ms`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--teal-glow), transparent)',
        opacity: 0.3,
      }} />
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 22, fontWeight: 900,
        color: 'var(--dark-teal)',
        boxShadow: '0 4px 20px var(--teal-glow)',
      }}>{number}</div>
      <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const pageRef = useReveal()

  return (
    <div ref={pageRef}>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        paddingTop: 80,
      }}>
        <div className="bg-grid" />
        <div className="bg-glow-tl" />
        <div className="bg-glow-br" style={{ top: '50%', right: '-10%' }} />

        <div className="container" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          alignItems: 'center', gap: 60, position: 'relative', zIndex: 1,
        }}>
          {/* Left - Text */}
          <div>
            <div className="anim-fade-up" style={{ marginBottom: 24 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(94,234,212,0.08)', border: '1px solid rgba(94,234,212,0.15)',
                borderRadius: 100, padding: '8px 18px',
                fontSize: 13, fontWeight: 600, color: 'var(--teal)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)',
                  boxShadow: '0 0 8px var(--teal-glow)',
                }} />
                India's Smartest Vehicle Identity System
              </span>
            </div>

            <h1 className="anim-fade-up delay-1" style={{
              fontFamily: 'Outfit', fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900, lineHeight: 1.1, marginBottom: 24,
            }}>
              Your Vehicle's<br />
              <span className="gradient-text">Digital Identity</span>
            </h1>

            <p className="anim-fade-up delay-2" style={{
              fontSize: 18, color: 'var(--text-dim)', lineHeight: 1.8,
              maxWidth: 480, marginBottom: 40,
            }}>
              Stick a smart QR on your vehicle. Anyone scans it — you get notified instantly.
              Block wrong parking alerts, emergency contacts, and more.
            </p>

            <div className="anim-fade-up delay-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="http://localhost:5173" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Get Free QR
              </a>
              <a href="#download" className="btn btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download App
              </a>
            </div>

            {/* Stats */}
            <div className="anim-fade-up delay-5" style={{
              display: 'flex', gap: 40, marginTop: 50,
            }}>
              {[
                { val: '10K+', label: 'QRs Generated' },
                { val: '5K+', label: 'Active Users' },
                { val: '99.9%', label: 'Uptime' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: 'var(--teal)' }}>{s.val}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - 3D QR */}
          <div className="anim-scale-in delay-3 hide-mobile" style={{ position: 'relative' }}>
            <OrbitParticles />
            <div className="anim-float">
              <QRCube />
            </div>
            {/* Glow ring */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 300, height: 300, borderRadius: '50%',
              border: '1px solid rgba(94,234,212,0.1)',
              transform: 'translate(-50%, -50%)',
              animation: 'pulse-ring 3s ease-out infinite',
            }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'float 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="7 13 12 18 17 13"/></svg>
        </div>

        <style>{`
          @media (max-width: 768px) {
            section > .container { grid-template-columns: 1fr !important; text-align: center; }
            section > .container > div:first-child > div:last-child { justify-content: center; }
          }
        `}</style>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" className="section" style={{ background: 'linear-gradient(180deg, var(--bg), var(--darker))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label reveal" style={{ justifyContent: 'center' }}>How It Works</span>
          <h2 className="section-title reveal" style={{ margin: '0 auto 16px' }}>
            3 Simple Steps to <span className="gradient-text">Protect Your Vehicle</span>
          </h2>
          <p className="section-subtitle reveal" style={{ margin: '0 auto 60px' }}>
            It takes less than 2 minutes to set up your vehicle&apos;s digital identity.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24, position: 'relative',
          }}>
            {/* Connecting line */}
            <div className="hide-mobile" style={{
              position: 'absolute', top: 52, left: '20%', right: '20%',
              height: 2, background: 'linear-gradient(90deg, transparent, var(--teal), transparent)',
              opacity: 0.2, zIndex: 0,
            }} />

            <StepCard number="1" title="Buy & Stick QR"
              desc="Get your Q Yaar QR sticker and stick it on your vehicle windshield or bumper."
              delay={0} />
            <StepCard number="2" title="Scan & Register"
              desc="Open the Q Yaar app, scan the QR, and link it to your vehicle details and phone number."
              delay={150} />
            <StepCard number="3" title="Get Protected"
              desc="Anyone who scans your QR can now notify you instantly — wrong parking, lights on, emergencies!"
              delay={300} />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section id="features" className="section" style={{ position: 'relative' }}>
        <div className="bg-glow-tl" style={{ top: '20%' }} />
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-label reveal" style={{ justifyContent: 'center' }}>Features</span>
            <h2 className="section-title reveal" style={{ margin: '0 auto 16px' }}>
              Everything You Need to <span className="gradient-text">Stay Connected</span>
            </h2>
            <p className="section-subtitle reveal" style={{ margin: '0 auto 60px' }}>
              Powerful features designed to keep your vehicle safe and you informed.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {[
              { icon: '🔔', title: 'Instant Notifications', desc: 'Get alerted the moment someone scans your QR. Know who, when, and why.' },
              { icon: '🪪', title: 'Digital Identity Card', desc: 'Your vehicle gets a verified digital profile — owner name, model, and registration.' },
              { icon: '🔍', title: 'Vehicle Lookup', desc: 'Quickly look up any registered vehicle by QR code or vehicle number.' },
              { icon: '📊', title: 'Activity History', desc: 'Track every scan, notification, and interaction with your vehicle QR.' },
              { icon: '🛡️', title: 'Privacy Protected', desc: 'Your phone number stays hidden. Scanners can only send notifications, not view your details.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Scan to notification in under 2 seconds. No lag, no delays, real-time alerts.' },
            ].map((feat, i) => (
              <div key={feat.title} className="reveal glass-card" style={{
                padding: 32, transitionDelay: `${i * 100}ms`,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(94,234,212,0.08)',
                  border: '1px solid rgba(94,234,212,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 20,
                }}>{feat.icon}</div>
                <h3 style={{
                  fontFamily: 'Outfit', fontSize: 18, fontWeight: 700,
                  color: 'var(--white)', marginBottom: 10,
                }}>{feat.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GET YOUR QR ─────────────────────────────── */}
      <section id="pricing" className="section" style={{ background: 'linear-gradient(180deg, var(--bg), var(--darker))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label reveal" style={{ justifyContent: 'center' }}>Get Your QR</span>
          <h2 className="section-title reveal" style={{ margin: '0 auto 16px' }}>
            100% <span className="gradient-text">Free</span> QR Sticker
          </h2>
          <p className="section-subtitle reveal" style={{ margin: '0 auto 60px' }}>
            Q Yaar QR is completely free! Just pay delivery charges for physical stickers, or download instantly.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, maxWidth: 900, margin: '0 auto',
          }}>
            {/* Digital Download */}
            <div className="reveal glass-card" style={{
              padding: 40, textAlign: 'center',
              border: '2px solid var(--teal)',
              boxShadow: '0 0 40px var(--teal-glow)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                color: 'var(--dark-teal)', fontSize: 12, fontWeight: 800,
                padding: '6px 20px', borderRadius: 100, letterSpacing: 1,
              }}>INSTANT</div>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'rgba(94,234,212,0.1)', border: '1px solid rgba(94,234,212,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>Digital Download</h3>
              <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Outfit', color: 'var(--white)', marginBottom: 4 }}>
                FREE
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Download &amp; print at home</p>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 32 }}>
                {['Instant QR Generation', 'High-Quality Print File', 'Vehicle Registration', 'Scan Notifications', 'Digital ID Card', 'Lifetime Validity'].map(item => (
                  <li key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontSize: 14, color: 'var(--text)', padding: '8px 0',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="http://localhost:5173" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Free QR
              </a>
            </div>

            {/* Physical Delivery */}
            <div className="reveal glass-card" style={{ padding: 40, textAlign: 'center', transitionDelay: '150ms' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 8 }}>Physical Delivery</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Outfit', color: 'var(--white)' }}>FREE</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>QR sticker is free!</p>
              <p style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 700, color: '#F59E0B',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: 100, padding: '6px 16px', marginBottom: 32,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                + Delivery charges only
              </p>
              <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 32 }}>
                {['Premium QR Sticker', 'Weatherproof Material', 'Professional Print Quality', 'Doorstep Delivery', 'Vehicle Registration', 'Lifetime Validity'].map(item => (
                  <li key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontSize: 14, color: 'var(--text)', padding: '8px 0',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="http://localhost:5173" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Order Physical QR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────── */}
      <section id="about" className="section" style={{ position: 'relative' }}>
        <div className="bg-glow-br" style={{ bottom: '20%' }} />
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <span className="section-label reveal" style={{ justifyContent: 'center' }}>About Us</span>
          <h2 className="section-title reveal" style={{ margin: '0 auto 24px' }}>
            Built with ❤️ in <span className="gradient-text">India</span>
          </h2>
          <p className="reveal" style={{
            fontSize: 17, color: 'var(--text-dim)', lineHeight: 1.9, marginBottom: 32,
          }}>
            Q Yaar was born from a simple problem — you are parked somewhere, and someone needs to reach you.
            Maybe your car is blocking a driveway, maybe your headlights are on, or maybe there is an emergency.
            We built the smartest, simplest way for strangers to notify vehicle owners — without exposing any private information.
          </p>
          <p className="reveal" style={{ fontSize: 17, color: 'var(--text-dim)', lineHeight: 1.9, transitionDelay: '100ms' }}>
            Our mission is to make every vehicle in India digitally identifiable and connected. One QR at a time.
          </p>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ───────────────────────────── */}
      <section id="download" className="section" style={{ paddingBottom: 120 }}>
        <div className="container">
          <div className="reveal" style={{
            background: 'linear-gradient(135deg, #073B3A, #0A4D4A, #0D6B5E)',
            borderRadius: 32, padding: '60px 40px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(94,234,212,0.15)',
          }}>
            <div style={{
              position: 'absolute', top: -100, right: -100, width: 300, height: 300,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,234,212,0.1), transparent)',
            }} />
            <div style={{
              position: 'absolute', bottom: -80, left: -80, width: 250, height: 250,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,170,0.08), transparent)',
            }} />

            <h2 style={{
              fontFamily: 'Outfit', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800, color: 'white', marginBottom: 16, position: 'relative',
            }}>
              Ready to Protect Your Vehicle?
            </h2>
            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 500,
              margin: '0 auto 36px', lineHeight: 1.7, position: 'relative',
            }}>
              Download Q Yaar now and give your vehicle the digital identity it deserves.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <button className="btn" style={{
                background: 'white', color: '#073B3A', fontWeight: 800,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#073B3A"><path d="M17.523 2.242l-4.106 7.164 4.42 4.867 3.2-5.58c.97-1.692-.242-3.81-2.167-3.81h-1.347zM12.005 10.788L7.16 2.242H3.514c-1.925 0-3.137 2.118-2.167 3.81L7.586 16.07l4.419-5.282zM7.927 17.07L12 23.758l4.073-6.688H7.927z"/></svg>
                Google Play
              </button>
              <button className="btn" style={{
                background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 800,
                border: '1px solid rgba(255,255,255,0.25)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
