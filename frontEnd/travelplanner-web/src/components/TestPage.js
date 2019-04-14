import React from 'react';
import { GoogleMap } from "react-google-maps";
import { Link } from "react-router-dom";
import RatioButtons from "./RatioButtons"
//import{ MyMapComponent}  from "MyMapComponent"
//mport {MyMapComponent} from './MyMapComponent';
const paths=[
    { lat: 40.7829, lng: -73.9654},
    { lat: 40.7794, lng: -73.9632},
    { lat:40.7614, lng: -73.9776},
    {lat: 40.7425, lng: -74.0061}
]
export class TestPage extends React.Component {
// // /update_paths
//     request json:
//         {
//             "pointId_day_index_array": [[1, 2, 1],[2, 2, 2],[4, -1, -1]]
//         }
//
//
//     response json:
//         {
//             "points" : [
//                 {pointId: 0, type: "poi", lat: 40.7829, lon: -73.9654, poi_name: "central park", image_url: "https://thenypost.files.wordpress.com/2018/07/central-park-conservancy.jpg?quality=90&strip=all&w=618&h=410&crop=1", day:2, index_in_the_day: 4},
//                 {pointId: 1, type: "poi", lat: 40.7794, lon: -73.9632, poi_name: "The Metropolitan Museum of Art", image_url: "https://cdn.getyourguide.com/img/tour_img-210854-148.jpg", day: 2, index_in_the_day: 1},
//                 {pointId: 2, type: "poi", lat: 40.7614, lon: -73.9776, poi_name: "MoMa", image_url: "https://images.musement.com/cover/0001/31/moma-museum-of-modern-art-tickets-tours-jpg_header-30520.jpeg?&q=60&fit=crop&lossless=true&auto=format&w=412&h=250", day: 2, index_in_the_day: 2},
//                 {pointId: 3, type: "poi", lat: 40.7425, lon: -74.0061, poi_name: "Chelsea Market", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Chelsea_Market.jpg/350px-Chelsea_Market.jpg", day:1, index_in_the_day: 1},
//                 {pointId: 4, type: "poi", lat: 40.7308, lon: -73.9973, poi_name: "Washington Square Park", image_url:"https://media.cntraveler.com/photos/55f6f83ef36883a0540d6845/4:5/w_767,c_limit/Washington-Square-Park-cr-getty.jpg", day: -1, index_in_the_day: -1},
//                 {pointId: 5, type: "poi", lat: 40.8296, lon: -73.9262, poi_name: "Yankee Stadium", image_url: "https://www.wheretraveler.com/sites/default/files/styles/wt17_promoted_large/public/images/YANKEE%20STADIUM_OVE%23747D12.jpg?itok=KHnOsPcI&timestamp=1451406398", day:2, index_in_the_day: 3}
//                 {pointId: 1000, type: "start", lat: 40.0005, lon: -74.0001, poi_name: "", image_url: "", day:1, index_in_the_day: 0},
//                 {pointId: 1000, type: "start", lat: 40.0005, lon: -74.0001, poi_name: "", image_url: "", day:3, index_in_the_day: 0},
//                 {pointId: 1001, type: "start", lat: 40.0001, lon: -73.5555, poi_name: "", image_url: "", day:2, index_in_the_day: 0}
//              ],
//
//             "steps" : [
//                 {},
//                 {},
//                 {},
//                 {},
//                 {},
//                 ...
//             ]
//        }

    onDrag = () => {

    }

    constructor (props) {
        super(props);

        this.state = {
            videoURL: 'https://imgur.com/ydH7ULN'
        }
    }

    render () {
        const sample = "https://i.imgur.com/ydH7ULN.mp4"
        return (
            <div>
                <video className='videoTag' autoPlay loop muted>
                    <source src={sample} type='video/mp4'/>
                </video>

                <p>lalala</p>
            </div>

        )
    }
}
