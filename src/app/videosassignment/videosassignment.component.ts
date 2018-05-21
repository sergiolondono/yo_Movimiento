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

  public canShowListVideos: boolean = false;
  public patientSelected: any;
  videoxPaciente$: FirebaseListObservable<any[]>;

  // this.videosSelected = this.videoxPaciente$;


   pacients: any[];
   patients$;

   private dbPath: string = '/customers';
   private userRegistred: any;
   private sub: any;

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

     this.videoxPaciente$ = db.list('/videosxpaciente');
   }

   getplaylist() {
  
    // this.youtubePlaylist.getplaylist("PLPrQRyn2uGR0sskMv0XC9gTrJHWRm35Ji")
    //   .subscribe(
    //    value => {console.log(value),
    //   playlist => this.playlist = playlist,
    //   error => this.msgErro = error});

      // this.playlistYoutube = this.youtubePlaylist.getplaylist("PLPrQRyn2uGR0sskMv0XC9gTrJHWRm35Ji").subscribe(value => {
      //   this.playlist = value.map( function( elem ) {
      //       return elem;
      //   } ); 
      // });

       //this.playlistYoutube = this.youtubePlaylist.getplaylist("PLPrQRyn2uGR0sskMv0XC9gTrJHWRm35Ji")
       //this.playlistYoutube = this.youtubePlaylist.getplaylist("UUJl1YajcPWTeJNsQhGyMIMg")
       //this.playlistYoutube = this.youtubePlaylist.getplaylist("PL9oRsvMekJFwjbL6B0s5TLHm1gU1zm8wv")
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
    
    public getRow(video: any, observation: string, patientSelected: string){
      if(!this.videosSelected.find(vs => vs.videoId==video.snippet.resourceId.videoId))
      {
          this.videosSelected
          .push({
            imagenUrl: video.snippet.thumbnails.default.url,
            videoId: video.snippet.resourceId.videoId,
            titulo: video.snippet.title,
            observacion: observation,
            cedulaPaciente: patientSelected
          });
      }
      else{
        this.videosSelected
        .splice(this.videosSelected.findIndex(vs => vs.videoId==video.snippet.resourceId.videoId), 1);
      }
    }

    public saveList(listVideos: any, selectedOptionPatients: any){

      for(let i = 0; i < listVideos.length; i++){
        this.videoxPaciente$.push({
          imagenUrl: listVideos[i].imagenUrl,
          videoId: listVideos[i].videoId,
          titulo: listVideos[i].titulo,
          observacion: listVideos[i].observacion,
          cedulaPaciente: selectedOptionPatients          
        }).then((resp) => {
          alert('setting Object OK:  '+ resp);
        },(err) => alert(err));
      }      
    }

    public onChange(args){
      if(args.target.value != 0)
      {
       //this.videosSelected.map(data => this.videoxPaciente$); ;
       this.db.list('/videosxpaciente',
        {
          query:{
            orderByChild: 'cedulaPaciente',
            equalTo: args.target.value
          }
        })
          .subscribe(usersInDb =>{
          this.videosSelected = usersInDb;
        });

       this.patientSelected = args.target.options[args.target.selectedIndex].text;
        this.canShowListVideos = true;

        console.log(this.videosSelected);
      }
      else
        this.canShowListVideos = false;
    }

    public deleteVideo(videoUser: any){
      this.videosSelected
      .splice(this.videosSelected.findIndex(vs => vs.videoId==videoUser.videoId), 1);
    }
}
