import './App.css'
import { ceo } from "./data";
import { useState } from "react";
import { Employee } from "./Interfaces/Interfaces";


let previousAction: any = {};

function ListItem({ item }:Employee | any ) {
  const itemClickHandler  = (e:React.MouseEvent<HTMLLIElement, MouseEvent>,id:number) => {
  }

  let children = null;
  if (item.subordinates && item.subordinates.length) {
    children = (
      <ul>
        {item.subordinates.map((i:any,index:number) => (
          <ListItem item={i} key={i.uniqueId} />
        ))}
      </ul>
    );
  }

  return (
    <li onClick={(e)=>itemClickHandler(e,item.uniqueId)}>
      {item.name}
      {children}
    </li>
  );
}

function App() {

  const [appState, setAppState] = useState(ceo);


  function redo(): void {
    const employeeID = previousAction.eID;
    const previousSupervisorID = previousAction.employeeSupervisorID;
    const previousSurbodinates: Employee[] = previousAction.subordinates;
    let clonedArray = JSON.parse(JSON.stringify(appState));
    const employeeParent = findEmployeeParent(
        clonedArray.subordinates,
        employeeID
    );

    if (employeeParent) {
        const employee = employeeParent?.subordinates.find(
            (employee) => employee.uniqueId === employeeID
        );

        employeeParent.subordinates = employeeParent.subordinates.filter(
            (employee) => employee.uniqueId !== employeeID
        );


        const previousSupervisor = findEmployee(
            clonedArray.subordinates,
            previousSupervisorID
        );

        if (previousSupervisor) {
            previousSupervisor.subordinates = previousSupervisor?.subordinates.filter(
                (el) => -1 === previousSurbodinates.indexOf(el)
            );

            if (employee) {
                previousSupervisor?.subordinates.push({
                    ...employee,
                    ...{ subordinates: previousSurbodinates }
                });
            }
            setAppState(clonedArray);
        }
    }
}


  const move = (eID:number, sID:number) => {
    let clonedArray = JSON.parse(JSON.stringify(appState));
    previousAction.eID = eID;
    previousAction.sID = sID;
    const employeeSupervisor = findEmployeeParent(
      clonedArray.subordinates,
      eID
  );
  previousAction.employeeSupervisorID = employeeSupervisor?.uniqueId;

  const supervisor = findEmployee(
    clonedArray.subordinates,
    sID
);
   if (supervisor != null) {
    let movingEmployee = employeeSupervisor?.subordinates.find(
        (item) => item.uniqueId === eID
    );

    if (employeeSupervisor != null) {
        let surbodinates = movingEmployee?.subordinates;
        previousAction.subordinates = surbodinates;

        employeeSupervisor.subordinates = employeeSupervisor.subordinates.filter(
            (employee) => {
                return employee.uniqueId !== eID;
            }
        );

        if (surbodinates !== undefined) {
            employeeSupervisor.subordinates.push(...surbodinates);
        }
    }

    if (movingEmployee !== undefined || movingEmployee != null) {
        supervisor.subordinates.push({
            ...movingEmployee,
            ...{ subordinates: [] }
        });
    }
    setAppState(clonedArray);
}
  }
 

  function findEmployeeParent(
    employeesorganizationChart: Employee[],
    id: number
): Employee | null {
    let result;
    employeesorganizationChart.some((child) => {
        if (child.subordinates.some((e) => e.uniqueId === id)) {
            return (result = child);
        } else {
            return (result = findEmployeeParent(child.subordinates || [], id));
        }
    });

    return result === undefined ? null : result;
}

function undo(): void {
  move(previousAction.eID,previousAction.employeeSupervisorID);
}

function findEmployee(employeesorganizationChart: Employee[], id: number): Employee | null {
  let result;
  employeesorganizationChart.some((child) => {
      if (child.uniqueId === id) {
          return (result = child);
      } else {
          return (result = findEmployee(child.subordinates || [], id));
      }
  });

  return result === undefined ? null : result;
}


  const handleClick = () => {
    move(5,8);
  } 

  return (
    <div className="App">
      <div className='btn-container'>
        <button className="btn" onClick={()=>move(4,5)}>Marry --&gt; Bob Saget</button>
        <button onClick={()=>move(11,9)} className="btn">George Carrey --&gt; Harry Tobs</button>
        <button onClick={()=>move(15,13)} className="btn">Sophie Turner --&gt; Bruce Willis </button>
        <button onClick={undo} className="undo">
          Undo
        </button>
        <button onClick={redo} className="Redo">
          Redo
        </button>
      </div>
      <ul className="list">
        <h1>{appState.name}</h1>
      {appState.subordinates.map((i,index) => {
        return <ListItem item={i} key={i.uniqueId} />
      })}
      </ul>
    </div>
  )
}


export default App
