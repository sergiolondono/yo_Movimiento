import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-userapplication',
  templateUrl: './userapplication.component.html',
  styleUrls: ['./userapplication.component.css']
})
export class UserapplicationComponent implements OnInit {

  perfiles;
  username: any;
  usuariosApp$: FirebaseListObservable<any[]>;
  
  constructor(private db: AngularFireDatabase) { 
    this.db.list('/perfiles/')
    .subscribe(profiles => {
      this.perfiles = profiles;
    });

    this.usuariosApp$ = db.list('/usuariosApp/');
  }

  ngOnInit() {
  }

  saveUser(userName, idUser){
    alert(userName + idUser);
  }

  submit(f: NgForm){
    const fFields = f.form.controls;

    this.db.list('/usuariosApp/', {
      query:{
        orderByChild: 'cedula',
        equalTo: fFields.idUser.value
      }
    })
     .subscribe(userInDb =>{
      if(userInDb.length > 0)
        alert('El usuario ya se encuentra registrado en la base de datos');
      else{
        this.usuariosApp$.push({
          cedula: fFields.idUser.value,
          nombre: fFields.username.value,
          perfil: fFields.cmbPerfil.value      
        }).then((resp) => {                            
          alert('setting Object OK:  '+ resp);
          f.reset();
        },(err) => alert(err));
          console.log(fFields);
        }
     });     
  }

}
