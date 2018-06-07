

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

   userInDb: any[];
   person: any;
   collapsed = true;
   subscription: Subscription;

  constructor(private router: Router, private db: AngularFireDatabase,
              public toastr: ToastsManager, vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  showSuccess() {
    this.toastr.success('You are awesome!', 'Success!');
  }

  showError() {
    this.toastr.error('This is not good!', 'Oops!');
  }

  showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
  }

  showInfo() {
    this.toastr.info('Just some information for you.');
  }
  
  showCustom() {
    this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
  }

   ngOnInit(){
   this.router.navigate(['/home']);
    //this.router.navigate(['/patientsPhysio']);
  }  

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  public validateUserRoute(userIdentification: any){      
    this.subscription = this.db.list('/usuariosApp/', {
      query:{
        orderByChild: 'cedula',
        equalTo: userIdentification //'114587'
      }
    })
    .subscribe(userInDb =>{
      if(userInDb.length > 0){
        this.userInDb = userInDb;
        this.person = this.userInDb.find(u => u.cedula == userIdentification);
        if(this.person){
            if(this.person.perfil == '3')
            {
              this.router.navigate(['/videosAssignment'], { queryParams: { userIdentification: userIdentification } });
            }        
            else if(this.person.perfil == '2')
            {
              this.router.navigate(['/videosUser'],  { queryParams: { userIdentification: userIdentification } });
            }  
            else if(this.person.perfil == '1')
            {
              this.router.navigate(['/usersapplication']);
            }       
          }
      }
      else{
        this.router.navigate(['/home']);
        this.person = null;
        this.toastr.warning("El usuario no se encuentra registrado en el sistema");        
      }
    });
    
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
}
