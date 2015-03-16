var mkpath = require('mkpath');
var raml2html = require('raml2html');
var fs =require('fs');
var ramlExtension='.raml';
var htmlExtension='.html';
var sourceFolder = process.argv[2];
var destinationFolder = process.argv[3];
var allFolders=[];
mkpath(destinationFolder, function (err) {
	if(err){
		if(err.code == 'EEXIST'){
			//console.log("destination Directory already exists, no need create.");
        }
	}else {
		//console.log("destination Directory created.");
	}
});
convertRaml=function(folder){
	try { 
		var files = fs.readdirSync(folder); 
		if (files.length > 0)
			for (var i = 0; i < files.length; i++) {
				var filePath = folder + '\\' + files[i]; // for linux change the path the separator '\'
				//console.log("filePath " +filePath);
				if (!fs.statSync(filePath).isFile()){
					//console.log("folder path : "+filePath);
					//convertRamltoHtml(filePath);
					allFolders.push(filePath);
					convertRaml(filePath);
				}
			}
	}
	catch(e) {console.log(e);}
};
convertRaml(sourceFolder);
for ( var folder in allFolders) {
	convertRamltoHtml(allFolders[folder].toString());
}
function convertRamltoHtml(folder){
	fs.readdir(folder, function(err, files) {  // apart from a static source folder keeping a dynamic folder read from json file.
		files.filter(function(file) {
			return (file.substr(-5) == ramlExtension); // comparing file us fileName.raml or not.
		}).forEach(function(file) {
			var rstream = fs.createReadStream(folder+"\\"+file);
			var string = '';
			rstream.on('data', function(response) {
				string += response;
			});
			rstream.on('end', function(){
			      raml2html.parse(string, onSuccess, onError);
					function onSuccess(result){
						var fileName=file.substring(0,file.length-ramlExtension.length); // cropping extension .raml and getting file name from it.
						//console.log("fileName : " +  fileName);
						//console.log("destinationFolder : " +  destinationFolder);
						fs.writeFile(destinationFolder+fileName+htmlExtension, result, 'utf-8', function(err) { 
							// writing html content to fileName.html in the destination folder mentioned in the configuration json file.
							if(err) {
								console.log(err);
							} else {
								console.log("The "+fileName+" was saved!");
							}});
					}
					function onError(err){
						console.log(err);
					}
			}); 
		});
	});
}
