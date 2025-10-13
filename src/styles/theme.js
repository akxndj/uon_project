const colors = {
  primary: "#002664", // UoN navy
  secondary: "#FFB81C", // UoN gold
  neutral100: "#F8FAFC",
  neutral200: "#E4E8EE",
  neutral400: "#94A3B8",
  neutral600: "#475569",
  neutral800: "#1E293B",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#0284C7",
};

const typography = {
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
};

const shadows = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.08)",
  md: "0 4px 12px rgba(15, 23, 42, 0.12)",
  lg: "0 12px 32px rgba(15, 23, 42, 0.18)",
};

const theme = {
  colors,
  typography,
  spacing,
  shadows,
  radii: {
    sm: "6px",
    md: "12px",
    pill: "9999px",
  },
  layout: {
    containerWidth: "1100px",
    gutter: "1.5rem",
  },
};

export default theme;
