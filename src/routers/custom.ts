import { staticRouter, errorRouter } from "@/routers/modules/staticRouter";

const customRoutes = [...staticRouter, ...errorRouter];

export default customRoutes;
