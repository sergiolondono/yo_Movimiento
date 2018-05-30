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

   pathListYoutube = "PLfYS6LODaQb0rqsKgWy0yKcSq9usfXxqd";

   videosByUser: any[] =[];
   
   path = '/usuariosApp/';

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

      db.list(this.path, {
       query:{
         orderByChild: 'cedula',
         equalTo: this.userRegistred
       }
        }).subscribe(userInDb =>{
          if(userInDb.length > 0){
            this.patients$ =  userInDb[0].pacientes;
        }
        else{
          this.patients$ = null;
        }      
    });
     
  }

   getplaylist() {
       //  "PLfYS6LODaQb0UtC49jMbiKAFTt7U_2sT7" 96 videos YoMovimiento
       // "PLYMOUCVo86jGwWoSoEkpgnCJ3IPXIQmIC" 56 videos .NET
       // Bípedos PLfYS6LODaQb3y3QudVu9tweEYrd9mG9Vp
       this.playlistYoutube = this.youtubePlaylist.getplaylist(this.pathListYoutube)
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
    .playlistList_page(this.pathListYoutube,pageToken)
    .subscribe(value => {
              this.playlistYoutube = value;
              this.resultCurrently = value.items.length;
               console.log(this.playlistYoutube);
               console.log(this.playlistYoutube.items);
      });
  }
    
  public onChange(args){
    if(args.target.value != 0)
    {
     this.patientSelected = args.target.options[args.target.selectedIndex].text;
     this.canShowListVideos = true;

      this.db.list(this.path, {
        query:{
          orderByChild: 'cedula',
          equalTo: args.target.value //'114587'
        }
      })
      .subscribe(userInDb =>{
       if(userInDb.length > 0){
         if(userInDb[0].videos){
          this.videosByUser =  userInDb[0].videos;
         }
           this.keyRowUser = userInDb[0].$key;
        }
      });
      console.log(this.videosByUser);
    }
    else
      this.canShowListVideos = false;
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
      console.log(this.videosByUser);
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

          this.db.object(this.path + this.keyRowUser)
          .update({
            videos: this.videosByUser
          });
          
          if(i == listVideos.length - 1){
            this.videosSelected.splice(0, this.videosSelected.length);
          }

        }  
    }

    public deleteVideoAssignment(videoUser: any){
      this.videosByUser
      .splice(this.videosByUser.findIndex(vs => vs.videoId==videoUser.videoId), 1);
  
      this.db.object(this.path + this.keyRowUser)
      .update({
        videos: this.videosByUser
      });
    }

    public deleteVideo(videoUser: any){
      this.videosSelected
      .splice(this.videosSelected.findIndex(vs => vs.videoId==videoUser.videoId), 1);
    }

    private resetValuesListYoutube()
    {
      this.sumCurrently = 0;
      this.isVisibleNext = true;
      this.isVisibleLast = false;
    }

    public changePathYoutube(typeVideos){
      switch(typeVideos) { 
        case 'sedentes': { 
          this.pathListYoutube = 'PLfYS6LODaQb0rqsKgWy0yKcSq9usfXxqd';
          this.resetValuesListYoutube();
          this.getplaylist();
           break; 
        } 
        case 'bipedos': { 
           this.pathListYoutube = 'PLfYS6LODaQb3y3QudVu9tweEYrd9mG9Vp';
           this.resetValuesListYoutube();
           this.getplaylist();
           break; 
        } 
        case 'cuadrupedos': { 
          this.pathListYoutube = 'PLfYS6LODaQb3UHoQm0EvGe51LVQJHBwrZ';
          this.resetValuesListYoutube();
          this.getplaylist();
          break; 
       } 
        default: { 
           //statements; 
           break; 
        } 
     }
    }
}
