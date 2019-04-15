import React from 'react';
import Dragula from 'dragula';
import '../styles/Board.css';
import Swimlane from './Swimlane';
import 'dragula/dist/dragula.css';
import SideTimeline from './SideTimeline';
import DayList from './DayList';
import { arrayMove } from 'react-sortable-hoc';
import { API_ROOT } from "../constants"
import { Button,notification } from 'antd'

/*const jsonArray = [
    {
        "imageURL": "",
        "name": "start hotel",
        "placeID": "ChIJ07Qf5YpZwokR5Yp1cUXil2o",
        "lon": -74.0043807,
        "type": "start",
        "day": 0,
        "lat": 40.7206663,
        "intradayIndex": 0
    },
    {
        "name": "Madison Square Garden",
        "placeID": "ChIJhRwB-yFawokR5Phil-QQ3zM",
        "lon": -73.9934387,
        "day": 0,
        "lat": 40.7505045,
        "intradayIndex": 1,
        "type": "poi"
    },
    {
        "name": "Madame Tussauds New York",
        "placeID": "ChIJ8VOfr1RYwokRhil9_pcMKuc",
        "lon": -73.9888338,
        "day": 0,
        "lat": 40.7564269,
        "intradayIndex": 2,
        "type": "poi"
    },
    {
        "name": "Washington Square Arch",
        "placeID": "ChIJXa-d3ZBZwokRGcUkpZc_uC4",
        "lon": -73.9971027,
        "day": 0,
        "lat": 40.7312339,
        "intradayIndex": 3,
        "type": "poi"
    },
    {
        "imageURL": "",
        "name": "start hotel",
        "placeID": "ChIJy6IAivdYwokRRSxXtvXGJcU",
        "lon": -73.9812207,
        "type": "start",
        "day": 1,
        "lat": 40.7646895,
        "intradayIndex": 0
    },
    {
        "name": "Queens Museum",
        "placeID": "ChIJmWMJBtBfwokR5qK7waLcgAM",
        "lon": -73.8467079,
        "day": 1,
        "lat": 40.7457885,
        "intradayIndex": 1,
        "type": "poi"
    },
    {
        "name": "South Street Seaport Museum",
        "placeID": "ChIJ1wNgehRawokR3qHBnKI48y8",
        "lon": -74.0037097,
        "day": 1,
        "lat": 40.7065616,
        "intradayIndex": 2,
        "type": "poi"
    },
    {
        "name": "Lincoln Center for the Performing Arts",
        "placeID": "ChIJN6W-X_VYwokRTqwcBnTw1Uk",
        "lon": -73.9834889,
        "day": 2,
        "lat": 40.7724641,
        "intradayIndex": 3,
        "type": "poi"
    }
]
const totalDays = 2;
*/
////////////////////////////Replace consts above using props.varname/////////////////////////////////////////////////
const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Successful!',
      description: "You've saved the routes successfully!"
    });
  };
export default class Board extends React.Component {
    constructor(props) {
        super(props);
        var spots = this.getSpots();
        //console.log('points:', this.props.points);

        function compare(obj1, obj2) {
            var day1 = obj1['day'];
            var day2 = obj2['day'];
            var inday1 = obj1['intradayIndex'];
            var inday2 = obj2['intradayIndex'];
            if (day1 < day2) {
                return -1;
            } else if (day1 > day2) {
                return 1;
            } else {
                if (inday1 < inday2) {
                    return -1;
                } else if (inday1 > inday2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        spots.sort(compare);

        //console.log('spots:', spots);
        //console.log('props:', props);
        var days = new Array();
        var refs = new Array();
        var rowrefs = new Array();
       
        for (var i = 0; i <= this.props.totalDays - 1; i++) {
            days[i] = spots.filter(spot => spot.day && spot.day === (i + 1));
            refs[i] = React.createRef();
        }

        for (var i = 1; i <= 5; i++) {
            rowrefs[i] = React.createRef();
        }
        
        days = days.map(day => day.map((spot, index) => {
            spot.intradayIndex = index;
            return spot;
        }));
        
        
        this.state = {
            days: days,
            col: refs,
            row: rowrefs,
        }

        //console.log('initial state:',this.state);
        this.swimlanes = {
            day: refs
        }

        this.rows = {
            row: rowrefs
        }
    }

    getSpots() {
        return this.props.points.filter(spot => spot.type && spot.type != 'start').map(spotDetails => ({
            placeID: spotDetails.placeID,
            lat: spotDetails.lat,
            lon: spotDetails.lon,
            name: spotDetails.name,
            url: spotDetails.imageURL,
            day: spotDetails.day + 1,
            intradayIndex: spotDetails.intradayIndex-1,
            type: spotDetails.type,
        }));
    }
    componentDidMount() {

        function array_move(arr, old_index, new_index) {
            while (old_index < 0) {
                old_index += arr.length;
            }
            while (new_index < 0) {
                new_index += arr.length;
            }
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing purposes
        };


        var colcontainer = this.state.col.map((col) => {
            return col.current;
        });
        console.log(colcontainer);
        var rowcontainer = this.state.row.map((row) => {
            return row.current;
        });
      
        var drake_spots = Dragula([
            ...colcontainer
        ]);
        ////////////////////////////////////////////////////Main Callback Part/////////////////////////////////////////////////

        //update spots drag result
        drake_spots.on('drop', (el, target, source, sibling) => {
            var sour = source.id - 1;
            var tar = target.id - 1;
            var index1 = el.id;
            var index2;
            if (sibling != null) index2 = sibling.id;
            else index2 = this.state.days[tar].length;
            console.log(index1);
            console.log(index2);

            // console.log(sour); 
            // console.log(tar); 
            if (sour === tar) {
                var temp = this.state.days[sour][index1];
                if (index1 < index2) index2--;

                array_move(this.state.days[sour], index1, index2);
                this.state.days[sour] = this.state.days[sour].map((spot, index) => {
                    spot.intradayIndex = index;
                    return spot;
                });
            } else {

                this.state.days[tar].splice(index2, 0, this.state.days[sour][index1]);
                this.state.days[sour].splice(index1, 1);

                this.state.days[sour] = this.state.days[sour].map((spot, index) => {
                    spot.intradayIndex = index;
                    spot.day = sour + 1;
                    return spot;
                });
                this.state.days[tar] = this.state.days[tar].map((spot, index) => {
                    spot.intradayIndex = index;
                    spot.day = tar + 1;
                    return spot;
                });
            }

            console.log('updated state:',this.state);
            this.setState({
                days: this.state.days,
            });

        });

    }


    componentDidUpdate() {

        function array_move(arr, old_index, new_index) {
            while (old_index < 0) {
                old_index += arr.length;
            }
            while (new_index < 0) {
                new_index += arr.length;
            }
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing purposes
        };


        var colcontainer = this.state.col.map((col) => {
            return col.current;
        });
        console.log(colcontainer);
        var rowcontainer = this.state.row.map((row) => {
            return row.current;
        });
        var drake_days = Dragula([
         //   ...rowcontainer
        ],
            {
                invalid: function (el, handle) {
                    return el.className === "Swimlane-dragColumn";
                }
            }
        );
        var drake_spots = Dragula([
            ...colcontainer
        ]);
        ////////////////////////////////////////////////////Main Callback Part//////////////////////////////////////////////////
        //update days drag result
        drake_days.on('drop', (el, target, source, sibling) => {
            //dayUpdate(el.id,sibling.id);
            var index1 = el.id - 1;
            var index2 = sibling.id - 1;
            // console.log(index1);
            // console.log(index2);
            // console.log(this.state.days);
            if (index1 < index2) index2--;
            var temparray = new Array();
            temparray[index2] = this.state.days[index1];
            let k = 0;
            for (var i = 0; i < this.state.days.length; i++) {
                if (k === index1) k++;
                if (i != index2) {
                    temparray[i] = this.state.days[k];
                    k++;
                }
            }

            temparray = temparray.map((array, index) => {
                for (var i = 0; i < array.length; i++) {
                    array[i].day = index + 1;
                }
                return array;
            });

            //  console.log(temparray);
            this.setState({
                days: temparray,
            });
        });

        //update spots drag result
        drake_spots.on('drop', (el, target, source, sibling) => {
            var sour = source.id - 1;
            var tar = target.id - 1;
            var index1 = el.id;
            var index2;
            if (sibling != null) index2 = sibling.id;
            else index2 = this.state.days[tar].length;
            console.log(index1);
            console.log(index2);

            // console.log(sour); 
            // console.log(tar); 
            if (sour === tar) {
                var temp = this.state.days[sour][index1];
                if (index1 < index2) index2--;

                array_move(this.state.days[sour], index1, index2);
                this.state.days[sour] = this.state.days[sour].map((spot, index) => {
                    spot.intradayIndex = index;
                    return spot;
                });
            } else {

                this.state.days[tar].splice(index2, 0, this.state.days[sour][index1]);
                this.state.days[sour].splice(index1, 1);

                this.state.days[sour] = this.state.days[sour].map((spot, index) => {
                    spot.intradayIndex = index;
                    spot.day = sour + 1;
                    return spot;
                });
                this.state.days[tar] = this.state.days[tar].map((spot, index) => {
                    spot.intradayIndex = index;
                    spot.day = tar + 1;
                    return spot;
                });
            }

            console.log('updated state:',this.state);
            this.setState({
                days: this.state.days,
            });

        });

    }


    saveButtonPressed = () => {
        const endPoint = 'UpdatePaths';
        let points = []
        for (let i = 0; i < this.props.totalDays; i++) {
            for (let j = 0; j < this.state.days[i].length; j++) {
                const { placeID, day, intradayIndex } = this.state.days[i][j];
                points.push({ placeID, day: day - 1, intradayIndex : intradayIndex + 1});
            }
        }
        this.props.homeBoardCallback(points);
        //console.log(JSON.stringify({"userID": this.props.userID, "newSchedule":points}));
        fetch(`${API_ROOT}/${endPoint}`, {
            method: 'POST',
            body: JSON.stringify({ "userID": this.props.userID, "newSchedule": points }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response)=>{
            console.log(response.status)
            if(response.status===200){
              openNotificationWithIcon('success')
            }
            
          }  
          )
        .catch((e) => {
            console.log(e.message);
        });
    }
  
    printButtonPressed = () => {
        window.print();
    }

    render() {
        //console.log(this.state.days);
        return (

            <div className="DetailPage" style={{ display:"flex", float:"left",marginTop:"50px", marginLeft:"100px", height:"900px", width:"1700px" }}>
           
                 <div className="DayList" style={{height:"900px", overflow:"auto"}}>
                <DayList dayspot={this.state.days} colrefs={this.swimlanes.day} rowrefs={this.rows.row} />
                <div className="detail_button_group" style={{marginLeft: "auto", marginRight: "auto"}}>
                <Button className="button-font" onClick={this.saveButtonPressed} style={{marginRight: "100px"}}>Save</Button>
                <Button className="button-font" onClick={this.printButtonPressed} id='printbutton'>Print</Button>
                 </div>
                </div>
                <div className="timeline" style={{ height:"900px", overflow:"auto"}}>
                <SideTimeline days={this.state.days}/>
                </div>
                 
            </div>
            
        );
    }

}


/*day1: spots.filter(spot => spot.day && spot.day === 1),
day2: spots.filter(spot => spot.day && spot.day === 2),
day3: spots.filter(spot => spot.day && spot.day === 3),
day4: spots.filter(spot => spot.day && spot.day === 4),
day5: spots.filter(spot => spot.day && spot.day === 5),
day6: spots.filter(spot => spot.day && spot.day === 6),
day7: spots.filter(spot => spot.day && spot.day === 7),
day8: spots.filter(spot => spot.day && spot.day === 8),
day9: spots.filter(spot => spot.day && spot.day === 9),
day10: spots.filter(spot => spot.day && spot.day === 10),
day11: spots.filter(spot => spot.day && spot.day === 11),
day12: spots.filter(spot => spot.day && spot.day === 12),
day13: spots.filter(spot => spot.day && spot.day === 13),
day14: spots.filter(spot => spot.day && spot.day === 14),
day15: spots.filter(spot => spot.day && spot.day === 15),*/

/*  day1: React.createRef(),
  day2: React.createRef(),
  day3: React.createRef(),
  day4: React.createRef(),
  day5: React.createRef(),
  day6: React.createRef(),
  day7: React.createRef(),
  day8: React.createRef(),
  day9: React.createRef(),
  day10: React.createRef(),
  day11: React.createRef(),
  day12: React.createRef(),
  day13: React.createRef(),
  day14: React.createRef(),
  day15: React.createRef(),*/


//[1, 40.7829, -73.9654, "central park", "https://thenypost.files.wordpress.com/2018/07/central-park-conservancy.jpg?quality=90&strip=all&w=618&h=410&crop=1", 1, 0],
//[2, 40.7794, -73.9632, "The Metropolitan Museum of Art", "https://cdn.getyourguide.com/img/tour_img-210854-148.jpg", 1, 2],
//[3, 40.7614, -73.9776, "MoMa", "https://images.musement.com/cover/0001/31/moma-museum-of-modern-art-tickets-tours-jpg_header-30520.jpeg?&q=60&fit=crop&lossless=true&auto=format&w=412&h=250", 1],
//[4, 40.7587, -73.9787, "Rockefeller Center", "https://res.cloudinary.com/gray-malin/image/upload/c_scale,w_1000,q_80/gray-malin/products/Gray_Malin_x_Rockefeller_Center_Tree.jpg?updated=1541526604", 1],
//[5, 40.7425, -74.0061, "Chelsea Market", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Chelsea_Market.jpg/350px-Chelsea_Market.jpg", 2],
//[6, 40.7480, -74.0048, "The High Line", "https://www.tripsavvy.com/thmb/u__1MLKdHHdEnrHxYjEx0KwHpyw=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/HighLine_WildflowerField_NYCCompany-MarleyWhite-5b104d08a474be003826e215.jpg", 2],
//[7, 40.7484, -73.9857, "Empire State Building", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg", 2],
//[8, 40.7308, -73.9973, "Washington Square Park", "https://media.cntraveler.com/photos/55f6f83ef36883a0540d6845/4:5/w_767,c_limit/Washington-Square-Park-cr-getty.jpg", 2],
//[9, 40.8075, -73.9626, "Columbia University", "https://www.columbia.edu/content/sites/default/files/styles/cu_crop/public/content/Campus%20Images/low-plaza.jpg?itok=DJ8f43Xe", 3],
//[10, 40.8296, -73.9262, "Yankee Stadium", "https://www.wheretraveler.com/sites/default/files/styles/wt17_promoted_large/public/images/YANKEE%20STADIUM_OVE%23747D12.jpg?itok=KHnOsPcI&timestamp=1451406398", 3],
//[11, 40.7925, -73.9519, "Museum of the City of New York", "https://media-cdn.tripadvisor.com/media/photo-s/0f/ec/53/13/the-museum-of-the-city.jpg", 3],

/**<div className="row" ref={this.rows.row[1]}>
                            <div className="col-md-4" id='1' >
                                {this.renderSwimlane('Day 1', this.state.days[1], this.swimlanes.day[1])}
                            </div>
                            <div className="col-md-4" id='2' >
                                {this.renderSwimlane('Day 2', this.state.days[2], this.swimlanes.day[2])}
                            </div>
                            <div className="col-md-4" id='3' >
                                {this.renderSwimlane('Day 3', this.state.days[3], this.swimlanes.day[3])}
                            </div>
                        </div>
                        <div className="row" ref={this.rows.row[2]}>
                            <div className="col-md-4" id='4' >
                                {this.renderSwimlane('Day 4', this.state.days[4], this.swimlanes.day[4])}
                            </div>
                            <div className="col-md-4" id='5' >
                                {this.renderSwimlane('Day 5', this.state.days[5], this.swimlanes.day[5])}
                            </div>
                            <div className="col-md-4" id='6' >
                                {this.renderSwimlane('Day 6', this.state.days[6], this.swimlanes.day[6])}
                            </div>
                        </div>
                        <div className="row" ref={this.rows.row[3]}>
                            <div className="col-md-4" id='7' >
                                {this.renderSwimlane('Day 7', this.state.days[7], this.swimlanes.day[7])}
                            </div>
                            <div className="col-md-4" id='8' >
                                {this.renderSwimlane('Day 8', this.state.days[8], this.swimlanes.day[8])}
                            </div>
                            <div className="col-md-4" id='9' >
                                {this.renderSwimlane('Day 9', this.state.days[9], this.swimlanes.day[9])}
                            </div>
                        </div>
                        <div className="row" ref={this.rows.row[4]}>
                            <div className="col-md-4" id='10' >
                                {this.renderSwimlane('Day 10', this.state.days[10], this.swimlanes.day[10])}
                            </div>
                            <div className="col-md-4" id='11' >
                                {this.renderSwimlane('Day 11', this.state.days[11], this.swimlanes.day[11])}
                            </div>
                            <div className="col-md-4" id='12' >
                                {this.renderSwimlane('Day 12', this.state.days[12], this.swimlanes.day[12])}
                            </div>
                        </div>
                        <div className="row" ref={this.rows.row[5]}>
                            <div className="col-md-4" id='13' >
                                {this.renderSwimlane('Day 13', this.state.days[13], this.swimlanes.day[13])}
                            </div>
                            <div className="col-md-4" id='14' >
                                {this.renderSwimlane('Day 14', this.state.days[14], this.swimlanes.day[14])}
                            </div>
                            <div className="col-md-4" id='15' >
                                {this.renderSwimlane('Day 15', this.state.days[15], this.swimlanes.day[15])}
                            </div>
                        </div> */