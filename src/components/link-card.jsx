/* eslint-disable react/prop-types */
import {Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, Eye, Share2} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";

const LinkCard = ({url = [], fetchUrls, onCopy, onShare, onDownload}) => {
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

    // Call parent component's download handler if provided
    if (onDownload) {
      onDownload(url);
    }
  };

  const handleCopy = async () => {
    try {
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      await navigator.clipboard.writeText(`${window.location.origin}/${link}`);
      
      // Call parent component's copy handler if provided
      if (onCopy) {
        onCopy(url);
      }
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
      
      if (onCopy) {
        onCopy(url);
      }
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(url);
    }
  };

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url.id);

  return (
    <div className="group relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Main Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* QR Code Section */}
          <div className="flex-shrink-0">
            <div className="relative group/qr">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300"></div>
              <img
                src={url?.qr}
                className="relative w-32 h-32 object-contain rounded-xl border border-white/20 bg-white p-2"
                alt="QR Code"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <Link to={`/link/${url?.id}`} className="block group/link">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover/link:text-purple-400 transition-colors duration-200 truncate">
                {url?.title}
              </h3>

              {/* Short URL */}
              <div className="flex items-center gap-2 mb-3 group/url">
                <span className="text-lg font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 break-all">
                  {window.location.host}/{url?.custom_url ? url?.custom_url : url.short_url}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover/url:opacity-100 transition-opacity duration-200 flex-shrink-0" />
              </div>

              {/* Original URL */}
              <div className="flex items-center gap-2 mb-4 group/original">
                <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 hover:text-white transition-colors duration-200 text-sm truncate">
                  {url?.original_url}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover/original:opacity-100 transition-opacity duration-200 flex-shrink-0" />
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(url?.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>View Analytics</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-col gap-2 flex-wrap lg:flex-nowrap">
            <Button
              onClick={handleCopy}
              className="flex-1 lg:flex-none bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Copy</span>
            </Button>

            <Button
              onClick={handleShare}
              className="flex-1 lg:flex-none bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 text-white transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Share</span>
            </Button>

            <Button
              onClick={downloadImage}
              className="flex-1 lg:flex-none bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border border-cyan-500/30 text-white transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Download</span>
            </Button>

            <Button
              onClick={() => fnDelete().then(() => fetchUrls())}
              disabled={loadingDelete}
              className="flex-1 lg:flex-none bg-gradient-to-r from-red-600/20 to-red-600/20 hover:from-red-600/30 hover:to-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              size="sm"
            >
              {loadingDelete ? (
                <BeatLoader size={12} color="#ffffff" />
              ) : (
                <>
                  <Trash className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Delete</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Hover Indicator */}
        <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default LinkCard;