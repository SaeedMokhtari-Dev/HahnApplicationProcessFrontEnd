import {IApplication} from "./IApplication";

export class Application implements IApplication {
  id: number;
  name: string;
  familyName: string;
  address: string;
  countryOfOrigin: string;
  eMailAddress: string;
  age: number;
  hired: boolean;
  createdDate: Date;
  lastUpdated: Date;
}
