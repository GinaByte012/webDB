const express = require('express');   // express 모듈을 import. const에 의해 express 변수는 값이 바뀌지 않음
const app = express();    // express() 함수에 의해 Application 객체를 app에 저장
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));    // 정적 파일 서비스 허용
var db = require('./lib/db.js');
var auth = require('./lib/authentication');
var etc = require('./lib/etc');
var book = require('./lib/book');
var search = require('./lib/search');
var board = require('./lib/board');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);

var options = {
  host: 'localhost',
  user : 'nodejs',
  password : 'nodejs',
  database : 'webdb2022'
}
var sessionStore = new MySqlStore(options);

app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true,
  store : sessionStore
}));

// 'home'
app.get('/', function(request, response){
  book.home(request, response);
})
app.post('/', function(request, response){
  book.home(request, response);
})

// 'login'
app.get('/login', function(request, response){
  auth.login(request, response);
});
app.post('/login_process', function(request, response){
  auth.login_process(request, response);
})
app.get('/logout', function(request, response){
  auth.logout(request, response);
})


// 'book'
app.get('/book/:pNum', function(request, response) {
  book.home(request, response);
});
app.get('/best', function(request, response) {
  book.best(request, response);
});
app.get('/ebook', function(request, response) {
  book.ebook(request, response);
});
app.get('/month', function(request, response) {
  book.month(request, response);
});


// 'book' CRUD
app.get('/book/create', function(request, response) {
  book.bookCreate(request, response);
});
app.post('/book/create_process', function(request, response) {
  book.bookCreate_process(request, response);
});
app.get('/book/list', function(request, response) {
  book.bookList(request, response);
});
app.get('/book/book_detail/:bookId', function(request, response) {
  book.book_detail(request, response);
});
app.get('/book/update/:bookId', function(request, response) {
  book.bookUpdate(request, response);
});
app.post('/book/update_process/:bookId', function(request, response) {
  book.bookUpdate_process(request, response);
});
app.get('/book/delete_process/:bookId', function(request, response) {
  book.bookDelete_process(request, response);
});


// 'order'
app.get('/cart', function(request, response) {
  book.cart_get(request, response);
});
app.post('/cart_process', function(request, response) {
  book.cart_process(request, response);
});
app.post('/cart_delete/:cartId', function(request, response) {
  book.cart_delete(request, response);
});
app.get('/purchase', function(request, response) {
  book.purchase_get(request, response);
});
app.post('/purchase_process/:purchId', function(request, response) {
  book.purchase_process(request, response);
});
app.post('/purchase_process_all', function(request, response) {
  book.purchase_process_all(request, response);
});
app.post('/purchase_delete/:purchId', function(request, response) {
  book.purchase_delete(request, response);
});


// 'register'
app.get('/register', function(request, response){
  auth.register(request, response);
});
app.post('/register_process', function(request, response){
  auth.register_process(request, response);
})

// 'change password'
app.get('/changepw', function(request, response){
  auth.changepw(request, response);
});
app.post('/changepw_process', function(request, response){
  auth.changepw_process(request, response);
})


// 'calendar'
app.get('/calendar', function(request, response) {
  etc.calendarHome(request, response);
});
app.get('/calendar/create', function(request, response) {
  etc.calendarCreate(request, response);
});
app.post('/calendar/create_process', function(request, response) {
  etc.calendarCreate_process(request, response);
});
app.get('/calendar/list', function(request, response) {
  etc.calendarList(request, response);
});
app.get('/calendar/update/:planId', function(request, response) {
  etc.calendarUpdate(request, response);
});
app.post('/calendar/update_process/:planId', function(request, response) {
  etc.calendarUpdate_process(request, response);
});
app.get('/calendar/delete_process/:planId', function(request, response) {
  etc.calendarDelete_process(request, response);
});


// 'namecard' CRUD
app.get('/namecard', function(request, response) {
  etc.namecardHome(request, response);
});
app.get('/namecard/create', function(request, response) {
  etc.namecardCreate(request, response);
});
app.post('/namecard/create_process', function(request, response) {
  etc.namecardCreate_process(request, response);
});
app.get('/namecard/list', function(request, response) {
  etc.namecardList(request, response);
});
app.get('/namecard/update/:cardId', function(request, response) {
  etc.namecardUpdate(request, response);
});
app.post('/namecard/update_process/:cardId', function(request, response) {
  etc.namecardUpdate_process(request, response);
});
app.get('/namecard/delete_process/:cardId', function(request, response) {
  etc.namecardDelete_process(request, response);
});

// 'user' CRUD
app.get('/user', function(request, response) {
  etc.userHome(request, response);
});
app.get('/user/create', function(request, response) {
  etc.userCreate(request, response);
});
app.post('/user/create_process', function(request, response) {
  etc.userCreate_process(request, response);
});
app.get('/user/list', function(request, response) {
  etc.userList(request, response);
});
app.get('/user/update/:usersId', function(request, response) {
  etc.userUpdate(request, response);
});
app.post('/user/update_process/:usersId', function(request, response) {
  etc.userUpdate_process(request, response);
});
app.get('/user/delete_process/:usersId', function(request, response) {
  etc.userDelete_process(request, response);
});

// 'Search'
app.get('/booksearch/search', function(request, response) {
  search.bookSearch(request, response);
});
app.post('/booksearch/search', function(request, response) {
  search.bookSearch_process(request, response);
});
app.get('/namecard/search', function(request, response) {
  search.namecardSearch(request, response);
});
app.post('/namecard/search', function(request, response) {
  search.namecardSearch_process(request, response);
});
app.get('/calendar/search', function(request, response) {
  search.calendarSearch(request, response);
});
app.post('/calendar/search', function(request, response) {
  search.calendarSearch_process(request, response);
});

// 'board'
app.get('/board/list/:pNum', function(request, response) {
  board.list(request, response);
});
app.get('/board/view/:bNum/:pNum', function(request, response) {
  board.view(request, response);
});
app.get('/board/create', function(request, response) {
  board.create(request, response);
});
app.post('/board/create_process', function(request, response) {
  board.create_process(request, response);
});
app.get('/board/update/:bNum/:pNum', function(request, response) {
  board.update(request, response);
});
app.post('/board/update_process', function(request, response) {
  board.update_process(request, response);
});
app.get('/board/delete/:bNum/:pNum', function(request, response) {
  board.delete(request, response);
});




app.listen(3000, () => console.log('Example app listening on port 3000'));    // 웹서버 작동, 웹의 요청을 수신

