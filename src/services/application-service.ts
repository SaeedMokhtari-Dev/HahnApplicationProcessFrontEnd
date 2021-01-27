import {HttpClient} from 'aurelia-http-client';
import {inject} from "aurelia-framework";
import {IApplication} from "../models/IApplication";

@inject(HttpClient)
export class ApplicationService {
  isRequesting = false;
  
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getApplicationDetails(id: number){
    this.isRequesting = true;    
    return  this.httpClient.get(
      `https://localhost:5001/api/applicant/${id}`
    );
  }
  getApplicationList(){
    this.isRequesting = true;
    
    return this.httpClient.get(
      `https://localhost:5001/api/applicant`
    );
  }
  createApplication(application: IApplication){
    this.isRequesting = true;
    
    return this.httpClient.post(
      `https://localhost:5001/api/applicant`, application
    );
  }
  updateApplication(application: IApplication){
    this.isRequesting = true;
    
    return this.httpClient.put(
      `https://localhost:5001/api/applicant`, application
    );
  }
}
