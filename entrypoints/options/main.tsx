import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { OptionsApp } from "./App";
import "tailwindcss/tailwind.css";

const root = createRoot(document.getElementById("root")!);
root.render(
	<Suspense fallback={<p>Loading from storage...</p>}>
		<OptionsApp />
	</Suspense>,
);
