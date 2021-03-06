// 바깥에 쪽에서 사용할 수 있도록 하기 위해서 exports만 쓴다.
// 하나만 사용하는 경우는 module.exports로 사용

var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');

exports.home = function(request,response){
    db.query('SELECT * FROM TOPIC',function(error, topics){
        if(error){console.log('오류발생>>',error);}
        console.log(topics);
    
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html); 
      });
}

exports.page = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('SELECT * FROM TOPIC',function(error, topics, fields){
        if(error){ throw error; }
        
        //SQL injection 공격에 대한 보안처리
        //사용자가 입력한 정보에 오염된 정보가 있을 경우 그것을 안전하게 데이터베이스 서버로 전송될 수 있도록 여러 가지 처리가 되어 있음
        //반드시 직접 넣는 것이 아닌 '?' 를 이용해서 값이 담길 수 있도록 해야 한다..
        //잘못된 방식)
        //var sql = `select * from topic LEFT JOIN author ON topic.author_id = author.id where topic.id = ${queryData.id}`;
        //var query = db.query(sql, function(error2, topic){

        var query = db.query(`select * from topic LEFT JOIN author ON topic.author_id = author.id where topic.id = ?`,[queryData.id],function(error2, topic){
          if(error2){ throw error2; }

          console.log(topic);

          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${sanitizeHTML(title)}</h2>
            ${sanitizeHTML(description)}
            <p>by ${sanitizeHTML(topic[0].name)}</p>
            `,
            `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`
          );
          console.log(query.sql);
          response.writeHead(200);
          response.end(html);
        });
      });
}

exports.create = function(request,response){
    db.query('SELECT * FROM TOPIC',function(error, topics, fields){
        if(error){console.log('오류발생>>',error);}
        console.log(topics);

        db.query('SELECT * FROM AUTHOR',function(error, authors, fields){

          console.log(authors);

          var title = 'WEB - Create';
          var list = template.list(topics);
          var html = template.HTML(sanitizeHTML(title), list,
            `<form action="/create_process" method="post">
              <p>
                ${template.authorSelect(authors)}
              </p> 
              <p>
                <input type="text" name="title" placeholder="title">
              </p>  
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
            ``
          );
          response.writeHead(200);
          response.end(html);
        });
      
      });
}

exports.create_process = function(request,response){
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var author = post.author;
      var title = post.title;
      var description = post.description;

      db.query(
        'INSERT INTO TOPIC(title,description, created, author_id) VALUES(?,?,NOW(),?)',
        [title, description, author],
        function(error, result) {
          if (error) {
            console.log('오류발생>>', error);
          }
          console.log('삽입된 데이터>>', result);
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      );
    });
}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    db.query('SELECT * FROM TOPIC',function(error, topics, fields){
        if(error){ throw error; }

        db.query(`SELECT * FROM TOPIC WHERE ID = ?`,[queryData.id],function(error2, topic){
          if(error2){ throw error2; }

          db.query('SELECT * FROM AUTHOR',function(error, authors, fields){
            
            var list = template.list(topics);
            var html = template.HTML(sanitizeHTML(topic[0].title), list,
              `<form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p>
                    ${template.authorSelect(authors)}
                  </p> 
                  <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
              </form>
              `,
              `<a href="/create">create</a>
              <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);

          });
        });
  });
}

exports.update_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;

    db.query(
      'UPDATE TOPIC SET TITLE=?, DESCRIPTION=?, AUTHOR_ID=? WHERE ID=?',
      [title, description, post.author, id],
      function(error, result) {
        if (error) {
          console.log('오류발생>>', error);
        }
        console.log('삽입된 데이터>>', result);
        response.writeHead(302, {Location: `/?id=${id}`});
        response.end();
      }
    );
  });
};

exports.delete = function(request,response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;

        db.query('DELETE FROM topic where id=?', [id], function(error, result){
              if(error){console.log('오류발생>>',error);}
              console.log('삽입된 데이터>>',result);
              response.writeHead(302, {Location: `/`});
              response.end();
            }
        );
    });
}