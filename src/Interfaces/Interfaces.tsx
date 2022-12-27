export interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
  }
  
  export interface IEmployeeOrgApp {
    organizationChart: Employee;
    
    move(employeeID: number, supervisorID: number): void;
  
    undo(): void;
  
    redo(): void;
  }