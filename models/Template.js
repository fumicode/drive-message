module.exports = class Template{
  constructor(args){
    this.ss_url     = args.ss_url; //スプレッドシートのURL
    this.ss_title = args.ss_title;  //メールのタイトル
    this.mail_body  = args.mail_body;  //メールの本文


    //ヘッダーのカラム
    this.ss_header_columns =  args.ss_header_columns || [];
      /*
      ss_header_columns: [
        {name:"タイムスタンプ", slug: "timestamp"},
        {name:"名前",           slug: "name"},
        {name:"メールアドレス", slug: "email"},
        {name:"学年",           slug: "grade"},
      ]
      */

    //ボディ
    this.ss_data =  args.ss_data
  }
}

