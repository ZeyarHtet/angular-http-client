import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  loadedPosts: Post[] = [];
  isFetching = false;
  error = '';
  private errorSub =  new Subscription;

  constructor(private http: HttpClient,private postsService: PostsService){}

  ngOnInit(): void {

    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
   this.isFetching = true;
   this.postsService.fetchPosts().subscribe(posts => {
    this.isFetching = false;
    this.loadedPosts = posts;
   },error => {
    this.error = error.message;
    console.log(this.error);
   });
  }

  onCreatePost(postData: Post){
    this.postsService.createAndStorePost(postData.title,postData.content);
  }

  onFetchPosts(){
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe (posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },error => {
      this.error = error.message;
      console.log(error);
     });
  }

  onClearPosts(id:number){
    this.postsService.deletePosts().subscribe(()=> {
      this.loadedPosts = this.loadedPosts.filter((v,i) => i !==id);
    })
  }

  onHandleError(){
    this.error = '';
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

}
