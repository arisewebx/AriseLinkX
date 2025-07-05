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
      {/* Clean Hero Section */}
<div className="relative z-10 flex flex-col items-center px-4 pt-12 pb-20">
  {/* Main Headline */}
  <div className="text-center mb-12 max-w-5xl">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 mb-8">
      <Sparkles className="w-4 h-4 text-purple-400" />
      <span className="text-sm text-gray-300 font-medium">Next-Generation URL Shortener</span>
    </div>
    
    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Smart links
      </span>
      <br />
      <span className="text-white">for smart businesses</span>
    </h1>
    
    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
      Beyond clicks. Real insights. Turn every shortened URL into actionable data that drives growth.
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

  {/* Enhanced Features Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-20">
    {[
      {
        icon: Link,
        title: "Smart Shortening",
        description: "Generate beautiful, memorable short URLs that work perfectly across all platforms.",
        color: "from-purple-500 to-blue-500",
        gradient: "from-purple-500/20 to-blue-500/20",
        borderGradient: "from-purple-500/50 to-blue-500/50"
      },
      {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Track clicks, locations, devices, and more with our comprehensive analytics dashboard.",
        color: "from-cyan-500 to-purple-500",
        gradient: "from-cyan-500/20 to-purple-500/20",
        borderGradient: "from-cyan-500/50 to-purple-500/50"
      },
      {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Enterprise-grade security with 99.9% uptime guarantee for all your important links.",
        color: "from-blue-500 to-cyan-500",
        gradient: "from-blue-500/20 to-cyan-500/20",
        borderGradient: "from-blue-500/50 to-cyan-500/50"
      }
    ].map((feature, index) => (
      <div 
        key={index}
        className={`group relative p-6 rounded-3xl bg-gradient-to-br ${feature.gradient} backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Subtle hover border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${feature.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`}></div>
        <div className="absolute inset-[1px] bg-gray-900/80 rounded-3xl backdrop-blur-2xl"></div>
        
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
          <p className="text-gray-300 leading-relaxed">{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
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

        {/* Use Cases Section */}
        <div className="w-full max-w-7xl mb-20 relative">
          {/* Floating Background Elements */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-white/10 mb-6 backdrop-blur-xl">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-300 font-medium tracking-wide">BUILD FOR SHARE & TRACK</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Perfect For Every{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Creator & Professional
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full opacity-50"></div>
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Whether you're building your brand, tracking performance, or scaling your business—
                <span className="text-white font-semibold"> Shortlinktics powers your success</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                {
                  icon: "🎬",
                  title: "YouTubers & Streamers",
                  description: "Track clicks from video descriptions, bio links, and community posts. Monitor which videos drive the most traffic to your external content.",
                  features: ["Video description analytics", "Bio link tracking", "Subscriber engagement metrics"],
                  gradient: "from-red-500/20 to-orange-500/20",
                  borderGradient: "from-red-500/50 to-orange-500/50"
                },
                {
                  icon: "📱",
                  title: "Content Creators",
                  description: "Optimize your social media strategy with detailed insights on post performance across Instagram, TikTok, Twitter, and more.",
                  features: ["Cross-platform tracking", "Story link analytics", "Campaign performance"],
                  gradient: "from-pink-500/20 to-purple-500/20",
                  borderGradient: "from-pink-500/50 to-purple-500/50"
                },
                {
                  icon: "💼",
                  title: "LinkedIn Professionals",
                  description: "Elevate your professional presence with advanced analytics on your LinkedIn posts, articles, and networking outreach.",
                  features: ["Post engagement tracking", "Professional network insights", "Lead generation analytics"],
                  gradient: "from-blue-600/20 to-indigo-600/20",
                  borderGradient: "from-blue-600/50 to-indigo-600/50"
                },
                {
                  icon: "📊",
                  title: "Digital Marketers",
                  description: "Comprehensive campaign tracking with UTM integration, conversion analytics, and ROI measurement for all your marketing efforts.",
                  features: ["Campaign attribution", "Conversion tracking", "A/B testing support"],
                  gradient: "from-green-500/20 to-emerald-500/20",
                  borderGradient: "from-green-500/50 to-emerald-500/50"
                },
                {
                  icon: "🛒",
                  title: "E-commerce & Online Stores",
                  description: "Optimize your product links and track sales funnels. Monitor affiliate performance and shopping cart abandonment with precision.",
                  features: ["Product link tracking", "Sales funnel analytics", "Affiliate performance monitoring"],
                  gradient: "from-amber-500/20 to-yellow-500/20",
                  borderGradient: "from-amber-500/50 to-yellow-500/50"
                },
                {
                  icon: "📧",
                  title: "Email Marketers",
                  description: "Maximize email campaign effectiveness with detailed click-through analytics and subscriber engagement insights.",
                  features: ["Newsletter performance", "Click-through rates", "Subscriber behavior analysis"],
                  gradient: "from-teal-500/20 to-cyan-500/20",
                  borderGradient: "from-teal-500/50 to-cyan-500/50"
                },
                {
                  icon: "✍️",
                  title: "Bloggers & Writers",
                  description: "Understand your readership better with comprehensive article sharing analytics and content performance insights.",
                  features: ["Article sharing metrics", "Reader engagement tracking", "Content optimization insights"],
                  gradient: "from-slate-500/20 to-gray-500/20",
                  borderGradient: "from-slate-500/50 to-gray-500/50"
                },
                {
                  icon: "🎟️",
                  title: "Event Organizers",
                  description: "Maximize event attendance with detailed registration link tracking and promotion campaign analytics.",
                  features: ["Registration tracking", "Event promotion analytics", "Attendee source attribution"],
                  gradient: "from-rose-500/20 to-pink-500/20",
                  borderGradient: "from-rose-500/50 to-pink-500/50"
                },
                {
                  icon: "🎓",
                  title: "Course Creators & Educators",
                  description: "Track student engagement and optimize your educational content with detailed enrollment and resource analytics.",
                  features: ["Course enrollment tracking", "Student engagement metrics", "Learning resource optimization"],
                  gradient: "from-indigo-500/20 to-blue-500/20",
                  borderGradient: "from-indigo-500/50 to-blue-500/50"
                },
                {
                  icon: "💰",
                  title: "Affiliate Marketers",
                  description: "Maximize your commission potential with detailed affiliate link tracking, product performance analytics, and revenue attribution.",
                  features: ["Commission tracking", "Product performance analytics", "Revenue attribution"],
                  gradient: "from-emerald-500/20 to-green-500/20",
                  borderGradient: "from-emerald-500/50 to-green-500/50"
                },
                {
                  icon: "🏢",
                  title: "Businesses",
                  description: "Monitor brand mentions, track competitor links, and protect your online presence with enterprise-grade link monitoring.",
                  features: ["Brand protection", "Competitive analysis", "Team collaboration"],
                  gradient: "from-gray-600/20 to-slate-600/20",
                  borderGradient: "from-gray-600/50 to-slate-600/50"
                },
                {
                  icon: "✨",
                  title: "Influencers",
                  description: "Maximize your influence with detailed audience insights, sponsored content tracking, and brand partnership analytics.",
                  features: ["Audience demographics", "Sponsored post tracking", "Partnership ROI"],
                  gradient: "from-purple-500/20 to-pink-500/20",
                  borderGradient: "from-purple-500/50 to-pink-500/50"
                }
              ].map((useCase, index) => (
                <div 
                  key={index}
                  className={`group relative p-6 rounded-3xl bg-gradient-to-br ${useCase.gradient} backdrop-blur-2xl border border-white/10 hover:border-transparent transition-all duration-500 hover:transform hover:scale-105 hover:rotate-1 overflow-hidden`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Animated Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${useCase.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                  <div className="absolute inset-[1px] bg-gray-900/80 rounded-3xl backdrop-blur-2xl"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Animation */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="relative text-4xl p-3 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 w-fit">
                        {useCase.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                      {useCase.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed text-sm line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
                      {useCase.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-3">
                      {useCase.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex} 
                          className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-all duration-300"
                          style={{transitionDelay: `${featureIndex * 100}ms`}}
                        >
                          <div className="relative">
                            <Check className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${useCase.borderGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        


        {/* Testimonials Section */}
        {/* <div className="w-full max-w-6xl mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-white/10 mb-6 backdrop-blur-xl">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-300 font-medium tracking-wide">LOVED BY CREATORS WORLDWIDE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Join <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">100,000+</span> Happy Users
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              See why creators, marketers, and businesses choose Shortlinktics for their link management needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "YouTuber (2.5M subscribers)",
                avatar: "👩‍💻",
                content: "Shortlinktics completely transformed how I track my video performance. The analytics are incredible - I can see exactly which videos drive the most traffic to my sponsors!",
                rating: 5,
                platform: "YouTube"
              },
              {
                name: "Marcus Rodriguez",
                role: "Digital Marketing Director",
                avatar: "👨‍💼",
                content: "We've tried every URL shortener out there. Shortlinktics is the only one that gives us the enterprise-level analytics we need while being super easy to use.",
                rating: 5,
                platform: "Enterprise"
              },
              {
                name: "Emma Thompson",
                role: "Content Creator & Influencer",
                avatar: "✨",
                content: "The Instagram story tracking feature is a game-changer! I finally understand which content resonates with my audience. My engagement rates have increased by 40%.",
                rating: 5,
                platform: "Instagram"
              },
              {
                name: "David Kim",
                role: "E-commerce Founder",
                avatar: "🚀",
                content: "Shortlinktics helped us optimize our email campaigns. We increased our click-through rates by 65% and our conversion rates by 30%. ROI speaks for itself!",
                rating: 5,
                platform: "E-commerce"
              },
              {
                name: "Lisa Park",
                role: "LinkedIn Thought Leader",
                avatar: "📊",
                content: "Professional, reliable, and powerful. The LinkedIn analytics help me understand my network better and create content that actually drives business results.",
                rating: 5,
                platform: "LinkedIn"
              },
              {
                name: "Alex Johnson",
                role: "Podcast Host",
                avatar: "🎙️",
                content: "Tracking sponsor mentions and episode performance has never been easier. Shortlinktics gives me the data I need to grow my podcast and attract better sponsors.",
                rating: 5,
                platform: "Podcast"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:transform hover:scale-105"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
               
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 bg-white/10 rounded-xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-300">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    
                  
                    <div className="px-2 py-1 text-xs font-medium text-green-300 bg-green-500/20 rounded-full border border-green-500/30">
                      {testimonial.platform}
                    </div>
                  </div>

                
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
                    ))}
                  </div>

                  <p className="text-gray-300 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>

         
          {/* <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm mb-6">Trusted by leading companies and creators</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['🎬 YouTube', '📱 Instagram', '💼 LinkedIn', '🛒 Shopify', '📧 Mailchimp', '🎙️ Spotify'].map((platform, index) => (
                <div key={index} className="text-lg font-medium text-gray-400 hover:text-white transition-colors duration-300">
                  {platform}
                </div>
              ))}
            </div>
          </div> 
        </div> */}

        {/* Interactive Demo Section */}
        {/* <div className="w-full max-w-6xl mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-white/10 mb-6 backdrop-blur-xl">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300 font-medium tracking-wide">SEE IT IN ACTION</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Experience The <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Power</span> Live
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Watch how Shortlinktics transforms your long URLs into powerful, trackable short links with beautiful analytics
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl">
            
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
           
              <div className="w-full h-full p-8 relative overflow-hidden">
               
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold">Shortlinktics Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

              
                <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                      <span className="text-gray-400 text-sm">https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 rounded-xl text-white font-semibold">
                      Shorten
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="text-green-400">✓</div>
                    <span className="text-white">shortlinktics.com/yt-music</span>
                    <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Copied!</div>
                  </div>
                </div>

             
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">2,847</div>
                    <div className="text-gray-400 text-sm">Total Clicks</div>
                    <div className="text-green-400 text-xs">+23% this week</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">67</div>
                    <div className="text-gray-400 text-sm">Countries</div>
                    <div className="text-green-400 text-xs">+5 new</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">94%</div>
                    <div className="text-gray-400 text-sm">Mobile Users</div>
                    <div className="text-gray-400 text-xs">vs 6% desktop</div>
                  </div>
                </div>

          
                <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>

            
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
              </div>
            </div>

           
            <div className="p-8 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="group cursor-pointer">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <div className="text-white font-semibold text-sm">Instant Shortening</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</div>
                  <div className="text-white font-semibold text-sm">Real-time Analytics</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🎨</div>
                  <div className="text-white font-semibold text-sm">Custom Branding</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔒</div>
                  <div className="text-white font-semibold text-sm">Enterprise Security</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Pricing Section */}
        {/* <div className="w-full max-w-6xl mb-20">
          {/* <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-white/10 mb-6 backdrop-blur-xl">
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-300 font-medium tracking-wide">SIMPLE, TRANSPARENT PRICING</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Choose Your <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Perfect Plan</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Start free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>
          </div> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for personal use and testing",
                features: [
                  "100 links per month",
                  "Basic analytics",
                  "7-day data retention",
                  "Standard support",
                  "Shortlinktics branding"
                ],
                buttonText: "Get Started Free",
                buttonStyle: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600",
                popular: false,
                gradient: "from-gray-500/20 to-slate-500/20",
                borderGradient: "from-gray-500/50 to-slate-500/50"
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                description: "Ideal for creators and small businesses",
                features: [
                  "10,000 links per month",
                  "Advanced analytics & insights",
                  "Unlimited data retention",
                  "Custom domains",
                  "Priority support",
                  "API access",
                  "Team collaboration (5 users)"
                ],
                buttonText: "Start Pro Trial",
                buttonStyle: "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500",
                popular: true,
                gradient: "from-purple-500/20 to-cyan-500/20",
                borderGradient: "from-purple-500/50 to-cyan-500/50"
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "per month",
                description: "For large teams and organizations",
                features: [
                  "Unlimited links",
                  "White-label solution",
                  "Advanced team management",
                  "SSO integration",
                  "Dedicated support manager",
                  "Custom integrations",
                  "SLA guarantee",
                  "Advanced security features"
                ],
                buttonText: "Contact Sales",
                buttonStyle: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500",
                popular: false,
                gradient: "from-orange-500/20 to-red-500/20",
                borderGradient: "from-orange-500/50 to-red-500/50"
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`group relative rounded-3xl p-8 backdrop-blur-2xl border transition-all duration-500 hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-cyan-500/10' 
                    : `border-white/10 bg-gradient-to-br ${plan.gradient}`
                }`}
                style={{
                  boxShadow: plan.popular 
                    ? '0 25px 50px -12px rgba(168, 85, 247, 0.25)' 
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
               
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

               
                <div className={`absolute -inset-1 bg-gradient-to-r ${plan.borderGradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                  </div>

                 
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center gap-3 text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                        style={{transitionDelay: `${featureIndex * 50}ms`}}
                      >
                        <div className="relative">
                          <Check className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

              
                  <Button 
                    className={`w-full h-12 ${plan.buttonStyle} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div> */}

         
          {/* <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-white/10 backdrop-blur-xl">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300 font-medium">30-day money-back guarantee</span>
            </div>
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
              },
              {
        id: "item-6",
        question: "Can I customize my short URLs and use my own domain?",
        answer: "Yes! Pro and Enterprise plans include custom domain support. Create branded short URLs like 'yourbrand.com/promo' instead of 'shortlinktics.com/abc123'. This is perfect for maintaining brand consistency across YouTube videos, Instagram stories, email campaigns, podcast show notes, and professional LinkedIn posts."
      },
      {
        id: "item-7",
        question: "How does Shortlinktics work for different platforms like YouTube, Instagram, and LinkedIn?",
        answer: "Shortlinktics automatically detects and optimizes tracking for different platforms. For YouTube, we track video description clicks and bio link performance. For Instagram, we monitor story links and bio clicks with device-specific analytics. For LinkedIn, we provide professional network insights and post engagement metrics. Each platform gets specialized analytics tailored to that environment."
      },
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