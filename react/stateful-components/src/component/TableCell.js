import React from "react";
//import { CallbackButton } from "./CallbackButton";
import {SimpleButton} from "./SimpleButton";
import {HooksButton} from "./HooksButton";

export function TableCell(props) {
  return (
    <React.Fragment>
      <td>{props.index + 1} </td>
      <td>{props.name} </td>
      <td>{props.name.length} </td>
      <td>
        <SimpleButton
          className="btn btn-warning btn-sm m-1" callback={props.reverseCallback} text={`Reverse (${props.name})`}
        />
        <SimpleButton
          className="btn btn-info btn-sm m-1"
          callback={() => props.promoteCallback(props.name)} text={`Promote (${props.name})`}
        />
        <HooksButton
          className="btn btn-info btn-sm m-1"
          callback={() => props.promoteCallback(props.name)} text={`Promote (${props.name})`}/>
      </td>
    </React.Fragment>
  )
}