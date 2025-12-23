import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

type LoginBtnProps = {
  setIsLoggedIn: () => void;
};

function LoginBtn({ setIsLoggedIn }: LoginBtnProps) {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      handleLogin(credentialResponse.access_token);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  async function handleLogin(jwt: string) {
    const res = await fetch("http://localhost:3000/api/user/login/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: jwt }),
    });
    const message = await res.json();
    if (message.username) {
      sessionStorage.setItem("subtrack-user", JSON.stringify(message));
      setIsLoggedIn();
    }
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
