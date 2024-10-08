import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../firebaseConfig"; 
const auth = getAuth(firebaseApp);

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="auth">
      <div className="auth auth--choice">
        <button className="auth auth--choice--button" disabled={isSignUp} onClick={() => setIsSignUp(true)}>Sign Up</button>
        <button className="auth auth--choice--button" disabled={!isSignUp} onClick={() => setIsSignUp(false)}>Sign In</button>
      </div>

      {isSignUp ? (
        <div className="auth auth--inputs">
          <h2>Sign Up</h2>
          <input className="auth auth--inputs--input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="auth auth--inputs--input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="auth auth--inputs--button" onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div className="auth auth--inputs">
          <h2>Sign In</h2>
          <input className="auth auth--inputs--input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="auth auth--inputs--input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="auth auth--inputs--button" onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
}
