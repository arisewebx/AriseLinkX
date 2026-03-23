import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import CubeLoader from "@/components/cube-loader";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, id);
  const {fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      // Fire analytics in background — don't wait for it
      fnStats();
      // Redirect immediately
      window.location.href = data.original_url;
    }
  }, [loading]);

  return <CubeLoader />;
};

export default RedirectLink;
