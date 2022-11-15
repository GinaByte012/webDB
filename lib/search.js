var db = require('./db.js');
var qs = require('querystring');


function authIsOwner(request, response){ 
  if(request.session.is_logined){
    return true;
  }
  else{
    return false;
  }
}


module.exports = {
  
  // 'search'
  bookSearch : function(request, response){
    var titleofcreate = 'Search';
    var usersId = request.params.usersId;
    var context = {doc : `./book/search.ejs`,
                    kind : 'book',
                    listyn : 'N',
                    kindOfDoc : 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  bookSearch_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`SELECT * FROM book where name like ?`, [`%${post.keyword}%`], function(error, result){
        var context = {doc : `./book/search.ejs`,
                      kind : 'book',
                      listyn : 'Y',
                      bs : result,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
        request.app.render('index', context, function(err, html){
        response.end(html);
        });
        }
      )
    });
  },
  namecardSearch : function(request, response){
    var titleofcreate = 'Search';
    var usersId = request.params.usersId;
    var context = {doc : `./namecard/search.ejs`,
                    kind : 'namecard',
                    listyn : 'N',
                    kindOfDoc : 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  namecardSearch_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`SELECT * FROM namecard where name like ?`, [`%${post.keyword}%`], function(error, result){
        var context = {doc : `./namecard/search.ejs`,
                      kind : 'namecard',
                      listyn : 'Y',
                      ns : result,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
        request.app.render('index', context, function(err, html){
        response.end(html);
        });
        }
      )
    });
  },
  calendarSearch : function(request, response){
    var titleofcreate = 'Search';
    var usersId = request.params.usersId;
    var context = {doc : `./calendar/search.ejs`,
                    kind : 'calendar',
                    listyn : 'N',
                    kindOfDoc : 'U',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  calendarSearch_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      db.query(`SELECT * FROM calendar where title like ?`, [`%${post.keyword}%`], function(error, result){
        var context = {doc : `./calendar/search.ejs`,
                      kind : 'calendar',
                      listyn : 'Y',
                      cs : result,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
        request.app.render('index', context, function(err, html){
        response.end(html);
        });
        }
      )
    });
  },
}