(function(){
    var rootUrl = 'https://api.parse.com/1/';
    var dataPersister = app.dataPersister.get(rootUrl);
    var controller = app.controller.get(dataPersister);
    controller.load();

}());