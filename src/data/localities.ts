export interface CityLocality {
  city: string;
  localities: string[];
}

export const CITIES_DATA: CityLocality[] = [
  {
    city: 'Bengaluru',
    localities: [
      'Koramangala',
      'Indiranagar',
      'HSR Layout',
      'Whitefield',
      'Bellandur',
      'Sarjapur Road',
      'BTM Layout',
      'JP Nagar',
      'Electronic City',
      'Marathahalli',
      'Richmond Town',
    ],
  },
  {
    city: 'Mumbai',
    localities: [
      'Powai',
      'Andheri West',
      'Andheri East',
      'Bandra West',
      'Juhu',
      'Lower Parel',
      'Goregaon West',
      'Malad West',
      'Thane West',
      'Khar',
    ],
  },
  {
    city: 'Delhi-NCR',
    localities: [
      'Gurgaon Sector 56',
      'Gurgaon Sector 43',
      'Gurgaon DLF Phase 5',
      'Gurgaon Golf Course Ext',
      'Noida Sector 62',
      'Noida Sector 137',
      'Saket',
      'Hauz Khas',
      'Vasant Kunj',
    ],
  },
  {
    city: 'Pune',
    localities: [
      'Hinjewadi Phase 1',
      'Wakad',
      'Baner',
      'Koregaon Park',
      'Viman Nagar',
      'Kharadi',
      'Kothrud',
    ],
  },
  {
    city: 'Hyderabad',
    localities: [
      'Gachibowli',
      'Hitec City',
      'Madhapur',
      'Kondapur',
      'Jubilee Hills',
      'Banjara Hills',
    ],
  },
];

export const ALL_LOCALITIES = CITIES_DATA.flatMap(c =>
  c.localities.map(loc => ({ city: c.city, locality: loc }))
);

