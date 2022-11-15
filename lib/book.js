var db = require('./db.js');
var qs = require('querystring');
var auth = require('./authentication.js');
const e = require('express');


function authIsOwner(request, response){ 
  // console.log(request.session);
  if(request.session.is_logined){
    return true;
  }
  else{
    return false;
  }
}

function dateOfEightDigit(){
  var today = new Date();
  var nowdate = String(today.getFullYear());
  var month;
  var day;
  if(today.getMonth < 9)
    month = "0" + String(today.getMonth() + 1);
  else
    month = String(today.getMonth() + 1);

  if(today.getDate < 10)
    day = "0" + String(today.getDate());
  
  else
    day = String(today.getDate());

  return nowdate + month + day;
}



module.exports = {
  home: function(request, response){
    db.query(`SELECT count(*) as total FROM book`,function(error, nums){
      var numPerPage = 2;
      var pageNum = (request.params.pNum == undefined) ? 1 : request.params.pNum;
      var offs = (pageNum-1)*numPerPage;
      var totalPages = Math.ceil(nums[0].total / numPerPage);

      db.query(`SELECT * FROM book ORDER BY name, id LIMIT ? OFFSET ?`,
        [numPerPage, offs],function(error, result) {
        if(error) {
          throw error;
        }
        var context = {doc : `./book/book.ejs`,
                      cls : request.session.class,
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id,
                      kind : 'home',
                      results : result,
                      pageNum : pageNum,
                      totalpages : totalPages};
        request.app.render('index',context, function(err, html){
          response.end(html); 
        })  
      });
    })
  }, 
  best: function(request, response){
    db.query(`SELECT * FROM book B join (SELECT * 
              FROM (SELECT bookid, count(bookid) as numOfSeller FROM purchase
                group by bookid
                order by count(bookid) desc) A
              LIMIT 3) S on B.id = S.bookid`, function(error, books){
      if(error) { throw error; }   
      var context = {doc : `./book/book.ejs`,
                    kind: 'best',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : books};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  ebook: function(request, response){
    db.query(`SELECT * FROM book WHERE ebook='Y'`, function(error, result){
      if(error) { throw error; }   
      var context = {doc : `./book/book.ejs`,
                    kind: 'ebook',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  month: function(request, response){
    db.query(`SELECT * FROM book B join (SELECT * FROM (
      SELECT bookid, count(bookid) as numOfSeller FROM purchase
      WHERE left(purchasedate, 6) = ?
      group by bookid
      order by count(bookid) desc) A
      LIMIT 3) S on B.id = S.bookid`, [dateOfEightDigit().substring(0, 6)], function(error, books){
        if(error) { throw error; }   
        var context = {doc : `./book/book.ejs`,
                      kind: 'month',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class,
                      results : books};
        request.app.render('index', context, function(err, html){
          response.end(html);
        });
    }); 
  },

  // book CRUD
  bookCreate : function(request, response){
    var titleofcreate = 'Create';
    var context = {doc : `./book/bookCreate.ejs`,
                    name : '',
                    publisher : '',
                    author : '',
                    stock: '',
                    pubdate: '',
                    pagenum: '',
                    ISBN: '',
                    ebook: '',
                    kdc: '',
                    img: '',
                    price: '',
                    nation: '',
                    description : '',
                    kindOfDoc : 'C',
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class};
    request.app.render('index', context, function(err, html){
      response.end(html);
    });
  },
  bookCreate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var book = qs.parse(body);
      db.query(`INSERT INTO book (name, publisher, author, stock, pubdate, pagenum, ISBN, ebook, kdc, img, price, nation, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [book.name, book.publisher, book.author, book.stock, book.pubdate, book.pagenum, book.ISBN, book.ebook, book.kdc, book.img, book.price, book.nation, book.description], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `/book`});
          response.end();
        }
      )
    });
  },
  bookList : function(request, response){
    db.query(`SELECT * FROM book`, function(error, result){
      if(error) { throw error; }   
      var context = {doc : `./book/bookList.ejs`,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  book_detail : function(request, response){
    var bookId = request.params.bookId;
    db.query(`SELECT * FROM book where id = ${bookId}`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./book/bookdetail.ejs`,
                    name : result[0].name,
                    author : result[0].author,
                    price: result[0].price,
                    img: result[0].img,
                    bId : bookId,
                    loggined : authIsOwner(request, response),
                    id : request.session.login_id, 
                    cls : request.session.class,
                    results : result};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    }); 
  },
  bookUpdate : function(request, response){
    var titleofcreate = 'Update';
    var bookId = request.params.bookId;
    db.query(`SELECT * FROM book where id = ${bookId}`, function(error, result){
      if(error) { throw error; }
      var context = {doc : `./book/bookCreate.ejs`,
                      name : result[0].name,
                      publisher : result[0].publisher,
                      author : result[0].author,
                      stock: result[0].stock,
                      pubdate: result[0].pubdate,
                      pagenum: result[0].pagenum,
                      ISBN: result[0].ISBN,
                      ebook: result[0].ebook,
                      kdc: result[0].kdc,
                      img: result[0].img,
                      price: result[0].price,
                      nation: result[0].nation,
                      description : result[0].description,
                      bId : bookId,
                      kindOfDoc : 'U',
                      loggined : authIsOwner(request, response),
                      id : request.session.login_id, 
                      cls : request.session.class};
      request.app.render('index', context, function(err, html){
        response.end(html);
      });
    });
  },
  bookUpdate_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var book = qs.parse(body);
      var bookId = request.params.bookId;
      db.query('UPDATE book SET name=?, publisher=?, author=?, stock=?, pubdate=?, pagenum=?, ISBN=?, ebook=?, kdc=?, img=?, price=?, nation=?, description=? WHERE id=?',
        [book.name, book.publisher, book.author, book.stock, book.pubdate, book.pagenum, book.ISBN, book.ebook, book.kdc, book.img, book.price, book.nation, book.description, bookId], function(error, result){
          response.writeHead(302, {Location: `/book`});
          response.end();
        }
      )
    });
  },
  bookDelete_process : function(request, response){
    var bookId = request.params.bookId;
    db.query('DELETE FROM book WHERE id=?', [bookId], function(error, result){
      if(error) { throw error; }
      response.writeHead(302, {Location: `/book`});
      response.end();
    });
  },


  // 'cart'
  cart_get : function(request, response){
    var titleofcreate = 'Cart';
    if(authIsOwner(request, response)){
      var loginID = request.session.login_id;
      db.query(`SELECT * FROM cart C join book B on C.bookid = B.id where custid = "${loginID}" order by cartdate desc, C.cartid desc`, function(error, result){
        if(error) { throw error; }
        var context = {doc : `./book/cart.ejs`,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id, 
                        cls : request.session.class,
                        results : result};
        request.app.render('index', context, function(err, html){
          response.end(html);
        });
      });
    }
    else{
      response.redirect('/login');   
    }
  }, 

  cart_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var cart = qs.parse(body);
      var loginID = request.session.login_id;
      db.query(`INSERT INTO cart (custid, bookid, cartdate, qty) VALUES(?, ?, ?, ?)`,
        [loginID, cart.id, dateOfEightDigit(), cart.qty], function(error, result){
          if(error){ throw error; }
          response.writeHead(302, {Location: `/cart`});
          response.end();
        }
      )
    });
  },

  cart_delete : function(request, response){
    var cartId = request.params.cartId;
    db.query('DELETE FROM cart WHERE cartid=?', [cartId], function(error, result){
      if(error) { throw error; }
      response.writeHead(302, {Location: `/cart`});
      response.end();
    });
  },
  
  
  // 'purchase'
  purchase_get : function(request, response){
    var titleofcreate = 'Purchase';
    if(authIsOwner(request, response)){
      var loginID = request.session.login_id;
      if(loginID != "admin"){   // 관리자가 아니면 본인이 구매한 내역만 볼 수 있다. 
        db.query(`SELECT * FROM purchase P join book B on P.bookid = B.id where custid = "${loginID}" order by purchasedate desc, purchaseid desc`, function(error, result){
          if(error) { throw error; }
          var context = {doc : `./book/purchase.ejs`,
                          loggined : authIsOwner(request, response),
                          id : request.session.login_id, 
                          cls : request.session.class,
                          results : result};
          request.app.render('index', context, function(err, html){
            response.end(html);
          });
        });
      }
      else{   // 관리자 계정으로 로그인하면, 전체 구매 내역을 볼 수 있다. 
        db.query(`SELECT * FROM purchase P join book B on P.bookid = B.id order by purchasedate desc, purchaseid desc`, function(error, result){
          if(error) { throw error; }
          var context = {doc : `./book/purchase.ejs`,
                          loggined : authIsOwner(request, response),
                          id : request.session.login_id, 
                          cls : request.session.class,
                          results : result};
          request.app.render('index', context, function(err, html){
            response.end(html);
          });
        });
      }
    }
    else{
      response.redirect('/login');   
    }
  },
  purchase_process : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    })
    request.on('end', function() {
      var purch = qs.parse(body);
      var purchNum = (request.params.purchId == 'all') ? purch.price.length : request.params.purchId;
      var loginID = request.session.login_id;

      if(purchNum == purch.price.length){   // '전체 구매' 선택한 경우
        for(var k=0; k<purch.price.length; k++){
          db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty, cancel, refund) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [loginID, purch.bookid[k], dateOfEightDigit(), purch.price[k], purch.point[k], purch.qty[k], 'N', 'N'], function(error, result){
              if(error){ throw error; }
            }
          )
          db.query('DELETE FROM cart WHERE cartid=?', [purch.cartid[k]], function(error, result){
            if(error) { throw error; }
          });
        }
      }
      else{   // 1개만 구매할 경우
        // purchase에 추가
        db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty, cancel, refund) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
          [loginID, purch.bookid[purchNum], dateOfEightDigit(), purch.price[purchNum], purch.point[purchNum], purch.qty[purchNum], 'N', 'N'], function(error, result){
            if(error){ throw error; }
          }
        )
        // cart 에서 삭제
        if(purch.cartid != undefined){
          db.query('DELETE FROM cart WHERE cartid=?', [purch.cartid[purchNum]], function(error, result){
            if(error) { throw error; }
          });
        }
      }
      response.writeHead(302, {Location: `/purchase`});
      response.end();
    });
  },
  purchase_delete : function(request, response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var purch = qs.parse(body);
      var purchId = request.params.purchId
      db.query('UPDATE purchase SET cancel=?, refund=? WHERE purchaseid=?',
        ['Y', 'Y', purchId], function(error, result){
          response.writeHead(302, {Location: `/purchase`});
          response.end();
        }
      )
    });
  },
  
}