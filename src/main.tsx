import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserAuthProvider } from "@/context/UserAuthContext";

createRoot(document.getElementById("root")!).render(
	<UserAuthProvider>
		<App />
	</UserAuthProvider>
);
