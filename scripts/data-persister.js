var app = app || {};

app.dataPersister = (function() {
    function Persister(rootUrl) {
        this.rootUrl = rootUrl;
        this.users = new Users(this.rootUrl);
        this.userAction = new UserAction(this.rootUrl);
        this.rootUrl += "classes/";
        this.questions = new Questions(this.rootUrl);
        this.comments = new Comments(this.rootUrl);
        this.categories = new Categories(this.rootUrl);
    }

    var Users = (function(){
        function Users(rootUrl){
            this.serviceUrl = rootUrl + 'users/';
        }
        
        Users.prototype.getAll = function(success, error){
            ajaxRequester.get(this.serviceUrl, success, error, 'application/json');
        };

        Users.prototype.add = function(user, success, error){
            ajaxRequester.post(this.serviceUrl, user, success, error, 'application/json');
        };
        
        Users.prototype.delete = function(id, success, error){
            ajaxRequester.delete(this.serviceUrl+id, success, error, 'application/json');
        };
        
        return Users;
    }());

    var Questions = (function(){
        function Questions(rootUrl){
            this.serviceUrl = rootUrl + 'Question/';
        }

        Questions.prototype.getAll = function(success, error){
            ajaxRequester.get(this.serviceUrl, success, error, 'application/json');
        };

        Questions.prototype.add = function(data, success, error){
            ajaxRequester.post(this.serviceUrl, data, success, error, 'application/json');
        };

        Questions.prototype.update = function(questionId, data, success, error){
            ajaxRequester.put(this.serviceUrl+questionId, data, success, error, 'application/json');
        };

        Questions.prototype.delete = function(id, success, error){
            ajaxRequester.delete(this.serviceUrl+id, success, error, 'application/json');
        };


        return Questions;
    }());

    var Comments = (function(){
        function Comments(rootUrl){
            this.serviceUrl = rootUrl + 'Comments/';
        }

        Comments.prototype.getAll = function(success, error){
            ajaxRequester.get(this.serviceUrl, success, error, 'application/json');
        };

        Comments.prototype.add = function(data, success, error){
            ajaxRequester.post(this.serviceUrl, data, success, error, 'application/json');
        };

        Comments.prototype.delete = function(id, success, error){
            ajaxRequester.delete(this.serviceUrl+id, success, error, 'application/json');
        };


        return Comments;
    }());

    var Categories = (function(){
        function Categories(rootUrl){
            this.serviceUrl = rootUrl + 'Category/';
        }

        Categories.prototype.getAll = function(success, error){
            ajaxRequester.get(this.serviceUrl, success, error, 'application/json');
        };

        Categories.prototype.add = function(Categorie, success, error){
            ajaxRequester.post(this.serviceUrl, Categorie, success, error, 'application/json');
        };

        Categories.prototype.delete = function(id, success, error){
            ajaxRequester.delete(this.serviceUrl+id, success, error, 'application/json');
        };


        return Categories;
    }());

    var UserAction = (function(){
        function UserAction(rootUrl){
            this.serviceUrl = rootUrl;
        }

        UserAction.prototype.login = function(data,success, error){
            ajaxRequester.login(this.serviceUrl+'login', data, success, error, 'application/x-www-form-urlencoded');
        };

        UserAction.prototype.signUp = function(data,succes, error){
            ajaxRequester.post(this.serviceUrl+'users', data, succes, error);
        };

        return UserAction;
    }());

    return {
        get: function(rootUrl) {
            return new Persister(rootUrl);
        }
    }
}());