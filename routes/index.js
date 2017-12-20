var express = require('express');
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const templates = [
  {
    ss_url: "http://supureddoshi-tonourl",
    text: "",
    data: [[]],
  }
];


router.post('/templates/', function(req, res, next) {
  const ss_url = req.body.ss_url;

  //ss_url からデータを取得
  //２行よんで、ヘッダーとして保存

  res.redirect(path.join(req.baseUrl, ""+0));
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

