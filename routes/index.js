var express = require('express');
var Template = require('../models/Template');
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const templates = [
];


router.post('/templates/', function(req, res, next) {
  const ss_url = req.body.ss_url;

  //ss_url からデータを取得
  //２行よんで、ヘッダーとして保存

  const ss_title = "CodePBL参加社";

  const ss_header_columns = [
    {name:"タイムスタンプ", slug: "timestamp"},
    {name:"名前",           slug: "name"},
    {name:"メールアドレス", slug: "email"},
    {name:"学年",           slug: "grade"},
  ];

  const ss_data = [
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
    [ 234234, "石井将文", "a@a.a", "M2" ],
  ];

  const mail_body = " mail_to: #{email} \n\n#{name}様 \n\nお世話になっております。 \n\nよろしくお願いいたします。 ";

  //なにも問題無かったら、templateをつくる
  const new_index = templates.length;

  templates[new_index] = new Template({
    ss_url: ss_url || "http://xxxx",
    ss_title: ss_title || "CodePBL参加社",
    mail_body,
    ss_header_columns,
    ss_data, //取得したデータをいれる
  });

  res.redirect( path.join(req.baseUrl, ""+new_index) );
});

router.get('/templates/:template_id', function(req, res, next) {
  const template_id = req.params.template_id;
  const template = templates[parseInt(template_id) ];

  res.render("template", {
    template,
  });

});

router.post('/templates/:template_id', function(req, res, next) {
  const template_id   = req.params.template_id;
  const template_text = req.body.template_text;

  const template = templates[parseInt(template_id)];
  template.mail_body = template_text;
  
  res.redirect( path.join(req.baseUrl,req.url,"drafts") );
});

router.get('/templates/:template_id/drafts', function(req, res, next) {

  const template_id = req.params.template_id;
  const template = templates[parseInt(template_id) ];

  if(!template){
    return next();
  }

  const columns = template.ss_header_columns;
  //template.mail_bodyと、dataをまーじする。
  const drafts =  template.ss_data.map((row)=>{
    let body = template.mail_body;

    columns.forEach((column, index)=>{
      const cell = row[index];
      body = body.replace("#{"+column.slug+"}", cell);
    });


    //emailという特別なカラムをとりだす
    var email_index = columns.findIndex((column)=>column.slug == "email");

    var email = row[email_index];


    return {
      email,
      body
    };
  });

  res.render("drafts", {
    template,
    drafts
  });
});

module.exports = router;

