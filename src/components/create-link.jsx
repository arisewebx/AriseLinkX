import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/context";
import {QRCode} from "react-qrcode-logo";
import {Plus, Link2, Sparkles, Globe, Zap, Check} from "lucide-react";

const CreateLink = () => {
  const {user} = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  // Add state to store the shortened URL
  const [shortUrl, setShortUrl] = useState("");

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues, user_id: user.id});

  useEffect(() => {
    if (error === null && data) {
      // Generate the shortened URL when data is available
      const baseUrl = window.location.origin;
      const generatedShortUrl = formValues.customUrl 
        ? `${baseUrl}/${formValues.customUrl}`
        : `${baseUrl}/${data[0].short_url || data[0].id}`;
      
      setShortUrl(generatedShortUrl);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(`/link/${data[0].id}`);
      }, 1500);
    }
  }, [error, data, formValues.customUrl]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, {abortEarly: false});

      // Generate QR code with shortened URL if available, otherwise use long URL
      const qrValue = shortUrl || formValues.longUrl;
      
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  // Generate preview short URL for QR code
  const getQRValue = () => {
    if (shortUrl) {
      return shortUrl; // Use actual shortened URL if available
    }
    
    if (formValues.longUrl) {
      // Generate preview shortened URL
      const baseUrl = window.location.origin;
      return formValues.customUrl 
        ? `${baseUrl}/${formValues.customUrl}`
        : `${baseUrl}/preview`;
    }
    
    return formValues.longUrl;
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParams({});
          setShowSuccess(false);
          setShortUrl(""); // Reset short URL when dialog closes
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40">
          <Plus className="w-4 h-4 mr-2" />
          Create New Link
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white">
        {/* Success State */}
        {showSuccess && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Link Created!</h3>
              <p className="text-gray-300 text-sm">Redirecting...</p>
            </div>
          </div>
        )}

        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Create New Link
              </DialogTitle>
              <p className="text-gray-300 text-xs">
                Transform your URL into a powerful short link
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Preview */}
          {formValues?.longUrl && (
            <div className="flex justify-center">
              <div className="relative bg-white rounded-lg p-2 border border-white/20 inline-block">
                <QRCode 
                  ref={ref} 
                  size={120} 
                  value={getQRValue()} // Use the shortened URL or preview
                  logoWidth={24}
                  logoHeight={24}
                />
                {/* Show what URL the QR code represents */}
                <p className="text-xs text-gray-600 mt-1 text-center max-w-[120px] truncate">
                  {shortUrl ? shortUrl : (formValues.customUrl ? `${window.location.host}/${formValues.customUrl}` : `${window.location.host}/...`)}
                </p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Title Input */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">
                Link Title
              </label>
              <Input
                id="title"
                placeholder="Enter title..."
                value={formValues.title}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500/50 h-9"
              />
              {errors.title && <Error message={errors.title} />}
            </div>

            {/* Long URL Input */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">
                Original URL
              </label>
              <Input
                id="longUrl"
                placeholder="https://example.com/your-url..."
                value={formValues.longUrl}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-cyan-500/50 h-9"
              />
              {errors.longUrl && <Error message={errors.longUrl} />}
            </div>

            {/* Custom URL Input */}
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">
                Custom URL (Optional)
              </label>
              <div className="flex items-center gap-2">
                <Card className="bg-white/5 border-white/10 px-2 py-1.5 text-cyan-400 text-xs font-medium">
                  {window.location.host}/
                </Card>
                <Input
                  id="customUrl"
                  placeholder="custom-link"
                  value={formValues.customUrl}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-green-500/50 h-9"
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Error message={error.message} />
            </div>
          )}

          {/* Features Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Shortlinktics Features:
            </h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                Analytics & tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                Custom QR codes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                Device insights
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium py-2 h-9 transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <BeatLoader size={12} color="white" />
                <span className="text-sm">Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Create Link</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;