var db = require('./db');
var qs = require('querystring');

function authIsOwner(request, response){ 
  if(request.session.is_logined){
    return true;
  }
  else{
    return false;
  }
}

module.exports  = {
  login: function(request, response){
    var subdoc;
    if(authIsOwner(request, response) === true){   
      subdoc = 'book.ejs';
    }
    else{
      subdoc = 'login.ejs';
    }
    var context = {doc : subdoc,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class
                  };
    request.app.render('index', context, function(err, html){
      response.end(html);
    })
  },

  login_process : function(request, response){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    })
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`SELECT loginid, password, classes FROM person WHERE loginid = ? and password = ?`,
      [post.id, post.pw, post.classes], function(error, result){
        if(error){
          throw error;
        }

        if(result[0] === undefined){
          response.end('Who ?');
        }
        else{
          request.session.is_logined = true;
          request.session.login_id = result[0].loginid;
          request.session.class = result[0].classes;
          response.redirect('/');   
          response.end('Welcome !!!');
        }
      })
    })
  },

  logout : function(request, response){
    request.session.destroy(function(err){
      response.redirect('/');  
    })
  },

  register : function(request, response){
    var titleofcreate = 'Register';
    var context = {doc : `./register.ejs`,
                    loginid : '',
                    password : '',
                    name : '',
                    address : '',
                    tel : '',
                    birth : '',
                    classes : 'U',
                    grade : 'B',
                    kindOfDoc : 'C',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },

  register_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var reg = qs.parse(body);
      db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, classes, grade) VALUES(?, ?, ?, ?, ?, ?, 'U', 'B')`,
        [reg.id, reg.pw, reg.name, reg.address, reg.tel, reg.birth], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `../login`});
          response.end();
        }
      )
    });
  },

  changepw : function(request, response){
    var titleofcreate = 'Update';
    var changeId = request.session.login_id;
    db.query(`SELECT * FROM person WHERE loginid = "${changeId}"`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./changepw.ejs`,
                      password : result[0].password, 
                      cId : changeId,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    });
  },
  
  changepw_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var chg = qs.parse(body);
      var changeId = request.session.login_id;
      db.query(`UPDATE person SET password=? WHERE loginid="${changeId}"`,
        [chg.password], function(error, result){
          response.writeHead(302, {Location: `./changepw`});
          response.end();
        }
      )
    });
  },
}