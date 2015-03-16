/**
 * New node file
 */
var fs = require("fs");
 rmDir = function(dirPath) {
	//console.log(" dirPath - " +dirPath);
      try { var files = fs.readdirSync(dirPath); }
      catch(e) {console.log(e);return;}
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '\\' + files[i]; // for linux change the path the separator '\'
          if (fs.statSync(filePath).isFile()){
        	  //console.log(filePath + " is removed");
        	  fs.unlinkSync(filePath);
          }
          else{
        	  //console.log(filePath + " is else");
        	  rmDir(filePath);
          } 
        }
      //console.log(dirPath + " is removed");
      fs.rmdirSync(dirPath);
    };
rmDir(process.argv[2]);