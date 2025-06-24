import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UrlState} from "@/context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, BarChart3, MousePointer, QrCode, ArrowLeft, Check, Share2, MessageCircle, Mail, Twitter, Facebook} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";

const LinkPage = () => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const downloadImage = async () => {
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
      try {
        const response = await fetch(url?.qr);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `${url?.title || 'qr-code'}-qr-code.png`;
        anchor.style.display = 'none';
        
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
        window.URL.revokeObjectURL(blobUrl);
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
        const anchor = document.createElement('a');
        anchor.href = url?.qr;
        anchor.download = `${url?.title || 'qr-code'}-qr-code.png`;
        anchor.click();
      }
    }
  };

  const navigate = useNavigate();
  const {user, fetchUrls} = UrlState();
  const {id} = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${link}`);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
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

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      action: () => {
        const text = `Check out this link: ${url?.title}\n${window.location.origin}/${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        const text = `Check out this link: ${url?.title}`;
        const urlToShare = `${window.location.origin}/${link}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(urlToShare)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      action: () => {
        const urlToShare = `${window.location.origin}/${link}`;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`, '_blank');
      }
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'from-gray-500 to-gray-600',
      action: () => {
        const subject = `Check out this link: ${url?.title}`;
        const body = `I wanted to share this link with you:\n\n${url?.title}\n${window.location.origin}/${link}\n\nOriginal URL: ${url?.original_url}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      }
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: url?.title,
          text: `Check out this link: ${url?.title}`,
          url: `${window.location.origin}/${link}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Share Menu Overlay */}
      {showShareMenu && (
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
                    option.action();
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
                  copyToClipboard();
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
      {(loading || loadingStats) && (
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

      {/* Back Button */}
      <Button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Link Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Link Card */}
          <Card className="border-0 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10"></div>
            <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Link Details</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Title</label>
                <h1 className="text-2xl md:text-3xl font-bold text-white break-words leading-tight hover:text-purple-400 transition-colors duration-200 cursor-pointer">
                  {url?.title}
                </h1>
              </div>

              {/* Short URL */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Short URL</label>
                <a
                  href={`${window.location.origin}/${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg md:text-xl font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 break-all inline-flex items-center gap-2 group"
                >
                  {window.location.host}/{link}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </div>

              {/* Original URL */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Original URL</label>
                <a
                  href={url?.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 break-all inline-flex items-center gap-2 group"
                >
                  <LinkIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{url?.original_url}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                </a>
              </div>

              {/* Created Date */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Created</label>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(url?.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <Button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white transition-all duration-300 hover:scale-105"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleNativeShare}
                  className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-white transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border border-cyan-500/30 text-white transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => fnDelete().then(() => {
                    // fetchUrls();
                    navigate("/dashboard");
                  })}
                  disabled={loadingDelete}
                  className="bg-gradient-to-r from-red-600/20 to-red-600/20 hover:from-red-600/30 hover:to-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingDelete ? (
                    <BeatLoader size={12} color="#ffffff" />
                  ) : (
                    <>
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card className="border-0 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-white">QR Code</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={url?.qr}
                  className="relative w-full max-w-sm mx-auto rounded-xl border border-white/20 bg-white p-4"
                  alt="QR Code"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
                    <p className="text-gray-300">Comprehensive insights for your link</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl border border-white/20">
                  <span className="text-lg font-semibold text-white">{stats?.length || 0} Total Clicks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Content */}
          {stats && stats.length ? (
            <div className="space-y-6">
              {/* Enhanced Total Clicks Card */}
              <Card className="border-0 bg-white/10 backdrop-blur-xl border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <MousePointer className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">Click Performance</CardTitle>
                        <p className="text-gray-300">Total engagement metrics</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-4xl font-bold text-white mb-2">{stats?.length}</div>
                      <div className="text-sm text-gray-300 uppercase tracking-wide">Total Clicks</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-4xl font-bold text-cyan-400 mb-2">
                        {Math.round((stats?.length || 0) / Math.max(1, Math.ceil((new Date() - new Date(url?.created_at)) / (1000 * 60 * 60 * 24))))}
                      </div>
                      <div className="text-sm text-gray-300 uppercase tracking-wide">Avg. Daily Clicks</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="text-4xl font-bold text-purple-400 mb-2">
                        {new Set(stats?.map(stat => stat.ip)).size || 0}
                      </div>
                      <div className="text-sm text-gray-300 uppercase tracking-wide">Unique Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Location Data */}
              <Card className="border-0 bg-white/10 backdrop-blur-xl border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">Geographic Distribution</CardTitle>
                      <p className="text-gray-300">Where your clicks are coming from</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <Location stats={stats} />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Device Info */}
              <Card className="border-0 bg-white/10 backdrop-blur-xl border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 rounded border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">Device & Browser Analytics</CardTitle>
                      <p className="text-gray-300">Technology preferences of your audience</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <DeviceStats stats={stats} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-0 bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="relative z-10">
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-500/20 to-gray-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {loadingStats ? "Loading Analytics..." : "No Analytics Data Yet"}
                  </h3>
                  <p className="text-gray-300 text-lg max-w-md mx-auto">
                    {loadingStats 
                      ? "Please wait while we gather your analytics data..."
                      : "Share your link to start collecting detailed analytics including location, device, and engagement metrics!"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkPage;