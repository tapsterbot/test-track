import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  // Check if fullscreen is available
  const isAvailable = useCallback(() => {
    return !!(
      document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
    );
  }, []);

  // Enter fullscreen mode
  const enterFullscreen = useCallback(async () => {
    if (!isAvailable()) {
      toast({
        title: "Fullscreen not available",
        description: "Your browser doesn't support fullscreen mode",
        variant: "destructive",
      });
      return false;
    }

    try {
      const element = document.documentElement;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }

      return true;
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast({
        title: "Fullscreen error",
        description: "Failed to enter fullscreen mode",
        variant: "destructive",
      });
      return false;
    }
  }, [isAvailable, toast]);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }

      return true;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      toast({
        title: "Fullscreen error",
        description: "Failed to exit fullscreen mode",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      return await exitFullscreen();
    } else {
      return await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Check current fullscreen state
  const checkFullscreenState = useCallback(() => {
    const fullscreenElement = 
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;
    
    // Simply check if any element is in fullscreen mode
    setIsFullscreen(!!fullscreenElement);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(event => {
      document.addEventListener(event, checkFullscreenState);
    });

    // Initial check
    checkFullscreenState();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, checkFullscreenState);
      });
    };
  }, [checkFullscreenState]);

  // Removed F key shortcut to prevent conflicts

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isAvailable: isAvailable()
  };
}