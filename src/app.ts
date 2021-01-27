import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';
import {ApplicationService} from "./services/application-service";

@inject(ApplicationService)
export class App {
  router: Router;

  constructor(applicationService: ApplicationService) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Applications';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '',              moduleId: PLATFORM.moduleName('no-selection'),   title: 'Select'},
      { route: 'applications/new',  moduleId: PLATFORM.moduleName('application-detail'), name:'newApplication'},
      { route: 'applications/:id/edit',  moduleId: PLATFORM.moduleName('application-detail'), name:'editApplication'}
    ]);

    this.router = router;
  }
}
  
