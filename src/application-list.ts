import {inject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {ApplicationUpdated, ApplicationViewed} from "./messages";
import {ApplicationService} from "./services/application-service";

@inject(ApplicationService, EventAggregator)
export class ApplicationList {
    applications;
    selectedId = 0;

    constructor(private applicationService: ApplicationService, ea: EventAggregator) {
        ea.subscribe(ApplicationViewed, msg => this.select(msg.application));
        ea.subscribe(ApplicationUpdated, msg => {
            let id = msg.application.id;
            let found = this.applications.find(x => x.id == id);
            Object.assign(found, msg.application);
        });
    }

    created() {
        this.applicationService.getApplicationList().then(value => {
          this.applications = value.content as Application[];
          this.applicationService.isRequesting = false;
        }).catch(reason => {
          this.applicationService.isRequesting = false;
          throw new Error(reason.toString());
        });
    }

    select(application) {
        this.selectedId = application.id;
        return true;
    }
}
