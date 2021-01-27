import {inject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {ApplicationCreated, ApplicationUpdated, ApplicationViewed} from "./messages";
import {ApplicationService} from "./services/application-service";
import {IApplication} from "./models/IApplication";
import {Application} from "./models/Application";
import Swal from 'sweetalert2'
import {Router} from "aurelia-router";
import {IResponseModel} from "./models/IResponseModel";
import {
  ValidateInstruction,
  validateTrigger,
  ValidationController,
  ValidationControllerFactory,
  ValidationRules
} from "aurelia-validation";
import {BootstrapFormRenderer} from "./Utility/bootstrap-form-renderer";
import {areEqual} from "./Utility/utility";

@inject(ApplicationService, EventAggregator, Router, ValidationRules, ValidationControllerFactory)
export class ApplicationDetail {
    routeConfig;
    application: IApplication;
    originalApplication: IApplication;
    controller: ValidationController;
    rules: any;
    constructor(private applicationService: ApplicationService, private ea: EventAggregator,
                private router: Router, private validationRules: ValidationRules,
                private controllerFactory: ValidationControllerFactory
    ) {
      this.controller = controllerFactory.createForCurrentScope();
      this.controller.addRenderer(new BootstrapFormRenderer());
      this.rules = ValidationRules.ensure((p: IApplication) => p.name).displayName('Name')
        .required().withMessage(`\${$displayName} cannot be blank.`).minLength(5)
        .ensure((p: IApplication) => p.familyName).displayName('Family Name')
        .required().withMessage(`\${$displayName} cannot be blank.`).minLength(5)
        .ensure((p: IApplication) => p.address).displayName('Address')
        .required().withMessage(`\${$displayName} cannot be blank.`).minLength(10)
        .ensure((p: IApplication) => p.age).displayName('Age')
        .required().withMessage(`\${$displayName} cannot be blank.`).between(20, 60)
        .ensure((p: IApplication) => p.countryOfOrigin).displayName('Country Of Origin')
        .required().withMessage(`\${$displayName} cannot be blank.`)
        .ensure((p: IApplication) => p.eMailAddress).displayName('EMailAddress')
        .required().withMessage(`\${$displayName} cannot be blank.`).email()
        .rules;
    }
    activate(params, routeConfig) {
      debugger;
        this.routeConfig = routeConfig;
        if(params.id)
        {
          return this.applicationService.getApplicationDetails(params.id).then(application => {
            this.application = application.content as IApplication;
            this.routeConfig.navModel.setTitle(this.application.name);
            this.originalApplication = JSON.parse(JSON.stringify(this.application));
            this.ea.publish(new ApplicationViewed(this.application));
            this.applicationService.isRequesting = false;
          });  
        }
        else {
          this.application = new Application();
        }
    }

    get canSave() {
      return !this.applicationService.isRequesting;
    }

    submit() {
      this.controller.validate({object: this.application, rules: this.rules})
        .then(result => {
          debugger;
          if (result.valid) {
            if(this.application.id)
            {
              this.applicationService.updateApplication(this.application)
                .then(response => this.onUpdatedSuccessfully(response))
                .catch(reason => this.onFailed(reason));
            }
            else {
              debugger;
              this.applicationService.createApplication(this.application)
                .then(response => this.onCreatedSuccessfully(response))
                .catch(reason => this.onFailed(reason));
            }
          } else {
            Swal.fire({
              title: 'Error!',
              text: result.results.filter(w => w.message).map(w => w.message).join(' , '),
              icon: 'error',
              confirmButtonText: 'Cool'
            })
          }
        });
    }
  onCreatedSuccessfully(response){
      debugger;
      const responseModel = response.content as IResponseModel;
      this.application.id = responseModel.entityId;
      this.ea.publish(new ApplicationCreated(this.application));
      this.applicationService.isRequesting = false;
      Swal.fire({
        title: 'Success',
        text: 'Do you want to create a new one?',
        showDenyButton: true,
        icon: 'success',
        confirmButtonText: 'Yup',
        denyButtonText: 'Nop',
      }).then(value => {
        if(value.isConfirmed){
          this.application = new Application();
        }
        else {
          this.router.navigateToRoute("editApplication", {id: this.application.id});
        }
      })
    }
  onUpdatedSuccessfully(response){
      debugger;
      const responseModel = response.content as IResponseModel;
      this.application.id = responseModel.entityId;
      this.ea.publish(new ApplicationUpdated(this.application));
      this.applicationService.isRequesting = false;
      Swal.fire({
        title: 'Success',
        text: 'Congrats! Successfully Updated',
        icon: 'success'
      });
    }
    onFailed(reason){
      debugger;
      this.applicationService.isRequesting = false;
      Swal.fire({
        title: 'Error!',
        text: reason.response,
        icon: 'error',
        confirmButtonText: 'Cool'
      })
    }
  get canReset(): boolean {
      let canReset: boolean = false;
    for (let applicationKey in this.application) {
      switch (typeof(this.application[applicationKey]))
      {
        case "string":
          if(this.application[applicationKey] != "")
            canReset = true;
          break;
        case "number":
          if(this.application[applicationKey] > 0)
            canReset = true;
          break;
      }
    }
    return canReset;
  }
  reset() {
    Swal.fire({
      title: 'question',
      text: 'Are you sure you want to reset this form?',
      showDenyButton: true,
      icon: 'question',
      confirmButtonText: 'Yup',
      denyButtonText: 'Nop',
    }).then(value => {
      if(value.isConfirmed){
        this.application = new Application();
        this.controller.revalidateErrors();
      }
    });
  }
}

