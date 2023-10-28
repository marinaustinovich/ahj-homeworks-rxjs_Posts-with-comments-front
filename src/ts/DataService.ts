import { Observable, interval } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap } from "rxjs/operators";
import { PostData, CommentData } from "./types";

interface ApiResponse<T> {
  data: T;
}

export class DataService {
  constructor(private url: string) {}

  getPosts(): Observable<ApiResponse<PostData[]>> {
    return ajax.getJSON<ApiResponse<PostData[]>>(`${this.url}latest`);
  }

  getCommentsForPost(postId: string): Observable<ApiResponse<CommentData[]>> {
    const commentsUrl = new URL(
      `${postId}/comments/latest`,
      this.url
    ).toString();
    return ajax.getJSON<ApiResponse<CommentData[]>>(commentsUrl);
  }

  getDataWithInterval(
    intervalTime: number
  ): Observable<ApiResponse<PostData[]>> {
    return interval(intervalTime).pipe(
      switchMap(() =>
        ajax.getJSON<ApiResponse<PostData[]>>(`${this.url}latest`)
      )
    );
  }
}
