import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videosByUser;
  cedulaUserInDb: any;
  keyRowUser: any;
  usuariosApp$: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) { 
    this.usuariosApp$ = db.list('/usuariosApp');
   }
  
  ngOnInit() {
    this.setUserVideos()
  }

   setUserVideos(){   

     this.usuariosApp$.push({
      cedula: '43903558',
      nombre: 'Valeria Escobar',
      perfil: '2',
      videos: [
        {
          imagenUrl: 'https://i.ytimg.com/vi/QMzoY48g924/default.jpg',
          observacion: 'REpetir 3 veces en cada sesión',
          titulo: '21. (ASP.NET Core 1.0 & MVC) Entity Framework Core Overview',
          videoId: 'QMzoY48g924'
        }
      ]       
    }).then((resp) => {                            
      console.log('setting Object OK:  '+ resp);
    },(err) => alert(err));


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

   deleteVideoAssignment(video){

    this.videosByUser
    .splice(this.videosByUser.findIndex(vs => vs.videoId==video.videoId), 1);

    this.db.object('/usuariosApp/' + this.keyRowUser)
    .update({
      videos: this.videosByUser
    });
   }

   AddVideoAssignment(){
    this.videosByUser
    .push({urlVideo: 'urlVideoAdded.com', videoId: 'eruio8954784mncxx' });
    console.log(this.videosByUser);

    this.db.object('/usuariosApp/' + this.keyRowUser)
    .update({
      videos: this.videosByUser
    });

   }
}
