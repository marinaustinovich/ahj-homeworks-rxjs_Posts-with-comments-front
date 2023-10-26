import { Observable, of, forkJoin, interval } from "rxjs";
import {
  mergeMap,
  catchError,
  take,
  finalize,
  switchMap,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

const dayjs = require("dayjs");

interface CommentData {
  author_id: string;
  author: string;
  content: string;
  avatar: string;
  created: number;
}

interface PostData {
  author_id: string;
  author: string;
  title: string;
  subject: string;
  image: string;
  avatar: string;
  created: number;
}

interface PostWithComments extends PostData {
  comments: CommentData[];
}

interface ApiResponse<T> {
  data: T;
}

export default class Widget {
  container: HTMLElement;
  url: string;
  postsList: HTMLElement | null;

  constructor(container: HTMLElement | null, url: string) {
    if (!container) {
      throw new Error("Container element must not be null");
    }

    this.container = container;
    this.url = url;
    this.postsList = null;
  }

  init() {
    this.drawUi();
    this.updateList();
  }

  drawUi() {
    this.container.innerHTML = `
      <h2>Posts with comments</h2>
      <div class="posts"></div>
    `;

    this.postsList = this.container.querySelector(".posts");
  }

  updateList() {
    Widget.getDataWithInterval(this.url, 5000)
      .pipe(
        take(5),
        mergeMap((response: ApiResponse<PostData[]>) => {
          const posts = response.data;

          const postWithCommentsObservables = posts.map((post: PostData) => {
            const postWithComments: PostWithComments = {
              ...post,
              comments: [],
            };
            return Widget.getCommentsForPost(this.url, post.author_id).pipe(
              mergeMap((commentsResponse: ApiResponse<CommentData[]>) => {
                postWithComments.comments = commentsResponse.data;
                return of(postWithComments);
              })
            );
          });
          return forkJoin(postWithCommentsObservables);
        }),
        catchError((error) => {
          console.error("Error:", error);
          return of([]);
        }),
        finalize(() => {
          console.log("Запросы на сервер остановлены после 5 итераций");
        })
      )
      .subscribe({
        next: (postsWithComments: PostWithComments[]) => {
          postsWithComments.forEach((post) => {
            this.addPost(post);
          });
        },
        error: (error: any) => {
          console.error("Unhandled error:", error);
        },
        complete: () => {
          console.log("Observable completed");
        },
      });
  }

  static getCommentsForPost(url: string, postId: string) {
    const commentsUrl = `${url}${postId}/comments/latest`;
    return ajax.getJSON<ApiResponse<CommentData[]>>(commentsUrl);
  }

  addPost(data: PostWithComments) {
    const post = this.createPostElement(data);

    data.comments.forEach((comment: CommentData) =>
      this.createCommentElement(comment, post)
    );

    this.postsList?.prepend(post);
  }

  createPostElement(data: PostWithComments) {
    const post = document.createElement("div");
    post.classList.add("post");
    post.innerHTML = `
      <div class="wrapper-data-author">
        <img src="${data.avatar}" class="avatar">
        <div class="data-author">
          <span class="author">${data.author}</span>
          <span class="timestamp">${Widget.formatTime(data.created)}</span>
        </div>
      </div>
      <div class="content-post">
        <h3>${data.title}</h3>
        <img src="${data.image}" class="image-post">
      </div>
      <div class="comments">
        <h4>Latest comments</h4>
      </div>
      <button class="load-comments">Load More</button>
    `;

    return post;
  }

  createCommentElement(data: CommentData, el: HTMLElement) {
    const commentsList = el.querySelector(".comments");
    const commentEl = document.createElement("div");
    commentEl.classList.add("comment-wrapper");
    commentEl.innerHTML = `
        <img src="${data.avatar}" class="avatar-comment">
        <div class="wrapper-content-comment">
          <span class="author-comment">${data.author}</span>
          <span class="content-comment">${data.content}</span>
        </div>
        <div class="timestamp-comment">${Widget.formatTime(data.created)}</div>
      `;

    if (commentsList) {
      commentsList.appendChild(commentEl);
    }
  }

  static getDataWithInterval(
    url: string,
    intervalTime: number
  ): Observable<ApiResponse<PostData[]>> {
    return interval(intervalTime).pipe(
      switchMap(() => ajax.getJSON<ApiResponse<PostData[]>>(`${url}latest`))
    );
  }

  static formatTime(timestamp: number) {
    return dayjs(timestamp).format("HH:mm DD.MM.YY");
  }

  static truncateSubject(subject: string, maxLength: number): string {
    return subject.length > maxLength
      ? subject.slice(0, maxLength - 1) + "…"
      : subject;
  }
}
