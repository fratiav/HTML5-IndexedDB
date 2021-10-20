    //API IndexedDB

    //Se usa cuando se quieren almacenar grandes cantidades de datos y localStorage o sessionStorage queda pequeño.

    //IndexedDB se estructura por almacenes (tablas de una BD) y dentro de esos almacenes hay registros (tuplas) pero los registros no tienen
    // por que ser del mismo tipo (base de datos no estructural)

    //La informacion se guarda en una carpeta local dentro de la estructura de carpetas del navegador utilizado

window.addEventListener("load",start,false);

var bd;

function start(){

    //Boton de almacenar datos
    almacenar = document.getElementById("almacenar");  // *** SI CREAMOS UNA VARIABLE SIN 'var' EL AMBITO ES GLOBAL!! ***
    almacenar.addEventListener("click",almacenarObjeto,false);

    //ZonaDatos
    zonaDatos = document.getElementById("zonaDatos");

    //Creamos la base de datos de IndexedDB
    var solicitud = indexedDB.open("filmoteca");

    //Almacenamos en una variable la base de datos
    solicitud.onsuccess = function(e){
        bd=e.target.result;
    }

    //Creación del almacen(tabla) si no está ya creada
    solicitud.onupgradeneeded = function(e){
        bd=e.target.result;
        bd.createObjectStore("peliculas",{keyPath: "clave"});
    }
}

function almacenarObjeto(){

    //Recogemos valores del formulario
    var clave = document.getElementById("clave").value;
    var titulo = document.getElementById("titulo").value;
    var fecha = document.getElementById("fecha").value;

    if(clave!="" && titulo!=""){
        //Creamos la transaccion donde se indica la tabla y el modo
        var transaccion = bd.transaction(["peliculas"],"readwrite");
        //Creamos variable de la transaccion con objectStore para poder añadir y borrar
        var almacen = transaccion.objectStore("peliculas");

        //Añadimos un registro
        var agregar = almacen.add({clave: clave, titulo: titulo, fecha: fecha});

        agregar.addEventListener("success",mostrarValores,false);

        //Si se ha podido añadir borramos campos
        agregar.onsuccess = function(e){
            //Vaciamos el contenido de los campos
            document.getElementById("clave").value = "";
            document.getElementById("titulo").value = "";
            document.getElementById("fecha").value = "";
        }
    }else{
        alert("Introduce datos antes de almacenar");
    }
}

function mostrarValores(){
    
    //Comenzamos una transaccion para leer tabla
    var transaccion = bd.transaction(["peliculas"],"readonly");

    //Variable del almacen de registros de peliculas
    var almacen = transaccion.objectStore("peliculas");

    //Creacion del cursor del almacen
    var cursor = almacen.openCursor();

    cursor.addEventListener("success", escribirHTML, false);

    zonaDatos.innerHTML="<h3>DATOS ALMACENADOS</h3>"

}

function escribirHTML(e){

    //Cursor
    var cursor = e.target.result;

    //No necesita bucle para recorrerse. El método continue lo hace todo (llama de nuevo al evento con la nueva tupla).
    if(cursor){
        zonaDatos.innerHTML+="<p>Clave: "+cursor.value.clave+"  -  Título: " + cursor.value.titulo + "  -  Fecha: " + cursor.value.fecha;
        cursor.continue();
    }

}