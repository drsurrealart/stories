import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "@/routes/AppRoutes";

function App() {
  useEffect(() => {
    // Any necessary side effects can be handled here
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
