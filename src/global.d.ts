declare module "*.css" {
  const content: { [className: string]: string };
  export = content;
}


// 해당 파일을 해주어야 import css를 할 때 ts2307 에러가 뜨지 않는다.