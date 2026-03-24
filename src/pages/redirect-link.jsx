import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CubeLoader from "@/components/cube-loader";
import { Navigation, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();
  const {loading, data, fn} = useFetch(getLongUrl, id);
  const [askingLocation, setAskingLocation] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      if (data.track_location) {
        setAskingLocation(true);
      } else {
        // Let storeClicks wait for completion and redirect automatically
        storeClicks({
          id: data.id,
          originalUrl: data.original_url,
        });
      }
    }
  }, [loading, data]);

  const handleLocationAllow = () => {
    setFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          storeClicks({
            id: data.id,
            originalUrl: data.original_url,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error:", error);
          // Fallback to IP if they deny or it fails
          storeClicks({ id: data.id, originalUrl: data.original_url });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      storeClicks({ id: data.id, originalUrl: data.original_url });
    }
  };

  if (loading || (!data && !askingLocation)) {
    return <CubeLoader />;
  }

  if (askingLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-sm w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 border-2 border-orange-200 rounded-full animate-ping opacity-20"></div>
            <Navigation className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
            We need a quick location check to verify your region and securely route you to your destination.
          </p>
          
          <Button 
            onClick={handleLocationAllow} 
            disabled={fetchingLocation}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-[15px] font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {fetchingLocation ? (
              <span className="flex items-center gap-2">
                <BeatLoader size={6} color="white" /> Checking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue to Link <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
          
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure & Private Routing</span>
          </div>
        </div>
      </div>
    );
  }

  return <CubeLoader />;
};

export default RedirectLink;
