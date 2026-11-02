/**
 * Location Data (Countries, States, and Cities)
 * Used across Joyzen onboarding, patient forms, and location selection.
 */

export interface LocationState {
  name: string;
  cities: string[];
}

export interface LocationCountry {
  name: string;
  code: string;
  phoneCode: string;
  states: LocationState[];
}

export const LOCATION_DATA: Record<string, LocationCountry> = {
  India: {
    name: 'India',
    code: 'IN',
    phoneCode: '+91',
    states: [
      {
        name: 'Karnataka',
        cities: [
          'Bengaluru',
          'Mysuru',
          'Mangaluru',
          'Hubballi-Dharwad',
          'Belagavi',
          'Davanagere',
          'Ballari',
          'Shivamogga',
          'Tumakuru',
          'Udupi',
          'Bidar',
          'Hassan',
        ],
      },
      {
        name: 'Maharashtra',
        cities: [
          'Mumbai',
          'Pune',
          'Nagpur',
          'Thane',
          'Nashik',
          'Kalyan-Dombivli',
          'Vasai-Virar',
          'Chhatrapati Sambhajinagar',
          'Navi Mumbai',
          'Solapur',
          'Kolhapur',
          'Amravati',
        ],
      },
      {
        name: 'Delhi',
        cities: [
          'New Delhi',
          'North Delhi',
          'South Delhi',
          'East Delhi',
          'West Delhi',
          'Central Delhi',
          'Dwarka',
          'Rohini',
          'Saket',
          'Connaught Place',
        ],
      },
      {
        name: 'Tamil Nadu',
        cities: [
          'Chennai',
          'Coimbatore',
          'Madurai',
          'Tiruchirappalli',
          'Salem',
          'Tirunelveli',
          'Tiruppur',
          'Vellore',
          'Erode',
          'Thoothukudi',
          'Dindigul',
          'Thanjavur',
        ],
      },
      {
        name: 'Telangana',
        cities: [
          'Hyderabad',
          'Warangal',
          'Nizamabad',
          'Karimnagar',
          'Ramagundam',
          'Khammam',
          'Mahbubnagar',
          'Nalgonda',
          'Adilabad',
        ],
      },
      {
        name: 'Uttar Pradesh',
        cities: [
          'Lucknow',
          'Noida',
          'Greater Noida',
          'Kanpur',
          'Ghaziabad',
          'Agra',
          'Varanasi',
          'Meerut',
          'Prayagraj',
          'Bareilly',
          'Aligarh',
          'Moradabad',
          'Gorakhpur',
          'Ayodhya',
        ],
      },
      {
        name: 'Gujarat',
        cities: [
          'Ahmedabad',
          'Surat',
          'Vadodara',
          'Rajkot',
          'Bhavnagar',
          'Jamnagar',
          'Junagadh',
          'Gandhinagar',
          'Anand',
          'Navsari',
          'Morbi',
        ],
      },
      {
        name: 'West Bengal',
        cities: [
          'Kolkata',
          'Howrah',
          'Siliguri',
          'Asansol',
          'Durgapur',
          'Bardhaman',
          'Malda',
          'Kharagpur',
          'Habra',
        ],
      },
      {
        name: 'Kerala',
        cities: [
          'Kochi',
          'Thiruvananthapuram',
          'Kozhikode',
          'Kollam',
          'Thrissur',
          'Alappuzha',
          'Palakkad',
          'Kannur',
          'Kottayam',
          'Malappuram',
        ],
      },
      {
        name: 'Rajasthan',
        cities: [
          'Jaipur',
          'Jodhpur',
          'Kota',
          'Bikaner',
          'Ajmer',
          'Udaipur',
          'Bhilwara',
          'Alwar',
          'Bharatpur',
          'Sikar',
        ],
      },
      {
        name: 'Punjab',
        cities: [
          'Ludhiana',
          'Amritsar',
          'Jalandhar',
          'Patiala',
          'Bathinda',
          'Mohali',
          'Hoshiarpur',
          'Batala',
          'Pathankot',
        ],
      },
      {
        name: 'Haryana',
        cities: [
          'Gurugram',
          'Faridabad',
          'Panipat',
          'Ambala',
          'Yamunanagar',
          'Rohtak',
          'Hisar',
          'Karnal',
          'Sonipat',
          'Panchkula',
        ],
      },
      {
        name: 'Andhra Pradesh',
        cities: [
          'Visakhapatnam',
          'Vijayawada',
          'Guntur',
          'Nellore',
          'Kurnool',
          'Rajahmundry',
          'Tirupati',
          'Kakinada',
          'Kadapa',
          'Anantapur',
        ],
      },
      {
        name: 'Madhya Pradesh',
        cities: [
          'Indore',
          'Bhopal',
          'Jabalpur',
          'Gwalior',
          'Ujjain',
          'Sagar',
          'Dewas',
          'Satna',
          'Ratlam',
        ],
      },
      {
        name: 'Bihar',
        cities: [
          'Patna',
          'Gaya',
          'Bhagalpur',
          'Muzaffarpur',
          'Purnia',
          'Darbhanga',
          'Bihar Sharif',
          'Arrah',
          'Begusarai',
        ],
      },
      {
        name: 'Odisha',
        cities: [
          'Bhubaneswar',
          'Cuttack',
          'Rourkela',
          'Berhampur',
          'Sambalpur',
          'Puri',
          'Balasore',
        ],
      },
      {
        name: 'Assam',
        cities: [
          'Guwahati',
          'Silchar',
          'Dibrugarh',
          'Jorhat',
          'Nagaon',
          'Tinsukia',
          'Tezpur',
        ],
      },
      {
        name: 'Jharkhand',
        cities: [
          'Ranchi',
          'Jamshedpur',
          'Dhanbad',
          'Bokaro',
          'Deoghar',
          'Hazaribagh',
        ],
      },
      {
        name: 'Chhattisgarh',
        cities: [
          'Raipur',
          'Bhilai',
          'Bilaspur',
          'Korba',
          'Rajnandgaon',
          'Durg',
        ],
      },
      {
        name: 'Uttarakhand',
        cities: [
          'Dehradun',
          'Haridwar',
          'Roorkee',
          'Haldwani',
          'Rishikesh',
          'Nainital',
        ],
      },
      {
        name: 'Goa',
        cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
      },
      {
        name: 'Himachal Pradesh',
        cities: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Manali'],
      },
      {
        name: 'Jammu and Kashmir',
        cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur'],
      },
      {
        name: 'Chandigarh',
        cities: ['Chandigarh'],
      },
    ],
  },
  'United States': {
    name: 'United States',
    code: 'US',
    phoneCode: '+1',
    states: [
      {
        name: 'California',
        cities: [
          'Los Angeles',
          'San Francisco',
          'San Diego',
          'San Jose',
          'Sacramento',
          'Fresno',
          'Oakland',
          'Long Beach',
        ],
      },
      {
        name: 'New York',
        cities: [
          'New York City',
          'Buffalo',
          'Rochester',
          'Yonkers',
          'Syracuse',
          'Albany',
        ],
      },
      {
        name: 'Texas',
        cities: [
          'Houston',
          'Austin',
          'Dallas',
          'San Antonio',
          'Fort Worth',
          'El Paso',
          'Arlington',
        ],
      },
      {
        name: 'Florida',
        cities: [
          'Miami',
          'Orlando',
          'Tampa',
          'Jacksonville',
          'St. Petersburg',
          'Fort Lauderdale',
        ],
      },
      {
        name: 'Washington',
        cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
      },
      {
        name: 'Illinois',
        cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
      },
      {
        name: 'Massachusetts',
        cities: ['Boston', 'Worcester', 'Cambridge', 'Lowell', 'Springfield'],
      },
      {
        name: 'New Jersey',
        cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'],
      },
    ],
  },
  'United Arab Emirates': {
    name: 'United Arab Emirates',
    code: 'AE',
    phoneCode: '+971',
    states: [
      {
        name: 'Dubai',
        cities: [
          'Dubai City',
          'Downtown Dubai',
          'Dubai Marina',
          'Deira',
          'Jumeirah',
          'Business Bay',
          'Al Barsha',
        ],
      },
      {
        name: 'Abu Dhabi',
        cities: ['Abu Dhabi City', 'Al Ain', 'Al Dhafra', 'Khalifa City', 'Yas Island'],
      },
      {
        name: 'Sharjah',
        cities: ['Sharjah City', 'Khor Fakkan', 'Kalba', 'Al Dhaid'],
      },
      {
        name: 'Ajman',
        cities: ['Ajman City', 'Masfout', 'Manama'],
      },
      {
        name: 'Ras Al Khaimah',
        cities: ['Ras Al Khaimah City', 'Al Jazirah Al Hamra'],
      },
    ],
  },
  'United Kingdom': {
    name: 'United Kingdom',
    code: 'GB',
    phoneCode: '+44',
    states: [
      {
        name: 'England',
        cities: [
          'London',
          'Manchester',
          'Birmingham',
          'Leeds',
          'Liverpool',
          'Bristol',
          'Newcastle',
          'Sheffield',
          'Cambridge',
          'Oxford',
        ],
      },
      {
        name: 'Scotland',
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
      },
      {
        name: 'Wales',
        cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham'],
      },
      {
        name: 'Northern Ireland',
        cities: ['Belfast', 'Derry', 'Lisburn', 'Newry'],
      },
    ],
  },
  Canada: {
    name: 'Canada',
    code: 'CA',
    phoneCode: '+1',
    states: [
      {
        name: 'Ontario',
        cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London'],
      },
      {
        name: 'British Columbia',
        cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna'],
      },
      {
        name: 'Quebec',
        cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
      },
      {
        name: 'Alberta',
        cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
      },
    ],
  },
  Australia: {
    name: 'Australia',
    code: 'AU',
    phoneCode: '+61',
    states: [
      {
        name: 'New South Wales',
        cities: ['Sydney', 'Newcastle', 'Central Coast', 'Wollongong'],
      },
      {
        name: 'Victoria',
        cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
      },
      {
        name: 'Queensland',
        cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Townsville'],
      },
      {
        name: 'Western Australia',
        cities: ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'],
      },
    ],
  },
  Singapore: {
    name: 'Singapore',
    code: 'SG',
    phoneCode: '+65',
    states: [
      {
        name: 'Singapore',
        cities: ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
      },
    ],
  },
  Germany: {
    name: 'Germany',
    code: 'DE',
    phoneCode: '+49',
    states: [
      {
        name: 'Berlin',
        cities: ['Berlin'],
      },
      {
        name: 'Bavaria',
        cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg'],
      },
      {
        name: 'Hesse',
        cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt'],
      },
      {
        name: 'North Rhine-Westphalia',
        cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Bonn'],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Convenience Helper Functions
// ---------------------------------------------------------------------------

/** Get list of all available countries */
export function getCountries(): string[] {
  return Object.keys(LOCATION_DATA);
}

/** Get list of states for a specific country */
export function getStatesByCountry(countryName: string): string[] {
  const country = LOCATION_DATA[countryName];
  if (!country) return [];
  return country.states.map((s) => s.name);
}

/** Get list of cities for a specific country and state */
export function getCitiesByState(countryName: string, stateName: string): string[] {
  const country = LOCATION_DATA[countryName];
  if (!country) return [];
  const state = country.states.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return state ? state.cities : [];
}

/** Default export array of country names for direct mapping */
export const COUNTRIES: string[] = getCountries();

