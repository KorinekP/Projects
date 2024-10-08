import AuthForm from "../components/AuthForm";
import "../app/globals.css";
export default function Home() {
  return (
    <div className="background">
    <div className="body">
      <h1>Star wars character info</h1>
      <AuthForm />
    </div>
    </div>
  );
}