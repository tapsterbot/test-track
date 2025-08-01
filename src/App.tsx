import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ButtonDemo from "./pages/ButtonDemo";
import TextInputDemo from "./pages/TextInputDemo";
import LoginDemo from "./pages/LoginDemo";
import DropdownDemo from "./pages/DropdownDemo";
import CheckboxRadioDemo from "./pages/CheckboxRadioDemo";
import TableDemo from "./pages/TableDemo";
import ModalDemo from "./pages/ModalDemo";
import AlertDemo from "./pages/AlertDemo";
import FileUploadDemo from "./pages/FileUploadDemo";
import DragDropDemo from "./pages/DragDropDemo";
import FramesDemo from "./pages/FramesDemo";
import DynamicDemo from "./pages/DynamicDemo";
import CanvasDemo from "./pages/CanvasDemo";
import MultiWindowDemo from "./pages/MultiWindowDemo";
import AdvancedButtonDemo from "./pages/AdvancedButtonDemo";
import CommsTarget from "./pages/CommsTarget";
import VehicleSimulator from "./pages/VehicleSimulator";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/button-demo" element={<ButtonDemo />} />
          <Route path="/text-input-demo" element={<TextInputDemo />} />
          <Route path="/login-demo" element={<LoginDemo />} />
          <Route path="/dropdown-demo" element={<DropdownDemo />} />
          <Route path="/checkbox-radio-demo" element={<CheckboxRadioDemo />} />
          <Route path="/table-demo" element={<TableDemo />} />
          <Route path="/modal-demo" element={<ModalDemo />} />
          <Route path="/alert-demo" element={<AlertDemo />} />
          <Route path="/file-upload-demo" element={<FileUploadDemo />} />
          <Route path="/drag-drop-demo" element={<DragDropDemo />} />
          <Route path="/frames-demo" element={<FramesDemo />} />
          <Route path="/dynamic-demo" element={<DynamicDemo />} />
          <Route path="/canvas-demo" element={<CanvasDemo />} />
          <Route path="/multi-window-demo" element={<MultiWindowDemo />} />
          <Route path="/advanced-button-demo" element={<AdvancedButtonDemo />} />
          <Route path="/vehicle-simulator" element={<VehicleSimulator />} />
            <Route path="/comms-target" element={<CommsTarget />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
