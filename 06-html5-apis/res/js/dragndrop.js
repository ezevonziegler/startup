(function() {

$("#textToSave").on("drop" , function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer = evt.originalEvent.dataTransfer;
    
    var files = evt.dataTransfer.files; // FileList object.

    var reader = new FileReader();  
    reader.onload = function(event) {            
         $("#textToSave").val(event.target.result);
    }        
    reader.readAsText(files[0],"UTF-8");
  });

  $("#textToSave").on("dragover" , function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer = evt.originalEvent.dataTransfer;
    evt.dataTransfer.dropEffect = 'copy';
  });

  $("#textToSave").on('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
  });

})();