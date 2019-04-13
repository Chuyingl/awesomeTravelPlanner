import Tour from "react-user-tour";
import React from 'react';
export class UserTour extends React.Component {
    constructor() {
		super();
		this.state = {
			isTourActive: false,
			tourStep: 1
		};
	}
	componentDidMount() {
		/* set state to active in cDM to make sure nodes being attached to have been mounted */
		this.setState({
			isTourActive: true
		});
	}
	render() {
		return (
			<div>
				<Tour
					active={this.state.isTourActive}
					step={this.state.tourStep}
					onNext={(step) => this.setState({tourStep: step})}
					onBack={(step) => this.setState({tourStep: step})}
					onCancel={() => this.setState({isTourActive: false})}
					steps={[
						{  
                            selector: 'button-group',
                            title: <div style={{color: "blue"}}>My Web</div>,
							body: <div style={{color: "green"}}>Site</div>
                            }
							
					]}
				/>
			</div>
		);
	}
}
