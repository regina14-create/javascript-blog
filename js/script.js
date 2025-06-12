/* global Handlebars */
'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
};


function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  console.log(event);


  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [IN PROGRESS] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle:', targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');

}






const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector =  '.list.tags',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';


function generateTitleLinks(customSelector = ''){
  console.log('customSelector:', customSelector);
  console.log('селектор статей:', optArticleSelector + customSelector);
  console.log('The generate TitleLinks function was called');

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* create an empty string to accumulate HTML */
  let html = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);


  for (let article of articles) {
    console.log(article); // временно выводим в консоль, чтобы проверить

    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId); // отладка

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    console.log(linkHTML);

    /* add linkHTML to html variable */
    html += linkHTML;

    console.log(html);
  }

  /* after the loop, insert all links at once */
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}
generateTitleLinks();

function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999 };

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles Найдите все статьи */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: Start Loop: для каждой статьи: */
  for (let article of articles) {

    /* find tags wrapper Найдите теги обертки */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string Сделайте переменную HTML с пустой строкой */
    let html = '';

    /* get tags from data-tags attribute Получите теги из атрибута Data-Tags */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array разделить теги в массив */
    const articleTagsArray = articleTags.split(' ');
    console.log('Теги как массив:', articleTagsArray); // ['cat', 'cactus', 'scissors']

    /* START LOOP: for each tag Start Loop: для каждого тега */
    for (let tag of articleTagsArray) {
      console.log('Один тег:', tag);

      // генерируем ссылку для тега внутри статьи
      const linkHTML = templates.articleTagLink({ tag: tag });
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags*/
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }

    /* insert HTML of all the links into the tags wrapper Вставьте HTML всех ссылок в обертку тегов */
    tagsWrapper.innerHTML = html;
    console.log('HTML всех тегов для статьи:', html);
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] готовим переменную для финального HTML */
  let allTagsHTML = '';

  /* [NEW] обходим объект allTags */
  for (let tag in allTags) {
    // вычисляем класс по количеству
    const tagClass = calculateTagClass(allTags[tag], tagsParams);
    console.log('Tag:', tag, '| allTags:', allTags[tag], '| tagClass:', tagClass);

    const tagData = {
      tag: tag,
      count: allTags[tag],
      className: tagClass
    };
    allTagsHTML += templates.tagCloudLink(tagData);
  }
  tagList.innerHTML = allTagsHTML;
}

generateTags();
addClickListenersToTags();



function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeLink of activeTagLinks) {
    activeLink.classList.remove('active');
  }


  /* remove class active */

  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const matchingTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let matchingLink of matchingTagLinks) {
    matchingLink.classList.add('active');
  }
  /* add class active */

  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags(){
  const allTagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for (let tagLink of allTagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* find all links to tags */

  /* START LOOP: for each link */

  /* add tagClickHandler as event listener for that link */

  /* END LOOP: for each link */
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const articleAuthor = article.getAttribute('data-author');

    const authorHTML = templates.articleAuthorLink({ author: articleAuthor });


    authorWrapper.innerHTML = authorHTML;
  }
}

function authorClickHandler(event) {
  event.preventDefault();

  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for (let link of activeAuthorLinks) {
    link.classList.remove('active');
  }

  const matchingAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let link of matchingAuthorLinks) {
    link.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let link of authorLinks) {
    link.addEventListener('click', authorClickHandler);
  }
}
generateTitleLinks();
generateTags();
addClickListenersToTags();
generateAuthors();
addClickListenersToAuthors();
