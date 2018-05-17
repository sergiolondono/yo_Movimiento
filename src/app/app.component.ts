//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  users = [
    {identification: '7', name: 'Sergio Londoño', profile: '1'},
    {identification: '1017588974', name: 'Julian Sanchez', profile: '2'},
    {identification: '1015487569', name: 'Walter Quiroga', profile: '2'}
  ];

   constructor(private router: Router) { }

   ngOnInit(){
    this.router.navigate(['/home'])
  }  

  public validateUserRoute(userIdentification: any){
    let person: any;
    person = this.users.find(u => u.identification == userIdentification);
    if(person){
      if(person.profile == '1')
        this.router.navigate(['/videosAssignment'])
      else if(person.profile == '2')
        this.router.navigate(['/videosUser'])
    }
    else{
      alert("El usuario no se encuentra registrado en el sistema");
    }
  }
}
