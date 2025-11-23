export interface Region {
  countryName: String;
  abbr: String;
  regions: [
    {
      name: String,
      abbr: String,
    },
  ],
}