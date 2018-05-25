import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videosByUser;
  perfiles;
  cedulaUserInDb: any;
  keyRowUser: any;
  usuariosApp$: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) { 
    this.usuariosApp$ = db.list('/usuariosApp/');

    this.db.list('/perfiles/')
    .subscribe(profiles => {
      this.perfiles = profiles;
    });

   }
  
  ngOnInit() {
    //this.setUserVideos();
  }

   setUserVideos(){   

    //  this.usuariosApp$.push({
    //   cedula: '71',
    //   nombre: 'Andres Gallo',
    //   perfil: '1'       
    // }).then((resp) => {                            
    //   console.log('setting Object OK:  '+ resp);
    // },(err) => alert(err));


    // this.db.list('/usuariosApp/', {
    //   query:{
    //     orderByChild: 'cedula',
    //     equalTo: '71555888'
    //   }
    // })
    //  .subscribe(userInDb =>{
    //    this.videosByUser = userInDb[0].videos;
    //    //this.userInDb = userInDb;
    //    this.keyRowUser = userInDb[0].$key;
    //    console.log(this.videosByUser);
    //  });

   }
}
