

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // usersInDb = [
  //   {cedula: '71316663', name: 'Sergio Londoño', perfil: '1'},
  //   {cedula: '1017588974', name: 'Julian Sanchez', perfil: '2'},
  //   {cedula: '1015487569', name: 'Walter Quiroga', perfil: '2'}
  // ];

   usersInDb: any[];
   person: any;

    constructor(private router: Router, db: AngularFireDatabase
    ) { 
     db.list('/usuarios')
     .subscribe(usersInDb =>{
       this.usersInDb = usersInDb;
       console.log(this.usersInDb);
     });
    }

   ngOnInit(){
    this.router.navigate(['/home']);
  }  


    collapsed = true;
    toggleCollapsed(): void {
      this.collapsed = !this.collapsed;
    }

  public validateUserRoute(userIdentification: any){    
    this.person = this.usersInDb.find(u => u.cedula == userIdentification);
    if(this.person){
      if(this.person.perfil == '1')
      {
        this.router.navigate(['/videosAssignment'], { queryParams: { userIdentification: userIdentification } });
      }        
      else if(this.person.perfil == '2')
      {
        this.router.navigate(['/videosUser']);
      }        
    }
    else{
      alert("El usuario no se encuentra registrado en el sistema");
      this.router.navigate(['/home']);
    }
  }

}
