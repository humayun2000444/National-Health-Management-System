"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BrandingColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface BrandingContextType {
  colors: BrandingColors;
  isLoading: boolean;
}

const defaultColors: BrandingColors = {
  primaryColor: "#0d9488", // teal-600
  secondaryColor: "#059669", // emerald-600
  accentColor: "#f59e0b", // amber-500
};

const BrandingContext = createContext<BrandingContextType>({
  colors: defaultColors,
  isLoading: true,
});

export function useBranding() {
  return useContext(BrandingContext);
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper to lighten a color
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amt = Math.round(2.55 * percent);

  const newR = Math.min(255, r + amt);
  const newG = Math.min(255, g + amt);
  const newB = Math.min(255, b + amt);

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

// Helper to darken a color
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const amt = Math.round(2.55 * percent);

  const newR = Math.max(0, r - amt);
  const newG = Math.max(0, g - amt);
  const newB = Math.max(0, b - amt);

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<BrandingColors>(defaultColors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await fetch("/api/public/hospital");
        if (response.ok) {
          const data = await response.json();
          if (data.primaryColor || data.secondaryColor || data.accentColor) {
            setColors({
              primaryColor: data.primaryColor || defaultColors.primaryColor,
              secondaryColor: data.secondaryColor || defaultColors.secondaryColor,
              accentColor: data.accentColor || defaultColors.accentColor,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch branding:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranding();
  }, []);

  // Apply CSS custom properties to the document
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const { primaryColor, secondaryColor, accentColor } = colors;

      // Primary color variations
      root.style.setProperty("--color-primary", primaryColor);
      root.style.setProperty("--color-primary-light", lightenColor(primaryColor, 40));
      root.style.setProperty("--color-primary-lighter", lightenColor(primaryColor, 60));
      root.style.setProperty("--color-primary-dark", darkenColor(primaryColor, 10));
      root.style.setProperty("--color-primary-darker", darkenColor(primaryColor, 20));

      // Secondary color variations
      root.style.setProperty("--color-secondary", secondaryColor);
      root.style.setProperty("--color-secondary-light", lightenColor(secondaryColor, 40));
      root.style.setProperty("--color-secondary-lighter", lightenColor(secondaryColor, 60));
      root.style.setProperty("--color-secondary-dark", darkenColor(secondaryColor, 10));

      // Accent color variations
      root.style.setProperty("--color-accent", accentColor);
      root.style.setProperty("--color-accent-light", lightenColor(accentColor, 40));
      root.style.setProperty("--color-accent-lighter", lightenColor(accentColor, 60));

      // RGB values for use with opacity
      const primaryRgb = hexToRgb(primaryColor);
      const secondaryRgb = hexToRgb(secondaryColor);
      const accentRgb = hexToRgb(accentColor);

      if (primaryRgb) {
        root.style.setProperty("--color-primary-rgb", `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
      }
      if (secondaryRgb) {
        root.style.setProperty("--color-secondary-rgb", `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
      }
      if (accentRgb) {
        root.style.setProperty("--color-accent-rgb", `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
      }
    }
  }, [colors]);

  return (
    <BrandingContext.Provider value={{ colors, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
}
