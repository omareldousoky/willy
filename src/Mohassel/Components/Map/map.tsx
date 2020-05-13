import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import * as local from '../../../Shared/Assets/ar.json';


const mapStyles = {
    margin: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid #131948',
    height: '400px'
};
interface Props {
    show: boolean;
    handleClose: any;
    save: any;
    location: { lat: number; lng: number };
    google: any;
    header: string;
}
interface State {
    lat: number;
    lng: number;
    mapCenterLat: number;
    mapCenterLng: number;
    address: string;
    query: string;
}

export class MapContainer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            lat: 0,
            lng: 0,
            address: '',
            query: '',
            mapCenterLat: 30.048764,
            mapCenterLng: 31.247705
            // autocomplete: '',
            // autocompleteReset: false
        }
    }
    componentDidMount() {
        const options = { componentRestrictions: { country: 'eg' } };
        const input = document.getElementById('autocomplete') as HTMLInputElement;
        /*global google*/ // To disable any eslint 'google not defined' errors
        const autocomplete = new window.google.maps.places.Autocomplete(
            input,
            options,
        );
        if (this.props.location.lat !== 0 && this.props.location.lng !== 0) {
            const input = document.getElementById('autocomplete') as HTMLInputElement;
            const geocoder = new google.maps.Geocoder;
            this.setState({
                lat: this.props.location.lat,
                lng: this.props.location.lng,
                mapCenterLat: this.props.location.lat,
                mapCenterLng: this.props.location.lng
            })
            geocoder.geocode({ 'location': this.props.location }, function (results: any, status: string) {
                if (status === 'OK') {
                    if (results[0]) {
                        input.value = results[0].formatted_address;
                    }
                }
            })
        }
        // Fire Event when a suggested name is selected
        autocomplete.addListener('place_changed', () => {
            this.handlePlaceSelect(autocomplete)
        });
    }
    handlePlaceSelect(autocomplete: any) {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();
        this.setState({
            lat,
            lng,
            mapCenterLat: lat,
            mapCenterLng: lng
        })
    }
    handleClick = (_t: any, _map: any, coord: any) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const geocoder = new google.maps.Geocoder;
        const input = document.getElementById('autocomplete') as HTMLInputElement;
        geocoder.geocode({ 'location': latLng }, function (results: any, status: string) {
            if (status === 'OK') {
                if (results[0]) {
                    input.value = results[0].formatted_address;
                }
            }
        })
        this.setState({
            lat,
            lng,
            mapCenterLat: lat,
            mapCenterLng: lng
        })
    }
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose} size="lg">
                <Modal.Header>
                    <Modal.Title>{this.props.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: 500, padding: '0px 0px 20px 0px' }}>
                    <div className="form-group" style={{ display: 'block', margin: '20px 20px 0px 20px' }}>
                        <input type="text" id="autocomplete" style={{ width: '100%' }} placeholder="ادخل العنوان" />
                        <label htmlFor="input" className="control-label"></label><i className="bar"></i>
                    </div>
                    <Map
                        google={this.props.google}
                        zoom={12}
                        style={mapStyles}
                        initialCenter={{ lat: this.state.mapCenterLat, lng: this.state.mapCenterLng }}
                        center={{ lat: this.state.mapCenterLat, lng: this.state.mapCenterLng }}
                        onClick={this.handleClick}
                    >
                        <Marker position={{ lat: this.state.lat, lng: this.state.lng }} />
                    </Map>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>{local.cancel}</Button>
                    <Button variant="primary" onClick={() => this.props.save({ lat: this.state.lat, lng: this.state.lng })}>{local.save}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_KEY||''
})(MapContainer);