var express = require('express');
var router = express.Router();
const path = require("path");

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


router.post('/templates/', function(req, res, next) {
  const ss_url = req.body.ss_url;

  //ss_url からデータを取得
  //２行よんで、ヘッダーとして保存

  const title = "CodePBLなんとか名簿";


  const header_columns = [
    {name:"タイムスタンプ", slug: "timestamp"},
    {name:"名前",           slug: "name"},
    {name:"メールアドレス", slug: "email"},
    {name:"学年",           slug: "grade"},
  ];

  const data = [
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
  ];


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

  res.redirect(path.join(req.baseUrl, ""+new_index));
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

module.exports = router;

