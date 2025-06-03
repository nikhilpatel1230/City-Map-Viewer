import { LightningElement, track } from 'lwc';
import getCoordinatesFromCity from '@salesforce/apex/cityMapController.getCoordinatesFromCity';

export default class CityMapViewer extends LightningElement {
    @track cityName = '';
    @track mapMarkers = [];
    @track error = '';

    handleCityChange(event) {
        this.cityName = event.target.value;
        this.error = '';
    }

    handleShowMap() {
        if (!this.cityName) {
            this.error = 'Please enter a city name.';
            this.mapMarkers = [];
            return;
        }

        getCoordinatesFromCity({ city: this.cityName })
            .then(result => {
                if (result && result.latitude && result.longitude) {
                    this.mapMarkers = [{
                        location: {
                            Latitude: result.latitude,
                            Longitude: result.longitude
                        },
                        title: this.cityName,
                        description: `Coordinates: (${result.latitude}, ${result.longitude})`
                    }];
                    this.error = '';
                } else {
                    this.error = 'No location found for this city.';
                    this.mapMarkers = [];
                }
            })
            .catch(error => {
                this.error = 'Error fetching coordinates. Please check the city name or try again later.';
                this.mapMarkers = [];
                console.error('Apex error:', error);
            });
    }
}
