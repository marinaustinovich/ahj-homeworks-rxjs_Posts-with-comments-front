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
    url: string;
    constructor(container: HTMLElement | null, url: string);
    drawUi(): void;
    updateList(): void;
    addPost(data: PostWithComments): void;
    createPostElement(data: PostWithComments): HTMLDivElement;
    createCommentElement(data: CommentData, el: HTMLElement): void;
    static getCommentsForPost(url: string, postId: string): import("rxjs").Observable<unknown>;
    static getDataWithInterval(url: string, intervalTime: number): import("rxjs").Observable<unknown>;
    static formatTime(timestamp: number): any;
    static truncateSubject(subject: string, maxLength: number): string;
}
export {};
