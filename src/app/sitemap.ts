import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/about", "/journal"].map(path=>({url:`https://krasyinspire.com${path}`})); }
