import Login from "@/components/login";
import Signup from "@/components/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link2 } from "lucide-react";
import { Link } from "react-router-dom";

function Auth() {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();
  const { isAuthenticated, loading } = UrlState();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AriseLinkX</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {longLink ? "Sign in to continue" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-500">
            {longLink
              ? "Sign in or create an account to shorten your link"
              : "Sign in to your account or create a new one"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-5 bg-gray-100 rounded-lg p-1 h-10">
              <TabsTrigger
                value="login"
                className="rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500"
              >
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <Login />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <Signup />
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-xs text-gray-400 text-center mt-5">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

export default Auth;
