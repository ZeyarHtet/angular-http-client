import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { catchError, map, throwError } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content:string){
    const postData: Post = {title: title,content: content};

    this.http.post<{name: string} > ('https://http-client-d5dcd-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
    postData).subscribe(responseData => {
      console.log(responseData);
    },error => {
      this.error = error.message;
     });
  }

  fetchPosts(){
    return this.http.get<{[key: string]: Post}>('https://http-client-d5dcd-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
    .pipe(
      map(responseData => {
        const postsArray: Post [] = [];
        for (const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postsArray.push({...responseData[key],id:key});
          }
        }
        return postsArray;
      }),catchError(errorRes => {
        return throwError(errorRes);
      })
      );
  }

  deletePosts(){
     return this.http.delete(
      'https://http-client-d5dcd-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json',
    );
  }

}
