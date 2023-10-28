import { Subscription, of, forkJoin } from "rxjs";
import { mergeMap, catchError, take, finalize } from "rxjs/operators";
import { DataService } from "./DataService";
import { DOMService } from "./DOMService";
import { ApiResponse, CommentData, PostData, PostWithComments } from "./types";

const UPDATE_INTERVAL = 5000;
const MAX_UPDATES = 5;

export default class Widget {
  private domService: DOMService;
  private dataService: DataService;
  private container: HTMLElement;
  private url: string;
  private postsList: HTMLElement | null;
  private subscription: Subscription | null = null;

  constructor(container: HTMLElement | null, url: string) {
    if (!container) {
      throw new Error("Container element must not be null");
    }
    this.container = container;
    this.subscription = null;
    this.url = url;
    this.postsList = null;
    this.domService = new DOMService();
    this.dataService = new DataService(this.url);
  }

  init(): void {
    this.drawUi();
    this.updateList();
  }

  drawUi() {
    const h2 = document.createElement("h2");
    h2.textContent = "Posts with comments";

    const postsDiv = document.createElement("div");
    postsDiv.classList.add("posts");

    this.container.appendChild(h2);
    this.container.appendChild(postsDiv);
    this.postsList = this.container.querySelector(".posts");
  }

  updateList() {
    this.subscription = this.dataService
      .getDataWithInterval(UPDATE_INTERVAL)
      .pipe(
        take(MAX_UPDATES),
        mergeMap((response: ApiResponse<PostData[]>) => {
          const posts = response.data;

          const postWithCommentsObservables = posts.map((post: PostData) => {
            const postWithComments: PostWithComments = {
              ...post,
              comments: [],
            };
            return this.dataService.getCommentsForPost(post.author_id).pipe(
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

  destroy() {
    this.subscription?.unsubscribe();
  }

  addPost(data: PostWithComments) {
    const post = this.domService.createPostElement(data);

    data.comments.forEach((comment: CommentData) =>
      this.domService.createCommentElement(comment, post)
    );

    this.postsList?.prepend(post);
  }
}
