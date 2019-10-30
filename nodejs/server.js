var express    = require('express');
var fs         = require("fs");
var bodyParser = require('body-parser');
var multer     = require('multer');
var callShell  = require('child_process'); 
var http       = require('http');
var app        = express();

let index_url  = __dirname + '/public/index.html';
let onsign_url = __dirname + '/public/onsign.html';
let down_url   = __dirname + '/public/download.html';
let sign_shell = __dirname + '/resign.sh';
var download_url = "";

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('file'));
 
app.get('/index.html', function (req, res) {
   res.sendFile(index_url);
})
 
app.post('/file_upload', function (req, res) {
 
   console.log(req.files[0]);  // 上传的文件信息
   var des_file = __dirname + "/ipas/" + req.files[0].originalname;
   fs.readFile( req.files[0].path, function (err, data) {

        console.log( des_file );
        fs.writeFile(des_file, data, function (err) {
          if( err ){
              console.log( err );
          }else{
              response = {
                   message:req.files[0].originalname+' uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          // res.end( JSON.stringify( response ) );
          let fileName  = req.files[0].originalname;
          let shortName = fileName.substring(0,fileName.length-4);
          console.log( shortName );
          callShell.execFile(sign_shell,['-P',__dirname + "/ipas/",'-N', fileName ,'-S', shortName],null,function (err, stdout, stderr) {
              if( err ){
                  console.log( 'resign fail' );
                  console.log( err );
              }else{
                  console.log( 'resign successfully' );
                  // res.sendFile(down_url);
                  // downloadFile(res,__dirname + "/ipas/"+shortName+"/"+shortName+"_resign.ipa");
                  download_url = __dirname + "/ipas/"+shortName+"/"+shortName+"_resign.ipa";
                  res.download(download_url);

                  // res.sendFile(onsign_url);

              }
          });
       });
   });
})

app.get('/download', function (req, res) {
   res.download(download_url);
})

function downloadFile(res,path) {
    // The must headers.
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename=aaa.txt');    // 'aaa.txt' can be customized.
    var fileStream = fs.createReadStream(path);
    fileStream.on('data', function (data) {
        res.write(data, 'binary');
    });
    fileStream.on('end', function () {
        res.end();
        console.log('The file has been downloaded successfully!');
    });
}
 
var server = app.listen(8000, function () {
 
  var host = server.address().address
  var port = server.address().port
  console.log("访问地址为 http://%s:%s", host, port)
 
})