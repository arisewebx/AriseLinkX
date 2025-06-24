import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Link, Zap, BarChart3, Shield, Globe, Sparkles, ArrowRight, Check} from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-12 pb-20">
        {/* Main Headline */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300 font-medium">Next-Generation URL Shortener</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">The only</span>{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              URL Shortener
            </span>
            <br />
            <span className="text-white">you'll ever need!</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your long URLs into powerful, trackable short links with advanced analytics and beautiful design.
          </p>
        </div>

        {/* URL Shortener Form */}
        <form
          onSubmit={handleShorten}
          className="w-full max-w-3xl mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex-1 relative group">
              <Input
                type="url"
                placeholder="Enter your loooong URL here..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="h-14 px-6 bg-transparent border-0 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-0"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Shorten Now!
            </Button>
          </div>
        </form>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-20">
          {[
            {
              icon: Link,
              title: "Smart Shortening",
              description: "Generate beautiful, memorable short URLs that work perfectly across all platforms.",
              color: "from-purple-500 to-blue-500"
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description: "Track clicks, locations, devices, and more with our comprehensive analytics dashboard.",
              color: "from-cyan-500 to-purple-500"
            },
            {
              icon: Shield,
              title: "Secure & Reliable",
              description: "Enterprise-grade security with 99.9% uptime guarantee for all your important links.",
              color: "from-blue-500 to-cyan-500"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        {/* Stats Section */}
        {/* <div className="w-full max-w-4xl mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10M+", label: "Links Created" },
              { number: "50M+", label: "Clicks Tracked" },
              { number: "100K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Image Section */}
        {/* <div className="w-full max-w-6xl mb-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
            <img
              src="/banner1.jpg"
              alt="Shortlinktics Dashboard"
              className="w-full h-auto relative z-10"
            />
          </div>
        </div> */}

        {/* FAQ Section */}
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 text-lg">
              Everything you need to know about Shortlinktics
            </p>
          </div>

          <Accordion type="multiple" className="w-full space-y-4">
            {[
              {
                id: "item-1",
                question: "How does the Shortlinktics URL shortener work?",
                answer: "When you enter a long URL, our advanced system generates a shorter, optimized version. This shortened URL redirects to the original long URL when accessed, while providing detailed analytics and tracking capabilities."
              },
              {
                id: "item-2",
                question: "Do I need an account to use the app?",
                answer: "Yes, creating an account unlocks the full power of Shortlinktics. You'll be able to manage your URLs, view comprehensive analytics, customize your short URLs, and access advanced features like bulk shortening and team collaboration."
              },
              {
                id: "item-3",
                question: "What analytics are available for my shortened URLs?",
                answer: "Shortlinktics provides comprehensive analytics including click counts, geographic location data, device types (mobile/desktop/tablet), browser information, referrer sources, and time-based click patterns. All data is presented in beautiful, easy-to-understand dashboards."
              },
              {
                id: "item-4",
                question: "Can I customize my short URLs?",
                answer: "Absolutely! With Shortlinktics, you can create custom branded short URLs that match your brand identity. Choose your own custom domain and create memorable, professional-looking links."
              },
              {
                id: "item-5",
                question: "Is Shortlinktics secure and reliable?",
                answer: "Security is our top priority. We use enterprise-grade encryption, provide 99.9% uptime guarantee, and ensure all your data is protected. Your links will work reliably around the clock."
              }
            ].map((faq) => (
              <AccordionItem 
                key={faq.id}
                value={faq.id} 
                className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl px-6 data-[state=open]:border-purple-500/50"
              >
                <AccordionTrigger className="text-white hover:text-purple-400 transition-colors duration-200 text-left font-medium py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex-shrink-0"></div>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-4xl mt-20 text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Shortlinktics for their URL shortening needs. 
              Start creating powerful short links today!
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 flex items-center gap-2 mx-auto"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;