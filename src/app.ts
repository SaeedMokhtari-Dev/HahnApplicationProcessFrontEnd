import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';

export class App {
  router: Router;

  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Applications';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '',              moduleId: PLATFORM.moduleName('no-selection'),   title: 'Select'},
      { route: 'applications/:id',  moduleId: PLATFORM.moduleName('application-detail'), name:'applications' }
    ]);

    this.router = router;
  }
}
  
