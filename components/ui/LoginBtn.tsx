import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

function LoginBtn() {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      handleLogin(credentialResponse.access_token);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  function handleLogin(jwt: string) {
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  }

  return (
    <div
      className="flex  justify-center px-5 py-3 rounded-lg bg-gray-900 text-white items-center text-lg cursor-pointer relative"
      onClick={() => login()}
    >
      <FcGoogle size={30} className="absolute left-5" />
      Sign in with Google
    </div>
  );
}

export default LoginBtn;
