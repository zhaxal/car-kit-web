export interface Element {
  Name: string;
  Value: any;
  Units: any | undefined;
}

export interface Avl {
  Altitude: number;
  Lat: number;
  Lng: number;
  Speed: number;
  Time: number;
  Elements: Element[];
}

export interface Device {
  IMEI: string;
  name: string;
  Lat: number | undefined;
  Lng: number | undefined;
  owner: string[] | undefined;
}


