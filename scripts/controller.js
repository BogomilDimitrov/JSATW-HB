var app = app || {};

app.controller = (function (){
    function Controller(dataPersister){
        this.persister = dataPersister;
        this.users;
        this.questions;
        this.comments;
        this.categories;
    }

    Controller.prototype.loadUsers = function(select){
        var _this = this;
        this.persister.users.getAll(
            function(data){
                _this.users = data.results;
            },
            function(error){
                console.log(error);
            }
        )
    };

    Controller.prototype.loadQuestions = function(select){
        var _this = this;
        this.persister.questions.getAll(
            function(data){
                _this.questions = data.results;
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.loadComments = function(select){
        var _this = this;
        this.persister.comments.getAll(
            function(data){
                _this.comments = data.results;
                $('#topics').text(_this.comments[0].questId.className);
                $('#addQuestion').click(function(){
                    _this.loadAddQuestion();
                });
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.loadCategories = function(select){
        var _this = this;
        this.persister.categories.getAll(
            function(data){
                _this.categories = data.results;
                //_this.loadCategoriesData(select, data.results);
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.login = function(username, password){
        this.persister.userAction.login(
            {
                username: username, password: password
            },
            function(data){
                sessionStorage.setItem('logged-in', data.objectId);
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.signUp = function(username, password){
        this.persister.userAction.signUp(
            {
                username: username, password: password
            },
            function(data){
                console.log(data);
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.load = function(selector){
        this.loadUsers(selector);
        this.loadCategories(selector);
        this.loadQuestions(selector);
        this.loadComments(selector);

        this.attachEvents(selector);
    };

    Controller.prototype.visitIncrement = function (questionId, visits){
        this.persister.questions.update(questionId, JSON.stringify({visits:visits}),
            function(data){
                //console.log(data);
            },
            function(error){
                console.log(error);
            }
        );
    };

    Controller.prototype.postComment = function(name, email, text, question){
        this.persister.comments.add(JSON.stringify({
            author: name,
            text: text,
            questId:
                {
                    __type: "Pointer",
                    className: "Question",
                    objectId: question.objectId
                }

        }),
        function(data){
            console.log(data);
        },
        function(error){
            console.log(error);
        });
    };

    Controller.prototype.postQuestion = function(title, category, tags, question){
        var _this = this;
        var categoryId;
        for (var i = 0; i < this.categories.length; i++) {
            var obj = this.categories[i];
            if(obj.name == category)
                categoryId = obj.objectId;
        }
        this.persister.questions.add(JSON.stringify({
                name: title,
                qText: question,
                tags:[tags],
                category:
                {
                    __type: "Pointer",
                    className: "Category",
                    objectId: categoryId
                },
                userId:
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": sessionStorage.getItem('logged-in')
                },
                visits: 1
            }),
            function(data){
                _this.loadQuestionsData('jq-wrapper');
            },
            function(error){
                console.log(error);
            });
    };

    function attachCommentsToDom(element, data) {
        var answer = $('<div />');
        answer.attr('id', "answer");
        var commentAuthor = $('<div />');
        commentAuthor.attr('class', "author");
        commentAuthor.text(data.author).appendTo(answer);
        $('<hr/>').appendTo(answer);
        var answerText = $('<div/>');
        answerText.attr('class', "answerText");
        answerText.text(data.text).appendTo(answer);
        answer.appendTo(element);
    }

    function attachQuestionToDom(element, data, _this) {
        var dataWrapper = $('<div />');
        dataWrapper.attr('class',"specialTopics");

        var link = $('<a>',{
            html: "<div class='topicName'>" + data.name + "</div>",
            href: '#',
            click: function(){
                $(".specialTopics").remove();
                _this.visitIncrement(data.objectId, data.visits+1);
                _this.loadCommentsData(element.selector, data, username);
            }
        });
        link.appendTo(dataWrapper);
        var username;
        for (var user in _this.users) {
            if(_this.users[user]['objectId'] == data.userId.objectId)
                username = _this.users[user]['username'];

        }
        var category;
        for (var obj in _this.categories) {
            if(_this.categories[obj]['objectId'] == data.category.objectId)
                category = _this.categories[obj]['name'];
        }
        var text = $('<div />').text('Latest update: ' + username + ' ' + data.updatedAt.substr(0,10)  + ' ' + data.updatedAt.substr(11,8));
        text.attr('class',"Latest");
        text.appendTo(dataWrapper);
        $('<br />').appendTo(dataWrapper);
        (($('<div />').text('Tags: ' + data.tags).appendTo(dataWrapper)).attr('class',"Latest")).appendTo(dataWrapper);
        $('<br />').appendTo(dataWrapper);
        (($('<div />').text('Category: ' + category).appendTo(dataWrapper)).attr('class',"Latest")).appendTo(dataWrapper);
        $('<br />').appendTo(dataWrapper);
        (($('<div />').text('Visits: ' + data.visits).appendTo(dataWrapper)).attr('class',"Latest")).appendTo(dataWrapper);
        $('<br />').appendTo(dataWrapper);
        element.append(dataWrapper);
    }

    Controller.prototype.loadQuestionsData = function(select) {
        var _this = this;
        var selector = '#' + select;
        var allQuestionsWrapper = $(selector);
        $(".specialTopics").remove();
        var length = _this.questions != undefined ? _this.questions.length : 0;
        for (var i = 0; i < length; i++) {
            attachQuestionToDom(allQuestionsWrapper, _this.questions[i], _this);
        }
    };

    Controller.prototype.loadCommentsData = function(select, question, username) {
        var _this = this;
        var allCommentsWrapper = $(select);
        var length = _this.comments != undefined ? _this.comments.length : 0;
        
        var comments = [];

        for (var i = 0; i < _this.comments.length; i++) {
            var comment = _this.comments[i];
            if(comment.questId.objectId == question.objectId)
                comments.push(comment);
        }

        $('#topics').text(question.name);
        var dataWrapper = $('<div />');
        dataWrapper.attr('class',"specialTopics");

        var topicText = $('<div />');
        topicText.attr('class', "topicText");
        $('<p>').text(question.qText).appendTo(topicText);
        $('<hr>').appendTo(topicText);
        var author = $('<div />');
        author.attr('class', "author");
        $('<div/>').text(username).appendTo(author);
        $('<div/>').text(question.createdAt.substr(0,10)  + ' ' + question.createdAt.substr(11,8)).appendTo(author);
        author.appendTo(topicText);
        var answers = $('<div />');
        answers.attr('class',"answers");
        $('<h3/>').text('Comments').appendTo(answers);
        $('<hr>').appendTo(answers);
        $('<br>').appendTo(answers);
        var submit = $('<div/>');
        submit.attr('class', "submit");
        var form = $("<form method='post' action='#'>");
        $("<input type=\"text\" id=\"Title\" placeholder='Name' />").appendTo(form);
        $("<input type=\"text\" id=\"Email\" placeholder='Email' />").appendTo(form);
        $("<textarea id='comments' cols=\"47\" rows='15' placeholder='Add your comment here...' />").appendTo(form);
        $('<br>').appendTo(form);
        var button = $("<input type=\"submit\" value='Submit' />");
        button.click(function() {
                var name = $('#Title').val();
                var email = $('#Email').val();
                var text = $('#comments').val();

                _this.postComment(name, email, text, question);
        }
        );
        button.appendTo(form);
        form.appendTo(submit);

        dataWrapper.append(topicText);
        dataWrapper.append(answers);
        dataWrapper.append($('<br>'));
        dataWrapper.append(submit);

        for (var i = 0; i < comments.length; i++) {
            attachCommentsToDom(answers, comments[i], _this, question, username);
        }
        allCommentsWrapper.append(dataWrapper);
    };

    Controller.prototype.loadAddQuestion = function(){
        var _this = this;
        var allCommentsWrapper = $('#jq-wrapper');
        $(".specialTopics").remove();
        var dataWrapper = $('<div />');
        dataWrapper.attr('class',"specialTopics");
        $('<h2>').text('Add Question').appendTo(dataWrapper);

        var formDiv = $('<div/>');
        formDiv.attr('class', 'formDiv');

        $("<input type=\"text\" id=\"title\" placeholder='Title...' />").appendTo(formDiv);
        $("<input type=\"text\" id=\"category\" placeholder='Category...' />").appendTo(formDiv);
        $("<input type=\"text\" id=\"tags\" placeholder='Tags...' />").appendTo(formDiv);
        $("<textarea id='question' cols=\"47\" rows='15' placeholder='Add your question here...' />").appendTo(formDiv);
        $("<br>").appendTo(formDiv);
        var button = $("<input type=\"submit\" value='Submit' />");
        button.click(function() {
                var title = $('#title').val();
                var category = $('#category').val();
                var tags = $('#tags').val();
                var question = $('#question').val();

                _this.postQuestion(title, category, tags, question);
            }
        );
        button.appendTo(formDiv);
        formDiv.appendTo(dataWrapper);
        allCommentsWrapper.append(dataWrapper);

    };

    Controller.prototype.loadCategoriesData = function(select,data) {
        var selector = select;
        var allCategoriesWrapper = $(selector);
        var length = data != undefined ? data.length : 0;
        for (var i = 0; i < length; i++) {
            attachDataToDom(allCategoriesWrapper, data[i]);
        }
    };

    Controller.prototype.attachEvents = function() {
        var _this = this;
        this.login('bi0game','12345');

        var hasLoaded = false;
        $(document).ajaxStop(function() {
            if(!hasLoaded) {
                hasLoaded = true;
                _this.loadQuestionsData('jq-wrapper');
            }
        });
    };

    return{
        get: function (dataPersister) {
            return new Controller(dataPersister);
        }
    }
}());
