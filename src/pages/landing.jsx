import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Link2, BarChart2, Shield, ArrowRight, QrCode,
  Globe, MousePointer, Sparkles, X, Zap,
  Check, ChevronRight
} from "lucide-react";
import HeroIllustration from "@/components/HeroIllustration";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [bannerVisible, setBannerVisible] = useState(true);
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="bg-white overflow-x-hidden w-full">
      {/* ── Announcement Bar ── */}
      {bannerVisible && (
        <div className="bg-orange-500 text-white py-2 px-4 flex items-center justify-between gap-4 text-sm">
          <div className="flex-1" />
          <div className="flex items-center gap-2 font-medium">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Custom links · Full click tracking · Built by AriseWebX</span>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setBannerVisible(false)}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -5%, #fef3c7 0%, #fff7ed 45%, #ffffff 100%)",
        }}
      >
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-24 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-orange-500 tracking-widest uppercase">By AriseWebX · Track every click</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-4">
            Your links.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-white px-2">Your brand.</span>
              <span className="absolute inset-0 bg-orange-500 rounded-md -rotate-1 z-0" />
            </span>
            <br className="hidden sm:block" /> Every click, tracked.
          </h1>

          {/* Sub */}
          <p className="text-gray-500 text-base mb-8 max-w-sm mx-auto leading-relaxed">
            Create custom branded links and know exactly who clicked — device, location, browser, all in real time.
          </p>

          {/* Feature arrows */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-8 text-sm text-gray-500">
            {[
              "Branded custom links",
              "Real-time click tracking",
              "QR codes",
              "Device & location data",
            ].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-gray-200 hidden sm:inline">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleShorten}
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto mb-6 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-100"
          >
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                placeholder="Paste your URL to track…"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>
            <Button
              type="submit"
              disabled={!longUrl}
              className="h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shrink-0 disabled:opacity-40 gap-1.5"
            >
              Create link
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-gray-500">4.9/5</span>
            <span className="text-gray-200">·</span>
            <span>A product by <strong className="text-gray-600">AriseWebX</strong></span>
          </div>

        </div>

        {/* Hero illustration — full width laptop style */}
        <div className="relative max-w-5xl mx-auto px-4 pb-16">
          <HeroIllustration />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: "Custom", label: "Branded links", desc: "Choose your own alias, your own identity", icon: Link2, color: "bg-orange-50 text-orange-500" },
            { value: "Live", label: "Click tracking", desc: "Device, location, browser — all in real time", icon: MousePointer, color: "bg-blue-50 text-blue-500" },
            { value: "Free", label: "To get started", desc: "No credit card, no hidden fees", icon: Shield, color: "bg-green-50 text-green-500" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 hover:border-orange-200 hover:shadow-sm transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-4">
            <span className="text-xs text-orange-600 font-bold uppercase tracking-widest">How it works</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Track your first link in 3 steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" />

          {[
            {
              step: "1",
              title: "Paste your URL",
              desc: "Drop any URL into the box above and hit 'Create link'.",
              icon: Link2,
            },
            {
              step: "2",
              title: "Get your branded link",
              desc: "Instantly get a custom link with your own alias and a QR code.",
              icon: Zap,
            },
            {
              step: "3",
              title: "Track every click",
              desc: "See real-time analytics — who clicked, from where, and on what device.",
              icon: BarChart2,
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="relative mb-5">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        className="py-20 border-t border-gray-100"
        style={{ background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-4">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs text-orange-600 font-bold uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything in one place</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              All the tools you need to share smarter and understand your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Link2,
                title: "Branded custom links",
                desc: "Choose your own alias — make every link represent your brand.",
              },
              {
                icon: BarChart2,
                title: "Real-time analytics",
                desc: "Device, browser, country, city — tracked on every click.",
              },
              {
                icon: QrCode,
                title: "QR code generator",
                desc: "Every link gets a branded downloadable QR code.",
              },
              {
                icon: Globe,
                title: "Location insights",
                desc: "See exactly which cities and countries click your links.",
              },
              {
                icon: MousePointer,
                title: "Click-level detail",
                desc: "Precise timestamps and full click history for every link.",
              },
              {
                icon: Shield,
                title: "Secure & reliable",
                desc: "High availability infrastructure for all your short links.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-md hover:border-orange-200"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-sm font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AriseLinkX ── */}
      <section className="max-w-5xl mx-auto px-4 py-20 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-5">
              <span className="text-xs text-orange-600 font-bold uppercase tracking-widest">Why us</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
              Links that work as hard as you do
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              AriseLinkX is not just a link tool — it's your tracking layer. Know exactly who engages with your content, from where, on what device, the moment it happens.
            </p>
            <ul className="space-y-3">
              {[
                "Custom alias — your brand on every link",
                "Real-time click analytics dashboard",
                "Device, browser & OS breakdown per click",
                "City & country location data",
                "QR code generated for every link",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual card mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50 rounded-3xl -rotate-3 scale-105" />
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Link analytics</p>
                <span className="text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5 font-medium">Live</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total clicks", value: "2,847" },
                  { label: "Countries", value: "24" },
                  { label: "This week", value: "+312" },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* mini bar chart */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Clicks last 7 days</p>
                <div className="flex items-end gap-1 h-14">
                  {[30, 55, 40, 75, 60, 90, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-orange-400 rounded-t-sm opacity-80 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="text-xs text-gray-400 flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Link2 className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">links.arisewebx.com/demo</p>
                  <p className="text-xs text-gray-400">https://example.com/very-long-url</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="py-20 border-t border-gray-100"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, #fff7ed 0%, #ffffff 60%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-4">
              <span className="text-xs text-orange-600 font-bold uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: "What makes AriseLinkX different from other link tools?",
                a: "AriseLinkX is built around tracking and branding, not just shortening. You get real-time analytics on every click — device, location, browser — plus full control over your link alias.",
              },
              {
                q: "Can I choose my own custom link alias?",
                a: "Yes. When creating a link, enter your preferred alias and it becomes part of your branded link URL.",
              },
              {
                q: "What data do I get per click?",
                a: "Every click logs device type, browser, OS, city, country, and timestamp — all visible in real time on your dashboard.",
              },
              {
                q: "Do I get a QR code for my link?",
                a: "Yes — every link automatically gets a branded, downloadable QR code. Great for print and offline campaigns.",
              },
              {
                q: "Can I manage or delete my links?",
                a: "Your dashboard gives you full control — view, copy, share, analyse, and delete any link at any time.",
              },
              {
                q: "Who built this?",
                a: "AriseLinkX is a product by AriseWebX — built to give creators, marketers, and businesses a smarter way to share and track links.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white border border-gray-200 rounded-xl px-5 data-[state=open]:border-orange-200 shadow-sm"
              >
                <AccordionTrigger className="text-gray-900 font-semibold text-sm text-left hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-orange-300 font-bold uppercase tracking-widest">Start for free</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Know who clicks your links.
          </h2>
          <p className="text-gray-400 mb-10 text-base max-w-md mx-auto">
            Create branded links and get real-time analytics on every single click. Built by AriseWebX.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 h-12 rounded-lg text-base"
            >
              Create free account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-lg text-base bg-transparent"
            >
              Sign in
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
