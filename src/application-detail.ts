import {inject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {ApplicationUpdated, ApplicationViewed} from "./messages";
import {areEqual} from "./utility";
import {ApplicationService} from "./services/application-service";

@inject(ApplicationService, EventAggregator)
export class ApplicationDetail {
    routeConfig;
    application: Application;
    originalApplication: Application;

    constructor(private applicationService: ApplicationService, private ea: EventAggregator) {
    }

    activate(params, routeConfig) {
        this.routeConfig = routeConfig;

        return this.applicationService.getApplicationDetails(params.id).then(application => {
            this.application = application.content as Application;
            this.routeConfig.navModel.setTitle(this.application.name);
            this.originalApplication = JSON.parse(JSON.stringify(this.application));
            this.ea.publish(new ApplicationViewed(this.application));
            this.applicationService.isRequesting = false;
        });
    }

    get canSave() {
        return this.application.name && this.application.familyName && !this.applicationService.isRequesting;
    }

    save() {
        /*this.applicationService.saveApplication(this.application).then(application => {
            this.application = <Application>application;
            this.routeConfig.navModel.setTitle(this.application.name);
            this.originalApplication = JSON.parse(JSON.stringify(this.application));
            this.ea.publish(new ApplicationUpdated(this.application));
        });*/
    }

    canDeactivate() {
        if (!areEqual(this.originalApplication, this.application)) {
            let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

            if (!result) {
                this.ea.publish(new ApplicationViewed(this.application));
            }

            return result;
        }

        return true;
    }
}
