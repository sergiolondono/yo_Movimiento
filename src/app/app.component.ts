

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // angular 4 firebase authentication
  // https://gist.github.com/codediodeio/5e02b605f2ab015f2fb1e60497bd46bf

   userInDb: any[];
   person: any;

  constructor(private router: Router, private db: AngularFireDatabase) { }

   ngOnInit(){
   this.router.navigate(['/home']);
    //this.router.navigate(['/videosAssignment']);
  }  

    collapsed = true;
    toggleCollapsed(): void {
      this.collapsed = !this.collapsed;
    }

  public validateUserRoute(userIdentification: any){      
    this.db.list('/usuariosApp/', {
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
        alert("El usuario no se encuentra registrado en el sistema");        
      }
    });
    
  }


}
