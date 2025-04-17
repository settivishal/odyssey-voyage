import { readFileSync } from 'fs';

const locations = JSON.parse(readFileSync(new URL('./locations_data.json', import.meta.url)))?.locations;

class LocationsAPI {
  getAllLocations() {
    return locations;
  }

  getLocation(id) {
    return locations.find(l => l.id === id);
  }
}

export default LocationsAPI;
