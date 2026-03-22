"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formState, setFormState] = useState("idle");
  const [showGate, setShowGate] = useState(false);
  const [gateData, setGateData] = useState({ name: "", email: "" });

  async function handleEmailSubmit(e, data, setData, callback) {
    e.preventDefault();
    if (!data.email) return;
    setFormState("submitting");

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
      if (scriptUrl && scriptUrl !== "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec") {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            timestamp: new Date().toISOString(),
            source: "godmodechat.com",
          }),
        });
      }
      setFormState("success");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gmc_email_captured", "true");
        sessionStorage.setItem("gmc_user_name", data.name);
      }
      if (callback) callback();
    } catch (err) {
      console.error("Form submission error:", err);
      setFormState("error");
    }
  }

  function handleTalkClick() {
    if (typeof window !== "undefined" && sessionStorage.getItem("gmc_email_captured")) {
      router.push("/chat");
      return;
    }
    setShowGate(true);
  }

  return (
    <>
      {/* SECTION 1 — HERO */}
      <section className="hero">
        <span className="hero-label">IAM &gt; AI</span>
        <h1>&ldquo;You can ask God anything and hear from Him right now.&rdquo;</h1>
        <p className="hero-sub">
          GodModeChat helps you bring every thought, worry, decision, and prayer
          directly to Jesus&nbsp;&mdash; and receive a response grounded entirely
          in His Word.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={handleTalkClick}>
            Talk to Jesus Now &rarr;
          </button>
          <a href="#ebook" className="btn-secondary">
            Get the Free eBook First &darr;
          </a>
        </div>
      </section>

      {/* SECTION 2 — ORIGIN STORY */}
      <section className="origin">
        <div className="section">
          <h2>Why GodModeChat Exists</h2>
          <p className="origin-text">
            When Lane &ldquo;Dawg&rdquo; Bowers heard the story of a 14-year-old
            boy who ended his life after a conversation with an AI chatbot, it
            shook him to his core.
            <br /><br />
            In that moment of grief, he felt God speak clearly:
            <br /><br />
            <em>
              &ldquo;This same AI can be used for My good to change the
              world.&rdquo;
            </em>
            <br /><br />
            GodModeChat was born from that moment. Not to replace the Holy
            Spirit. Not to replace the Bible. But to help you run to your
            Father&nbsp;&mdash; right now, about anything, and hear Him respond
            through His Word.
          </p>
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Bring It</h3>
              <p>
                Bring any thought, worry, fear, decision, or celebration to
                Jesus. Nothing is too small. Nothing is too big.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Receive</h3>
              <p>
                Receive a personalized prayer and a response grounded entirely in
                Scripture&nbsp;&mdash; spoken directly to your situation.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Go Deeper</h3>
              <p>
                Use GodModeChat as your starting point. Your own daily time with
                Jesus is the goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — EMAIL CAPTURE / EBOOK */}
      <section className="ebook-section" id="ebook">
        <div className="section">
          <div className="ebook-card">
            <h2>Get the Free eBook</h2>
            <p className="ebook-title">
              &ldquo;GodModeChat: You Can Ask God Anything and Hear from Him
              Right Now&rdquo;
            </p>
            <p className="ebook-author">by Lane &ldquo;Dawg&rdquo; Bowers</p>
            <p className="ebook-desc">
              16 chapters on hearing from God, personalizing Scripture, and
              building the most powerful habit in the world&nbsp;&mdash; daily
              conversation with Jesus.
            </p>

            {formState === "success" ? (
              <div className="form-success">
                <p>
                  <strong>Thank you, {formData.name || "friend"}!</strong>
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                  Your eBook is on its way. You can also{" "}
                  <a
                    href="/chat"
                    style={{ color: "var(--gold)", textDecoration: "underline" }}
                  >
                    start talking to Jesus now &rarr;
                  </a>
                </p>
              </div>
            ) : (
              <form
                className="email-form"
                onSubmit={(e) =>
                  handleEmailSubmit(e, formData, setFormData, null)
                }
              >
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, name: e.target.value }))
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, email: e.target.value }))
                  }
                />
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={formState === "submitting"}
                >
                  {formState === "submitting"
                    ? "Sending..."
                    : "Send Me the eBook + Access GodModeChat"}
                </button>
              </form>
            )}
            <p className="form-note">No spam. Ever. Just Jesus.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — ABOUT LANE */}
      <section className="about">
        <div className="section">
          <h2>About the Author</h2>
          <img
            src="/lane-headshot.jpg"
            alt="Lane Dawg Bowers"
            className="about-photo"
          />
          <p className="about-text">
            Lane &ldquo;Dawg&rdquo; Bowers spent 25 years as a professional
            barefoot water skier. Today, he has one mission:
            <br /><br />
            <strong>
              &ldquo;To let everyone who will listen know that Jesus loves them
              and wants to talk to them right now.&rdquo;
            </strong>
            <br /><br />
            Lane is the founder of WinterHaven.AI and Bowers Bookkeeping, a
            husband, and father of two sons&nbsp;&mdash; Zane and Peyton.
          </p>
          <blockquote className="about-verse">
            &ldquo;Lord, you are my secret hiding place, protecting me from
            these troubles, surrounding me with songs of gladness! Your joyous
            shouts of rescue release my breakthrough.&rdquo;
            <cite>&mdash; Psalm 32:7 (TPT)</cite>
          </blockquote>
        </div>
      </section>

      {/* SECTION 6 — FOOTER CTA */}
      <footer>
        <div className="footer-cta">
          <h2>
            Nothing is too small. Nothing is too big.
            <br />
            Bring it to Jesus now.
          </h2>
          <button className="btn-primary" onClick={handleTalkClick}>
            Talk to Jesus Now &rarr;
          </button>
        </div>
        <div className="footer-bottom">
          &copy; 2026 GodModeChat &nbsp;|&nbsp; A{" "}
          <a
            href="https://winterhaven.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            WinterHaven.AI
          </a>{" "}
          Project &nbsp;|&nbsp;{" "}
          <a href="/privacy">Privacy Policy</a>
        </div>
      </footer>

      {/* CHAT GATE MODAL */}
      {showGate && (
        <div className="modal-overlay" onClick={() => setShowGate(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Where should we send your free eBook?</h3>
            <form
              className="email-form"
              onSubmit={(e) =>
                handleEmailSubmit(e, gateData, setGateData, () => {
                  setShowGate(false);
                  router.push("/chat");
                })
              }
            >
              <input
                type="text"
                placeholder="First Name"
                value={gateData.name}
                onChange={(e) =>
                  setGateData((d) => ({ ...d, name: e.target.value }))
                }
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={gateData.email}
                onChange={(e) =>
                  setGateData((d) => ({ ...d, email: e.target.value }))
                }
              />
              <button
                className="btn-primary"
                type="submit"
                disabled={formState === "submitting"}
              >
                {formState === "submitting" ? "Sending..." : "Let's Go →"}
              </button>
            </form>
            <button
              className="modal-skip"
              onClick={() => {
                setShowGate(false);
                router.push("/chat");
              }}
            >
              Or skip and go straight to chat &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
