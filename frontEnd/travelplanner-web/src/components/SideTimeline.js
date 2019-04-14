import { Timeline, Icon } from 'antd';
import React from 'react';
import '../styles/SideTimeline.css';


export default class SideTimeline extends React.Component {




    render() {

        const planList = ((Days) => {
            let list = new Array();
            for (var i = 0; i <= Days.length; i++) {
                if (Days[i] === undefined) continue;
                var innerstr;
                innerstr = 'Day ' + (i + 1);
                list.push(<Timeline.Item classname='day-title' dot={<Icon type="pushpin" theme="twoTone" style={{ fontSize: '16px', fontWeight:'bold'}} />} >{'Day ' + (i + 1)}</Timeline.Item>);
                // console.log(Days[i]);    
                for (var j = 0; j <= Days[i].length; j++) {
                    if (Days[i][j] === undefined) continue;
                    innerstr = (j + 1) + '. ' + Days[i][j].name;
                    // console.log(Days[i]);
                    list.push(<Timeline.Item color="green" classname='intra-list'>{innerstr}</Timeline.Item>);
                }
            }
            return list;
        })(this.props.days);


        return (
            <div className='timeline'>
                <div id='travel-plan'>
                    <Timeline style={{color: "white"}}>
                        {planList}
                    </Timeline>
                </div>
            </div>
        );

    }
}