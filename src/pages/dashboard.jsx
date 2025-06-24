import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Filter, Link2, MousePointer, TrendingUp, Plus, Search, Sparkles, Check, Share2, MessageCircle, Mail, Twitter, Facebook, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Error from '@/components/error';
import useFetch from '@/hooks/use-fetch';
import { UrlState } from '@/context';
import { getUrls } from '@/db/apiUrls';
import { getClicksForUrls } from '@/db/apiClicks';
import { Input } from '@/components/ui/input';
import LinkCard from '@/components/link-card';
import CreateLink from '@/components/create-link';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  
  const {user} = UrlState();
  const {loading, error, data: urls, fn: fnUrls} = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort URLs by creation date (newest first)
  const sortedUrls = filteredUrls?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  // Calculate additional stats
  const totalClicks = clicks?.length || 0;
  const averageClicks = urls?.length ? Math.round(totalClicks / urls.length) : 0;
  const recentUrls = urls?.filter(url => {
    const created = new Date(url.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length || 0;

  // Copy functionality
  const copyToClipboard = async (url) => {
    try {
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      await navigator.clipboard.writeText(`${window.location.origin}/${link}`);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/${link}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  // Download QR with branding
  const downloadQRCode = async (url) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = 400;
      canvas.height = 500;
      
      // Create white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load QR code image
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = url?.qr;
      });
      
      // Draw QR code (centered, with some padding)
      const qrSize = 300;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 60;
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      
      // Add company branding
      ctx.fillStyle = '#8b5cf6'; // Purple color matching your theme
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Shortlinktics', canvas.width / 2, 40);
      
      // Add subtitle
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Next-Gen Links', canvas.width / 2, 55);
      
      // Add link title below QR code
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      
      // Wrap text if too long
      const linkTitle = url?.title || 'Shortlinktics Short URL';
      const maxWidth = canvas.width - 40;
      const words = linkTitle.split(' ');
      let line = '';
      let y = qrY + qrSize + 40;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      
      // Add short URL
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      ctx.fillStyle = '#3b82f6';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText(`${window.location.origin}/${link}`, canvas.width / 2, y + 30);
      
      // Add footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Scan to visit • Powered by Shortlinktics', canvas.width / 2, canvas.height - 20);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `${url?.title || 'Shortlinktics'}-qr-code.png`;
        anchor.style.display = 'none';
        
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
        window.URL.revokeObjectURL(blobUrl);
      }, 'image/png');
      
    } catch (error) {
      console.error('Enhanced download failed, using fallback:', error);
      // Fallback to original method
      const anchor = document.createElement('a');
      anchor.href = url?.qr;
      anchor.download = `${url?.title || 'qr-code'}-qr-code.png`;
      anchor.click();
    }
  };

  // Share options
  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      action: (url) => {
        if (url === 'bulk') {
          // Bulk share all links
          const allLinks = sortedUrls.map(urlItem => {
            const link = urlItem?.custom_url ? urlItem?.custom_url : urlItem.short_url;
            return `${urlItem.title}: ${window.location.origin}/${link}`;
          }).join('\n\n');
          const text = `Check out my ${sortedUrls.length} links:\n\n${allLinks}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else {
          // Single link share
          const link = url?.custom_url ? url?.custom_url : url.short_url;
          const text = `Check out this link: ${url?.title}\n${window.location.origin}/${link}`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-500 to-blue-600',
      action: (url) => {
        if (url === 'bulk') {
          // For Twitter, share first few links due to character limit
          const firstThree = sortedUrls.slice(0, 3);
          const links = firstThree.map(urlItem => {
            const link = urlItem?.custom_url ? urlItem?.custom_url : urlItem.short_url;
            return `${urlItem.title}: ${window.location.origin}/${link}`;
          }).join('\n');
          const text = `Check out my links:\n${links}${sortedUrls.length > 3 ? `\n...and ${sortedUrls.length - 3} more!` : ''}`;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        } else {
          // Single link share
          const link = url?.custom_url ? url?.custom_url : url.short_url;
          const text = `Check out this link: ${url?.title}`;
          const urlToShare = `${window.location.origin}/${link}`;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(urlToShare)}`, '_blank');
        }
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      action: (url) => {
        if (url === 'bulk') {
          // For Facebook, share the first link and mention there are more
          const firstUrl = sortedUrls[0];
          const link = firstUrl?.custom_url ? firstUrl?.custom_url : firstUrl.short_url;
          const urlToShare = `${window.location.origin}/${link}`;
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}&quote=${encodeURIComponent(`Check out my ${sortedUrls.length} Shortlinktics links! Starting with: ${firstUrl.title}`)}`, '_blank');
        } else {
          // Single link share
          const link = url?.custom_url ? url?.custom_url : url.short_url;
          const urlToShare = `${window.location.origin}/${link}`;
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`, '_blank');
        }
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'from-gray-500 to-gray-600',
      action: (url) => {
        if (url === 'bulk') {
          // Bulk email all links
          const allLinks = sortedUrls.map(urlItem => {
            const link = urlItem?.custom_url ? urlItem?.custom_url : urlItem.short_url;
            return `${urlItem.title}\n${window.location.origin}/${link}\nOriginal: ${urlItem.original_url}`;
          }).join('\n\n---\n\n');
          const subject = `My ${sortedUrls.length} Shortlinktics Links`;
          const body = `I wanted to share my collection of ${sortedUrls.length} links with you:\n\n${allLinks}\n\nCreated with Shortlinktics - Next-Gen URL Shortening`;
          window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        } else {
          // Single link share
          const link = url?.custom_url ? url?.custom_url : url.short_url;
          const subject = `Check out this link: ${url?.title}`;
          const body = `I wanted to share this link with you:\n\n${url?.title}\n${window.location.origin}/${link}\n\nOriginal URL: ${url?.original_url}`;
          window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }
      }
    }
  ];

  const handleNativeShare = async (url) => {
    const link = url?.custom_url ? url?.custom_url : url.short_url;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: url?.title,
          text: `Check out this link: ${url?.title}`,
          url: `${window.location.origin}/${link}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        setSelectedUrl(url);
        setShowShareMenu(true);
      }
    } else {
      setSelectedUrl(url);
      setShowShareMenu(true);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Share Menu Overlay */}
      {showShareMenu && selectedUrl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Share Link</h3>
              <Button
                onClick={() => setShowShareMenu(false)}
                className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 border-0"
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  onClick={() => {
                    option.action(selectedUrl);
                    setShowShareMenu(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 h-auto bg-gradient-to-r ${option.color} hover:scale-105 transition-all duration-300 border-0`}
                >
                  <option.icon className="w-6 h-6 text-white" />
                  <span className="text-sm font-medium text-white">{option.name}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={() => {
                  copyToClipboard(selectedUrl);
                  setShowShareMenu(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link to Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Popup */}
      {showCopySuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600/90 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Link Copied!</p>
              <p className="text-green-100 text-sm">Ready to share anywhere</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Bar */}
      {(loading || loadingClicks) && (
        <div className="relative">
          <BarLoader 
            width="100%" 
            color="#8b5cf6" 
            height={3}
            className="rounded-full"
          />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-50 animate-pulse"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Welcome back, {user?.user_metadata?.name || 'User'}!
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your links and track their performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Links Created",
            value: urls?.length || 0,
            icon: Link2,
            color: "from-purple-500 to-blue-500",
            bgColor: "from-purple-500/20 to-blue-500/20"
          },
          {
            title: "Total Clicks",
            value: totalClicks,
            icon: MousePointer,
            color: "from-cyan-500 to-purple-500",
            bgColor: "from-cyan-500/20 to-purple-500/20"
          },
          {
            title: "Avg. Clicks",
            value: averageClicks,
            icon: TrendingUp,
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-500/20 to-cyan-500/20"
          },
          {
            title: "This Week",
            value: recentUrls,
            icon: Plus,
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-500/20 to-emerald-500/20"
          }
        ].map((stat, index) => (
          <Card 
            key={index}
            className="border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${stat.bgColor} border border-white/10`}>
                  <span className="text-xs text-white font-medium">
                    {index === 3 ? 'New' : 'Total'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Quick Actions
          </h3>
          <p className="text-gray-300 mb-6">Batch operations for your links</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                if (urls?.length > 0) {
                  urls.forEach(url => downloadQRCode(url));
                }
              }}
              disabled={!urls?.length}
              className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border border-cyan-500/30 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Download All QR Codes</div>
                <div className="text-xs text-gray-300">Export all QR codes at once</div>
              </div>
            </Button>
            
            <Button
              onClick={() => {
                if (urls?.length > 0) {
                  const allLinks = urls.map(url => {
                    const link = url?.custom_url ? url?.custom_url : url.short_url;
                    return `${url.title}: ${window.location.origin}/${link}`;
                  }).join('\n');
                  
                  navigator.clipboard.writeText(allLinks).then(() => {
                    setShowCopySuccess(true);
                    setTimeout(() => setShowCopySuccess(false), 2000);
                  });
                }
              }}
              disabled={!urls?.length}
              className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Copy className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Copy All Links</div>
                <div className="text-xs text-gray-300">Copy all links to clipboard</div>
              </div>
            </Button>
            
            <Button
              onClick={() => {
                if (urls?.length > 0) {
                  setSelectedUrl(urls[0]); // Use first URL as example
                  setShowShareMenu(true);
                }
              }}
              disabled={!urls?.length}
              className="flex items-center gap-3 p-4 h-auto bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Share2 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Bulk Share</div>
                <div className="text-xs text-gray-300">Share multiple links</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Links Management Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">My Links</h2>
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-white/10">
              <span className="text-sm text-gray-300">{urls?.length || 0} links</span>
            </div>
          </div>
          <CreateLink />
        </div>

        {/* Search Filter */}
        <div className="relative max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-sm"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              />
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
            <Error message={error?.message} />
          </div>
        )}

        {/* Links Grid */}
        {filteredUrls && filteredUrls.length > 0 ? (
          <div className="space-y-4">
            {filteredUrls.map((url, i) => (
              <div key={i} className="relative group">
                <LinkCard 
                  url={url} 
                  fetchUrls={fnUrls}
                  onCopy={() => copyToClipboard(url)}
                  onShare={() => handleNativeShare(url)}
                  onDownload={() => downloadQRCode(url)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Link2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchQuery ? 'No links found' : 'No links yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No links match "${searchQuery}". Try a different search term.`
                : 'Create your first shortened link to get started!'
              }
            </p>
            {!searchQuery && <CreateLink />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;