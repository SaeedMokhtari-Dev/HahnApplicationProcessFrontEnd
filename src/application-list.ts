import {inject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {ApplicationCreated, ApplicationUpdated, ApplicationViewed} from "./messages";
import {ApplicationService} from "./services/application-service";
import {IApplication} from "./models/IApplication";

@inject(ApplicationService, EventAggregator)
export class ApplicationList {
  applications;
  selectedId = 0;

  constructor(private applicationService: ApplicationService, ea: EventAggregator) {
    ea.subscribe(ApplicationViewed, msg => this.select(msg.application));
    ea.subscribe(ApplicationCreated, msg => {
      debugger;
      this.created();
    });
    ea.subscribe(ApplicationUpdated, msg => {
      let id = msg.application.id;
      let found = this.applications.find(x => x.id == id);
      Object.assign(found, msg.application);
    });
  }

  created() {
    this.applicationService.getApplicationList().then(value => {
      debugger;
      this.applications = value.content as IApplication[];
      this.applicationService.isRequesting = false;
      this.applications = this.applications.sort((a, b) => (a.id > b.id) ? 1 : -1);
      this.select(this.applications[this.applications.length - 1]);
    }).catch(reason => {
      this.applicationService.isRequesting = false;
      throw new Error(reason.toString());
    });
  }

  select(application) {
    debugger;
    if(application) this.selectedId = application.id;
    else this.selectedId = 0;
    return true;
  }
}
