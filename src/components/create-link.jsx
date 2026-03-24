import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";
import { Plus, Check } from "lucide-react";

const CreateLink = () => {
  const { user } = UrlState();
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
    high_accuracy: false,
  });
  const [shortUrl, setShortUrl] = useState("");

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      const baseUrl = window.location.origin;
      const generatedShortUrl = formValues.customUrl
        ? `${baseUrl}/${formValues.customUrl}`
        : `${baseUrl}/${data[0].short_url || data[0].id}`;
      setShortUrl(generatedShortUrl);
      setShowSuccess(true);
      setTimeout(() => { navigate(`/link/${data[0].id}`); }, 1500);
    }
  }, [error, data, formValues.customUrl]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });
      const qrValue = shortUrl || formValues.longUrl;
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => { newErrors[err.path] = err.message; });
      setErrors(newErrors);
    }
  };

  const getQRValue = () => {
    if (shortUrl) return shortUrl;
    if (formValues.longUrl) {
      const baseUrl = window.location.origin;
      return formValues.customUrl ? `${baseUrl}/${formValues.customUrl}` : `${baseUrl}/preview`;
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
          setShortUrl("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium h-9 px-4 rounded-lg">
          <Plus className="w-4 h-4 mr-1.5" />
          New Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-gray-200 text-gray-900 rounded-2xl">
        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Link created!</h3>
              <p className="text-sm text-gray-500">Redirecting to analytics...</p>
            </div>
          </div>
        )}

        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Create new link
          </DialogTitle>
          <p className="text-sm text-gray-500">Shorten a URL and start tracking clicks</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Preview */}
          {formValues?.longUrl && (
            <div className="flex justify-center py-2">
              <div className="bg-white rounded-xl border border-gray-200 p-3 inline-block">
                <QRCode
                  ref={ref}
                  size={110}
                  value={getQRValue()}
                  logoWidth={22}
                  logoHeight={22}
                  fgColor="#1f2937"
                  eyeRadius={4}
                />
                <p className="text-xs text-gray-400 mt-2 text-center max-w-[110px] truncate">
                  {shortUrl || (formValues.customUrl ? `${window.location.host}/${formValues.customUrl}` : `${window.location.host}/...`)}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Link title</label>
              <Input
                id="title"
                placeholder="e.g. My portfolio site"
                value={formValues.title}
                onChange={handleChange}
                className="border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-orange-400 h-9 text-sm"
              />
              {errors.title && <Error message={errors.title} />}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Original URL</label>
              <Input
                id="longUrl"
                placeholder="https://example.com/your-long-url"
                value={formValues.longUrl}
                onChange={handleChange}
                className="border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-orange-400 h-9 text-sm"
              />
              {errors.longUrl && <Error message={errors.longUrl} />}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                Custom alias <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <Card className="bg-gray-50 border-gray-200 px-2.5 py-2 text-gray-500 text-xs font-medium shrink-0">
                  {window.location.host}/
                </Card>
                <Input
                  id="customUrl"
                  placeholder="my-custom-link"
                  value={formValues.customUrl}
                  onChange={handleChange}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 focus-visible:ring-orange-400 h-9 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50 mt-2">
              <div>
                <label className="text-xs font-medium text-gray-900 block mb-0.5">High Accuracy Tracking</label>
                <p className="text-[11px] text-gray-500">Ask visitors for precise GPS location before redirecting</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formValues.high_accuracy}
                  onChange={(e) => setFormValues({...formValues, high_accuracy: e.target.checked})}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <Error message={error.message} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={createNewLink}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-10 disabled:opacity-50"
          >
            {loading ? (
              <BeatLoader size={10} color="white" />
            ) : (
              "Create link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
