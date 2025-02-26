import { GoogleAnalytics } from "@next/third-parties/google";

const Analytics = () => {
  if (!process.env.GOOGLE_ANALYTICS_ID) {
    return null;
  }
  return <GoogleAnalytics gaId="G-1BJKFRMP12" />;
};

export default Analytics;
