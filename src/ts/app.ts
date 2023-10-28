import Widget from "./Widget";

const container = document.getElementById("posts-container");
const url = "https://posts-with-comments-back.netlify.app/posts/";
const widget = new Widget(container, url);

widget.init();

window.addEventListener('beforeunload', () => {
    widget.destroy();
  });