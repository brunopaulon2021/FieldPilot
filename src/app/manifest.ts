import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FieldPilot",
    short_name: "FieldPilot",
    description: "Operações de assistência técnica no terreno.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8f7",
    theme_color: "#176b52",
    lang: "pt-PT",
  };
}
