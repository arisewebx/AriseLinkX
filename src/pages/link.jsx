import DeviceStats from "@/components/device-stats";
import ClicksChart from "@/components/clicks-chart";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UrlState} from "@/context";
import {getClicksForUrl, validateLocationAccuracy, deleteClick} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, BarChart3, MousePointer, QrCode, ArrowLeft, Check, Share2, MessageCircle, Mail, Twitter, Facebook} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";

const LinkPage = () => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [deletingClickId, setDeletingClickId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AriseLinkX', canvas.width / 2, 40);

      // Add subtitle
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Short links, big results', canvas.width / 2, 58);
      
      // Add link title below QR code
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      
      // Wrap text if too long
      const linkTitle = url?.title || 'AriseLinkX Short URL';
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
      ctx.fillStyle = '#f97316';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText(`${window.location.origin}/${link}`, canvas.width / 2, y + 30);
      
      // Add footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Scan to visit • Powered by AriseLinkX', canvas.width / 2, canvas.height - 20);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `${url?.title || 'AriseLinkX'}-qr-code.png`;
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

  const confirmDeleteClick = (clickId) => {
    if (!clickId) {
      alert("Error: Cannot delete this click (No ID found).");
      return;
    }
    setDeleteConfirmId(clickId);
  };

  const executeDeleteClick = async () => {
    const clickId = deleteConfirmId;
    if (!clickId) return;
    
    setDeleteConfirmId(null);
    setDeletingClickId(clickId);
    
    try {
      await deleteClick(clickId);
      await fnStats(); // refresh stats immediately
    } catch (error) {
      console.error("Failed to delete click:", error);
      alert("Failed to delete click. Please try again.");
    } finally {
      setDeletingClickId(null);
    }
  };

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Share Menu */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">Share link</h3>
              <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">×</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <Button key={option.name} onClick={() => { option.action(); setShowShareMenu(false); }} variant="outline" className="flex items-center gap-2 h-11 border-gray-200 text-gray-700 hover:bg-gray-50 justify-start px-3">
                  <option.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{option.name}</span>
                </Button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button onClick={() => { copyToClipboard(); setShowShareMenu(false); }} className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10">
                <Copy className="w-4 h-4 mr-2" />Copy link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Click</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this click record? This action cannot be undone and will permanently remove it from your analytics.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmId(null)}
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={executeDeleteClick}
                className="bg-red-600 hover:bg-red-700 text-white flex-1 border-0"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {showCopySuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gray-900 text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" />
            Copied to clipboard
          </div>
        </div>
      )}

      {(loading || loadingStats) && <BarLoader width="100%" color="#f97316" height={2} />}

      {/* Back */}
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 -ml-2 h-9">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Link Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Link Details</h2>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Title</p>
              <h1 className="text-xl font-bold text-gray-900 break-words leading-snug">{url?.title}</h1>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Short URL</p>
              <a href={`${window.location.origin}/${link}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-orange-500 hover:text-orange-600 break-all inline-flex items-center gap-1.5 group">
                {window.location.host}/{link}
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Original URL</p>
              <a href={url?.original_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900 break-all inline-flex items-start gap-1.5 group">
                <LinkIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                <span className="break-all">{url?.original_url}</span>
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Created</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{new Date(url?.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-gray-200 text-gray-700 hover:bg-gray-50 h-9">
                <Copy className="w-3.5 h-3.5 mr-1.5" />Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleNativeShare} className="border-gray-200 text-gray-700 hover:bg-gray-50 h-9">
                <Share2 className="w-3.5 h-3.5 mr-1.5" />Share
              </Button>
              <Button variant="outline" size="sm" onClick={downloadImage} className="border-gray-200 text-gray-700 hover:bg-gray-50 h-9">
                <Download className="w-3.5 h-3.5 mr-1.5" />Download
              </Button>
              <Button variant="outline" size="sm" onClick={() => fnDelete().then(() => navigate("/dashboard"))} disabled={loadingDelete} className="border-red-200 text-red-500 hover:bg-red-50 h-9 disabled:opacity-50">
                {loadingDelete ? <BeatLoader size={8} color="#ef4444" /> : <><Trash className="w-3.5 h-3.5 mr-1.5" />Delete</>}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">QR Code</h2>
            </div>
            <img src={url?.qr} className="w-full max-w-[200px] mx-auto rounded-xl border border-gray-200 bg-white p-3" alt="QR Code" />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats?.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10).map((click, index) => {
                const now = new Date();
                const clickTime = new Date(click.created_at);
                const diffMs = now - clickTime;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);
                const timeAgo = diffDays > 0 ? `${diffDays}d ago` : diffHours > 0 ? `${diffHours}h ago` : diffMins > 0 ? `${diffMins}m ago` : 'Just now';
                const accuracy = validateLocationAccuracy(click.country, click.timezone);

                return (
                  <div key={`click-${click.id || index}-${click.created_at}`} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                        {click.device?.charAt(0)?.toUpperCase() || 'D'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {click.city && click.city !== 'Unknown' ? click.city : 'Unknown'}{click.country && click.country !== 'Unknown' ? `, ${click.country}` : ''}
                        </p>
                        <p className="text-xs text-gray-400">
                          {click.device || 'unknown'}
                          {accuracy === 'potential_vpn_proxy' && <span className="ml-1.5 text-amber-500">VPN?</span>}
                          {accuracy === 'likely_accurate' && <span className="ml-1.5 text-green-500">✓</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-700">{timeAgo}</p>
                        <p className="text-xs text-gray-400">{new Date(click.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <button 
                        onClick={() => confirmDeleteClick(click.id)}
                        disabled={deletingClickId === click.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        title="Delete click record"
                      >
                        {deletingClickId === click.id ? <BeatLoader size={4} color="#ef4444" /> : <Trash className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
              {(!stats || stats.length === 0) && (
                <div className="text-center py-8">
                  <Calendar className="w-7 h-7 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-400">No clicks yet</p>
                </div>
              )}
              {stats?.length > 10 && (
                <p className="text-xs text-gray-400 text-center pt-2">Latest 10 of {stats.length} total clicks</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Analytics Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Analytics</h2>
                <p className="text-xs text-gray-500">Insights for this link</p>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
              <span className="text-sm font-semibold text-orange-600">{stats?.length || 0} clicks</span>
            </div>
          </div>

          {stats && stats.length ? (
            <div className="space-y-4">
              {/* Click Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Clicks", value: stats?.length, color: "text-gray-900" },
                  {
                    label: "This Week",
                    value: (() => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return stats?.filter(s => new Date(s.created_at) >= weekAgo).length || 0;
                    })(),
                    color: "text-orange-500"
                  },
                  {
                    label: "Unique Visitors",
                    value: (() => {
                      const ips = new Set();
                      stats?.forEach(s => { const ip = s.ip_address || s.ip; if (ip && ip !== 'Unknown') ips.add(ip); });
                      return ips.size || 0;
                    })(),
                    color: "text-gray-900"
                  },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Clicks Over Time */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Clicks Over Time</h3>
                <p className="text-xs text-gray-500 mb-4">Day · Week · Month · Year trends</p>
                <ClicksChart stats={stats} />
              </div>

              {/* Geographic */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Top Locations</h3>
                    <p className="text-xs text-gray-500">Where your customers are from</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />Countries
                    <span className="w-2 h-2 rounded-full bg-orange-200 inline-block ml-2" />Cities
                  </div>
                </div>

                {(() => {
                  const countryCount = stats.reduce((acc, s) => {
                    const key = s.country && s.country !== 'Unknown' ? s.country : null;
                    if (key) acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {});
                  const cityCount = stats.reduce((acc, s) => {
                    const key = s.city && s.city !== 'Unknown' ? s.city : null;
                    if (key) acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {});

                  const topCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  const maxCountry = topCountries[0]?.[1] || 1;
                  const maxCity = topCities[0]?.[1] || 1;

                  return topCountries.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Countries */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">By Country</p>
                        <div className="space-y-2.5">
                          {topCountries.map(([name, count]) => (
                            <div key={name}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 truncate">{name}</span>
                                <span className="text-xs font-semibold text-gray-600 ml-2 shrink-0">{count} ({Math.round((count / stats.length) * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(count / maxCountry) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cities */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">By City</p>
                        <div className="space-y-2.5">
                          {topCities.length ? topCities.map(([name, count]) => (
                            <div key={name}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 truncate">{name}</span>
                                <span className="text-xs font-semibold text-gray-600 ml-2 shrink-0">{count} ({Math.round((count / stats.length) * 100)}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-orange-200 h-1.5 rounded-full" style={{ width: `${(count / maxCity) * 100}%` }} />
                              </div>
                            </div>
                          )) : <p className="text-sm text-gray-400">No city data</p>}
                        </div>
                      </div>
                    </div>
                  ) : <p className="text-sm text-gray-400">No location data yet</p>;
                })()}
              </div>

              {/* Device */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Device & Browser</h3>
                <p className="text-xs text-gray-500 mb-4">Technology breakdown of your audience</p>
                <DeviceStats stats={stats} />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {loadingStats ? "Loading analytics..." : "No data yet"}
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {loadingStats ? "Gathering your analytics data..." : "Share your link to start collecting click data."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkPage;