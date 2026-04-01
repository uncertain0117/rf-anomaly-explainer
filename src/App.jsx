import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 0,
    title: "What is Signal Anomaly Detection?",
    subtitle: "Let's understand with a real life example",
    type: "intro",
  },
  {
    id: 1,
    title: "Imagine a Hospital 🏥",
    subtitle: "A patient is connected to a heart monitor",
    type: "hospital",
    description: "The monitor watches the heartbeat 24/7 and alerts doctors if something goes wrong.",
  },
  {
    id: 2,
    title: "Normal Heartbeat ✅",
    subtitle: "Steady, predictable, repeating pattern",
    type: "normal_signal",
    description: "A healthy heart beats in a regular rhythm. The monitor sees this as NORMAL.",
  },
  {
    id: 3,
    title: "Sudden Spike! ⚠️",
    subtitle: "Something unexpected happens",
    type: "anomaly_signal",
    description: "Suddenly the signal jumps abnormally. This is an ANOMALY — the alarm goes off!",
  },
  {
    id: 4,
    title: "How Does It Detect? 🧠",
    subtitle: "The Z-Score method — simple but powerful",
    type: "zscore",
    description: "It always watches the average normal pattern. If a new point is TOO FAR from the average — it's flagged.",
  },
  {
    id: 5,
    title: "Recovery Mode 🔧",
    subtitle: "Don't just detect — FIX IT!",
    type: "recovery",
    description: "When an anomaly is found, replace the bad value with the predicted clean value. Signal is corrected instantly!",
  },
  {
    id: 6,
    title: "RF Signals Work the Same Way 📡",
    subtitle: "WiFi, Radar, Satellite — same concept",
    type: "rf",
    description: "Instead of heartbeats, we monitor radio frequency signals. Jamming, interference, faults — all caught the same way.",
  },
  {
    id: 7,
    title: "Your App Does All This! 🚀",
    subtitle: "Live. In your browser. Built by you.",
    type: "summary",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Orbitron:wght@700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .demo {
    min-height: 100vh;
    background: #0a0a0f;
    color: #fff;
    font-family: 'Space Grotesk', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .bg-glow {
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.15;
    pointer-events: none;
    transition: all 1s ease;
  }

  .card {
    width: 100%;
    max-width: 720px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 40px;
    position: relative;
    backdrop-filter: blur(10px);
    animation: fadeUp 0.5s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .slide-counter {
    position: absolute;
    top: 20px; right: 24px;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 2px;
  }

  .tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    letter-spacing: 2px;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 24px;
  }

  .description {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.8;
    background: rgba(255,255,255,0.05);
    border-left: 3px solid;
    padding: 14px 18px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 24px;
  }

  /* Signal canvas */
  canvas { border-radius: 10px; width: 100%; }

  /* Navigation */
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 28px;
    gap: 12px;
  }

  .btn {
    padding: 12px 28px;
    border-radius: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  .btn-next {
    background: linear-gradient(135deg, #00ff88, #00aaff);
    color: #000;
    flex: 1;
  }
  .btn-next:hover { transform: scale(1.03); box-shadow: 0 0 20px rgba(0,255,136,0.4); }
  .btn-prev { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); }
  .btn-prev:hover { background: rgba(255,255,255,0.14); color: #fff; }
  .btn-prev:disabled { opacity: 0.2; cursor: not-allowed; }

  .progress {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }

  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    transition: all 0.3s;
    cursor: pointer;
  }
  .dot.active { background: #00ff88; width: 20px; border-radius: 3px; }

  /* Hospital slide */
  .hospital-scene {
    display: flex;
    align-items: center;
    gap: 20px;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .icon-big { font-size: 60px; animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .hospital-text { flex: 1; }
  .hospital-text h3 { font-size: 18px; margin-bottom: 6px; }
  .hospital-text p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.7; }

  /* Z-score explanation */
  .zscore-boxes {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }
  .zscore-box {
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .zscore-box .emoji { font-size: 28px; margin-bottom: 8px; }
  .zscore-box h4 { font-size: 12px; margin-bottom: 4px; }
  .zscore-box p { font-size: 11px; color: rgba(255,255,255,0.4); }

  /* RF examples */
  .rf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }
  .rf-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    transition: all 0.3s;
  }
  .rf-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
  .rf-card .icon { font-size: 24px; }

  /* Summary */
  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }
  .summary-item {
    background: rgba(0,255,136,0.05);
    border: 1px solid rgba(0,255,136,0.15);
    border-radius: 10px;
    padding: 14px;
    font-size: 13px;
  }
  .summary-item .label { color: rgba(0,255,136,0.6); font-size: 10px; letter-spacing: 2px; margin-bottom: 4px; }
  .summary-item .val { color: #fff; font-weight: 600; }

  /* Recovery visual */
  .recovery-flow {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .flow-box {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
  }
  .flow-arrow { font-size: 18px; color: rgba(255,255,255,0.3); }
`;

// Draw animated signals on canvas
function useSignalCanvas(canvasRef, type) {
  const animRef = useRef();
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = 140 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const W = canvas.offsetWidth;
    const H = 140;
    const points = [];
    let anomalyT = type === "anomaly_signal" ? 60 : -999;

    function draw() {
      tRef.current++;
      const t = tRef.current;
      const cx = W - 10;
      let val = Math.sin(t * 0.08) * 0.6 + Math.sin(t * 0.2) * 0.2;

      // inject anomaly
      if (type === "anomaly_signal" && Math.abs(t - anomalyT) < 6) {
        val += (t - anomalyT > 0 ? 1 : -1) * 1.8;
      }
      if (type === "anomaly_signal" && t > anomalyT + 80) anomalyT = t + 80;

      // recovery: clamp anomaly
      let recoveredVal = val;
      if (type === "recovery" && Math.abs(val) > 0.9) recoveredVal = 0.3 * Math.sign(val);

      points.push({ x: cx, rawY: H / 2 - val * 45, recY: H / 2 - recoveredVal * 45, isAnomaly: Math.abs(val) > 0.9 });
      if (points.length > W - 20) points.shift();

      // shift points left
      points.forEach(p => { p.x -= 1.5; });

      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 35) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Center line
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

      // Raw signal
      if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = type === "recovery" ? "rgba(0,255,136,0.35)" : "#00ff88";
        ctx.lineWidth = type === "recovery" ? 1.5 : 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00ff88";
        points.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.rawY) : ctx.lineTo(p.x, p.rawY); });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Recovered signal overlay
      if (type === "recovery" && points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#00aaff";
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00aaff";
        points.forEach((p, i) => { i === 0 ? ctx.moveTo(p.x, p.recY) : ctx.lineTo(p.x, p.recY); });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Anomaly dots
      if (type === "anomaly_signal" || type === "recovery") {
        points.forEach(p => {
          if (p.isAnomaly) {
            ctx.beginPath();
            ctx.arc(p.x, p.rawY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ff3355";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ff3355";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // Anomaly label
      if (type === "anomaly_signal") {
        const anom = points.find(p => p.isAnomaly);
        if (anom) {
          ctx.fillStyle = "#ff3355";
          ctx.font = "bold 11px Space Grotesk";
          ctx.fillText("⚠ ANOMALY!", anom.x - 10, anom.rawY - 14);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [canvasRef, type]);
}

function SignalCanvas({ type }) {
  const ref = useRef();
  useSignalCanvas(ref, type);
  return <canvas ref={ref} style={{ height: 140, display: 'block', width: '100%', borderRadius: 10, background: 'rgba(0,0,0,0.3)', marginBottom: 20 }} />;
}

const glowColors = ["#6600ff", "#00ff88", "#00ff88", "#ff3355", "#ffaa00", "#00aaff", "#00aaff", "#00ff88"];

export default function App() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  const next = () => slide < slides.length - 1 && setSlide(s => s + 1);
  const prev = () => slide > 0 && setSlide(s => s - 1);

  return (
    <>
      <style>{styles}</style>
      <div className="demo">
        <div className="bg-glow" style={{ background: glowColors[slide], top: -100, left: '20%' }} />
        <div className="bg-glow" style={{ background: glowColors[slide], bottom: -100, right: '10%' }} />

        <div className="card" key={slide}>
          <div className="slide-counter">{slide + 1} / {slides.length}</div>

          {/* INTRO */}
          {current.type === "intro" && (
            <>
              <div className="tag" style={{ background: 'rgba(102,0,255,0.2)', color: '#aa88ff', border: '1px solid rgba(102,0,255,0.3)' }}>DEMO EXPLAINER</div>
              <h1 style={{ fontSize: 32 }}>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                {["🏥 Real Life Example", "📡 RF Signals", "🔧 Auto Recovery", "🚀 Your App"].map((item, i) => (
                  <div key={i} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{item}</div>
                ))}
              </div>
            </>
          )}

          {/* HOSPITAL */}
          {current.type === "hospital" && (
            <>
              <div className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>REAL LIFE ANALOGY</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <div className="hospital-scene">
                <div className="icon-big">🏥</div>
                <div className="hospital-text">
                  <h3>Heart Rate Monitor</h3>
                  <p>A patient is connected 24/7. The machine watches every heartbeat. If anything goes wrong — <strong style={{ color: '#ff3355' }}>ALARM!</strong> Doctor rushes in.</p>
                  <p style={{ marginTop: 8 }}>Your app does <strong style={{ color: '#00ff88' }}>the exact same thing</strong> — but for radio signals instead of heartbeats.</p>
                </div>
              </div>
              <p className="description" style={{ borderColor: '#00ff88' }}>{current.description}</p>
            </>
          )}

          {/* NORMAL SIGNAL */}
          {current.type === "normal_signal" && (
            <>
              <div className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>NORMAL STATE</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <SignalCanvas type="normal_signal" />
              <p className="description" style={{ borderColor: '#00ff88' }}>
                👆 This is the heartbeat / RF signal in normal condition. The green wave flows smoothly and predictably. The system says: <strong style={{ color: '#00ff88' }}>✅ ALL GOOD</strong>
              </p>
            </>
          )}

          {/* ANOMALY SIGNAL */}
          {current.type === "anomaly_signal" && (
            <>
              <div className="tag" style={{ background: 'rgba(255,51,85,0.1)', color: '#ff3355', border: '1px solid rgba(255,51,85,0.3)' }}>ANOMALY DETECTED</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <SignalCanvas type="anomaly_signal" />
              <p className="description" style={{ borderColor: '#ff3355' }}>
                👆 Watch for the <strong style={{ color: '#ff3355' }}>red dot</strong> — that's an anomaly! The signal suddenly spikes way outside the normal range. System screams: <strong style={{ color: '#ff3355' }}>⚠️ ANOMALY!</strong>
              </p>
            </>
          )}

          {/* ZSCORE */}
          {current.type === "zscore" && (
            <>
              <div className="tag" style={{ background: 'rgba(255,170,0,0.1)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.2)' }}>THE MATH (SIMPLE)</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <div className="zscore-boxes">
                <div className="zscore-box">
                  <div className="emoji">📊</div>
                  <h4 style={{ color: '#00ff88' }}>Watch Average</h4>
                  <p>Always track the normal average of last 30 signals</p>
                </div>
                <div className="zscore-box">
                  <div className="emoji">📏</div>
                  <h4 style={{ color: '#ffaa00' }}>Measure Distance</h4>
                  <p>How far is this new point from the average?</p>
                </div>
                <div className="zscore-box">
                  <div className="emoji">🚨</div>
                  <h4 style={{ color: '#ff3355' }}>Too Far = Alert!</h4>
                  <p>If distance &gt; 2.8σ — it's an anomaly</p>
                </div>
              </div>
              <p className="description" style={{ borderColor: '#ffaa00' }}>
                🎓 <strong>Class analogy:</strong> Class average is 60. If you score 99 — teacher notices. If score is 62 — normal. The "how far from average" = Z-Score!
              </p>
            </>
          )}

          {/* RECOVERY */}
          {current.type === "recovery" && (
            <>
              <div className="tag" style={{ background: 'rgba(0,170,255,0.1)', color: '#00aaff', border: '1px solid rgba(0,170,255,0.2)' }}>AUTO RECOVERY</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <SignalCanvas type="recovery" />
              <div className="recovery-flow">
                {[
                  { label: "RAW SIGNAL", color: "rgba(0,255,136,0.15)", border: "rgba(0,255,136,0.3)", text: "#00ff88" },
                  null,
                  { label: "ANOMALY FOUND", color: "rgba(255,51,85,0.15)", border: "rgba(255,51,85,0.3)", text: "#ff3355" },
                  null,
                  { label: "REPLACE WITH MEAN", color: "rgba(255,170,0,0.15)", border: "rgba(255,170,0,0.3)", text: "#ffaa00" },
                  null,
                  { label: "CLEAN OUTPUT", color: "rgba(0,170,255,0.15)", border: "rgba(0,170,255,0.3)", text: "#00aaff" },
                ].map((item, i) =>
                  item ? (
                    <div key={i} className="flow-box" style={{ background: item.color, border: `1px solid ${item.border}`, color: item.text }}>{item.label}</div>
                  ) : <div key={i} className="flow-arrow">→</div>
                )}
              </div>
              <p className="description" style={{ borderColor: '#00aaff' }}>
                👆 Green = raw signal (with spikes). Blue = recovered clean signal. The bad values are <strong style={{ color: '#00aaff' }}>replaced with predicted clean values</strong> in real time!
              </p>
            </>
          )}

          {/* RF */}
          {current.type === "rf" && (
            <>
              <div className="tag" style={{ background: 'rgba(0,170,255,0.1)', color: '#00aaff', border: '1px solid rgba(0,170,255,0.2)' }}>REAL WORLD USE</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <div className="rf-grid">
                {[
                  { icon: "📡", label: "Radar Systems", desc: "Detect jamming or ghost signals" },
                  { icon: "📶", label: "WiFi Networks", desc: "Catch interference or attacks" },
                  { icon: "🛰️", label: "Satellite Comms", desc: "Monitor signal degradation" },
                  { icon: "🏭", label: "Industrial IoT", desc: "Detect sensor faults in factories" },
                ].map((item, i) => (
                  <div key={i} className="rf-card">
                    <div className="icon">{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="description" style={{ borderColor: '#00aaff' }}>
                Your FPGA project at the IEEE Hackathon implemented this on real hardware — that's a level above just software simulation!
              </p>
            </>
          )}

          {/* SUMMARY */}
          {current.type === "summary" && (
            <>
              <div className="tag" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>SUMMARY</div>
              <h1>{current.title}</h1>
              <p className="subtitle">{current.subtitle}</p>
              <div className="summary-grid">
                {[
                  { label: "DETECTION", val: "Z-Score statistical method" },
                  { label: "RECOVERY", val: "Replace with local mean" },
                  { label: "HARDWARE", val: "AMD Artix-7 FPGA (Verilog)" },
                  { label: "SOFTWARE", val: "React + Recharts (Browser)" },
                  { label: "EVENT", val: "IEEE Hackathon 2026" },
                  { label: "GITHUB", val: "uncertain0117" },
                ].map((item, i) => (
                  <div key={i} className="summary-item">
                    <div className="label">{item.label}</div>
                    <div className="val">{item.val}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="nav">
            <button className="btn btn-prev" onClick={prev} disabled={slide === 0}>← Back</button>
            <button className="btn btn-next" onClick={next}>
              {slide === slides.length - 1 ? "🎉 Done!" : "Next →"}
            </button>
          </div>
        </div>

        <div className="progress">
          {slides.map((_, i) => (
            <div key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
    </>
  );
}
