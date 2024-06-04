import { ComponentPublicInstance } from "vue";
import BooTableLayout from "@/components/BooTableLayout/TableLayout.vue";

export type BooTableLayoutInstance = Omit<InstanceType<typeof BooTableLayout>, keyof ComponentPublicInstance>;
