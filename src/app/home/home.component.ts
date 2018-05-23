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

    //  this.usuariosApp$.push({
    //   cedula: '71555888',
    //   nombre: 'Francisco Garzón',
    //   perfil: '2',
    //   videos: [
    //     {
    //       urlVideo: 'urlVideo4.com',
    //       videoId: 'asjdfkj489'
    //     },
    //     {
    //       urlVideo: 'urlVideo5.com',
    //       videoId: 'hhdfg45454d'
    //     },
    //     {
    //       urlVideo: 'urlVideo6.com',
    //       videoId: 'dfg45-46d4'
    //     },
    //     {
    //       urlVideo: 'urlVideo7.com',
    //       videoId: 'jdfkjklf9834jsdf'
    //     }
    //   ]       
    // }).then((resp) => {                            
    //   console.log('setting Object OK:  '+ resp);
    // },(err) => alert(err));


    this.db.list('/usuariosApp/', {
      query:{
        orderByChild: 'cedula',
        equalTo: '71555888'
      }
    })
     .subscribe(userInDb =>{
       this.videosByUser = userInDb[0].videos;
       //this.userInDb = userInDb;
       this.keyRowUser = userInDb[0].$key;
       console.log(this.videosByUser);
     });

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
