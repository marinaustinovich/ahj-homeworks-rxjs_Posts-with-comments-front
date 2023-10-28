import { PostWithComments } from "./types";
export default class Widget {
    private domService;
    private dataService;
    private container;
    private url;
    private postsList;
    private subscription;
    constructor(container: HTMLElement | null, url: string);
    init(): void;
    drawUi(): void;
    updateList(): void;
    destroy(): void;
    addPost(data: PostWithComments): void;
}
