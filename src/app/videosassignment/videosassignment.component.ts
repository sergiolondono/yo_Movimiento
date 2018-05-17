import { Component, OnInit } from '@angular/core';
import { YoutubePlaylist } from '../services/youtube-playlist';
import { Playlist } from "../models/playlist";

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

   constructor(private youtubePlaylist:YoutubePlaylist) { }

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

  ngOnInit(){
       this.getplaylist();
    }
    
    public getRow(video: any, observation: string){
      if(!this.videosSelected.find(vs => vs.videoId==video.snippet.resourceId.videoId))
      {
          this.videosSelected
          .push({
            imageUrl: video.snippet.thumbnails.default.url,
            videoId: video.snippet.resourceId.videoId,
            title: video.snippet.title,
            description: observation
          });
      }
      else{
        this.videosSelected
        .splice(this.videosSelected.findIndex(vs => vs.videoId==video.snippet.resourceId.videoId), 1);
      }
    }

    public saveList(listVideos: any){
      console.log(listVideos);
  }

}
