# AQuiz

AQuiz is a simple JavaScript library for small tests or quizzes.

It is intended for integration with server-side test generator
such as [EGE](http://github.com/klenin/EGE)
but can also be used locally with hand-prepared test files.

## Dependencies
* JQuery (http://jquery.com)
* JQuery UI (http://jqueryui.com)
* JQuery [inherit plugin](https://github.com/dfilatov/jquery-plugins/tree/master/src/jquery.inherit)
* JQuery [localize plugin](https://github.com/coderifous/jquery-localize)

## Installation
1. Clone the repository.
2. Put dependencies into the same directory (or modify links in quiz.xhtml).
3. Copy `config.sample.js` to `config.js`, modify as required.
4. (Optionally) configure your browser to allow local file access.

To test, run `firefox quiz.xhtml?load_url=test.quiz`

## Integration

Configuration file `config.js` must define type of server, 
now available local file server and [CATS](http://github.com/klenin/cats-main) server.

If selected server defined `submit_answer` method,
`Submit` button will be displayed in the UI.
Pressing this button will call `submit_answer` with array of given answers.
Each array element will be either student's
answer to a quiz question or `null` if the question was not answered.

## Features
* Single choice questions (pick a single correct answer)
* Multiple choice questions (pick all correct answers)
* Direct input questions (enter answer as number/word)
* Ordering questions (arrange options in connect order)
* Matching questions (match entities into categories)
* Optional built-in self-check

## Quiz format
A quiz is a JSON file containing an array of questions.
Each question is an object with the following keys:
* `"type"`: question type, must be one of `"sc"`, `"mc"`, `"di"`, `"sr"`, `"mt"`, `"cn"`;
* `"text"`: question text;
* `"variants"`: answer options/choices;
* `"answer"`: *optional* answer given by student;
* `"correct"`: *optional* correct answer.
* `"options"`: *optional* hash of selectors, labels for selectively displayed data.

##License

GPL v2
