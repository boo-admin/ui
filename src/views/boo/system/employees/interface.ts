import { boo } from "@/api/interface";

export interface EmployeeFormProps {
  title: string;
  isView: boolean;
  row: Partial<boo.Employee>;
  departmentTree?: boo.Department[];
  api?: (params: any) => Promise<any>;
  update?: (id: any) => Promise<void>;
}
