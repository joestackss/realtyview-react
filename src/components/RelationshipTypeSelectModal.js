import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'rsuite';
import classNames from 'classnames';
import empty from 'is-empty';
import '../styles/RelationshipTypeSelectModal.scss';

class RelationshipTypeSelectModal extends React.Component {
	constructor(props) {
		super(props);
		this.handleRelationshipTypeSelect = this.handleRelationshipTypeSelect.bind(this);
		this.state = {
			selectedRelationshipTypes: []
		};
	}

	handleRelationshipTypeSelect(event) {
    const { checked, value } = event.target;

    if (checked) {
      this.setState(prevState => {
        return {
          selectedRelationshipTypes: [...prevState.selectedRelationshipTypes, value]
        }
      });
    } else {
      // Remove
      this.setState(prevState => {
        let selectedRelationshipTypesCopy = [...prevState.selectedRelationshipTypes];
        const matchIndex = selectedRelationshipTypesCopy.indexOf(value);
        selectedRelationshipTypesCopy.splice(matchIndex, 1);

        if (matchIndex !== -1) {
          return {
            selectedRelationshipTypes: selectedRelationshipTypesCopy
          }
        }
      });
    }
  }

  render() {
		return (
			<Modal
				className="select-relationship-type-modal"
				backdrop={true}
				show={this.props.show}
			>
				<h3>Select Relationship Type</h3>
				<p>First, select the relationship type you're creating</p>
				<div className="options">
					<label
						htmlFor="select-buyer"
						className={classNames({
							"option-btn": true,
							"rs-btn": true,
							"rs-btn-cyan": true,
							"selected": (this.state.selectedRelationshipTypes.indexOf("buyer") !== -1)
						})}
					>
						Buyer
						<input
							id="select-buyer"
							type="checkbox"
							value="buyer"
							onChange={(e) => this.handleRelationshipTypeSelect(e)}
						/>
					</label>
					<label
						htmlFor="select-seller"
						className={classNames({
							"option-btn": true,
							"rs-btn": true,
							"rs-btn-red": true,
							"selected": (this.state.selectedRelationshipTypes.indexOf("seller") !== -1)
						})}
					>
						Seller
						<input
							id="select-seller"
							type="checkbox"
							value="seller"
							onChange={(e) => this.handleRelationshipTypeSelect(e)}
						/>
					</label>
					<label
						htmlFor="select-renter"
						className={classNames({
							"option-btn": true,
							"rs-btn": true,
							"rs-btn-violet": true,
							"selected": (this.state.selectedRelationshipTypes.indexOf("renter") !== -1)
						})}
					>
						Renter
						<input
							id="select-renter"
							type="checkbox"
							value="renter"
							onChange={(e) => this.handleRelationshipTypeSelect(e)}
						/>
					</label>
					<label
						htmlFor="select-landlord"
						className={classNames({
							"option-btn": true,
							"rs-btn": true,
							"rs-btn-yellow": true,
							"selected": (this.state.selectedRelationshipTypes.indexOf("landlord") !== -1)
						})}
					>
						Landlord
						<input
							id="select-landlord"
							type="checkbox"
							value="landlord"
							onChange={(e) => this.handleRelationshipTypeSelect(e)}
						/>
					</label>
				</div>

				<Modal.Footer>
					<Button
						color="green"
						onClick={() => {
							let queryParts = [];
							this.state.selectedRelationshipTypes.forEach((relationshipType) => {
								queryParts.push(`type[]=${relationshipType}`);
							});

							this.props.history.push({
								pathname: "/relationship/create",
								search: !empty(queryParts) ? ("?" + queryParts.join("&")) : ""
							});
						}}
					>Next</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

export default withRouter(RelationshipTypeSelectModal);