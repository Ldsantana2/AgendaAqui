import { ReactNode, useState, useEffect } from "react";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  hasSideMenu?: boolean;
}

export default function MainLayout({
  children,
  className = "",
  hasSideMenu = false,
}: MainLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if we're on client-side before using window
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // Initial check
      checkIfMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);

      // Cleanup
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  // Listen for mobile menu state changes
  useEffect(() => {
    const handleMenuStateChange = (e: CustomEvent) => {
      setIsMobileMenuOpen(e.detail.isOpen);
    };

    // Add event listener for custom event
    window.addEventListener('mobileMenuStateChange' as any, handleMenuStateChange);

    // Cleanup
    return () => window.removeEventListener('mobileMenuStateChange' as any, handleMenuStateChange);
  }, []);

  return (
    <div className={`
      ${hasSideMenu 
        ? isMobile
          ? isMobileMenuOpen
            ? 'min-h-[calc(100vh-120px)] pl-64 transition-all duration-300' // Mobile with open menu
            : 'min-h-[calc(100vh-120px)] pl-0 transition-all duration-300'  // Mobile with closed menu
          : 'min-h-[calc(100vh-120px)] pl-14 transition-all duration-300'   // Desktop with menu
        : 'min-h-[calc(100vh-65px-120px)]'                                  // No side menu
      } 
      w-full 
      ${className}
    `}>
      {children}
    </div>
  );
}
