import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { List, Typography } from 'antd';
import React from 'react';
import arrayMove from 'array-move';
import { API_ROOT } from "../constants";


const SortableItem = SortableElement(({value, index}) =>
 <List.Item className="items-font" style={{color:"black", fontSize:"20px",fontWeight:"400" }}><Typography.Text style={{color:"black",fontWeight:"1000"}}>{<span ><b> Stop {index+1}</b></span>}</Typography.Text> {value}</List.Item>
);

const SortableList = SortableContainer(({items, start}) => {
  var startname=start[0].name;
  return (
    typeof(items[0])!="undefined"&&typeof(start)!="undefined"&&items[0]!=null&&start!=null&&<List  header={<h1 className="banger" style={{fontSize:"50px"}}><b>Day{items[0].day+1}</b></h1>} bordered>
      <List.Item><Typography.Text>{<span className="list-title items-font" style={{color:"black",fontSize:"20px",fontWeight:'1000'}}><b> Start Point:  </b></span>}</Typography.Text>{startname}</List.Item>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value.name} />
      ))}
    </List>
  );
});

  
  export class SortableComponent extends React.Component {
    onSortEnd = ({oldIndex, newIndex}) => {
       var temp1= arrayMove(this.props.items, oldIndex, newIndex);
       //temp1=temp1.concat(this.props.start);
       this.props.change(temp1);
    };
  render() {
    return (
     
    <div className="font-white">
      {
      typeof(this.props.items)!="undefined"&&typeof(this.props.start)!="undefined"&&this.props.items!=null&&this.props.start!=null&&<SortableList items={this.props.items} onSortEnd={this.onSortEnd} start={this.props.start}/>
      }
    </div>
  )

}
}