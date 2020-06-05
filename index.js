const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const port = 8080;

app.use(bodyParser.text());
app.use(fileUpload());

app.get('/',(req,res) =>{
  res.send('Bem Vindo!');
})
app.post('/', (req, res) => {
  function csvJSON(csv){ //Função de leitura de csv e conversão para json
    var lines = csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
    for(var i=1;i<lines.length;i++){
      var obj = {};
      lines[i] = lines[i].replace('\r','');
      var currentline=lines[i].split(",");
      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.parse(JSON.stringify(result)); //String para Json
  }

  csvBuff = req.files.csvFile.data; // buffer Vindo do <form>
  csv = csvBuff.toString().replace('\r',''); // buffer para string
  json = csvJSON(csv); // string para json  

  status = true;
  delete json[json.length-1];
  var cont = 0;
  json.forEach(element => {
    if(element.cnpj != '04.739.000/0008-35'){
      delete json.element;
    }
    cont++;
  });
  console.log(cont); // Exibe a quantidade de notas
  res.send(json); // Exibe json na pagina web
});

app.listen(port)