/* eslint-disable react/prop-types */
import { Copy, Download, LinkIcon, Trash, ExternalLink, Calendar, Share2, BarChart2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url = [], fetchUrls, onCopy, onShare, onDownload }) => {
  const navigate = useNavigate();
  const downloadImage = async () => {
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
    if (onDownload) onDownload(url);
  };

  const handleCopy = async () => {
    try {
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      await navigator.clipboard.writeText(`${window.location.origin}/${link}`);
      if (onCopy) onCopy(url);
    } catch (err) {
      const link = url?.custom_url ? url?.custom_url : url.short_url;
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/${link}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (onCopy) onCopy(url);
    }
  };

  const handleShare = () => { if (onShare) onShare(url); };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* QR Code */}
        <div className="shrink-0">
          <img
            src={url?.qr}
            className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-1"
            alt="QR Code"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{url?.title}</h3>
          <div className="flex items-center gap-1.5 mb-1">
            <ExternalLink className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="text-sm font-medium text-orange-500 truncate">
              {window.location.host}/{url?.custom_url ? url?.custom_url : url.short_url}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-3">
            <LinkIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500 truncate">{url?.original_url}</span>
          </div>

          {/* Bottom row: date + View Analytics */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date(url?.created_at).toLocaleDateString()}</span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/link/${url?.id}`)}
              className="h-7 px-3 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-medium text-xs rounded-lg shadow-none"
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
            title="Copy link"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadImage}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
            title="Download QR"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fnDelete().then(() => fetchUrls())}
            disabled={loadingDelete}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 disabled:opacity-50"
            title="Delete"
          >
            {loadingDelete ? <BeatLoader size={5} color="#ef4444" /> : <Trash className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
