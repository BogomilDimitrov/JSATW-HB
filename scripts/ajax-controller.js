var ajaxRequester = (function() {
    var makeRequest = function makeRequest(method, url, data, success, error, contentType){
        var PARSE_APP_ID = "wqG0Qu3xqLCJCMUCPyDK18FW8Rgb9I22uHG04RYL";
        var PARSE_REST_API_KEY = "DI9T1qxXETA7cAcpfNKdQGejgogAJJyezVRbjypY";
        return $.ajax({
            type: method,
            headers: {
                "X-Parse-Application-Id": PARSE_APP_ID,
                "X-Parse-REST-API-Key": PARSE_REST_API_KEY
            },
            url: url,
            contentType: contentType,
            data: data,
            success: success,
            error: error
        })
    };

    function makeLoginRequest(url, data, success, error, contentType) {
        return makeRequest('GET', url, data, success, error, contentType);
    }

    function makeGetRequest(url, success, error, contentType) {
        return makeRequest('GET', url, null, success, error, 'application/json');
    }

    function makePostRequest(url, data, success, error, contentType) {
        return makeRequest('POST', url, data, success, error, contentType);
    }

    function makePutRequest(url, data, success, error) {
        return makeRequest('PUT', url, data, success, error, 'application/json');
    }

    function makeDeleteRequest(url, success, error) {
        return makeRequest('DELETE', url, null, success, error, 'application/json');
    }

    return{
        get: makeGetRequest,
        post: makePostRequest,
        put: makePutRequest,
        delete: makeDeleteRequest,
        login: makeLoginRequest
    }

}());
