import { interval, mergeMap, forkJoin, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, take, finalize, catchError } from 'rxjs/operators';
const dayjs = require('dayjs');

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

export default class Widget {
  container: HTMLElement;
  url : string;

  constructor(container : HTMLElement | null, url : string) {
    if (!container) {
      throw new Error('Container element must not be null');
    }

    this.container = container;
    this.url = url;
    this.drawUi();
  }

  drawUi() {
    this.container.innerHTML = `
      <h2>Posts with comments</h2>
      <div class="posts"></div>
    `;
    this.updateList();
  }

  updateList() {
    Widget.getDataWithInterval(this.url, 5000)
      .pipe(
        take(5), // Ограничиваем количество запросов до 5
        mergeMap((response: any) => {
          const posts = response.data;
          // Загружаем комментарии для каждого поста
          const postWithCommentsObservables = posts.map((post: PostData) => {
            const postWithComments: PostWithComments = { ...post, comments: [] }; // Создаем объект PostWithComments
            return Widget.getCommentsForPost(this.url, post.author_id).pipe(
              mergeMap((comments: any) => {
                // Добавляем комментарии к посту
                postWithComments.comments = comments.data;
                return [postWithComments];
              })
            )
            });
          return forkJoin(postWithCommentsObservables);
        }),
        catchError(error => {
          console.error('Error:', error);
          return of(error);
        }),
        finalize(() => {
          console.log('Запросы на сервер остановлены после 5 итераций');
        })
      )
      .subscribe(
        (postsWithComments: any) => {
          console.log('Data received:', postsWithComments);
          postsWithComments.forEach((post: PostWithComments) => {
            this.addPost(post);
          });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }

  addPost(data: PostWithComments) {
    const postsList = this.container.querySelector('.posts');
    const post = this.createPostElement(data);

    data.comments.forEach((comment: CommentData) => this.createCommentElement(comment, post));

    if (postsList) {
      postsList.insertBefore(post, postsList.firstChild);
    }
  }

  createPostElement(data: PostWithComments) {
    const post = document.createElement('div');
    post.classList.add('post');
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
    const commentsList = el.querySelector('.comments');
      const commentEl = document.createElement("div");
      commentEl.classList.add('comment-wrapper');
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

  static getCommentsForPost(url: string, postId: string) {
    const commentsUrl = `${url}${postId}/comments/latest`;
    return ajax.getJSON(commentsUrl);
  }

  static getDataWithInterval(url : string, intervalTime : number) {
    return interval(intervalTime).pipe(
      switchMap(() => ajax.getJSON(`${url}latest`))
    );
  }

  static formatTime(timestamp: number) {
    return dayjs(timestamp).format('HH:mm DD.MM.YY');
  }

  static truncateSubject(subject: string, maxLength: number): string {
    return subject.length > maxLength ? subject.slice(0, maxLength - 1) + '…' : subject;
  }
}
