import { Component, OnInit } from '@angular/core';
import { YoutubePlaylist } from '../services/youtube-playlist';
import { Playlist } from "../models/playlist";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operator/switchMap';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { resolve } from 'url';
import { reject } from 'q';

@Component({
  selector: 'app-videosassignment',
  templateUrl: './videosassignment.component.html',
  styleUrls: ['./videosassignment.component.css']
})
export class VideosassignmentComponent implements OnInit {

  keyRowUser: any;
  private playlist:Playlist[];
  private playlistYoutube:any;

  private msgErro: string;

  private listVideosforUser: any[] = [];
  private results: any = "";
  private resultCurrently: number = 0;
  private sumCurrently: number = 0;
  private isVisibleNext: boolean = true;
  private isVisibleLast: boolean = false;
  private videosSelected: any[] = [];
  private videosSavedDb: any[] = [];
  private videoToDelete: any[] = [];

  public canShowListVideos: boolean = false;
  public patientSelected: any;
  //videoxPaciente$: FirebaseListObservable<any[]>;

   pacients: any[];
   patients$;

   private dbPath: string = '/customers';
   private userRegistred: any;
   private sub: any;

   videosByUser;
   
   ngOnInit(){
    this.getplaylist();
 }

   constructor(private youtubePlaylist:YoutubePlaylist, private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router) { 

      this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userRegistred = params['userIdentification'] ;
      });

     this.patients$ = db.list('/fisioxpaciente', {
       query:{
         orderByChild: 'cedulaFisio',
         equalTo: Number(this.userRegistred)
       }
     });

     //this.videoxPaciente$ = db.list('/videosxpaciente');
   }

   getplaylist() {
  
    // this.youtubePlaylist.getplaylist("PLPrQRyn2uGR0sskMv0XC9gTrJHWRm35Ji")
    //   .subscribe(
    //    value => {console.log(value),
    //   playlist => this.playlist = playlist,
    //   error => this.msgErro = error});

       //  "PLPrQRyn2uGR0sskMv0XC9gTrJHWRm35Ji"
       //  "UUJl1YajcPWTeJNsQhGyMIMg"
       //  "PL9oRsvMekJFwjbL6B0s5TLHm1gU1zm8wv"
       this.playlistYoutube = this.youtubePlaylist.getplaylist("PLYMOUCVo86jGwWoSoEkpgnCJ3IPXIQmIC")
       .subscribe(value => {
              this.playlistYoutube = value;
              this.results = value.pageInfo["totalResults"];
              this.resultCurrently = value.items.length;
              this.sumCurrently = this.sumCurrently + this.resultCurrently;
              console.log(this.results);
               console.log(this.playlistYoutube);
               console.log(this.playlistYoutube.items);
      });
  }

  nextPage(pageToken:string, resultsPerPage: any, type: string){
    this.isVisibleNext = true;
    if(type == 'last'){
      this.sumCurrently = this.sumCurrently - resultsPerPage;
      if(this.sumCurrently <= 10){
          this.isVisibleLast = false;
      }
    }
    else if(type == 'next'){
      this.isVisibleLast = true;
      this.sumCurrently = this.sumCurrently + resultsPerPage;
          if(this.results <=  this.sumCurrently){
            this.isVisibleNext = false;
            this.sumCurrently = this.results;
          }
          else{
            this.isVisibleNext = true;
          }
    }

    this.playlistYoutube = this.youtubePlaylist
    .playlistList_page("PLYMOUCVo86jGwWoSoEkpgnCJ3IPXIQmIC",pageToken)
    .subscribe(value => {
              this.playlistYoutube = value;
              this.resultCurrently = value.items.length;
               console.log(this.playlistYoutube);
               console.log(this.playlistYoutube.items);
      });
  }
    
    public addRow(video: any, observation: string, patientSelected: string){
      if(!this.videosSelected.find(vs => vs.videoId==video.snippet.resourceId.videoId))
      {
          this.videosSelected
          .push({
            imagenUrl: video.snippet.thumbnails.default.url,
            observacion: observation,
            titulo: video.snippet.title,
            videoId: video.snippet.resourceId.videoId
          });
      }
      else{
        this.videosSelected
        .splice(this.videosSelected.findIndex(vs => vs.videoId==video.snippet.resourceId.videoId), 1);
      }
    }

    public saveList(listVideos: any, selectedOptionPatients: any){
      for(let i = 0; i < listVideos.length; i++){

        /// Update sobre usuariosApp
        this.videosByUser
        .push(
          {
            imagenUrl: listVideos[i].imagenUrl,
            observacion: listVideos[i].observacion,
            titulo: listVideos[i].titulo,
            videoId: listVideos[i].videoId
          });

        this.db.object('/usuariosApp/' + this.keyRowUser)
        .update({
          videos: this.videosByUser
        });

            // this.videoxPaciente$.push({
            //   imagenUrl: listVideos[i].imagenUrl,
            //   videoId: listVideos[i].videoId,
            //   titulo: listVideos[i].titulo,
            //   observacion: listVideos[i].observacion,
            //   cedulaPaciente: selectedOptionPatients          
            // }).then((resp) => {                            
            //   console.log('setting Object OK:  '+ resp);
            // },(err) => alert(err));

            if(i == listVideos.length - 1){
              this.videosSelected.splice(0, this.videosSelected.length);
            }

        }  
      }

    public onChange(args){
      if(args.target.value != 0)
      {
      //  this.db.list('/videosxpaciente',
      //   {
      //     query:{
      //       orderByChild: 'cedulaPaciente',
      //       equalTo: args.target.value
      //     }
      //   })
      //     .subscribe(usersInDb =>{
      //     this.videosSavedDb = usersInDb;
      //   });

       this.patientSelected = args.target.options[args.target.selectedIndex].text;
       this.canShowListVideos = true;

        console.log(this.videosSavedDb);

        ///////////////////////////////////////////////////////
        this.db.list('/usuariosApp/', {
          query:{
            orderByChild: 'cedula',
            equalTo: args.target.value //'114587'
          }
        })
        .subscribe(userInDb =>{
          if(userInDb.length > 0){
             this.videosByUser =  userInDb[0].videos;
             this.keyRowUser = userInDb[0].$key;
          }
          else{
           this.videosByUser = null;
          }
          
          console.log(this.videosByUser);
        });


      }
      else
        this.canShowListVideos = false;
    }

    // public deleteVideoDb(videoUser: any){
    //   this.db.object('/videosxpaciente/' + videoUser.$key)
    //   .remove()
    //   .then(resp => console.log("Object: " + videoUser.$key + " Deleted"));
    // }

    public deleteVideoAssignment(videoUser: any){
      this.videosByUser
      .splice(this.videosByUser.findIndex(vs => vs.videoId==videoUser.videoId), 1);
  
      this.db.object('/videosxpaciente/' + this.keyRowUser)
      .update({
        videos: this.videosByUser
      });
    }

    public deleteVideo(videoUser: any){
      this.videosSelected
      .splice(this.videosSelected.findIndex(vs => vs.videoId==videoUser.videoId), 1);
    }
}
