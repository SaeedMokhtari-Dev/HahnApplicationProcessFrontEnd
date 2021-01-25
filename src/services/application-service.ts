import {HttpClient} from 'aurelia-http-client';
import {inject} from "aurelia-framework";

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
}
