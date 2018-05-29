import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'app-videosuser',
  templateUrl: './videosuser.component.html',
  styleUrls: ['./videosuser.component.css']
})
export class VideosuserComponent implements OnInit {

  private sub: any;
  private userRegistred: any;
  path = '/usuariosApp/';
  patientVideos$;

  constructor(private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router) { 
      
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.userRegistred = params['userIdentification'];
      
      db.list(this.path, {
            query:{
              orderByChild: 'cedula',
              equalTo: this.userRegistred
            }
            }).subscribe(userInDb =>{
              console.log(userInDb);
              if(userInDb.length > 0){
                this.patientVideos$ =  userInDb[0].videos;
            }
            else{
              this.patientVideos$ = null;
            }      
        });

    });

    

  }

  ngOnInit() {
  }

}
