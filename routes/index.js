const express = require('express');
const router = express.Router();
const path = require("path");
const co = require("co");
const auth = require("./auth.js")

const readFilePromise = require('fs-readfile-promise');

var ss_id; //callbackに行ってる間覚えておかなきゃいけないからしょーがなくここに書いている
//けれども、本来は

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const templates = [
  {
    ss_url: "http://xxxx",
    title: "",
    text: " mail_to: #{email} \n\n#{name}様 \n\nお世話になっております。 \n\nよろしくお願いいたします。 ",

    header_columns: [
      {name:"タイムスタンプ", slug: "timestamp"},
      {name:"名前",           slug: "name"},
      {name:"メールアドレス", slug: "email"},
      {name:"学年",           slug: "grade"},
    ],
    data:[
      [ 234234, "石井将文", "a@a.a", "M2" ],
      [ 234234, "石井将文", "a@a.a", "M2" ],
      [ 234234, "石井将文", "a@a.a", "M2" ],
      [ 234234, "石井将文", "a@a.a", "M2" ],
      [ 234234, "石井将文", "a@a.a", "M2" ],
    ] //取得したデータをいれる
  }
];


function createTemplateFromSSData(ss_data){
  return new Promise(function(resolve,reject){
    try{

      console.log("start create temlate");
      // ss_data  は array of {key:value, key2, value} //1こめはタイトル

      const title = "CodePBLなんとか名簿";

      const slugs =  Object.keys(ss_data[0]);

      const header_columns = slugs.map(slug => ({
        name:ss_data[0][slug],
        slug:slug
      }));

       

      ss_data.shift(); //1行目はもういらない
      
      const data =   ss_data.map(row => slugs.map(slug => row[slug])) //array;
      


      const text = " mail_to: #{email} \n\n#{name}様 \n\nお世話になっております。 \n\nよろしくお願いいたします。 ";



      //なにも問題無かったら、templateをつくる
      const new_index = templates.length;

      templates[new_index] = {
        ss_url: ss_url || "http://xxxx",
        title: title || "CodePBLなんとか名簿",
        text,
        header_columns: header_columns ,
        data:data , //取得したデータをいれる
      };


      console.log("created temlate" + new_index);
      console.log(templates[new_index]);

      return resolve(new_index);
    }
    catch(err){
      return reject(err);
    }
  });
}

router.post('/templates/', function(req, res, next) {
  co(function*(){

    ss_url = req.body.ss_url;
    ss_id = ss_url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)[0].slice(16);

    //ss_url からデータを取得
    //２行よんで、ヘッダーとして保存

    const credentials = yield auth.loadSecret();

    const oauth2Client = yield auth.createAuthClient(credentials);

    try{
      const token = yield readFilePromise(auth.TOKEN_PATH);

      oauth2Client.credentials = JSON.parse(token);

      const api_response = yield auth.callAppsScript(oauth2Client, ss_id);

      const template_id  = yield createTemplateFromSSData(api_response);

      res.redirect(path.join(req.baseUrl, template_id.toString()));
    }
    catch(e){
      //tokenファイルがなかった場合

      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: auth.SCOPES

        // Optional property that passes state parameters to redirect URI
        // state: 'foo'
        // !!!! ここに、SS_ID,もしくはtemplate _id をもっとくべし！
      });
      // トークン取得画面に遷移
      return res.redirect(302, authUrl);
    }

  }).catch(next);
});


router.get('/templates/:template_id', function(req, res, next) {
  const template_id = req.params.template_id;
  console.log("templates");
  console.log(templates);
  console.log(templates[0]);
  console.log(template_id);
  const template = templates[parseInt(template_id) ];

  console.log(template);
  res.render("template", {
    template,
  });
});

router.post('/templates/:template_id', function(req, res, next) {
  const template_id = req.params.template_id;

  const template = templates[parseInt(template_id)];

  const template_text = req.body.template_text;

  console.log("template_text ");
  console.log(template_text );

  console.log("template");
  console.log(template);

  template.text = template_text;


  console.log("template");
  console.log(template);


  res.redirect(path.join(req.baseUrl,req.url,"drafts"));
});


router.get('/templates/:template_id/drafts', function(req, res, next) {
  const template_id = req.params.template_id;
  console.log("templates");
  console.log(templates);
  console.log(templates[0]);
  const template = templates[parseInt(template_id) ];

  console.log("template in drafts");
  console.log(template);

  const drafts = [
    {
      email:"aaa@gmail.com",
      body: template.text
    },
    {
      email:"aaa@gmail.com",
      body: template.text
    },
    {
      email:"aaa@gmail.com",
      body: template.text
    },
  ];

  res.render("drafts", {
    template,
    drafts
  });
});

router.get('/callback', function(req, res, next) {
  co(function*(){
    const code = req.query.code; //URLにトークンがきてる
    console.log(code);

    //この時点で、認証は終わってる
    
    //だから、Templateを生成して、生成先に飛ぶ

    const receivedToken = yield auth.receiveToken(code); 

    const api_response = yield auth.callAppsScript(receivedToken, ss_id);

    const template_id = yield createTemplateFromSSData(api_response);

    res.redirect(path.join(req.baseUrl,"templates", template_id.toString()));

  }).catch(next);
});


module.exports = router;
