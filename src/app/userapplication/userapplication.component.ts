import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-userapplication',
  templateUrl: './userapplication.component.html',
  styleUrls: ['./userapplication.component.css']
})
export class UserapplicationComponent implements OnInit, OnDestroy {

  perfiles;
  userSavedDb:any[];
  username: any;
  usuariosApp$: FirebaseListObservable<any[]>;
  usersToShow: any[];
  userToShow: any[];
  showUsers: boolean;
  path = '/usuariosApp/';

  subscription: Subscription;
  subscriptionGetAllUsers: Subscription;
  subscriptionSearchUserbyId: Subscription;
  subscriptionSubmit: Subscription;

  constructor(private db: AngularFireDatabase) { 
    this.subscription = this.db.list('/perfiles/')
    .subscribe(profiles => {
      this.perfiles = profiles;
    });

    this.getAllUsers();

    this.showUsers = true;
  }

  ngOnInit() {
    this.usuariosApp$ = this.db.list(this.path);
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }

    if(this.subscriptionGetAllUsers){
      this.subscriptionGetAllUsers.unsubscribe();
    }

    if(this.subscriptionSearchUserbyId){
      this.subscriptionSearchUserbyId.unsubscribe();
    }

    if(this.subscriptionSubmit){
      this.subscriptionSubmit.unsubscribe();
    }          
  }

  getAllUsers(){
    this.subscriptionGetAllUsers = this.db.list(this.path)
    .subscribe(usersToShow =>{
      this.usersToShow = usersToShow;
      this.showUsers = true;
    });
  }

  searchUserbyId(textoBusqueda){
    this.subscriptionSearchUserbyId = this.db.list(this.path, {
      query:{
        orderByChild: 'cedula',
        equalTo: textoBusqueda
        }
      })
    .subscribe(userToShow =>{
      if(userToShow.length > 0){
        this.userToShow = userToShow;
        this.showUsers = false;
      }else this.showUsers = true;

    });
  }

  submit(f: NgForm){
   
    const fFields = f.form.controls;
    
    this.subscriptionSubmit = this.db.list(this.path, {
      query:{
        orderByChild: 'cedula',
        equalTo: fFields.idUser.value
      }
    })
     .subscribe(userInDb =>{
      this.userSavedDb = userInDb
     });  

     if(this.userSavedDb){
       if(this.userSavedDb.length > 0)
       {
         alert('El usuario ya se encuentra registrado en la base de datos');
       }
       else{
        this.usuariosApp$.push({
          cedula: fFields.idUser.value,
          nombre: fFields.username.value,
          perfil: fFields.cmbPerfil.value      
        }).then((resp) => {                            
          alert('Usuario registrado correctamente');
          f.reset();
          this.userSavedDb = [];
        },(err) => alert(err));
          console.log(fFields);
      }
    }

  }

  deleteUser(user){
      this.db.object(this.path + user.$key)
      .remove()
      .then(resp => console.log("Object: " + user.$key + " Deleted"));
  }
}
