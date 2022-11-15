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

  // 'calendar'
  calendarHome: function(request, response){
    db.query(`SELECT * FROM calendar`, function(error, result){
      if(error){ throw error; }
      var context = {doc : `./calendar/calendar.ejs`,
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class,
                      results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      })
    });
  }, 
  calendarCreate : function(request, response){
    var titleofcreate = 'Create';
    var context = {doc : `./calendar/calendarCreate.ejs`,
                    title : '',
                    description : '',
                    kindOfDoc : 'C',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  calendarCreate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var cal = qs.parse(body);
      db.query(`INSERT INTO calendar (title, description, created, author_id) VALUES(?, ?, NOW(), 2)`,
        [cal.title, cal.description], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `/calendar`});
          response.end();
        }
      )
    });
  },
  calendarList : function(request, response){
    var titleofcreate = 'Create';
    db.query(`SELECT * FROM calendar`, function(error, result){
      if(error) { throw error; }   
      var context = {doc : `./calendar/calendarList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  calendarUpdate : function(request, response){
    var titleofcreate = 'Update';
    var planId = request.params.planId;
    db.query(`SELECT * FROM calendar where id = ${planId}`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./calendar/calendarCreate.ejs`,
                      title : result[0].title,
                      description : result[0].description,
                      pId : planId,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    });
  },
  calendarUpdate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var plan = qs.parse(body);
      var planId = request.params.planId;
      db.query('UPDATE calendar SET title=?, description=?, author_id=? WHERE id=?',
        [plan.title, plan.description, 2, planId], function(error, result){
          response.writeHead(302, {Location: `/calendar`});
          response.end();
        }
      )
    });
  },
  calendarDelete_process : function(request, response){
    var planId = request.params.planId;
    db.query('DELETE FROM calendar WHERE id=?', [planId], function(error, result){
      if(error) { throw error; }
      response.writeHead(302, {Location: `/calendar`});
      response.end();
    });
  },


  // 'namecard'
  namecardHome: function(request, response){
    db.query(`SELECT * FROM namecard`, function(error, result){
      if(error){ throw error; }
      var context = {doc : `./namecard/namecard.ejs`,
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class,
                      results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      })
    });
  }, 
  namecardCreate : function(request, response){
    var titleofcreate = 'Create';
    var context = {doc : `./namecard/namecardCreate.ejs`,
                    loginid : '',
                    name : '', 
                    company : '', 
                    company_position : '', 
                    email : '', 
                    tel : '', 
                    birth : '',
                    kindOfDoc : 'C',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  namecardCreate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var card = qs.parse(body);
      db.query(`INSERT INTO namecard (loginid, name, company, company_position, email, tel, birth) VALUES(?, ?, ?, ?, ?, ?, ?)`,
        [card.loginid, card.name, card.company, card.company_position, card.email, card.tel, card.birth], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `/namecard`});
          response.end();
        }
      )
    });
  },
  namecardList : function(request, response){
    var titleofcreate = 'Create';
    db.query(`SELECT * FROM namecard`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./namecard/namecardList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  namecardUpdate : function(request, response){
    var titleofcreate = 'Update';
    var cardId = request.params.cardId;
    db.query(`SELECT * FROM namecard where id = ${cardId}`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./namecard/namecardCreate.ejs`,
                      loginid : result[0].loginid,
                      name : result[0].name, 
                      company : result[0].company, 
                      company_position : result[0].company_position, 
                      email : result[0].email, 
                      tel : result[0].tel, 
                      birth : result[0].birth, 
                      cId : cardId,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    });
  },
  namecardUpdate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var card = qs.parse(body);
      var cardId = request.params.cardId;
      db.query('UPDATE namecard SET loginid=?, name=?, company=?, company_position=?, email=?, tel=?, birth=? WHERE id=?',
        [card.loginid, card.name, card.company, card.company_position, card.email, card.tel, card.birth, cardId], function(error, result){
          response.writeHead(302, {Location: `/namecard`});
          response.end();
        }
      )
    });
  },
  namecardDelete_process : function(request, response){
    var cardId = request.params.cardId;
    db.query('DELETE FROM namecard WHERE id=?', [cardId], function(error, result){
      if(error) { throw error; }
      response.writeHead(302, {Location: `/namecard`});
      response.end();
    });
  },


  // 'user'
  userHome: function(request, response){
    db.query(`SELECT * FROM person`, function(error, result){
      if(error){ throw error; }
      var context = {doc : `./user/user.ejs`,
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class,
                      results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      })
    });
  }, 
  userCreate : function(request, response){
    var titleofcreate = 'Create';
    var context = {doc : `./user/userCreate.ejs`,
                    loginid : '',
                    password : '',
                    name : '', 
                    address : '', 
                    tel : '', 
                    birth : '', 
                    classes : '', 
                    grade : '',
                    kindOfDoc : 'C',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  userCreate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var users = qs.parse(body);
      db.query(`INSERT INTO person (loginid, password, name, address, tel, birth, classes, grade) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
        [users.loginid, users.password, users.name, users.address, users.tel, users.birth, users.classes, users.grade], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `/user`});
          response.end();
        }
      )
    });
  },
  userList : function(request, response){
    var titleofcreate = 'Create';
    db.query(`SELECT * FROM person`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./user/userList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  userUpdate : function(request, response){
    var titleofcreate = 'Update';
    var usersId = request.params.usersId;
    db.query(`SELECT * FROM person where id = ${usersId}`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./user/userCreate.ejs`,
                      loginid : result[0].loginid,
                      password : result[0].password, 
                      name : result[0].name, 
                      address : result[0].address, 
                      tel : result[0].tel, 
                      birth : result[0].birth,
                      classes : result[0].classes, 
                      grade : result[0].grade,
                      uId : usersId,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    });
  },
  userUpdate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var users = qs.parse(body);
      var usersId = request.params.usersId;
      db.query('UPDATE person SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, classes=?, grade=? WHERE id=?',
        [users.loginid, users.password, users.name, users.address, users.tel, users.birth, users.classes, users.grade, usersId], function(error, result){
          response.writeHead(302, {Location: `/user`});
          response.end();
        }
      )
    });
  },
  userDelete_process : function(request, response){
    var usersId = request.params.usersId;
    db.query('DELETE FROM person WHERE id=?', [usersId], function(error, result){
      if(error) { throw error; }
      response.writeHead(302, {Location: `/user`});
      response.end();
    });
  },

}
