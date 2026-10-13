export interface Locality {
  name: string;
  lat: number;
  lng: number;
}

export interface CityInfo {
  name: string;
  state: string;
  isDefault?: boolean;
  center: { lat: number; lng: number };
  localities: Locality[];
}

export const CITIES_DATA: CityInfo[] = [
  {
    name: 'Pune',
    state: 'Maharashtra',
    isDefault: true,
    center: { lat: 18.5204, lng: 73.8567 },
    localities: [
      { name: 'Akurdi', lat: 18.6492, lng: 73.7707 },
      { name: 'Aundh', lat: 18.5580, lng: 73.8075 },
      { name: 'Baner', lat: 18.5590, lng: 73.7868 },
      { name: 'Bavdhan', lat: 18.5135, lng: 73.7698 },
      { name: 'Bhosari', lat: 18.6247, lng: 73.8436 },
      { name: 'Camp', lat: 18.5167, lng: 73.8792 },
      { name: 'Chinchwad', lat: 18.6271, lng: 73.7821 },
      { name: 'Dapodi', lat: 18.5815, lng: 73.8315 },
      { name: 'Deccan', lat: 18.5173, lng: 73.8415 },
      { name: 'Dhayari', lat: 18.4485, lng: 73.8097 },
      { name: 'Hadapsar', lat: 18.5089, lng: 73.9260 },
      { name: 'Hinjawadi', lat: 18.5913, lng: 73.7389 },
      { name: 'Katraj', lat: 18.4575, lng: 73.8677 },
      { name: 'Kharadi', lat: 18.5516, lng: 73.9348 },
      { name: 'Kondhwa', lat: 18.4735, lng: 73.8920 },
      { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
      { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
      { name: 'Lohegaon', lat: 18.5898, lng: 73.9215 },
      { name: 'Narhe', lat: 18.4552, lng: 73.8219 },
      { name: 'Nigdi', lat: 18.6534, lng: 73.7692 },
      { name: 'Pimple Gurav', lat: 18.5878, lng: 73.8189 },
      { name: 'Pimple Saudagar', lat: 18.5987, lng: 73.7925 },
      { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
      { name: 'Shivajinagar', lat: 18.5308, lng: 73.8475 },
      { name: 'Sinhagad Road', lat: 18.4867, lng: 73.8245 },
      { name: 'Swargate', lat: 18.5018, lng: 73.8586 },
      { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
      { name: 'Vishrantwadi', lat: 18.5714, lng: 73.8789 },
      { name: 'Wakad', lat: 18.5987, lng: 73.7631 },
      { name: 'Wagholi', lat: 18.5808, lng: 73.9806 },
      { name: 'Yerawada', lat: 18.5529, lng: 73.8797 },
    ],
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    center: { lat: 19.0760, lng: 72.8777 },
    localities: [
      { name: 'Andheri', lat: 19.1136, lng: 72.8697 },
      { name: 'Bandra', lat: 19.0596, lng: 72.8295 },
      { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
      { name: 'Mahim', lat: 19.0354, lng: 72.8432 },
      { name: 'Parel', lat: 19.0096, lng: 72.8427 },
    ],
  },
  {
    name: 'Navi Mumbai',
    state: 'Maharashtra',
    center: { lat: 19.0330, lng: 73.0297 },
    localities: [
      { name: 'Belapur', lat: 19.0180, lng: 73.0416 },
      { name: 'Kharghar', lat: 19.0473, lng: 73.0699 },
      { name: 'Nerul', lat: 19.0330, lng: 73.0182 },
      { name: 'Vashi', lat: 19.0771, lng: 72.9986 },
    ],
  },
  {
    name: 'Thane',
    state: 'Maharashtra',
    center: { lat: 19.2183, lng: 72.9781 },
    localities: [
      { name: 'Ghodbunder Road', lat: 19.2736, lng: 72.9348 },
      { name: 'Majiwada', lat: 19.2144, lng: 72.9818 },
      { name: 'Thane West', lat: 19.2183, lng: 72.9781 },
    ],
  },
  {
    name: 'Nagpur',
    state: 'Maharashtra',
    center: { lat: 21.1458, lng: 79.0882 },
    localities: [
      { name: 'Dharampeth', lat: 21.1420, lng: 79.0620 },
      { name: 'Ramdaspeth', lat: 21.1350, lng: 79.0730 },
      { name: 'Sitabuldi', lat: 21.1440, lng: 79.0830 },
    ],
  },
  {
    name: 'Nashik',
    state: 'Maharashtra',
    center: { lat: 19.9975, lng: 73.7898 },
    localities: [
      { name: 'College Road', lat: 20.0050, lng: 73.7650 },
      { name: 'Gangapur', lat: 20.0210, lng: 73.7380 },
      { name: 'Panchavati', lat: 20.0120, lng: 73.7930 },
    ],
  },
  {
    name: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    center: { lat: 19.8762, lng: 75.3433 },
    localities: [
      { name: 'CIDCO', lat: 19.8780, lng: 75.3620 },
      { name: 'Jalna Road', lat: 19.8750, lng: 75.3550 },
      { name: 'Samarthnagar', lat: 19.8820, lng: 75.3340 },
    ],
  },
  {
    name: 'Kolhapur',
    state: 'Maharashtra',
    center: { lat: 16.7050, lng: 74.2433 },
    localities: [
      { name: 'Rajarampuri', lat: 16.6970, lng: 74.2470 },
      { name: 'Tarabai Park', lat: 16.7110, lng: 74.2380 },
    ],
  },
  {
    name: 'Solapur',
    state: 'Maharashtra',
    center: { lat: 17.6599, lng: 75.9064 },
    localities: [
      { name: 'Hotgi Road', lat: 17.6420, lng: 75.9230 },
      { name: 'Jule Solapur', lat: 17.6510, lng: 75.8940 },
    ],
  },
  {
    name: 'Satara',
    state: 'Maharashtra',
    center: { lat: 17.6805, lng: 73.9930 },
    localities: [
      { name: 'Powai Naka', lat: 17.6850, lng: 73.9980 },
      { name: 'Sadashiv Peth', lat: 17.6780, lng: 73.9910 },
    ],
  },
  {
    name: 'Sangli',
    state: 'Maharashtra',
    center: { lat: 16.8524, lng: 74.5815 },
    localities: [
      { name: 'Market Yard', lat: 16.8480, lng: 74.5880 },
      { name: 'Vishrambag', lat: 16.8410, lng: 74.6020 },
    ],
  },
  {
    name: 'Ahilyanagar',
    state: 'Maharashtra',
    center: { lat: 19.0948, lng: 74.7480 },
    localities: [
      { name: 'Savedi', lat: 19.1180, lng: 74.7390 },
      { name: 'Station Road', lat: 19.0910, lng: 74.7520 },
    ],
  },
];

export const DEFAULT_CITY = 'Pune';
export const DEFAULT_PUNE_COORDS = { lat: 18.5204, lng: 73.8567 };
