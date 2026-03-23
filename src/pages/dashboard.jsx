import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { Link2, MousePointer, TrendingUp, Plus, Search, Check, Share2, MessageCircle, Mail, Twitter, Facebook, Download, Copy, BarChart3, Smartphone, Trophy, ExternalLink } from 'lucide-react';
import ClicksChart from '@/components/clicks-chart';
import DeviceStats from '@/components/device-stats';
import { Button } from '@/components/ui/button';
import Error from '@/components/error';
import useFetch from '@/hooks/use-fetch';
import { UrlState } from '@/context';
import { getUrls } from '@/db/apiUrls';
import { getClicksForUrls } from '@/db/apiClicks';
import { Input } from '@/components/ui/input';
import LinkCard from '@/components/link-card';
import CreateLink from '@/components/create-link';

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls, urls?.map((url) => url.id));

  useEffect(() => { fnUrls(); }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedUrls = filteredUrls?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const totalPages = Math.ceil((sortedUrls?.length || 0) / ITEMS_PER_PAGE);
  const paginatedUrls = sortedUrls?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Top performing links: join clicks → urls, sort by count
  const topLinks = urls
    ?.map((url) => ({
      ...url,
      clickCount: clicks?.filter((c) => c.url_id === url.id).length || 0,
    }))
    .filter((u) => u.clickCount > 0)
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 5) || [];

  const maxClicks = topLinks[0]?.clickCount || 1;

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const totalClicks = clicks?.length || 0;
  const averageClicks = urls?.length ? Math.round(totalClicks / urls.length) : 0;
  const recentUrls = urls?.filter(url => {
    const created = new Date(url.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length || 0;

  const copyToClipboard = async (url) => {
    try {
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      await navigator.clipboard.writeText(`${window.location.origin}/${link}`);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
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

  const downloadQRCode = async (url) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400;
      canvas.height = 500;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
        qrImage.src = url?.qr;
      });
      const qrSize = 300;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 60;
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AriseLinkX', canvas.width / 2, 40);
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText(window.location.host, canvas.width / 2, 55);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      const linkTitle = url?.title || 'AriseLinkX Short URL';
      const maxWidth = canvas.width - 40;
      const words = linkTitle.split(' ');
      let line = '';
      let y = qrY + qrSize + 40;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      ctx.fillStyle = '#f97316';
      ctx.font = '16px Arial, sans-serif';
      ctx.fillText(`${window.location.origin}/${link}`, canvas.width / 2, y + 30);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial, sans-serif';
      ctx.fillText('Scan to visit • Powered by AriseLinkX', canvas.width / 2, canvas.height - 20);
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
      const anchor = document.createElement('a');
      anchor.href = url?.qr;
      anchor.download = `${url?.title || 'qr-code'}-qr-code.png`;
      anchor.click();
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp', icon: MessageCircle,
      action: (url) => {
        if (url === 'bulk') {
          const allLinks = sortedUrls.map(u => { const l = u?.custom_url || u.short_url; return `${u.title}: ${window.location.origin}/${l}`; }).join('\n\n');
          window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my ${sortedUrls.length} links:\n\n${allLinks}`)}`, '_blank');
        } else {
          const link = url?.custom_url || url.short_url;
          window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this link: ${url?.title}\n${window.location.origin}/${link}`)}`, '_blank');
        }
      }
    },
    {
      name: 'Twitter', icon: Twitter,
      action: (url) => {
        if (url === 'bulk') {
          const links = sortedUrls.slice(0, 3).map(u => { const l = u?.custom_url || u.short_url; return `${u.title}: ${window.location.origin}/${l}`; }).join('\n');
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my links:\n${links}`)}`, '_blank');
        } else {
          const link = url?.custom_url || url.short_url;
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: ${url?.title}`)}&url=${encodeURIComponent(`${window.location.origin}/${link}`)}`, '_blank');
        }
      }
    },
    {
      name: 'Facebook', icon: Facebook,
      action: (url) => {
        if (url === 'bulk') {
          const first = sortedUrls[0];
          const link = first?.custom_url || first.short_url;
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/${link}`)}`, '_blank');
        } else {
          const link = url?.custom_url || url.short_url;
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/${link}`)}`, '_blank');
        }
      }
    },
    {
      name: 'Email', icon: Mail,
      action: (url) => {
        if (url === 'bulk') {
          const allLinks = sortedUrls.map(u => { const l = u?.custom_url || u.short_url; return `${u.title}\n${window.location.origin}/${l}`; }).join('\n\n---\n\n');
          window.open(`mailto:?subject=${encodeURIComponent(`My ${sortedUrls.length} Links`)}&body=${encodeURIComponent(allLinks)}`);
        } else {
          const link = url?.custom_url || url.short_url;
          window.open(`mailto:?subject=${encodeURIComponent(`Check out: ${url?.title}`)}&body=${encodeURIComponent(`${window.location.origin}/${link}`)}`);
        }
      }
    },
  ];

  const handleNativeShare = async (url) => {
    const link = url?.custom_url ? url?.custom_url : url.short_url;
    if (navigator.share) {
      try {
        await navigator.share({ title: url?.title, url: `${window.location.origin}/${link}` });
      } catch {
        setSelectedUrl(url);
        setShowShareMenu(true);
      }
    } else {
      setSelectedUrl(url);
      setShowShareMenu(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Share Menu */}
      {showShareMenu && selectedUrl && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                {selectedUrl === 'bulk' ? `Share all links (${sortedUrls?.length})` : 'Share link'}
              </h3>
              <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  onClick={() => { option.action(selectedUrl); setShowShareMenu(false); }}
                  variant="outline"
                  className="flex items-center gap-2 h-11 border-gray-200 text-gray-700 hover:bg-gray-50 justify-start px-3"
                >
                  <option.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{option.name}</span>
                </Button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              {selectedUrl !== 'bulk' && (
                <Button
                  onClick={() => { copyToClipboard(selectedUrl); setShowShareMenu(false); }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy link
                </Button>
              )}
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

      {(loading || loadingClicks) && <BarLoader width="100%" color="#f97316" height={2} className="rounded" />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {user?.user_metadata?.name || 'there'}
          </p>
        </div>
        <CreateLink />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Links", value: urls?.length || 0, icon: Link2 },
          { title: "Total Clicks", value: totalClicks, icon: MousePointer },
          { title: "Avg. Clicks", value: averageClicks, icon: TrendingUp },
          { title: "This Week", value: recentUrls, icon: Plus },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {clicks && clicks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Clicks over time */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Clicks over time</p>
                <p className="text-xs text-gray-400">All links combined</p>
              </div>
            </div>
            <ClicksChart stats={clicks} />
          </div>

          {/* Device breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Devices</p>
                <p className="text-xs text-gray-400">{clicks.length} total clicks</p>
              </div>
            </div>
            <DeviceStats stats={clicks} />
          </div>
        </div>
      )}

      {/* Top Performing Links */}
      {topLinks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Top performing links</p>
              <p className="text-xs text-gray-400">Ranked by total clicks</p>
            </div>
          </div>
          <div className="space-y-3">
            {topLinks.map((url, i) => {
              const shortLink = `${window.location.origin}/${url.custom_url || url.short_url}`;
              const pct = Math.round((url.clickCount / maxClicks) * 100);
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={url.id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center shrink-0">
                    {medals[i] || <span className="text-xs font-bold text-gray-400">#{i + 1}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[60%]">{url.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-orange-500">{url.clickCount} clicks</span>
                        <a href={shortLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-orange-500 transition-colors" />
                        </a>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{shortLink}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bulk Actions</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => urls?.length && urls.forEach(url => downloadQRCode(url))}
            disabled={!urls?.length}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download All QR Codes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (urls?.length) {
                const allLinks = urls.map(url => {
                  const link = url?.custom_url || url.short_url;
                  return `${url.title}: ${window.location.origin}/${link}`;
                }).join('\n');
                navigator.clipboard.writeText(allLinks).then(() => {
                  setShowCopySuccess(true);
                  setTimeout(() => setShowCopySuccess(false), 2000);
                });
              }
            }}
            disabled={!urls?.length}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8 text-xs"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy All Links
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (urls?.length) { setSelectedUrl('bulk'); setShowShareMenu(true); }
            }}
            disabled={!urls?.length}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 h-8 text-xs"
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Bulk Share
          </Button>
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 border-gray-200 focus-visible:ring-orange-400 bg-white h-9 text-sm"
            />
          </div>
          <span className="text-sm text-gray-400 shrink-0">{sortedUrls?.length || 0} links</span>
        </div>

        {error && <Error message={error?.message} />}

        {paginatedUrls && paginatedUrls.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedUrls.map((url, i) => (
                <LinkCard
                  key={url.id || i}
                  url={url}
                  fetchUrls={fnUrls}
                  onCopy={() => copyToClipboard(url)}
                  onShare={() => handleNativeShare(url)}
                  onDownload={() => downloadQRCode(url)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedUrls.length)} of {sortedUrls.length} links
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 h-8 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                            currentPage === p
                              ? 'bg-orange-500 border-orange-500 text-white font-medium'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 h-8 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {searchQuery ? "No links found" : "No links yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery
                ? `No links match "${searchQuery}"`
                : "Create your first short link to get started"}
            </p>
            {!searchQuery && <CreateLink />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
