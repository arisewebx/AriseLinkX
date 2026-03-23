import { useEffect, useState } from "react";
import Error from "./error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { Eye, EyeOff, User, Upload, UserPlus } from "lucide-react";

const DISPOSABLE_DOMAINS = [
  "mailinator.com","guerrillamail.com","tempmail.com","throwaway.email",
  "yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.info","guerrillamail.biz","guerrillamail.de","guerrillamail.net",
  "guerrillamail.org","spam4.me","trashmail.com","trashmail.me","trashmail.at",
  "dispostable.com","mailnull.com","spamgourmet.com","maildrop.cc",
  "getairmail.com","fakeinbox.com","tempinbox.com","discard.email",
  "spambox.us","mailexpire.com","mailscrap.com","spamfree24.org",
  "tempr.email","temp-mail.org","10minutemail.com","10minutemail.net",
  "minutemail.com","mailtemp.info","tempmailo.com","tmailinator.com",
  "throwam.com","emailondeck.com","getnada.com","mohmal.com",
];

const isDisposableEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
};

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilepic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
      setFormData((prevState) => ({ ...prevState, [name]: file }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required")
          .test("no-disposable", "Temporary/disposable emails are not allowed", (val) => !isDisposableEmail(val || "")),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profilepic: Yup.mixed().required("Profile picture is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => { newErrors[err.path] = err.message; });
        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="space-y-4">
      {error && <Error message={error?.message} />}

      {/* Profile Picture */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700 block">Profile picture</label>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {profilePreview ? (
              <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <label className="flex-1 relative cursor-pointer">
            <input
              name="profilepic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors text-sm">
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {formData.profilepic ? formData.profilepic.name : "Choose photo"}
              </span>
            </div>
          </label>
        </div>
        {errors.profilepic && <p className="text-xs text-red-500">{errors.profilepic}</p>}
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700 block">Full name</label>
        <Input
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`h-10 border-gray-200 focus-visible:ring-orange-400 ${errors.name ? "border-red-300" : ""}`}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700 block">Email address</label>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`h-10 border-gray-200 focus-visible:ring-orange-400 ${errors.email ? "border-red-300" : ""}`}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-700 block">Password</label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password (min. 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`h-10 border-gray-200 focus-visible:ring-orange-400 pr-10 ${errors.password ? "border-red-300" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSignup}
        disabled={loading}
        className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-60"
      >
        {loading ? (
          <BeatLoader size={6} color="#ffffff" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Create account</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default Signup;
